import { z } from 'zod'

export const ObservedEventSchema = z.object({
  id: z.string().uuid(),
  timestamp: z.number().int(),
  source: z.string(),
  category: z.string(),
  type: z.string(),
  projectId: z.string().nullable(),
  repositoryId: z.string().nullable(),
  workspaceId: z.string().nullable(),
  sessionId: z.string().nullable(),
  taskId: z.string().nullable(),
  processId: z.number().nullable(),
  payload: z.record(z.string(), z.unknown()),
  correlationKey: z.string().nullable()
})

export type ObservedEventDto = z.infer<typeof ObservedEventSchema>

export const ListEventsSchema = z.object({
  projectId: z.string().uuid().optional(),
  taskId: z.string().uuid().optional(),
  sessionId: z.string().uuid().optional(),
  limit: z.number().int().min(1).max(500).optional()
}).strict()

export type ListEventsInput = z.infer<typeof ListEventsSchema>
