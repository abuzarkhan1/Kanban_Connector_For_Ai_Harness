import { columnFor, COLUMNS, type ColumnId } from '@domain/state-machine/status'
import type { Project } from '@domain/entities/Project'
import type { Task } from '@domain/entities/Task'
import type { BoardDto } from '@ipc/contracts/boardContracts'

const COLUMN_NAMES: Record<ColumnId, string> = {
  TODO: 'TODO',
  IN_PROGRESS: 'IN PROGRESS',
  REVIEW: 'REVIEW',
  DONE: 'DONE'
}

export function buildBoard(project: Project, tasks: Task[]): BoardDto {
  return {
    projectId: project.id,
    projectName: project.name,
    columns: COLUMNS.map((columnId) => ({
      id: columnId,
      name: COLUMN_NAMES[columnId],
      tasks: tasks.filter((task) => columnFor(task.status) === columnId)
    }))
  }
}
