import { createId } from '@shared/utils/id'
import { columnFor, DEFAULT_STATUS, type ColumnId, type InternalStatus } from '../state-machine/status'
import { DEFAULT_PRIORITY, type Priority } from '../value-objects/priority'

export type AutomationMode = 'AUTO' | 'MANUAL' | 'CONFIRM'

export interface Task {
  id: string
  projectId: string
  title: string
  description: string
  status: InternalStatus
  priority: Priority
  labels: string[]
  repositoryId: string | null
  workspaceId: string | null
  branch: string | null
  automationMode: AutomationMode
  createdAt: number
  updatedAt: number
}

export interface CreateTaskInput {
  id?: string
  projectId: string
  title: string
  description?: string
  priority?: Priority
  labels?: string[]
  repositoryId?: string | null
  workspaceId?: string | null
  branch?: string | null
  automationMode?: AutomationMode
  status?: InternalStatus
  now?: number
}

export function createTask(input: CreateTaskInput): Task {
  const now = input.now ?? Date.now()
  return {
    id: input.id ?? createId(),
    projectId: input.projectId,
    title: input.title.trim(),
    description: input.description?.trim() ?? '',
    status: input.status ?? DEFAULT_STATUS,
    priority: input.priority ?? DEFAULT_PRIORITY,
    labels: input.labels ?? [],
    repositoryId: input.repositoryId ?? null,
    workspaceId: input.workspaceId ?? null,
    branch: input.branch ?? null,
    automationMode: input.automationMode ?? 'AUTO',
    createdAt: now,
    updatedAt: now
  }
}

export function withStatus(task: Task, status: InternalStatus, now: number = Date.now()): Task {
  return { ...task, status, updatedAt: now }
}

export function withTaskPatch(
  task: Task,
  patch: {
    title?: string
    description?: string
    priority?: Priority
    labels?: string[]
    repositoryId?: string | null
    workspaceId?: string | null
    branch?: string | null
    automationMode?: AutomationMode
  },
  now: number = Date.now()
): Task {
  return {
    ...task,
    title: patch.title !== undefined ? patch.title.trim() : task.title,
    description: patch.description !== undefined ? patch.description.trim() : task.description,
    priority: patch.priority ?? task.priority,
    labels: patch.labels ?? task.labels,
    repositoryId: patch.repositoryId !== undefined ? patch.repositoryId : task.repositoryId,
    workspaceId: patch.workspaceId !== undefined ? patch.workspaceId : task.workspaceId,
    branch: patch.branch !== undefined ? patch.branch : task.branch,
    automationMode: patch.automationMode ?? task.automationMode,
    updatedAt: now
  }
}

export function columnIdOf(task: Task): ColumnId {
  return columnFor(task.status)
}
