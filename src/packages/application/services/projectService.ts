import type { Project } from '@domain/entities/Project'
import { createProject, renameProject } from '@domain/entities/Project'
import { createDomainEvent } from '@domain/events/domainEvents'
import type { ProjectRepository } from '@persistence/repositories/projectRepository'

export class ProjectService {
  constructor(private readonly projects: ProjectRepository) {}

  list(): Project[] {
    return this.projects.list()
  }

  get(id: string): Project {
    return this.projects.get(id)
  }

  create(name: string): { project: Project; events: unknown[] } {
    const project = createProject({ name })
    this.projects.insert(project)
    const events = [createDomainEvent('project.created', project.id, { name: project.name }, project.createdAt)]
    return { project, events }
  }

  rename(id: string, name: string): Project {
    const existing = this.projects.get(id)
    const renamed = renameProject(existing, name)
    this.projects.update(renamed)
    return renamed
  }

  delete(id: string): void {
    this.projects.delete(id)
  }
}
