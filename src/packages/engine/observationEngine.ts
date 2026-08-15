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
import type { ObservedEvent } from '@domain/entities/ObservedEvent'

export class ObservationEngine {
  readonly git: GitService
  readonly filesystem: FilesystemWatcher
  readonly processes: ProcessWatcher
  readonly adapters: AdapterRegistry
  readonly correlator: Correlator
  readonly inference: InferenceEngine

  private isRunning = false

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

    // Watch all registered repositories
    const allRepos = this.repositories.listAll()
    for (const repo of allRepos) {
      this.filesystem.watchRepository(repo.id, repo.projectId, repo.path)
    }
  }

  stop(): void {
    this.isRunning = false
    this.processes.stop()
    this.filesystem.closeAll()
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
        this.inference.processTransition(enrichedEvent, task)
      } catch {
        // Task not found or deleted
      }
    }
  }
}
