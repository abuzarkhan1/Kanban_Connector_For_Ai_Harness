import type { Database } from 'better-sqlite3'
import type { Project } from '@domain/entities/Project'
import { NotFoundError } from '@domain/errors/domainError'

interface ProjectRow {
  id: string
  name: string
  created_at: number
  updated_at: number
}

function toProject(row: ProjectRow): Project {
  return {
    id: row.id,
    name: row.name,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  }
}

export class ProjectRepository {
  constructor(private readonly db: Database) {}

  list(): Project[] {
    const rows = this.db.prepare('SELECT id, name, created_at, updated_at FROM projects ORDER BY created_at').all() as ProjectRow[]
    return rows.map(toProject)
  }

  get(id: string): Project {
    const row = this.db.prepare('SELECT id, name, created_at, updated_at FROM projects WHERE id = ?').get(id) as ProjectRow | undefined
    if (!row) throw new NotFoundError('Project', id)
    return toProject(row)
  }

  insert(project: Project): void {
    this.db
      .prepare('INSERT INTO projects (id, name, created_at, updated_at) VALUES (?, ?, ?, ?)')
      .run(project.id, project.name, project.createdAt, project.updatedAt)
  }

  update(project: Project): void {
    const result = this.db
      .prepare('UPDATE projects SET name = ?, updated_at = ? WHERE id = ?')
      .run(project.name, project.updatedAt, project.id)
    if (result.changes === 0) throw new NotFoundError('Project', project.id)
  }

  delete(id: string): void {
    const result = this.db.prepare('DELETE FROM projects WHERE id = ?').run(id)
    if (result.changes === 0) throw new NotFoundError('Project', id)
  }
}
