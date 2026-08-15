import type { Database } from 'better-sqlite3'
import type { Agent, HarnessType } from '@domain/entities/Agent'
import { NotFoundError } from '@domain/errors/domainError'

interface AgentRow {
  id: string
  type: string
  display_name: string
  process_id: number | null
  command: string | null
  working_directory: string | null
  adapter_level: number
  status: string
  last_seen_at: number
  created_at: number
}

function toAgent(row: AgentRow): Agent {
  return {
    id: row.id,
    type: row.type as HarnessType,
    displayName: row.display_name,
    processId: row.process_id,
    command: row.command,
    workingDirectory: row.working_directory,
    adapterLevel: row.adapter_level as 0 | 1 | 2 | 3,
    status: row.status as 'active' | 'idle' | 'stopped',
    lastSeenAt: row.last_seen_at,
    createdAt: row.created_at
  }
}

const SELECT_COLS = 'id, type, display_name, process_id, command, working_directory, adapter_level, status, last_seen_at, created_at'

export class AgentRepository {
  constructor(private readonly db: Database) {}

  get(id: string): Agent {
    const row = this.db.prepare(`SELECT ${SELECT_COLS} FROM agents WHERE id = ?`).get(id) as AgentRow | undefined
    if (!row) throw new NotFoundError('Agent', id)
    return toAgent(row)
  }

  list(): Agent[] {
    const rows = this.db.prepare(`SELECT ${SELECT_COLS} FROM agents ORDER BY last_seen_at DESC`).all() as AgentRow[]
    return rows.map(toAgent)
  }

  listActive(): Agent[] {
    const rows = this.db
      .prepare(`SELECT ${SELECT_COLS} FROM agents WHERE status = 'active' ORDER BY last_seen_at DESC`)
      .all() as AgentRow[]
    return rows.map(toAgent)
  }

  upsert(agent: Agent): void {
    this.db
      .prepare(
        `INSERT INTO agents (id, type, display_name, process_id, command, working_directory, adapter_level, status, last_seen_at, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(id) DO UPDATE SET
           display_name = excluded.display_name,
           process_id = excluded.process_id,
           command = excluded.command,
           working_directory = excluded.working_directory,
           adapter_level = excluded.adapter_level,
           status = excluded.status,
           last_seen_at = excluded.last_seen_at`
      )
      .run(
        agent.id,
        agent.type,
        agent.displayName,
        agent.processId,
        agent.command,
        agent.workingDirectory,
        agent.adapterLevel,
        agent.status,
        agent.lastSeenAt,
        agent.createdAt
      )
  }

  delete(id: string): void {
    this.db.prepare('DELETE FROM agents WHERE id = ?').run(id)
  }
}
