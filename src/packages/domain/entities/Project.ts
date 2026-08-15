import { createId } from '@shared/utils/id'

export interface Project {
  id: string
  name: string
  createdAt: number
  updatedAt: number
}

export interface CreateProjectInput {
  id?: string
  name: string
  now?: number
}

export function createProject(input: CreateProjectInput): Project {
  const now = input.now ?? Date.now()
  return {
    id: input.id ?? createId(),
    name: input.name.trim(),
    createdAt: now,
    updatedAt: now
  }
}

export function renameProject(project: Project, name: string, now: number = Date.now()): Project {
  return { ...project, name: name.trim(), updatedAt: now }
}
