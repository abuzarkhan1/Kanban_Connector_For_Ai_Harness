import type { Database } from 'better-sqlite3'
import type { Repository, WorktreeInfo } from '@domain/entities/Repository'
import { NotFoundError } from '@domain/errors/domainError'

interface RepositoryRow {
  id: string
  project_id: string
  name: string
  path: string
  default_branch: string
  current_branch: string
  head_commit: string | null
  worktrees_json: string
  last_scanned_at: number
  created_at: number
  updated_at: number
}

function toRepository(row: RepositoryRow): Repository {
  let worktrees: WorktreeInfo[]
  try {
    worktrees = JSON.parse(row.worktrees_json) as WorktreeInfo[]
  } catch {
    worktrees = []
  }
  return {
    id: row.id,
    projectId: row.project_id,
    name: row.name,
    path: row.path,
    defaultBranch: row.default_branch,
    currentBranch: row.current_branch,
    headCommit: row.head_commit,
    worktrees,
    lastScannedAt: row.last_scanned_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  }
}

const SELECT_COLS = 'id, project_id, name, path, default_branch, current_branch, head_commit, worktrees_json, last_scanned_at, created_at, updated_at'

export class RepositoryRepository {
  constructor(private readonly db: Database) {}

  get(id: string): Repository {
    const row = this.db.prepare(`SELECT ${SELECT_COLS} FROM repositories WHERE id = ?`).get(id) as RepositoryRow | undefined
    if (!row) throw new NotFoundError('Repository', id)
    return toRepository(row)
  }

  getByPath(path: string): Repository | null {
    const row = this.db.prepare(`SELECT ${SELECT_COLS} FROM repositories WHERE path = ?`).get(path) as RepositoryRow | undefined
    return row ? toRepository(row) : null
  }

  listByProject(projectId: string): Repository[] {
    const rows = this.db
      .prepare(`SELECT ${SELECT_COLS} FROM repositories WHERE project_id = ? ORDER BY name ASC`)
      .all(projectId) as RepositoryRow[]
    return rows.map(toRepository)
  }

  listAll(): Repository[] {
    const rows = this.db.prepare(`SELECT ${SELECT_COLS} FROM repositories ORDER BY name ASC`).all() as RepositoryRow[]
    return rows.map(toRepository)
  }

  insert(repo: Repository): void {
    this.db
      .prepare(
        'INSERT INTO repositories (id, project_id, name, path, default_branch, current_branch, head_commit, worktrees_json, last_scanned_at, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
      )
      .run(
        repo.id,
        repo.projectId,
        repo.name,
        repo.path,
        repo.defaultBranch,
        repo.currentBranch,
        repo.headCommit,
        JSON.stringify(repo.worktrees),
        repo.lastScannedAt,
        repo.createdAt,
        repo.updatedAt
      )
  }

  save(repo: Repository): void {
    const result = this.db
      .prepare(
        'UPDATE repositories SET name = ?, default_branch = ?, current_branch = ?, head_commit = ?, worktrees_json = ?, last_scanned_at = ?, updated_at = ? WHERE id = ?'
      )
      .run(
        repo.name,
        repo.defaultBranch,
        repo.currentBranch,
        repo.headCommit,
        JSON.stringify(repo.worktrees),
        repo.lastScannedAt,
        repo.updatedAt,
        repo.id
      )
    if (result.changes === 0) throw new NotFoundError('Repository', repo.id)
  }

  delete(id: string): void {
    const result = this.db.prepare('DELETE FROM repositories WHERE id = ?').run(id)
    if (result.changes === 0) throw new NotFoundError('Repository', id)
  }
}
