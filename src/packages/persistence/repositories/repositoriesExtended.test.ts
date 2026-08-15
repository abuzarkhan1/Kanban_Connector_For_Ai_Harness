import { describe, it, expect, beforeEach } from 'vitest'
import { openDatabase, ProjectRepository, TaskRepository, TransitionRepository, RepositoryRepository, SessionRepository, EventRepository, EvidenceRepository } from '../index'
import { createProject } from '@domain/entities/Project'
import { createTask } from '@domain/entities/Task'
import { createRepository } from '@domain/entities/Repository'
import { createSession } from '@domain/entities/Session'
import { createObservedEvent } from '@domain/entities/ObservedEvent'
import { createEvidence } from '@domain/entities/Evidence'
import { createTransition } from '@domain/entities/Transition'

describe('Extended Repositories (Repositories, Sessions, Events, Evidence)', () => {
  let db: ReturnType<typeof openDatabase>
  let projectRepo: ProjectRepository
  let taskRepo: TaskRepository
  let transitionRepo: TransitionRepository
  let repoRepo: RepositoryRepository
  let sessionRepo: SessionRepository
  let eventRepo: EventRepository
  let evidenceRepo: EvidenceRepository

  beforeEach(() => {
    db = openDatabase(':memory:')
    projectRepo = new ProjectRepository(db.raw)
    taskRepo = new TaskRepository(db.raw)
    transitionRepo = new TransitionRepository(db.raw)
    repoRepo = new RepositoryRepository(db.raw)
    sessionRepo = new SessionRepository(db.raw)
    eventRepo = new EventRepository(db.raw)
    evidenceRepo = new EvidenceRepository(db.raw)
  })

  it('inserts and retrieves repositories', () => {
    const project = createProject({ name: 'Alpha' })
    projectRepo.insert(project)

    const repo = createRepository({
      projectId: project.id,
      name: 'alpha-core',
      path: '/tmp/alpha-core',
      defaultBranch: 'main',
      currentBranch: 'feature/test'
    })
    repoRepo.insert(repo)

    const fetched = repoRepo.get(repo.id)
    expect(fetched.name).toBe('alpha-core')
    expect(fetched.path).toBe('/tmp/alpha-core')
    expect(fetched.currentBranch).toBe('feature/test')

    const list = repoRepo.listByProject(project.id)
    expect(list.length).toBe(1)
    expect(list[0]?.id).toBe(repo.id)
  })

  it('records development sessions and updates activity state', () => {
    const project = createProject({ name: 'Beta' })
    projectRepo.insert(project)

    const session = createSession({
      agentId: 'agent-1',
      agentType: 'antigravity',
      projectId: project.id,
      branch: 'feature/mcp',
      activityState: 'thinking'
    })
    sessionRepo.insert(session)

    const active = sessionRepo.listActive()
    expect(active.length).toBe(1)
    expect(active[0]?.activityState).toBe('thinking')

    sessionRepo.save({
      ...session,
      activityState: 'modifying_files',
      lastActivityAt: Date.now()
    })

    const updated = sessionRepo.get(session.id)
    expect(updated.activityState).toBe('modifying_files')
  })

  it('persists observed events and calculates total counts', () => {
    const project = createProject({ name: 'Gamma' })
    projectRepo.insert(project)

    const event = createObservedEvent({
      source: 'unit-test',
      category: 'filesystem',
      type: 'FILE_MODIFIED',
      projectId: project.id,
      payload: { filepath: 'src/main.ts' }
    })
    eventRepo.insert(event)

    expect(eventRepo.count()).toBe(1)
    const recent = eventRepo.listRecent(10)
    expect(recent[0]?.type).toBe('FILE_MODIFIED')
  })

  it('stores explainable evidence attached to transitions', () => {
    const project = createProject({ name: 'Delta' })
    projectRepo.insert(project)

    const task = createTask({ projectId: project.id, title: 'Test Task' })
    taskRepo.insert(task)

    const transition = createTransition({
      id: 'trans-1',
      taskId: task.id,
      fromStatus: 'BACKLOG',
      toStatus: 'READY',
      actor: 'system'
    })
    transitionRepo.insert(transition)

    const evidence = createEvidence({
      transitionId: 'trans-1',
      taskId: task.id,
      ruleId: 'RULE_TESTS_PASSED_CLEAN',
      confidence: 0.92,
      summary: 'All unit tests passed',
      items: [{ type: 'test', description: 'Vitest passed (47/47)', confidence: 0.92 }]
    })
    evidenceRepo.insert(evidence)

    const fetched = evidenceRepo.getByTransition('trans-1')
    expect(fetched).toBeDefined()
    expect(fetched?.confidence).toBe(0.92)
    expect(fetched?.summary).toBe('All unit tests passed')
  })
})
