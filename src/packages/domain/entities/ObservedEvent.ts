import { createId } from '@shared/utils/id'

export type EventCategory =
  | 'process'
  | 'harness'
  | 'filesystem'
  | 'terminal'
  | 'git'
  | 'test'
  | 'mcp'
  | 'user'

export type EventType =
  // Process
  | 'PROCESS_STARTED'
  | 'PROCESS_UPDATED'
  | 'PROCESS_EXITED'
  // Harness
  | 'HARNESS_DETECTED'
  | 'HARNESS_SESSION_STARTED'
  | 'HARNESS_SESSION_ENDED'
  | 'HARNESS_WAITING'
  | 'HARNESS_AWAITING_INPUT'
  | 'HARNESS_AWAITING_PERMISSION'
  | 'HARNESS_IDLE'
  | 'HARNESS_ERROR'
  | 'HARNESS_COMPLETED'
  // Filesystem
  | 'FILE_CREATED'
  | 'FILE_MODIFIED'
  | 'FILE_DELETED'
  | 'FILE_RENAMED'
  // Git
  | 'REPOSITORY_DETECTED'
  | 'BRANCH_CHANGED'
  | 'WORKTREE_CHANGED'
  | 'DIFF_CHANGED'
  | 'COMMIT_CREATED'
  | 'MERGE_DETECTED'
  // Test / Build
  | 'TEST_STARTED'
  | 'TEST_PASSED'
  | 'TEST_FAILED'
  | 'BUILD_STARTED'
  | 'BUILD_PASSED'
  | 'BUILD_FAILED'
  // MCP
  | 'MCP_TOOL_CALLED'
  | 'MCP_TOOL_COMPLETED'
  | 'MCP_ACTIVITY_REPORTED'

export interface ObservedEvent {
  id: string
  timestamp: number
  source: string
  category: EventCategory
  type: EventType
  projectId: string | null
  repositoryId: string | null
  workspaceId: string | null
  sessionId: string | null
  taskId: string | null
  processId: number | null
  payload: Record<string, unknown>
  correlationKey: string | null
}

export interface CreateObservedEventInput {
  id?: string
  source: string
  category: EventCategory
  type: EventType
  projectId?: string | null
  repositoryId?: string | null
  workspaceId?: string | null
  sessionId?: string | null
  taskId?: string | null
  processId?: number | null
  payload?: Record<string, unknown>
  correlationKey?: string | null
  now?: number
}

export function createObservedEvent(input: CreateObservedEventInput): ObservedEvent {
  return {
    id: input.id ?? createId(),
    timestamp: input.now ?? Date.now(),
    source: input.source,
    category: input.category,
    type: input.type,
    projectId: input.projectId ?? null,
    repositoryId: input.repositoryId ?? null,
    workspaceId: input.workspaceId ?? null,
    sessionId: input.sessionId ?? null,
    taskId: input.taskId ?? null,
    processId: input.processId ?? null,
    payload: input.payload ?? {},
    correlationKey: input.correlationKey ?? null
  }
}
