import { describe, it, expect, beforeEach } from 'vitest'
import { Correlator } from './correlation/correlator'
import { InferenceEngine } from './inference/inferenceEngine'
import { openDatabase, ProjectRepository, TaskRepository, TransitionRepository, EvidenceRepository } from '@persistence'
import { TaskService } from '@application/services/taskService'
import { createProject } from '@domain/entities/Project'
import { createTask } from '@domain/entities/Task'
import { createRepository } from '@domain/entities/Repository'
import { createObservedEvent } from '@domain/entities/ObservedEvent'

describe('Correlation & State Inference Engine', () => {
  let correlator: Correlator
  let inference: InferenceEngine
  let taskService: TaskService
  let evidenceRepo: EvidenceRepository
  let taskRepo: TaskRepository

  beforeEach(() => {
    const db = openDatabase(':memory:')
    const projectRepo = new ProjectRepository(db.raw)
    taskRepo = new TaskRepository(db.raw)
    const transitionRepo = new TransitionRepository(db.raw)
    evidenceRepo = new EvidenceRepository(db.raw)

    taskService = new TaskService(projectRepo, taskRepo, transitionRepo)
    correlator = new Correlator()
    inference = new InferenceEngine(taskService, evidenceRepo)

    const project = createProject({ id: 'proj-1', name: 'Test Proj' })
    projectRepo.insert(project)
  })

  it('correlates file event with matching repository and branch task', () => {
    const repo = createRepository({
      id: 'repo-1',
      projectId: 'proj-1',
      path: '/workspaces/my-app',
      currentBranch: 'feature/auth'
    })

    const task = createTask({
      id: 'task-100',
      projectId: 'proj-1',
      title: 'Implement Auth',
      repositoryId: 'repo-1',
      branch: 'feature/auth',
      status: 'BACKLOG'
    })
    taskRepo.insert(task)

    const event = createObservedEvent({
      source: 'filesystem-watcher',
      category: 'filesystem',
      type: 'FILE_MODIFIED',
      payload: { filepath: '/workspaces/my-app/src/auth.ts' }
    })

    const result = correlator.correlate(event, {
      repositories: [repo],
      tasks: [task],
      sessions: []
    })

    expect(result.repositoryId).toBe('repo-1')
    expect(result.taskId).toBe('task-100')
    expect(result.confidence).toBeGreaterThan(0.7)
  })

  it('infers state transition advancing task lifecycle when harness starts', () => {
    const task = taskService.create({
      projectId: 'proj-1',
      title: 'Build Login API'
    })

    const event = createObservedEvent({
      source: 'process-watcher',
      category: 'harness',
      type: 'HARNESS_DETECTED',
      taskId: task.id,
      payload: { harnessType: 'antigravity' }
    })

    const updated = inference.processTransition(event, task)
    expect(updated).not.toBeNull()
    expect(updated?.status).toBe('READY')

    const transitions = taskService.transitionsFor(task.id)
    expect(transitions[0]?.toStatus).toBe('READY')
    expect(transitions[0]?.actor).toBe('system')
    expect(transitions[0]?.ruleId).toBe('RULE_AGENT_STARTED')
  })

  it('promotes task to READY_FOR_REVIEW when test suite passes', () => {
    const task = taskService.create({
      projectId: 'proj-1',
      title: 'Build Payment Feature'
    })

    // Advance through state machine to IMPLEMENTING: BACKLOG -> READY -> ASSIGNED -> AGENT_STARTED -> IMPLEMENTING
    const s1 = taskService.move(task.id, 'READY')
    const s2 = taskService.move(s1.id, 'ASSIGNED')
    const s3 = taskService.move(s2.id, 'AGENT_STARTED')
    const inProgress = taskService.move(s3.id, 'IMPLEMENTING')

    const event = createObservedEvent({
      source: 'process-watcher',
      category: 'test',
      type: 'TEST_PASSED',
      taskId: inProgress.id,
      payload: { command: 'vitest run' }
    })

    const updated = inference.processTransition(event, inProgress)
    expect(updated).not.toBeNull()
    expect(updated?.status).toBe('READY_FOR_REVIEW')

    const evidenceList = evidenceRepo.listByTask(task.id)
    expect(evidenceList.length).toBeGreaterThan(0)
    expect(evidenceList[0]?.ruleId).toBe('RULE_TESTS_PASSED_CLEAN')
  })
})
