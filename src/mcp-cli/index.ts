import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { join } from 'node:path'
import { homedir } from 'node:os'
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
import { createKanbanMcpServer } from '@mcp/server'

async function main(): Promise<void> {
  const isMac = process.platform === 'darwin'
  const isWin = process.platform === 'win32'
  let userDataDir = join(homedir(), '.ai-harness-project-manager')
  if (isMac) {
    userDataDir = join(homedir(), 'Library', 'Application Support', 'ai-harness-project-manager')
  } else if (isWin) {
    userDataDir = join(process.env.APPDATA || homedir(), 'ai-harness-project-manager')
  }

  const dbHandle = openDatabase(join(userDataDir, 'ai-harness-pm.db'))

  const projectRepo = new ProjectRepository(dbHandle.raw)
  const taskRepo = new TaskRepository(dbHandle.raw)
  const transitionRepo = new TransitionRepository(dbHandle.raw)
  const repoRepo = new RepositoryRepository(dbHandle.raw)
  const sessionRepo = new SessionRepository(dbHandle.raw)
  const eventRepo = new EventRepository(dbHandle.raw)
  const evidenceRepo = new EvidenceRepository(dbHandle.raw)
  const agentRepo = new AgentRepository(dbHandle.raw)

  const services = {
    projects: new ProjectService(projectRepo),
    tasks: new TaskService(projectRepo, taskRepo, transitionRepo),
    repositories: new RepositoryService(projectRepo, repoRepo),
    sessions: new SessionService(sessionRepo, agentRepo),
    events: new EventService(eventRepo),
    evidence: evidenceRepo
  }

  const server = createKanbanMcpServer(services)
  const transport = new StdioServerTransport()

  await server.connect(transport)
}

void main()
