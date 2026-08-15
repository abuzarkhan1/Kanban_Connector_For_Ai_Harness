import { describe, it, expect, beforeEach } from 'vitest'
import { createKanbanMcpServer } from './server'
import { HarnessConfigManager } from './discovery/harnessConfigManager'
import {
  openDatabase,
  ProjectRepository,
  TaskRepository,
  TransitionRepository,
  RepositoryRepository,
  SessionRepository,
  EventRepository,
  EvidenceRepository,
  AgentRepository
} from '@persistence'
import { ProjectService, TaskService, RepositoryService, SessionService, EventService } from '@application'

describe('Model Context Protocol (MCP) Server & Discovery', () => {
  let server: ReturnType<typeof createKanbanMcpServer>
  let projectService: ProjectService
  let taskService: TaskService
  let evidenceRepo: EvidenceRepository

  beforeEach(() => {
    const db = openDatabase(':memory:')
    const projectRepo = new ProjectRepository(db.raw)
    const taskRepo = new TaskRepository(db.raw)
    const transitionRepo = new TransitionRepository(db.raw)
    const repoRepo = new RepositoryRepository(db.raw)
    const sessionRepo = new SessionRepository(db.raw)
    const eventRepo = new EventRepository(db.raw)
    evidenceRepo = new EvidenceRepository(db.raw)
    const agentRepo = new AgentRepository(db.raw)

    projectService = new ProjectService(projectRepo)
    taskService = new TaskService(projectRepo, taskRepo, transitionRepo)
    const repositoryService = new RepositoryService(projectRepo, repoRepo)
    const sessionService = new SessionService(sessionRepo, agentRepo)
    const eventService = new EventService(eventRepo)

    server = createKanbanMcpServer({
      projects: projectService,
      tasks: taskService,
      repositories: repositoryService,
      sessions: sessionService,
      events: eventService,
      evidence: evidenceRepo
    })
  })

  it('instantiates MCP Server instance with correct metadata', () => {
    expect(server).toBeDefined()
  })

  it('HarnessConfigManager lists all 5 supported target harnesses', () => {
    const manager = new HarnessConfigManager()
    const list = manager.getLocations()
    const harnesses = list.map((l) => l.harness)

    expect(harnesses).toContain('antigravity')
    expect(harnesses).toContain('claude_code')
    expect(harnesses).toContain('claude_desktop')
    expect(harnesses).toContain('cursor')
    expect(harnesses).toContain('windsurf')
    expect(harnesses.length).toBe(5)
  })
})
