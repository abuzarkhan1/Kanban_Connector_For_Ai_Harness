import type { Database } from 'better-sqlite3'
import type { Session, AgentActivityState } from '@domain/entities/Session'
import type { HarnessType } from '@domain/entities/Agent'
import { NotFoundError } from '@domain/errors/domainError'

interface SessionRow {
  id: string
  agent_id: string
  agent_type: string
  project_id: string
  repository_id: string | null
  workspace_id: string | null
  task_id: string | null
  branch: string | null
  activity_state: string
  last_prompt: string | null
  started_at: number
  last_activity_at: number
  ended_at: number | null
}

function toSession(row: SessionRow): Session {
  return {
    id: row.id,
    agentId: row.agent_id,
    agentType: row.agent_type as HarnessType,
    projectId: row.project_id,
    repositoryId: row.repository_id,
    workspaceId: row.workspace_id,
    taskId: row.task_id,
    branch: row.branch,
    activityState: row.activity_state as AgentActivityState,
    lastPrompt: row.last_prompt,
    startedAt: row.started_at,
    lastActivityAt: row.last_activity_at,
    endedAt: row.ended_at
  }
}

const SELECT_COLS = 'id, agent_id, agent_type, project_id, repository_id, workspace_id, task_id, branch, activity_state, last_prompt, started_at, last_activity_at, ended_at'

export class SessionRepository {
  constructor(private readonly db: Database) {}

  get(id: string): Session {
    const row = this.db.prepare(`SELECT ${SELECT_COLS} FROM sessions WHERE id = ?`).get(id) as SessionRow | undefined
    if (!row) throw new NotFoundError('Session', id)
    return toSession(row)
  }

  listByProject(projectId: string): Session[] {
    const rows = this.db
      .prepare(`SELECT ${SELECT_COLS} FROM sessions WHERE project_id = ? ORDER BY started_at DESC`)
      .all(projectId) as SessionRow[]
    return rows.map(toSession)
  }

  listActive(): Session[] {
    const rows = this.db
      .prepare(`SELECT ${SELECT_COLS} FROM sessions WHERE ended_at IS NULL ORDER BY last_activity_at DESC`)
      .all() as SessionRow[]
    return rows.map(toSession)
  }

  listByTask(taskId: string): Session[] {
    const rows = this.db
      .prepare(`SELECT ${SELECT_COLS} FROM sessions WHERE task_id = ? ORDER BY started_at DESC`)
      .all(taskId) as SessionRow[]
    return rows.map(toSession)
  }

  insert(session: Session): void {
    this.db
      .prepare(
        'INSERT INTO sessions (id, agent_id, agent_type, project_id, repository_id, workspace_id, task_id, branch, activity_state, last_prompt, started_at, last_activity_at, ended_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
      )
      .run(
        session.id,
        session.agentId,
        session.agentType,
        session.projectId,
        session.repositoryId,
        session.workspaceId,
        session.taskId,
        session.branch,
        session.activityState,
        session.lastPrompt,
        session.startedAt,
        session.lastActivityAt,
        session.endedAt
      )
  }

  save(session: Session): void {
    const result = this.db
      .prepare(
        'UPDATE sessions SET task_id = ?, branch = ?, activity_state = ?, last_prompt = ?, last_activity_at = ?, ended_at = ? WHERE id = ?'
      )
      .run(
        session.taskId,
        session.branch,
        session.activityState,
        session.lastPrompt,
        session.lastActivityAt,
        session.endedAt,
        session.id
      )
    if (result.changes === 0) throw new NotFoundError('Session', session.id)
  }

  delete(id: string): void {
    const result = this.db.prepare('DELETE FROM sessions WHERE id = ?').run(id)
    if (result.changes === 0) throw new NotFoundError('Session', id)
  }
}
