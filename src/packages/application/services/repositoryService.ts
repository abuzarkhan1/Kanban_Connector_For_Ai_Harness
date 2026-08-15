import type { Repository, WorktreeInfo } from '@domain/entities/Repository'
import { createRepository } from '@domain/entities/Repository'
import type { RepositoryRepository } from '@persistence/repositories/repositoryRepository'
import type { ProjectRepository } from '@persistence/repositories/projectRepository'

export interface CreateRepositoryServiceInput {
  projectId: string
  name?: string
  path: string
  defaultBranch?: string
  currentBranch?: string
  headCommit?: string | null
  worktrees?: WorktreeInfo[]
}

export class RepositoryService {
  constructor(
    private readonly projects: ProjectRepository,
    private readonly repos: RepositoryRepository
  ) {}

  create(input: CreateRepositoryServiceInput): Repository {
    this.projects.get(input.projectId)
    const existing = this.repos.getByPath(input.path)
    if (existing) return existing

    const repo = createRepository({
      projectId: input.projectId,
      name: input.name,
      path: input.path,
      defaultBranch: input.defaultBranch,
      currentBranch: input.currentBranch,
      headCommit: input.headCommit,
      worktrees: input.worktrees
    })
    this.repos.insert(repo)
    return repo
  }

  listByProject(projectId: string): Repository[] {
    return this.repos.listByProject(projectId)
  }

  listAll(): Repository[] {
    return this.repos.listAll()
  }

  get(id: string): Repository {
    return this.repos.get(id)
  }

  update(id: string, patch: Partial<Repository>): Repository {
    const current = this.repos.get(id)
    const updated: Repository = {
      ...current,
      ...patch,
      updatedAt: Date.now()
    }
    this.repos.save(updated)
    return updated
  }

  delete(id: string): void {
    this.repos.delete(id)
  }
}
