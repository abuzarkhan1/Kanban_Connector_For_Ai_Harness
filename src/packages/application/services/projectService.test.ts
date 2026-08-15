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
import { NotFoundError } from '@domain/errors/domainError'

describe('ProjectService', () => {
  let dir: string
  let handle: ReturnType<typeof openDatabase>
  let projects: ProjectService
  let tasks: TaskService

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), 'aihpm-project-'))
    handle = openDatabase(join(dir, 'test.db'))
    const projectRepo = new ProjectRepository(handle.raw)
    projects = new ProjectService(projectRepo)
    tasks = new TaskService(projectRepo, new TaskRepository(handle.raw), new TransitionRepository(handle.raw))
  })

  afterEach(() => {
    handle.close()
    rmSync(dir, { recursive: true, force: true })
  })

  it('creates and lists projects', () => {
    const a = projects.create('Alpha').project
    const b = projects.create('Beta').project
    expect(projects.list().map((p) => p.id)).toEqual([a.id, b.id])
  })

  it('renames a project', () => {
    const created = projects.create('Old').project
    const renamed = projects.rename(created.id, 'New')
    expect(renamed.name).toBe('New')
    expect(projects.list()[0]!.name).toBe('New')
  })

  it('throws when renaming a missing project', () => {
    expect(() => projects.rename('00000000-0000-4000-8000-000000000000', 'X')).toThrow(NotFoundError)
  })

  it('deleting a project removes its tasks', () => {
    const project = projects.create('Alpha').project
    tasks.create({ projectId: project.id, title: 'child task' })
    projects.delete(project.id)
    expect(tasks.listByProject(project.id)).toHaveLength(0)
  })

  it('throws when deleting a missing project', () => {
    expect(() => projects.delete('00000000-0000-4000-8000-000000000000')).toThrow(NotFoundError)
  })
})
