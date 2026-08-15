import { describe, expect, it } from 'vitest'
import { canTransition, nextStatuses, TRANSITIONS } from './stateMachine'
import { columnFor, defaultStatusForColumn, DEFAULT_STATUS, INTERNAL_STATUSES } from './status'

describe('state machine', () => {
  it('follows the documented primary lifecycle path', () => {
    const path = ['BACKLOG', 'READY', 'ASSIGNED', 'AGENT_STARTED', 'IMPLEMENTING', 'TESTING', 'READY_FOR_REVIEW', 'APPROVED', 'MERGED', 'DONE'] as const
    for (let i = 0; i < path.length - 1; i += 1) {
      expect(canTransition(path[i]!, path[i + 1]!), `${path[i]} -> ${path[i + 1]}`).toBe(true)
    }
  })

  it('supports the changes-requested loop', () => {
    expect(canTransition('READY_FOR_REVIEW', 'CHANGES_REQUESTED')).toBe(true)
    expect(canTransition('CHANGES_REQUESTED', 'IMPLEMENTING')).toBe(true)
  })

  it('allows blocking and resuming around IMPLEMENTING/TESTING', () => {
    expect(canTransition('IMPLEMENTING', 'BLOCKED')).toBe(true)
    expect(canTransition('TESTING', 'BLOCKED')).toBe(true)
    expect(canTransition('BLOCKED', 'IMPLEMENTING')).toBe(true)
    expect(canTransition('BLOCKED', 'TESTING')).toBe(true)
  })

  it('rejects invalid jumps', () => {
    expect(canTransition('BACKLOG', 'DONE')).toBe(false)
    expect(canTransition('ASSIGNED', 'DONE')).toBe(false)
  })

  it('supports reopening from DONE to BACKLOG or READY', () => {
    expect(canTransition('DONE', 'BACKLOG')).toBe(true)
    expect(canTransition('DONE', 'READY')).toBe(true)
  })

  it('declares a valid entry for every internal status', () => {
    for (const status of INTERNAL_STATUSES) {
      expect(TRANSITIONS[status], status).toBeDefined()
      expect(nextStatuses(status)).toBe(TRANSITIONS[status])
    }
  })
})

describe('column mapping', () => {
  it('maps lifecycle states to the four user-facing columns', () => {
    expect(columnFor('BACKLOG')).toBe('TODO')
    expect(columnFor('ASSIGNED')).toBe('TODO')
    expect(columnFor('IMPLEMENTING')).toBe('IN_PROGRESS')
    expect(columnFor('BLOCKED')).toBe('IN_PROGRESS')
    expect(columnFor('READY_FOR_REVIEW')).toBe('REVIEW')
    expect(columnFor('APPROVED')).toBe('REVIEW')
    expect(columnFor('MERGED')).toBe('DONE')
    expect(columnFor('DONE')).toBe('DONE')
  })

  it('starts new tasks in the TODO column', () => {
    expect(columnFor(DEFAULT_STATUS)).toBe('TODO')
  })

  it('provides an entry status for every column', () => {
    expect(defaultStatusForColumn('TODO')).toBe('BACKLOG')
    expect(defaultStatusForColumn('IN_PROGRESS')).toBe('IMPLEMENTING')
    expect(defaultStatusForColumn('REVIEW')).toBe('READY_FOR_REVIEW')
    expect(defaultStatusForColumn('DONE')).toBe('DONE')
  })

  it('maps every column default back to its own column', () => {
    for (const column of ['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'] as const) {
      expect(columnFor(defaultStatusForColumn(column))).toBe(column)
    }
  })
})
