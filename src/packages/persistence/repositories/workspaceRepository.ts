import type { Database } from 'better-sqlite3'
import type { Workspace } from '@domain/entities/Workspace'
import { NotFoundError } from '@domain/errors/domainError'

interface WorkspaceRow {
  id: string
  repository_id: string
  project_id: string
  name: string
  path: string
  branch: string
  is_worktree: number
  created_at: number
  updated_at: number
}

function toWorkspace(row: WorkspaceRow): Workspace {
  return {
    id: row.id,
    repositoryId: row.repository_id,
    projectId: row.project_id,
    name: row.name,
    path: row.path,
    branch: row.branch,
    isWorktree: Boolean(row.is_worktree),
    createdAt: row.created_at,
    updatedAt: row.updated_at
  }
}

const SELECT_COLS = 'id, repository_id, project_id, name, path, branch, is_worktree, created_at, updated_at'

export class WorkspaceRepository {
  constructor(private readonly db: Database) {}

  get(id: string): Workspace {
    const row = this.db.prepare(`SELECT ${SELECT_COLS} FROM workspaces WHERE id = ?`).get(id) as WorkspaceRow | undefined
    if (!row) throw new NotFoundError('Workspace', id)
    return toWorkspace(row)
  }

  getByPath(path: string): Workspace | null {
    const row = this.db.prepare(`SELECT ${SELECT_COLS} FROM workspaces WHERE path = ?`).get(path) as WorkspaceRow | undefined
    return row ? toWorkspace(row) : null
  }

  listByRepository(repositoryId: string): Workspace[] {
    const rows = this.db
      .prepare(`SELECT ${SELECT_COLS} FROM workspaces WHERE repository_id = ? ORDER BY name ASC`)
      .all(repositoryId) as WorkspaceRow[]
    return rows.map(toWorkspace)
  }

  listByProject(projectId: string): Workspace[] {
    const rows = this.db
      .prepare(`SELECT ${SELECT_COLS} FROM workspaces WHERE project_id = ? ORDER BY name ASC`)
      .all(projectId) as WorkspaceRow[]
    return rows.map(toWorkspace)
  }

  insert(workspace: Workspace): void {
    this.db
      .prepare(
        'INSERT INTO workspaces (id, repository_id, project_id, name, path, branch, is_worktree, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
      )
      .run(
        workspace.id,
        workspace.repositoryId,
        workspace.projectId,
        workspace.name,
        workspace.path,
        workspace.branch,
        workspace.isWorktree ? 1 : 0,
        workspace.createdAt,
        workspace.updatedAt
      )
  }

  save(workspace: Workspace): void {
    const result = this.db
      .prepare('UPDATE workspaces SET name = ?, branch = ?, updated_at = ? WHERE id = ?')
      .run(workspace.name, workspace.branch, workspace.updatedAt, workspace.id)
    if (result.changes === 0) throw new NotFoundError('Workspace', workspace.id)
  }

  delete(id: string): void {
    const result = this.db.prepare('DELETE FROM workspaces WHERE id = ?').run(id)
    if (result.changes === 0) throw new NotFoundError('Workspace', id)
  }
}
