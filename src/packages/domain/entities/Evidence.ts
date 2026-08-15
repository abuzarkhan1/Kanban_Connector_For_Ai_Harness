import { createId } from '@shared/utils/id'

export interface EvidenceItem {
  type: 'process' | 'git' | 'test' | 'file' | 'mcp' | 'adapter'
  description: string
  eventId?: string
  confidence: number
}

export interface Evidence {
  id: string
  transitionId: string
  taskId: string
  ruleId: string
  confidence: number
  summary: string
  items: EvidenceItem[]
  createdAt: number
}

export interface CreateEvidenceInput {
  id?: string
  transitionId: string
  taskId: string
  ruleId: string
  confidence: number
  summary: string
  items: EvidenceItem[]
  now?: number
}

export function createEvidence(input: CreateEvidenceInput): Evidence {
  return {
    id: input.id ?? createId(),
    transitionId: input.transitionId,
    taskId: input.taskId,
    ruleId: input.ruleId,
    confidence: input.confidence,
    summary: input.summary,
    items: input.items,
    createdAt: input.now ?? Date.now()
  }
}
