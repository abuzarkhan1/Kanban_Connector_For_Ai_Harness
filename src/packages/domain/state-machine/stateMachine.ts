import type { InternalStatus } from './status'

/**
 * Explicit transition table.
 *
 * This is the single source of truth for legal task-lifecycle transitions.
 * The UI, application services, and state-inference engine all go through this
 * table. System/inferred moves strictly follow these one-step edges.
 * User-driven column movements use moveToColumn to change columns directly.
 *
 * Diagram reference: docs/03-domain/STATE_MACHINE.md
 */
export const TRANSITIONS: Record<InternalStatus, readonly InternalStatus[]> = {
  BACKLOG: ['READY', 'ASSIGNED'],
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
  DONE: ['BACKLOG', 'READY']
}

export function canTransition(from: InternalStatus, to: InternalStatus): boolean {
  if (from === to) return true
  const list = TRANSITIONS[from]
  return Boolean(list && list.includes(to))
}

export function nextStatuses(from: InternalStatus): readonly InternalStatus[] {
  return TRANSITIONS[from] || []
}
