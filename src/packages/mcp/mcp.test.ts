import { describe, it, expect, beforeEach } from 'vitest'
import { join } from 'node:path'
import { mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
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
  let eventService: EventService
  let evidenceRepo: EvidenceRepository
  let tempDir: string

  beforeEach(() => {
    tempDir = mkdtempSync(join(tmpdir(), 'mcp-test-'))
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
    eventService = new EventService(eventRepo)

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

  it('HarnessConfigManager discovers Antigravity multi-variants and editor harnesses', () => {
    const manager = new HarnessConfigManager(tempDir)
    const list = manager.getLocations()
    const ids = list.map((l) => l.id)

    expect(ids).toContain('antigravity_cli')
    expect(ids).toContain('antigravity_desktop')
    expect(ids).toContain('antigravity_ide')
    expect(ids).toContain('claude_code')
    expect(ids).toContain('claude_desktop')
    expect(ids).toContain('cursor')
    expect(ids).toContain('windsurf')
    expect(ids).toContain('vscode_roo')
    expect(ids).toContain('vscode_cline')
    expect(list.length).toBeGreaterThanOrEqual(9)
  })

  it('supports custom harness registration and persistence', () => {
    const manager = new HarnessConfigManager(tempDir)
    const customConfig = join(tempDir, 'custom_agent.json')
    writeFileSync(customConfig, JSON.stringify({ mcpServers: {} }), 'utf8')

    const entry = manager.saveCustomLocation('My Custom Harness', customConfig)
    expect(entry.isCustom).toBe(true)
    expect(entry.name).toBe('My Custom Harness')

    const updatedLocations = manager.getLocations()
    expect(updatedLocations.some((l) => l.id === entry.id)).toBe(true)

    manager.removeCustomLocation(entry.id)
    const afterRemoval = manager.getLocations()
    expect(afterRemoval.some((l) => l.id === entry.id)).toBe(false)
  })

  it('configures and unconfigures MCP servers in JSON configuration files', () => {
    const manager = new HarnessConfigManager(tempDir)
    const testConfigPath = join(tempDir, 'agy_test_mcp.json')
    writeFileSync(testConfigPath, JSON.stringify({ mcpServers: {} }), 'utf8')

    const customEntry = manager.saveCustomLocation('Test Antigravity App', testConfigPath)
    const cliPath = join(tempDir, 'bin', 'kanban-mcp.js')

    const configRes = manager.configureHarness(customEntry.id, cliPath)
    expect(configRes.success).toBe(true)

    const statusList = manager.getStatusList()
    const matched = statusList.find((s) => s.id === customEntry.id)
    expect(matched?.configured).toBe(true)

    const unconfigRes = manager.unconfigureHarness(customEntry.id)
    expect(unconfigRes.success).toBe(true)

    const statusListAfter = manager.getStatusList()
    const matchedAfter = statusListAfter.find((s) => s.id === customEntry.id)
    expect(matchedAfter?.configured).toBe(false)
  })
})
