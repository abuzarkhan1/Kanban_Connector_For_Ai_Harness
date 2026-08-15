import type { Database } from 'better-sqlite3'
import type { ObservedEvent, EventCategory, EventType } from '@domain/entities/ObservedEvent'
import { NotFoundError } from '@domain/errors/domainError'

interface EventRow {
  id: string
  timestamp: number
  source: string
  category: string
  type: string
  project_id: string | null
  repository_id: string | null
  workspace_id: string | null
  session_id: string | null
  task_id: string | null
  process_id: number | null
  payload_json: string
  correlation_key: string | null
}

function toObservedEvent(row: EventRow): ObservedEvent {
  let payload: Record<string, unknown>
  try {
    payload = JSON.parse(row.payload_json) as Record<string, unknown>
  } catch {
    payload = {}
  }
  return {
    id: row.id,
    timestamp: row.timestamp,
    source: row.source,
    category: row.category as EventCategory,
    type: row.type as EventType,
    projectId: row.project_id,
    repositoryId: row.repository_id,
    workspaceId: row.workspace_id,
    sessionId: row.session_id,
    taskId: row.task_id,
    processId: row.process_id,
    payload,
    correlationKey: row.correlation_key
  }
}

const SELECT_COLS = 'id, timestamp, source, category, type, project_id, repository_id, workspace_id, session_id, task_id, process_id, payload_json, correlation_key'

export class EventRepository {
  constructor(private readonly db: Database) {}

  get(id: string): ObservedEvent {
    const row = this.db.prepare(`SELECT ${SELECT_COLS} FROM events WHERE id = ?`).get(id) as EventRow | undefined
    if (!row) throw new NotFoundError('Event', id)
    return toObservedEvent(row)
  }

  listRecent(limit: number = 100): ObservedEvent[] {
    const rows = this.db
      .prepare(`SELECT ${SELECT_COLS} FROM events ORDER BY timestamp DESC LIMIT ?`)
      .all(limit) as EventRow[]
    return rows.map(toObservedEvent)
  }

  listByProject(projectId: string, limit: number = 100): ObservedEvent[] {
    const rows = this.db
      .prepare(`SELECT ${SELECT_COLS} FROM events WHERE project_id = ? ORDER BY timestamp DESC LIMIT ?`)
      .all(projectId, limit) as EventRow[]
    return rows.map(toObservedEvent)
  }

  listByTask(taskId: string, limit: number = 100): ObservedEvent[] {
    const rows = this.db
      .prepare(`SELECT ${SELECT_COLS} FROM events WHERE task_id = ? ORDER BY timestamp DESC LIMIT ?`)
      .all(taskId, limit) as EventRow[]
    return rows.map(toObservedEvent)
  }

  listBySession(sessionId: string, limit: number = 100): ObservedEvent[] {
    const rows = this.db
      .prepare(`SELECT ${SELECT_COLS} FROM events WHERE session_id = ? ORDER BY timestamp DESC LIMIT ?`)
      .all(sessionId, limit) as EventRow[]
    return rows.map(toObservedEvent)
  }

  insert(event: ObservedEvent): void {
    this.db
      .prepare(
        'INSERT INTO events (id, timestamp, source, category, type, project_id, repository_id, workspace_id, session_id, task_id, process_id, payload_json, correlation_key) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
      )
      .run(
        event.id,
        event.timestamp,
        event.source,
        event.category,
        event.type,
        event.projectId,
        event.repositoryId,
        event.workspaceId,
        event.sessionId,
        event.taskId,
        event.processId,
        JSON.stringify(event.payload),
        event.correlationKey
      )
  }

  count(): number {
    const row = this.db.prepare('SELECT COUNT(*) as count FROM events').get() as { count: number }
    return row.count
  }
}
