import { describe, expect, it } from 'vitest'
import { CreateTaskSchema, MoveTaskSchema, MoveTaskToColumnSchema, UpdateTaskSchema } from './taskContracts'
import { CreateProjectSchema } from './projectContracts'
import { GetBoardSchema, BoardSchema } from './boardContracts'

const UUID = '00000000-0000-4000-8000-000000000000'

describe('IPC contracts', () => {
  it('accepts a valid create-task payload', () => {
    const parsed = CreateTaskSchema.safeParse({
      projectId: UUID,
      title: 'Implement OAuth',
      description: 'Add GitHub OAuth flow',
      priority: 'HIGH',
      labels: ['auth']
    })
    expect(parsed.success).toBe(true)
  })

  it('accepts an optional-only create-task payload', () => {
    const parsed = CreateTaskSchema.safeParse({ projectId: UUID, title: 'x' })
    expect(parsed.success).toBe(true)
  })

  it('rejects an empty title', () => {
    expect(CreateTaskSchema.safeParse({ projectId: UUID, title: '   ' }).success).toBe(false)
  })

  it('rejects an unknown priority', () => {
    expect(CreateTaskSchema.safeParse({ projectId: UUID, title: 'x', priority: 'CRITICAL' }).success).toBe(false)
  })

  it('accepts a valid move-to-column payload and rejects an internal status', () => {
    expect(MoveTaskToColumnSchema.safeParse({ id: UUID, columnId: 'IN_PROGRESS' }).success).toBe(true)
    expect(MoveTaskToColumnSchema.safeParse({ id: UUID, columnId: 'BACKLOG' }).success).toBe(false)
  })

  it('rejects an unknown move target', () => {
    expect(MoveTaskSchema.safeParse({ id: UUID, toStatus: 'DONEISH' }).success).toBe(false)
    expect(MoveTaskSchema.safeParse({ id: UUID, toStatus: 'READY_FOR_REVIEW' }).success).toBe(true)
  })

  it('rejects unknown fields in update payloads', () => {
    const parsed = UpdateTaskSchema.safeParse({ id: UUID, owner: 'someone' })
    expect(parsed.success).toBe(false)
  })

  it('rejects a non-uuid project id', () => {
    expect(CreateTaskSchema.safeParse({ projectId: 'not-a-uuid', title: 'x' }).success).toBe(false)
    expect(GetBoardSchema.safeParse({ projectId: 'not-a-uuid' }).success).toBe(false)
  })

  it('validates the project name length', () => {
    expect(CreateProjectSchema.safeParse({ name: 'A'.repeat(201) }).success).toBe(false)
    expect(CreateProjectSchema.safeParse({ name: 'A' }).success).toBe(true)
  })

  it('accepts a well-formed board payload', () => {
    const task = {
      id: UUID,
      projectId: UUID,
      title: 't',
      description: '',
      status: 'BACKLOG',
      priority: 'MEDIUM',
      labels: [],
      repositoryId: null,
      createdAt: 1,
      updatedAt: 1
    }
    const board = {
      projectId: UUID,
      projectName: 'Alpha',
      columns: [
        { id: 'TODO', name: 'TODO', tasks: [task] },
        { id: 'IN_PROGRESS', name: 'IN PROGRESS', tasks: [] },
        { id: 'REVIEW', name: 'REVIEW', tasks: [] },
        { id: 'DONE', name: 'DONE', tasks: [] }
      ]
    }
    expect(BoardSchema.safeParse(board).success).toBe(true)
  })
})
