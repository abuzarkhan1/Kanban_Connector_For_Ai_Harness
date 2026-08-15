import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { openDatabase } from '@persistence'
import { ProjectRepository } from '@persistence/repositories/projectRepository'
import { TaskRepository } from '@persistence/repositories/taskRepository'
import { TransitionRepository } from '@persistence/repositories/transitionRepository'
import { ProjectService } from './projectService'
import { TaskService } from './taskService'
import { InvalidTransitionError, NotFoundError } from '@domain/errors/domainError'

describe('TaskService', () => {
  let dir: string
  let handle: ReturnType<typeof openDatabase>
  let projects: ProjectService
  let tasks: TaskService
  let projectId: string

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), 'aihpm-test-'))
    handle = openDatabase(join(dir, 'test.db'))
    const projectRepo = new ProjectRepository(handle.raw)
    projects = new ProjectService(projectRepo)
    tasks = new TaskService(projectRepo, new TaskRepository(handle.raw), new TransitionRepository(handle.raw))
    projectId = projects.create('Test Project').project.id
  })

  afterEach(() => {
    handle.close()
    rmSync(dir, { recursive: true, force: true })
  })

  it('creates a task in the BACKLOG state', () => {
    const task = tasks.create({ projectId, title: 'Implement OAuth' })
    expect(task.status).toBe('BACKLOG')
    expect(tasks.get(task.id).title).toBe('Implement OAuth')
  })

  it('rejects creating a task for a missing project', () => {
    expect(() => tasks.create({ projectId: '00000000-0000-4000-8000-000000000000', title: 'orphan' })).toThrow(NotFoundError)
  })

  it('moves a task along the lifecycle and records an audit transition', () => {
    const task = tasks.create({ projectId, title: 'Rate limiting' })
    const moved = tasks.move(task.id, 'READY', { actor: 'user' })
    expect(moved.status).toBe('READY')

    const transitions = tasks.transitionsFor(task.id)
    expect(transitions).toHaveLength(1)
    expect(transitions[0]).toMatchObject({
      fromStatus: 'BACKLOG',
      toStatus: 'READY',
      actor: 'user',
      confidence: null,
      ruleId: null
    })
  })

  it('rejects an invalid transition and leaves state unchanged', () => {
    const task = tasks.create({ projectId, title: 'x' })
    expect(() => tasks.move(task.id, 'DONE', { actor: 'user' })).toThrow(InvalidTransitionError)
    expect(tasks.get(task.id).status).toBe('BACKLOG')
    expect(tasks.transitionsFor(task.id)).toHaveLength(0)
  })

  it('moves a task between columns as a user override and records the transition', () => {
    const task = tasks.create({ projectId, title: 'Backlog item' })
    // BACKLOG -> IMPLEMENTING is not a legal one-step lifecycle edge…
    expect(() => tasks.move(task.id, 'IMPLEMENTING')).toThrow(InvalidTransitionError)
    // …but dragging the card to IN PROGRESS is an explicit user column move.
    const moved = tasks.moveToColumn(task.id, 'IN_PROGRESS')
    expect(moved.status).toBe('IMPLEMENTING')
    const transitions = tasks.transitionsFor(task.id)
    expect(transitions).toHaveLength(1)
    expect(transitions[0]).toMatchObject({ fromStatus: 'BACKLOG', toStatus: 'IMPLEMENTING', actor: 'user' })
  })

  it('reopens a completed task by dragging it back to TODO', () => {
    const task = tasks.create({ projectId, title: 'Shipped' })
    tasks.moveToColumn(task.id, 'DONE')
    const reopened = tasks.moveToColumn(task.id, 'TODO')
    expect(reopened.status).toBe('BACKLOG')
    expect(tasks.transitionsFor(task.id)).toHaveLength(2)
  })

  it('is a no-op when the task already sits in the target column', () => {
    const task = tasks.create({ projectId, title: 'x' })
    expect(tasks.moveToColumn(task.id, 'TODO').status).toBe('BACKLOG')
    expect(tasks.transitionsFor(task.id)).toHaveLength(0)
  })

  it('records automatic-style transitions with confidence and rule', () => {
    const task = tasks.create({ projectId, title: 'x' })
    tasks.move(task.id, 'READY', { actor: 'user' })
    const moved = tasks.move(task.id, 'ASSIGNED', { actor: 'system', confidence: 0.87, ruleId: 'AGENT_ASSIGNED' })
    expect(moved.status).toBe('ASSIGNED')
    const last = tasks.transitionsFor(task.id).at(-1)
    expect(last).toMatchObject({ actor: 'system', confidence: 0.87, ruleId: 'AGENT_ASSIGNED' })
  })

  it('updates editable fields', () => {
    const task = tasks.create({ projectId, title: 'Old' })
    const updated = tasks.update(task.id, { title: 'New', priority: 'HIGH', labels: ['auth', 'api'] })
    expect(updated.title).toBe('New')
    expect(updated.priority).toBe('HIGH')
    expect(updated.labels).toEqual(['auth', 'api'])
    expect(tasks.get(task.id).labels).toEqual(['auth', 'api'])
  })
})
