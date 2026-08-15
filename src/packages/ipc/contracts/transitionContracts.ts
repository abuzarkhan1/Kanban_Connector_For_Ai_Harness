import { z } from 'zod'
import { INTERNAL_STATUSES } from '@domain/state-machine/status'

export const TransitionSchema = z.object({
  id: z.string().uuid(),
  taskId: z.string().uuid(),
  fromStatus: z.enum(INTERNAL_STATUSES),
  toStatus: z.enum(INTERNAL_STATUSES),
  actor: z.enum(['system', 'user']),
  confidence: z.number().min(0).max(1).nullable(),
  ruleId: z.string().nullable(),
  createdAt: z.number().int()
})

export type TransitionDto = z.infer<typeof TransitionSchema>

export const ListTransitionsSchema = z.object({
  taskId: z.string().uuid()
}).strict()

export type ListTransitionsInput = z.infer<typeof ListTransitionsSchema>
