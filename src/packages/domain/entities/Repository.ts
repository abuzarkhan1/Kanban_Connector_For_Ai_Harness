import { createId } from '@shared/utils/id'

export interface WorktreeInfo {
  path: string
  branch: string | null
  head: string | null
  isBare: boolean
}

export interface Repository {
  id: string
  projectId: string
  name: string
  path: string
  defaultBranch: string
  currentBranch: string
  headCommit: string | null
  worktrees: WorktreeInfo[]
  lastScannedAt: number
  createdAt: number
  updatedAt: number
}

export interface CreateRepositoryInput {
  id?: string
  projectId: string
  name?: string
  path: string
  defaultBranch?: string
  currentBranch?: string
  headCommit?: string | null
  worktrees?: WorktreeInfo[]
  now?: number
}

export function createRepository(input: CreateRepositoryInput): Repository {
  const now = input.now ?? Date.now()
  const name = input.name?.trim() || input.path.split(/[\\/]/).filter(Boolean).pop() || 'repository'
  return {
    id: input.id ?? createId(),
    projectId: input.projectId,
    name,
    path: input.path.trim(),
    defaultBranch: input.defaultBranch?.trim() || 'main',
    currentBranch: input.currentBranch?.trim() || 'main',
    headCommit: input.headCommit ?? null,
    worktrees: input.worktrees ?? [],
    lastScannedAt: now,
    createdAt: now,
    updatedAt: now
  }
}
