import { createId } from '@shared/utils/id'

export interface Workspace {
  id: string
  repositoryId: string
  projectId: string
  name: string
  path: string
  branch: string
  isWorktree: boolean
  createdAt: number
  updatedAt: number
}

export interface CreateWorkspaceInput {
  id?: string
  repositoryId: string
  projectId: string
  name?: string
  path: string
  branch?: string
  isWorktree?: boolean
  now?: number
}

export function createWorkspace(input: CreateWorkspaceInput): Workspace {
  const now = input.now ?? Date.now()
  const name = input.name?.trim() || input.path.split(/[\\/]/).filter(Boolean).pop() || 'workspace'
  return {
    id: input.id ?? createId(),
    repositoryId: input.repositoryId,
    projectId: input.projectId,
    name,
    path: input.path.trim(),
    branch: input.branch?.trim() || 'main',
    isWorktree: input.isWorktree ?? false,
    createdAt: now,
    updatedAt: now
  }
}
