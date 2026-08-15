import type { Database } from 'better-sqlite3'
import type { Task } from '@domain/entities/Task'
import { NotFoundError } from '@domain/errors/domainError'
import { isInternalStatus } from '@domain/state-machine/status'
import { isPriority, type Priority } from '@domain/value-objects/priority'

interface TaskRow {
  id: string
  project_id: string
  title: string
  description: string
  status: string
  priority: string
  repository_id: string | null
  workspace_id: string | null
  branch: string | null
  automation_mode: string | null
  created_at: number
  updated_at: number
}

function toTask(row: TaskRow, labels: string[]): Task {
  if (!isInternalStatus(row.status)) throw new Error(`Database contains unknown task status: ${row.status}`)
  if (!isPriority(row.priority)) throw new Error(`Database contains unknown priority: ${row.priority}`)
  return {
    id: row.id,
    projectId: row.project_id,
    title: row.title,
    description: row.description,
    status: row.status,
    priority: row.priority as Priority,
    labels,
    repositoryId: row.repository_id,
    workspaceId: row.workspace_id,
    branch: row.branch,
    automationMode: (row.automation_mode as 'AUTO' | 'MANUAL' | 'CONFIRM') || 'AUTO',
    createdAt: row.created_at,
    updatedAt: row.updated_at
  }
}

const SELECT_COLUMNS = 'id, project_id, title, description, status, priority, repository_id, workspace_id, branch, automation_mode, created_at, updated_at'

export class TaskRepository {
  constructor(private readonly db: Database) {}

  get(id: string): Task {
    const row = this.db.prepare(`SELECT ${SELECT_COLUMNS} FROM tasks WHERE id = ?`).get(id) as TaskRow | undefined
    if (!row) throw new NotFoundError('Task', id)
    return toTask(row, this.labelsFor(id))
  }

  listByProject(projectId: string): Task[] {
    const rows = this.db
      .prepare(`SELECT ${SELECT_COLUMNS} FROM tasks WHERE project_id = ? ORDER BY created_at`)
      .all(projectId) as TaskRow[]
    const labelsByTask = this.labelsByTask(rows.map((r) => r.id))
    return rows.map((row) => toTask(row, labelsByTask.get(row.id) ?? []))
  }

  insert(task: Task): void {
    const tx = this.db.transaction(() => {
      this.db
        .prepare(
          'INSERT INTO tasks (id, project_id, title, description, status, priority, repository_id, workspace_id, branch, automation_mode, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
        )
        .run(
          task.id,
          task.projectId,
          task.title,
          task.description,
          task.status,
          task.priority,
          task.repositoryId,
          task.workspaceId,
          task.branch,
          task.automationMode,
          task.createdAt,
          task.updatedAt
        )
      this.replaceLabels(task.id, task.labels)
    })
    tx()
  }

  save(task: Task): void {
    const tx = this.db.transaction(() => {
      const result = this.db
        .prepare(
          'UPDATE tasks SET title = ?, description = ?, status = ?, priority = ?, repository_id = ?, workspace_id = ?, branch = ?, automation_mode = ?, updated_at = ? WHERE id = ?'
        )
        .run(
          task.title,
          task.description,
          task.status,
          task.priority,
          task.repositoryId,
          task.workspaceId,
          task.branch,
          task.automationMode,
          task.updatedAt,
          task.id
        )
      if (result.changes === 0) throw new NotFoundError('Task', task.id)
      this.replaceLabels(task.id, task.labels)
    })
    tx()
  }

  delete(id: string): void {
    const result = this.db.prepare('DELETE FROM tasks WHERE id = ?').run(id)
    if (result.changes === 0) throw new NotFoundError('Task', id)
  }

  private labelsFor(taskId: string): string[] {
    const rows = this.db.prepare('SELECT label FROM task_labels WHERE task_id = ? ORDER BY rowid').all(taskId) as { label: string }[]
    return rows.map((r) => r.label)
  }

  private labelsByTask(taskIds: string[]): Map<string, string[]> {
    const map = new Map<string, string[]>()
    if (taskIds.length === 0) return map
    const placeholders = taskIds.map(() => '?').join(', ')
    const rows = this.db
      .prepare(`SELECT task_id, label FROM task_labels WHERE task_id IN (${placeholders}) ORDER BY rowid`)
      .all(...taskIds) as { task_id: string; label: string }[]
    for (const row of rows) {
      const labels = map.get(row.task_id)
      if (labels) labels.push(row.label)
      else map.set(row.task_id, [row.label])
    }
    return map
  }

  private replaceLabels(taskId: string, labels: string[]): void {
    this.db.prepare('DELETE FROM task_labels WHERE task_id = ?').run(taskId)
    const insert = this.db.prepare('INSERT INTO task_labels (task_id, label) VALUES (?, ?)')
    for (const label of labels) insert.run(taskId, label)
  }
}
