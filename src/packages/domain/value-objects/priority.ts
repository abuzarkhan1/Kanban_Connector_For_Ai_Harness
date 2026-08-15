export const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'] as const

export type Priority = (typeof PRIORITIES)[number]

export const DEFAULT_PRIORITY: Priority = 'MEDIUM'

export function isPriority(value: unknown): value is Priority {
  return typeof value === 'string' && (PRIORITIES as readonly string[]).includes(value)
}
