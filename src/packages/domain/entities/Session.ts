import { createId } from '@shared/utils/id'
import type { HarnessType } from './Agent'

export type AgentActivityState =
  | 'thinking'
  | 'waiting_for_input'
  | 'awaiting_permission'
  | 'executing_commands'
  | 'modifying_files'
  | 'running_tests'
  | 'finished'
  | 'failed'
  | 'stuck'
  | 'idle'

export interface Session {
  id: string
  agentId: string
  agentType: HarnessType
  projectId: string
  repositoryId: string | null
  workspaceId: string | null
  taskId: string | null
  branch: string | null
  activityState: AgentActivityState
  lastPrompt: string | null
  startedAt: number
  lastActivityAt: number
  endedAt: number | null
}

export interface CreateSessionInput {
  id?: string
  agentId: string
  agentType: HarnessType
  projectId: string
  repositoryId?: string | null
  workspaceId?: string | null
  taskId?: string | null
  branch?: string | null
  activityState?: AgentActivityState
  lastPrompt?: string | null
  now?: number
}

export function createSession(input: CreateSessionInput): Session {
  const now = input.now ?? Date.now()
  return {
    id: input.id ?? createId(),
    agentId: input.agentId,
    agentType: input.agentType,
    projectId: input.projectId,
    repositoryId: input.repositoryId ?? null,
    workspaceId: input.workspaceId ?? null,
    taskId: input.taskId ?? null,
    branch: input.branch ?? null,
    activityState: input.activityState ?? 'thinking',
    lastPrompt: input.lastPrompt ?? null,
    startedAt: now,
    lastActivityAt: now,
    endedAt: null
  }
}
