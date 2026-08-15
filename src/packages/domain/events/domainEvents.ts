import { createId } from '@shared/utils/id'

export const DOMAIN_EVENT_TYPES = [
  'project.created',
  'project.renamed',
  'project.deleted',
  'task.created',
  'task.updated',
  'task.status_changed',
  'task.deleted'
] as const

export type DomainEventType = (typeof DOMAIN_EVENT_TYPES)[number]

export interface DomainEvent {
  id: string
  type: DomainEventType
  timestamp: number
  aggregateId: string
  payload: Record<string, unknown>
}

export function createDomainEvent(
  type: DomainEventType,
  aggregateId: string,
  payload: Record<string, unknown> = {},
  timestamp: number = Date.now()
): DomainEvent {
  return { id: createId(), type, timestamp, aggregateId, payload }
}
