import { describe, expect, it } from 'vitest'
import { buildBoard } from './boardQuery'
import { createProject } from '@domain/entities/Project'
import { createTask, withStatus } from '@domain/entities/Task'
import { COLUMNS } from '@domain/state-machine/status'

describe('buildBoard', () => {
  it('groups tasks into the four columns by internal status', () => {
    const project = createProject({ name: 'Alpha' })
    const backlog = createTask({ projectId: project.id, title: 'backlog task' })
    const implementing = withStatus(createTask({ projectId: project.id, title: 'implementing task' }), 'IMPLEMENTING')
    const review = withStatus(createTask({ projectId: project.id, title: 'review task' }), 'READY_FOR_REVIEW')
    const done = withStatus(createTask({ projectId: project.id, title: 'done task' }), 'DONE')

    const board = buildBoard(project, [done, review, implementing, backlog])

    expect(board.projectId).toBe(project.id)
    expect(board.projectName).toBe('Alpha')
    expect(board.columns.map((c) => c.id)).toEqual([...COLUMNS])
    expect(board.columns.map((c) => c.tasks.length)).toEqual([1, 1, 1, 1])
    expect(board.columns[0]!.tasks[0]!.title).toBe('backlog task')
    expect(board.columns[1]!.tasks[0]!.title).toBe('implementing task')
  })

  it('maps multiple internal states into the same column', () => {
    const project = createProject({ name: 'Alpha' })
    const tasks = [
      withStatus(createTask({ projectId: project.id, title: 'a' }), 'AGENT_STARTED'),
      withStatus(createTask({ projectId: project.id, title: 'b' }), 'TESTING'),
      withStatus(createTask({ projectId: project.id, title: 'c' }), 'BLOCKED')
    ]
    const board = buildBoard(project, tasks)
    expect(board.columns.find((c) => c.id === 'IN_PROGRESS')!.tasks).toHaveLength(3)
    expect(board.columns.find((c) => c.id === 'TODO')!.tasks).toHaveLength(0)
  })

  it('handles an empty project', () => {
    const project = createProject({ name: 'Empty' })
    const board = buildBoard(project, [])
    expect(board.columns.every((c) => c.tasks.length === 0)).toBe(true)
  })
})
