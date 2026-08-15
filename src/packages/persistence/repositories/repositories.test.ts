import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import Database from 'better-sqlite3'
import { migrate } from '../schema/migrations'
import { openDatabase } from '../database'
import { ProjectRepository } from './projectRepository'
import { TaskRepository } from './taskRepository'
import { TransitionRepository } from './transitionRepository'
import { createProject } from '@domain/entities/Project'
import { createTask } from '@domain/entities/Task'
import { createTransition } from '@domain/entities/Transition'

describe('migrations', () => {
  it('sets user_version after applying', () => {
    const db = new Database(':memory:')
    migrate(db)
    expect(db.pragma('user_version', { simple: true })).toBeGreaterThanOrEqual(1)
    db.close()
  })

  it('is idempotent across restarts', () => {
    const db = new Database(':memory:')
    migrate(db)
    migrate(db)
    const tables = db
      .prepare("SELECT name FROM sqlite_master WHERE type = 'table' ORDER BY name")
      .all() as { name: string }[]
    expect(tables.map((t) => t.name)).toContain('transitions')
    db.close()
  })
})

describe('repositories', () => {
  let dir: string
  let handle: ReturnType<typeof openDatabase>
  let projects: ProjectRepository
  let tasks: TaskRepository
  let transitions: TransitionRepository

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), 'aihpm-repo-'))
    handle = openDatabase(join(dir, 'test.db'))
    projects = new ProjectRepository(handle.raw)
    tasks = new TaskRepository(handle.raw)
    transitions = new TransitionRepository(handle.raw)
  })

  afterEach(() => {
    handle.close()
    rmSync(dir, { recursive: true, force: true })
  })

  it('round-trips projects', () => {
    const project = createProject({ name: 'Alpha' })
    projects.insert(project)
    expect(projects.get(project.id).name).toBe('Alpha')
    expect(projects.list().map((p) => p.id)).toEqual([project.id])
  })

  it('round-trips tasks with labels', () => {
    const project = createProject({ name: 'Alpha' })
    projects.insert(project)
    const task = createTask({ projectId: project.id, title: 'Do the thing', labels: ['a', 'b'] })
    tasks.insert(task)
    expect(tasks.get(task.id).labels).toEqual(['a', 'b'])
    expect(tasks.listByProject(project.id)).toHaveLength(1)
  })

  it('persists transitions ordered by time', () => {
    const project = createProject({ name: 'Alpha' })
    projects.insert(project)
    const task = createTask({ projectId: project.id, title: 't' })
    tasks.insert(task)
    const t1 = createTransition({ taskId: task.id, fromStatus: 'BACKLOG', toStatus: 'READY', actor: 'user', now: 1 })
    const t2 = createTransition({ taskId: task.id, fromStatus: 'READY', toStatus: 'ASSIGNED', actor: 'user', now: 2 })
    transitions.insert(t1)
    transitions.insert(t2)
    expect(transitions.listByTask(task.id).map((t) => t.toStatus)).toEqual(['READY', 'ASSIGNED'])
  })

  it('cascades task deletion to transitions and labels', () => {
    const project = createProject({ name: 'Alpha' })
    projects.insert(project)
    const task = createTask({ projectId: project.id, title: 't', labels: ['x'] })
    tasks.insert(task)
    const transition = createTransition({ taskId: task.id, fromStatus: 'BACKLOG', toStatus: 'READY', actor: 'user' })
    transitions.insert(transition)

    tasks.delete(task.id)
    expect(transitions.listByTask(task.id)).toHaveLength(0)
    expect(() => tasks.get(task.id)).toThrow()
  })

  it('cascades project deletion to its tasks', () => {
    const project = createProject({ name: 'Alpha' })
    projects.insert(project)
    const task = createTask({ projectId: project.id, title: 't' })
    tasks.insert(task)
    projects.delete(project.id)
    expect(tasks.listByProject(project.id)).toHaveLength(0)
  })
})
