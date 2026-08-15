/**
 * Internal lifecycle states are richer than the user-facing columns.
 *
 * The UI only ever displays the four columns, but the domain model tracks the
 * full lifecycle so that future automation (state inference, harness adapters)
 * can reason about fine-grained progress.
 */
export const INTERNAL_STATUSES = [
  'BACKLOG',
  'READY',
  'ASSIGNED',
  'AGENT_STARTED',
  'IMPLEMENTING',
  'TESTING',
  'BLOCKED',
  'READY_FOR_REVIEW',
  'CHANGES_REQUESTED',
  'APPROVED',
  'MERGED',
  'DONE'
] as const

export type InternalStatus = (typeof INTERNAL_STATUSES)[number]

export const COLUMNS = ['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'] as const

export type ColumnId = (typeof COLUMNS)[number]

export const DEFAULT_STATUS: InternalStatus = 'BACKLOG'

const COLUMN_FOR: Record<InternalStatus, ColumnId> = {
  BACKLOG: 'TODO',
  READY: 'TODO',
  ASSIGNED: 'TODO',
  AGENT_STARTED: 'IN_PROGRESS',
  IMPLEMENTING: 'IN_PROGRESS',
  TESTING: 'IN_PROGRESS',
  BLOCKED: 'IN_PROGRESS',
  READY_FOR_REVIEW: 'REVIEW',
  CHANGES_REQUESTED: 'REVIEW',
  APPROVED: 'REVIEW',
  MERGED: 'DONE',
  DONE: 'DONE'
}

export function columnFor(status: InternalStatus): ColumnId {
  return COLUMN_FOR[status]
}

/**
 * The internal status a task takes when it is dropped onto a board column
 * (e.g. via drag-and-drop or a "move to column" action). The column's
 * entry/representative status.
 */
export const DEFAULT_STATUS_FOR_COLUMN: Record<ColumnId, InternalStatus> = {
  TODO: 'BACKLOG',
  IN_PROGRESS: 'IMPLEMENTING',
  REVIEW: 'READY_FOR_REVIEW',
  DONE: 'DONE'
}

export function defaultStatusForColumn(column: ColumnId): InternalStatus {
  return DEFAULT_STATUS_FOR_COLUMN[column]
}

export function isInternalStatus(value: unknown): value is InternalStatus {
  return typeof value === 'string' && (INTERNAL_STATUSES as readonly string[]).includes(value)
}
