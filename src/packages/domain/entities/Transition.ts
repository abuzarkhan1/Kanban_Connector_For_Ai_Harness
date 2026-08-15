import { createId } from '@shared/utils/id'
import type { InternalStatus } from '../state-machine/status'

export type TransitionActor = 'system' | 'user'

export interface Transition {
  id: string
  taskId: string
  fromStatus: InternalStatus
  toStatus: InternalStatus
  actor: TransitionActor
  /** Only present for automatic transitions produced by the inference engine. */
  confidence: number | null
  /** Rule identifier for automatic transitions; null for manual moves. */
  ruleId: string | null
  createdAt: number
}

export interface CreateTransitionInput {
  id?: string
  taskId: string
  fromStatus: InternalStatus
  toStatus: InternalStatus
  actor: TransitionActor
  confidence?: number | null
  ruleId?: string | null
  now?: number
}

export function createTransition(input: CreateTransitionInput): Transition {
  return {
    id: input.id ?? createId(),
    taskId: input.taskId,
    fromStatus: input.fromStatus,
    toStatus: input.toStatus,
    actor: input.actor,
    confidence: input.confidence ?? null,
    ruleId: input.ruleId ?? null,
    createdAt: input.now ?? Date.now()
  }
}
