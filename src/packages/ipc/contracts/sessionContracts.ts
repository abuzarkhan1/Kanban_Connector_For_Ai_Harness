import { z } from 'zod'

export const HarnessTypes = [
  'antigravity',
  'claude_code',
  'codex',
  'aider',
  'opencode',
  'gemini',
  'cursor',
  'windsurf',
  'generic'
] as const

export const AgentActivityStates = [
  'thinking',
  'waiting_for_input',
  'awaiting_permission',
  'executing_commands',
  'modifying_files',
  'running_tests',
  'finished',
  'failed',
  'stuck',
  'idle'
] as const

export const AgentSchema = z.object({
  id: z.string().uuid(),
  type: z.enum(HarnessTypes),
  displayName: z.string(),
  processId: z.number().int().nullable(),
  command: z.string().nullable(),
  workingDirectory: z.string().nullable(),
  adapterLevel: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)]),
  status: z.enum(['active', 'idle', 'stopped']),
  lastSeenAt: z.number().int(),
  createdAt: z.number().int()
})

export type AgentDto = z.infer<typeof AgentSchema>

export const SessionSchema = z.object({
  id: z.string().uuid(),
  agentId: z.string(),
  agentType: z.enum(HarnessTypes),
  projectId: z.string().uuid(),
  repositoryId: z.string().uuid().nullable(),
  workspaceId: z.string().uuid().nullable(),
  taskId: z.string().uuid().nullable(),
  branch: z.string().nullable(),
  activityState: z.enum(AgentActivityStates),
  lastPrompt: z.string().nullable(),
  startedAt: z.number().int(),
  lastActivityAt: z.number().int(),
  endedAt: z.number().int().nullable()
})

export type SessionDto = z.infer<typeof SessionSchema>

export const ListSessionsSchema = z.object({
  projectId: z.string().uuid().optional(),
  taskId: z.string().uuid().optional()
}).strict()

export type ListSessionsInput = z.infer<typeof ListSessionsSchema>
