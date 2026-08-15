import { createId } from '@shared/utils/id'

export type HarnessType =
  | 'antigravity'
  | 'claude_code'
  | 'codex'
  | 'aider'
  | 'opencode'
  | 'gemini'
  | 'cursor'
  | 'windsurf'
  | 'generic'

export interface Agent {
  id: string
  type: HarnessType
  displayName: string
  processId: number | null
  command: string | null
  workingDirectory: string | null
  adapterLevel: 0 | 1 | 2 | 3
  status: 'active' | 'idle' | 'stopped'
  lastSeenAt: number
  createdAt: number
}

export interface CreateAgentInput {
  id?: string
  type: HarnessType
  displayName?: string
  processId?: number | null
  command?: string | null
  workingDirectory?: string | null
  adapterLevel?: 0 | 1 | 2 | 3
  status?: 'active' | 'idle' | 'stopped'
  now?: number
}

export function createAgent(input: CreateAgentInput): Agent {
  const now = input.now ?? Date.now()
  const defaultNames: Record<HarnessType, string> = {
    antigravity: 'Antigravity CLI (agy)',
    claude_code: 'Claude Code',
    codex: 'Codex CLI',
    aider: 'Aider',
    opencode: 'OpenCode',
    gemini: 'Gemini CLI',
    cursor: 'Cursor Agent',
    windsurf: 'Windsurf Cascade',
    generic: 'Generic Dev Process'
  }
  return {
    id: input.id ?? createId(),
    type: input.type,
    displayName: input.displayName || defaultNames[input.type],
    processId: input.processId ?? null,
    command: input.command ?? null,
    workingDirectory: input.workingDirectory ?? null,
    adapterLevel: input.adapterLevel ?? 1,
    status: input.status ?? 'active',
    lastSeenAt: now,
    createdAt: now
  }
}
