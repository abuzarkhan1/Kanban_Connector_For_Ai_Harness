import { GitService } from './git/gitService'
import { FilesystemWatcher } from './watchers/filesystemWatcher'
import { ProcessWatcher } from './watchers/processWatcher'
import { AdapterRegistry } from './adapters'
import { Correlator } from './correlation/correlator'
import { InferenceEngine } from './inference/inferenceEngine'
import type { RepositoryService } from '@application/services/repositoryService'
import type { TaskService } from '@application/services/taskService'
import type { SessionService } from '@application/services/sessionService'
import type { EventService } from '@application/services/eventService'
import type { EvidenceRepository } from '@persistence/repositories/evidenceRepository'
import { createObservedEvent, type ObservedEvent } from '@domain/entities/ObservedEvent'

export class ObservationEngine {
  readonly git: GitService
  readonly filesystem: FilesystemWatcher
  readonly processes: ProcessWatcher
  readonly adapters: AdapterRegistry
  readonly correlator: Correlator
  readonly inference: InferenceEngine

  private isRunning = false
  private gitPollTimer: NodeJS.Timeout | null = null
  private lastKnownGitState = new Map<string, { headCommit: string | null; currentBranch: string }>()

  public onTransition?: (taskTitle: string, fromStatus: string, toStatus: string, ruleId: string) => void

  constructor(
    private readonly repositories: RepositoryService,
    private readonly tasks: TaskService,
    private readonly sessions: SessionService,
    private readonly events: EventService,
    evidenceRepo: EvidenceRepository
  ) {
    this.git = new GitService()
    this.filesystem = new FilesystemWatcher()
    this.processes = new ProcessWatcher()
    this.adapters = new AdapterRegistry()
    this.correlator = new Correlator()
    this.inference = new InferenceEngine(tasks, evidenceRepo)

    // Wire up event streams
    this.filesystem.onEvent((e) => this.handleEvent(e))
    this.processes.onEvent((e) => this.handleEvent(e))
  }

  start(): void {
    if (this.isRunning) return
    this.isRunning = true

    // Start process polling
    this.processes.start(4000)

    // Watch all registered repositories for filesystem events
    const allRepos = this.repositories.listAll()
    for (const repo of allRepos) {
      this.filesystem.watchRepository(repo.id, repo.projectId, repo.path)
    }

    // Start periodic Git observation
    void this.pollGit()
    this.gitPollTimer = setInterval(() => {
      void this.pollGit()
    }, 8000)
  }

  stop(): void {
    this.isRunning = false
    if (this.gitPollTimer) {
      clearInterval(this.gitPollTimer)
      this.gitPollTimer = null
    }
    this.processes.stop()
    this.filesystem.closeAll()
  }

  async pollGit(): Promise<void> {
    if (!this.isRunning) return
    const repos = this.repositories.listAll()
    for (const repo of repos) {
      try {
        const info = await this.git.inspect(repo.path)
        if (!info.isGitRepo) continue

        const prev = this.lastKnownGitState.get(repo.id)
        if (!prev) {
          this.lastKnownGitState.set(repo.id, {
            headCommit: info.headCommit,
            currentBranch: info.currentBranch
          })
          continue
        }

        // Branch changed
        if (info.currentBranch !== prev.currentBranch) {
          this.handleEvent(
            createObservedEvent({
              source: 'git-observer',
              category: 'git',
              type: 'BRANCH_CHANGED',
              projectId: repo.projectId,
              repositoryId: repo.id,
              payload: {
                fromBranch: prev.currentBranch,
                toBranch: info.currentBranch,
                headCommit: info.headCommit
              }
            })
          )
        }

        // Commit created
        if (info.headCommit && info.headCommit !== prev.headCommit) {
          const latestCommit = info.recentCommits[0]
          const message = latestCommit?.message ?? ''
          const isMerge =
            message.toLowerCase().includes('merge branch') ||
            message.toLowerCase().includes('merge pull request') ||
            message.toLowerCase().startsWith('merge')

          this.handleEvent(
            createObservedEvent({
              source: 'git-observer',
              category: 'git',
              type: isMerge ? 'MERGE_DETECTED' : 'COMMIT_CREATED',
              projectId: repo.projectId,
              repositoryId: repo.id,
              payload: {
                hash: info.headCommit,
                message,
                branch: info.currentBranch,
                modifiedFilesCount: info.modifiedFilesCount
              }
            })
          )
        }

        this.lastKnownGitState.set(repo.id, {
          headCommit: info.headCommit,
          currentBranch: info.currentBranch
        })
      } catch {
        // Non-blocking
      }
    }
  }

  handleEvent(rawEvent: ObservedEvent): void {
    // 1. Correlate with current context
    const allRepos = this.repositories.listAll()
    const allTasks = rawEvent.projectId ? this.tasks.listByProject(rawEvent.projectId) : []
    const allSessions = this.sessions.listActive()

    const correlation = this.correlator.correlate(rawEvent, {
      repositories: allRepos,
      tasks: allTasks,
      sessions: allSessions
    })

    const enrichedEvent: ObservedEvent = {
      ...rawEvent,
      projectId: rawEvent.projectId || correlation.projectId,
      repositoryId: rawEvent.repositoryId || correlation.repositoryId,
      workspaceId: rawEvent.workspaceId || correlation.workspaceId,
      sessionId: rawEvent.sessionId || correlation.sessionId,
      taskId: rawEvent.taskId || correlation.taskId
    }

    // 2. Persist event
    this.events.record(enrichedEvent)

    // 3. Update active session activity state if applicable
    if (enrichedEvent.sessionId) {
      if (enrichedEvent.type === 'FILE_MODIFIED' || enrichedEvent.type === 'FILE_CREATED') {
        this.sessions.updateActivity(enrichedEvent.sessionId, 'modifying_files')
      } else if (enrichedEvent.type === 'TEST_STARTED') {
        this.sessions.updateActivity(enrichedEvent.sessionId, 'running_tests')
      } else if (enrichedEvent.type === 'HARNESS_AWAITING_PERMISSION') {
        this.sessions.updateActivity(enrichedEvent.sessionId, 'awaiting_permission')
      }
    }

    // 4. Run state inference on correlated task
    if (enrichedEvent.taskId) {
      try {
        const task = this.tasks.get(enrichedEvent.taskId)
        const oldStatus = task.status
        const updated = this.inference.processTransition(enrichedEvent, task)
        if (updated && this.onTransition) {
          const transitions = this.tasks.transitionsFor(task.id)
          const latest = transitions[transitions.length - 1]
          this.onTransition(task.title, oldStatus, updated.status, latest?.ruleId || 'unknown')
        }
      } catch {
        // Task not found or deleted
      }
    }
  }
}
