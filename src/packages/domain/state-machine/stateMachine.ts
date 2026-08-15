import type { InternalStatus } from './status'

/**
 * Explicit transition table.
 *
 * This is the single source of truth for legal task-lifecycle transitions.
 * The UI, the application services and (later) the state-inference engine all
 * go through this table; nothing may move a task by bypassing it.
 *
 * Diagram reference: docs/03-domain/STATE_MACHINE.md
 */
export const TRANSITIONS: Record<InternalStatus, readonly InternalStatus[]> = {
  BACKLOG: ['READY'],
  READY: ['ASSIGNED', 'BACKLOG'],
  ASSIGNED: ['AGENT_STARTED', 'READY'],
  AGENT_STARTED: ['IMPLEMENTING', 'BLOCKED'],
  IMPLEMENTING: ['TESTING', 'BLOCKED', 'READY_FOR_REVIEW'],
  TESTING: ['IMPLEMENTING', 'BLOCKED', 'READY_FOR_REVIEW'],
  BLOCKED: ['IMPLEMENTING', 'TESTING'],
  READY_FOR_REVIEW: ['CHANGES_REQUESTED', 'APPROVED', 'IMPLEMENTING'],
  CHANGES_REQUESTED: ['IMPLEMENTING'],
  APPROVED: ['MERGED', 'READY_FOR_REVIEW'],
  MERGED: ['DONE'],
  DONE: []
}

export function canTransition(from: InternalStatus, to: InternalStatus): boolean {
  return TRANSITIONS[from].includes(to)
}

export function nextStatuses(from: InternalStatus): readonly InternalStatus[] {
  return TRANSITIONS[from]
}
