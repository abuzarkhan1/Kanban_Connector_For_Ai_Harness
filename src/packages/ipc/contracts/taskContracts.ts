import { z } from 'zod'
import { COLUMNS, INTERNAL_STATUSES } from '@domain/state-machine/status'
import { PRIORITIES } from '@domain/value-objects/priority'

export const TaskSchema = z.object({
  id: z.string().uuid(),
  projectId: z.string().uuid(),
  title: z.string().min(1).max(500),
  description: z.string().max(100_000),
  status: z.enum(INTERNAL_STATUSES),
  priority: z.enum(PRIORITIES),
  labels: z.array(z.string().min(1).max(50)).max(20),
  repositoryId: z.string().nullable(),
  workspaceId: z.string().nullable().optional(),
  branch: z.string().nullable().optional(),
  automationMode: z.enum(['AUTO', 'MANUAL', 'CONFIRM']).optional(),
  createdAt: z.number().int(),
  updatedAt: z.number().int()
})

export type TaskDto = z.infer<typeof TaskSchema>

export const CreateTaskSchema = z.object({
  projectId: z.string().uuid(),
  title: z.string().trim().min(1).max(500),
  description: z.string().max(100_000).optional(),
  status: z.enum(INTERNAL_STATUSES).optional(),
  priority: z.enum(PRIORITIES).optional(),
  labels: z.array(z.string().trim().min(1).max(50)).max(20).optional(),
  repositoryId: z.string().nullable().optional(),
  workspaceId: z.string().nullable().optional(),
  branch: z.string().nullable().optional(),
  automationMode: z.enum(['AUTO', 'MANUAL', 'CONFIRM']).optional()
}).strict()

export type CreateTaskInput = z.infer<typeof CreateTaskSchema>

export const UpdateTaskSchema = z.object({
  id: z.string().uuid(),
  title: z.string().trim().min(1).max(500).optional(),
  description: z.string().max(100_000).optional(),
  priority: z.enum(PRIORITIES).optional(),
  labels: z.array(z.string().trim().min(1).max(50)).max(20).optional(),
  repositoryId: z.string().nullable().optional(),
  workspaceId: z.string().nullable().optional(),
  branch: z.string().nullable().optional(),
  automationMode: z.enum(['AUTO', 'MANUAL', 'CONFIRM']).optional()
}).strict()

export type UpdateTaskInput = z.infer<typeof UpdateTaskSchema>

/** Field-level patch used by application services (the id travels separately). */
export const UpdateTaskPatchSchema = UpdateTaskSchema.omit({ id: true })

export type UpdateTaskPatch = z.infer<typeof UpdateTaskPatchSchema>

export const MoveTaskSchema = z.object({
  id: z.string().uuid(),
  toStatus: z.enum(INTERNAL_STATUSES)
}).strict()

export type MoveTaskInput = z.infer<typeof MoveTaskSchema>

export const MoveTaskToColumnSchema = z.object({
  id: z.string().uuid(),
  columnId: z.enum(COLUMNS)
}).strict()

export type MoveTaskToColumnInput = z.infer<typeof MoveTaskToColumnSchema>

export const ListTasksSchema = z.object({
  projectId: z.string().uuid()
}).strict()

export type ListTasksInput = z.infer<typeof ListTasksSchema>

export const DeleteTaskSchema = z.object({
  id: z.string().uuid()
}).strict()

export type DeleteTaskInput = z.infer<typeof DeleteTaskSchema>
