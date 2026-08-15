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

export const EvidenceItemSchema = z.object({
  type: z.enum(['process', 'git', 'test', 'file', 'mcp', 'adapter']),
  description: z.string(),
  eventId: z.string().optional(),
  confidence: z.number()
})

export const EvidenceSchema = z.object({
  id: z.string().uuid(),
  transitionId: z.string().uuid(),
  taskId: z.string().uuid(),
  ruleId: z.string(),
  confidence: z.number(),
  summary: z.string(),
  items: z.array(EvidenceItemSchema),
  createdAt: z.number().int()
})

export type EvidenceDto = z.infer<typeof EvidenceSchema>

export const ListEvidenceSchema = z.object({
  taskId: z.string().uuid()
}).strict()

export type ListEvidenceInput = z.infer<typeof ListEvidenceSchema>
