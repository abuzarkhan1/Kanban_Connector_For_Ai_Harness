import type { RendererApi } from '../../preload/api'
import type {
  BoardColumnDto,
  BoardDto,
  ProjectDto,
  TaskDto,
  TransitionDto,
  RepositoryDto,
  SessionDto,
  AgentDto,
  ObservedEventDto,
  McpStatusDto,
  DiagnosticsInfoDto
} from '@ipc'
import { fail, ok } from '@ipc'
import type { ColumnId, InternalStatus } from '@domain/state-machine/status'
import { COLUMNS, columnFor, defaultStatusForColumn } from '@domain/state-machine/status'

const now = Date.now()
const HOUR = 3_600_000

function uuid(n: number): string {
  return `00000000-0000-4000-8000-${String(n).padStart(12, '0')}`
}

export const FIRST_PROJECT_ID = uuid(1)

const COLUMN_NAMES: Record<ColumnId, string> = {
  TODO: 'TODO',
  IN_PROGRESS: 'IN PROGRESS',
  REVIEW: 'REVIEW',
  DONE: 'DONE'
}

const projects: ProjectDto[] = [
  { id: uuid(1), name: 'freebuff-desktop', createdAt: now - 12 * 24 * HOUR, updatedAt: now - 5 * 60_000 },
  { id: uuid(2), name: 'website-redesign', createdAt: now - 30 * 24 * HOUR, updatedAt: now - 3 * HOUR },
  { id: uuid(3), name: 'cli-tooling', createdAt: now - 2 * 24 * HOUR, updatedAt: now - 10 * 60_000 }
]

function task(
  n: number,
  projectId: string,
  title: string,
  status: InternalStatus,
  priority: TaskDto['priority'],
  labels: string[],
  hoursAgo: number,
  description = ''
): TaskDto {
  return {
    id: uuid(n),
    projectId,
    title,
    description,
    status,
    priority,
    labels,
    repositoryId: null,
    createdAt: now - hoursAgo * HOUR,
    updatedAt: now - hoursAgo * HOUR
  }
}

const tasks: TaskDto[] = [
  task(101, uuid(1), 'Design monochrome theme tokens', 'BACKLOG', 'LOW', ['design'], 8),
  task(102, uuid(1), 'Add empty states for repositories', 'BACKLOG', 'MEDIUM', ['ux'], 30),
  task(
    103,
    uuid(1),
    'Build Antigravity CLI adapter',
    'IMPLEMENTING',
    'URGENT',
    ['adapter', 'agy'],
    1,
    'Process detection, PTY lifecycle observation and MCP server registration.'
  ),
  task(104, uuid(1), 'Unify the surface ladder across panels', 'AGENT_STARTED', 'HIGH', ['theme'], 3),
  task(105, uuid(1), 'Rework task transition pills', 'READY_FOR_REVIEW', 'MEDIUM', ['ux', 'kanban'], 6),
  task(106, uuid(1), 'Set up SQLite migrations', 'DONE', 'HIGH', ['db'], 72),
  task(107, uuid(1), 'Ship IPC contracts', 'DONE', 'MEDIUM', ['ipc', 'zod'], 96),
  task(108, uuid(2), 'Settle on brand typography', 'BACKLOG', 'LOW', ['brand'], 20),
  task(109, uuid(2), 'Publish staging copy', 'IMPLEMENTING', 'MEDIUM', ['content'], 2),
  task(110, uuid(3), 'Port CLI to ESM', 'DONE', 'HIGH', ['cli'], 50)
]

const repositories: RepositoryDto[] = [
  {
    id: uuid(501),
    projectId: uuid(1),
    name: 'kanban-core',
    path: '/Users/developer/code/kanban-core',
    defaultBranch: 'main',
    currentBranch: 'feature/mcp-integration',
    headCommit: 'a1b2c3d',
    worktrees: [{ path: '/Users/developer/code/kanban-core', branch: 'feature/mcp-integration', head: 'a1b2c3d', isBare: false }],
    lastScannedAt: Date.now(),
    createdAt: Date.now() - 5 * HOUR,
    updatedAt: Date.now()
  }
]

const agents: AgentDto[] = [
  {
    id: uuid(601),
    type: 'antigravity',
    displayName: 'Antigravity CLI (agy)',
    processId: 48291,
    command: 'agy run project-audit',
    workingDirectory: '/Users/developer/code/kanban-core',
    adapterLevel: 3,
    status: 'active',
    lastSeenAt: Date.now(),
    createdAt: Date.now() - HOUR
  }
]

const sessions: SessionDto[] = [
  {
    id: uuid(701),
    agentId: uuid(601),
    agentType: 'antigravity',
    projectId: uuid(1),
    repositoryId: uuid(501),
    workspaceId: null,
    taskId: uuid(103),
    branch: 'feature/mcp-integration',
    activityState: 'modifying_files',
    lastPrompt: 'Build Antigravity CLI MCP adapter',
    startedAt: Date.now() - 30 * 60_000,
    lastActivityAt: Date.now() - 2 * 60_000,
    endedAt: null
  }
]

const events: ObservedEventDto[] = [
  {
    id: uuid(801),
    timestamp: Date.now() - 2 * 60_000,
    source: 'filesystem-watcher',
    category: 'filesystem',
    type: 'FILE_MODIFIED',
    projectId: uuid(1),
    repositoryId: uuid(501),
    workspaceId: null,
    sessionId: uuid(701),
    taskId: uuid(103),
    processId: 48291,
    payload: { filepath: 'src/packages/mcp/server.ts' },
    correlationKey: null
  },
  {
    id: uuid(802),
    timestamp: Date.now() - 5 * 60_000,
    source: 'process-watcher',
    category: 'harness',
    type: 'HARNESS_DETECTED',
    projectId: uuid(1),
    repositoryId: uuid(501),
    workspaceId: null,
    sessionId: uuid(701),
    taskId: uuid(103),
    processId: 48291,
    payload: { harnessType: 'antigravity', command: 'agy run project-audit' },
    correlationKey: null
  }
]

const transitions: TransitionDto[] = [
  {
    id: uuid(201),
    taskId: uuid(103),
    fromStatus: 'BACKLOG',
    toStatus: 'IMPLEMENTING',
    actor: 'user',
    confidence: null,
    ruleId: null,
    createdAt: now - 3 * HOUR
  },
  {
    id: uuid(202),
    taskId: uuid(105),
    fromStatus: 'BACKLOG',
    toStatus: 'TESTING',
    actor: 'user',
    confidence: null,
    ruleId: null,
    createdAt: now - 26 * HOUR
  },
  {
    id: uuid(203),
    taskId: uuid(105),
    fromStatus: 'TESTING',
    toStatus: 'READY_FOR_REVIEW',
    actor: 'system',
    confidence: 0.91,
    ruleId: 'session-ended',
    createdAt: now - 6 * HOUR
  }
]

function boardFor(projectId: string): BoardDto {
  const project = projects.find((p) => p.id === projectId)
  const columns: BoardColumnDto[] = COLUMNS.map((id) => ({
    id,
    name: COLUMN_NAMES[id],
    tasks: tasks
      .filter((t) => t.projectId === projectId && columnFor(t.status) === id)
      .sort((a, b) => a.createdAt - b.createdAt)
  }))
  return { projectId, projectName: project?.name ?? 'Unknown project', columns }
}

export const previewApi: RendererApi = {
  projects: {
    async list() {
      return ok([...projects])
    },
    async create(input) {
      const created: ProjectDto = {
        id: crypto.randomUUID(),
        name: input.name,
        createdAt: Date.now(),
        updatedAt: Date.now()
      }
      projects.push(created)
      return ok(created)
    },
    async update(input) {
      const project = projects.find((p) => p.id === input.id)
      if (!project) return fail('NOT_FOUND', 'Project not found')
      project.name = input.name
      project.updatedAt = Date.now()
      return ok(project)
    },
    async delete(input) {
      const index = projects.findIndex((p) => p.id === input.id)
      if (index === -1) return fail('NOT_FOUND', 'Project not found')
      projects.splice(index, 1)
      return ok({ deleted: true })
    }
  },
  tasks: {
    async list(input) {
      return ok(tasks.filter((t) => t.projectId === input.projectId))
    },
    async create(input) {
      const created: TaskDto = {
        id: crypto.randomUUID(),
        projectId: input.projectId,
        title: input.title,
        description: input.description ?? '',
        status: 'BACKLOG',
        priority: input.priority ?? 'MEDIUM',
        labels: input.labels ?? [],
        repositoryId: null,
        createdAt: Date.now(),
        updatedAt: Date.now()
      }
      tasks.push(created)
      return ok(created)
    },
    async update(input) {
      const target = tasks.find((t) => t.id === input.id)
      if (!target) return fail('NOT_FOUND', 'Task not found')
      if (input.title !== undefined) target.title = input.title
      if (input.description !== undefined) target.description = input.description
      if (input.priority !== undefined) target.priority = input.priority
      if (input.labels !== undefined) target.labels = input.labels
      target.updatedAt = Date.now()
      return ok(target)
    },
    async move(input) {
      const target = tasks.find((t) => t.id === input.id)
      if (!target) return fail('NOT_FOUND', 'Task not found')
      const fromStatus = target.status
      target.status = input.toStatus
      target.updatedAt = Date.now()
      transitions.push({
        id: crypto.randomUUID(),
        taskId: target.id,
        fromStatus,
        toStatus: input.toStatus,
        actor: 'user',
        confidence: null,
        ruleId: null,
        createdAt: Date.now()
      })
      return ok(target)
    },
    async moveToColumn(input) {
      const target = tasks.find((t) => t.id === input.id)
      if (!target) return fail('NOT_FOUND', 'Task not found')
      if (columnFor(target.status) === input.columnId) return ok(target)
      const fromStatus = target.status
      target.status = defaultStatusForColumn(input.columnId)
      target.updatedAt = Date.now()
      transitions.push({
        id: crypto.randomUUID(),
        taskId: target.id,
        fromStatus,
        toStatus: target.status,
        actor: 'user',
        confidence: null,
        ruleId: null,
        createdAt: Date.now()
      })
      return ok(target)
    },
    async delete(input) {
      const index = tasks.findIndex((t) => t.id === input.id)
      if (index === -1) return fail('NOT_FOUND', 'Task not found')
      tasks.splice(index, 1)
      return ok({ deleted: true })
    },
    async transitions(input) {
      return ok(transitions.filter((t) => t.taskId === input.taskId))
    },
    async evidence(input) {
      return ok([
        {
          id: uuid(901),
          transitionId: uuid(201),
          taskId: input.taskId,
          ruleId: 'RULE_TESTS_PASSED',
          confidence: 0.95,
          summary: 'All vitest unit suites passed with 0 errors',
          items: [
            {
              type: 'test',
              description: '10 test suites passed (56/56 tests)',
              confidence: 0.95
            },
            {
              type: 'git',
              description: 'Commit created: feat(mcp): add probe tool',
              confidence: 0.9
            }
          ],
          createdAt: Date.now() - 5 * 60_000
        }
      ])
    }
  },
  board: {
    async get(input) {
      const project = projects.find((p) => p.id === input.projectId)
      if (!project) return fail('NOT_FOUND', 'Project not found')
      return ok(boardFor(input.projectId))
    }
  },
  repositories: {
    async list(input) {
      return ok(repositories.filter((r) => r.projectId === input.projectId))
    },
    async listAll() {
      return ok([...repositories])
    },
    async create(input) {
      const created: RepositoryDto = {
        id: uuid(Date.now()),
        projectId: input.projectId,
        name: input.name || input.path.split(/[\\/]/).filter(Boolean).pop() || 'repo',
        path: input.path,
        defaultBranch: 'main',
        currentBranch: 'main',
        headCommit: null,
        worktrees: [],
        lastScannedAt: Date.now(),
        createdAt: Date.now(),
        updatedAt: Date.now()
      }
      repositories.push(created)
      return ok(created)
    },
    async delete(input) {
      const idx = repositories.findIndex((r) => r.id === input.id)
      if (idx !== -1) repositories.splice(idx, 1)
      return ok({ deleted: true })
    },
    async scan(input) {
      const repo = repositories.find((r) => r.id === input.id)
      if (!repo) return fail('NOT_FOUND', 'Repository not found')
      repo.lastScannedAt = Date.now()
      return ok(repo)
    },
    async pickDirectory() {
      return ok('/Users/developer/code/sample-project')
    }
  },
  sessions: {
    async list() {
      return ok([...sessions])
    },
    async listActive() {
      return ok(sessions.filter((s) => !s.endedAt))
    },
    async listAgents() {
      return ok([...agents])
    }
  },
  events: {
    async list() {
      return ok([...events])
    }
  },
  mcp: {
    async getStatus() {
      const status: McpStatusDto = {
        serverRunning: true,
        socketPath: 'stdio:kanban-mcp',
        harnesses: [
          { id: 'antigravity_cli', harness: 'antigravity', name: 'Google Antigravity CLI', configPath: '~/.gemini/config/mcp_config.json', category: 'antigravity', detected: true, configured: true },
          { id: 'antigravity_desktop', harness: 'antigravity_desktop', name: 'Google Antigravity Desktop (2.0)', configPath: '~/.gemini/antigravity/mcp_config.json', category: 'antigravity', detected: true, configured: true },
          { id: 'antigravity_ide', harness: 'antigravity_ide', name: 'Google Antigravity IDE', configPath: '~/.gemini/antigravity-ide/mcp_config.json', category: 'antigravity', detected: true, configured: false },
          { id: 'claude_code', harness: 'claude_code', name: 'Claude Code CLI', configPath: '~/.claude.json', category: 'claude', detected: true, configured: false },
          { id: 'claude_desktop', harness: 'claude_desktop', name: 'Claude Desktop', configPath: '~/Library/Application Support/Claude/claude_desktop_config.json', category: 'claude', detected: true, configured: false },
          { id: 'cursor', harness: 'cursor', name: 'Cursor Editor', configPath: '~/.cursor/mcp.json', category: 'editor', detected: true, configured: true },
          { id: 'windsurf', harness: 'windsurf', name: 'Windsurf Editor', configPath: '~/.codeium/windsurf/mcp_config.json', category: 'editor', detected: false, configured: false },
          { id: 'vscode_roo', harness: 'vscode_roo', name: 'VS Code (Roo Code)', configPath: '~/.config/Code/User/.../mcp_settings.json', category: 'editor', detected: true, configured: false },
          { id: 'vscode_cline', harness: 'vscode_cline', name: 'VS Code (Cline)', configPath: '~/.config/Code/User/.../cline_mcp_settings.json', category: 'editor', detected: true, configured: false }
        ],
        recentToolCalls: [
          { id: uuid(902), tool: 'kanban_list_tasks', source: 'mcp-server', payload: { projectId: uuid(1) }, timestamp: Date.now() - 60_000 }
        ]
      }
      return ok(status)
    },
    async configureHarness(input) {
      return ok({ success: true, message: `Configured ${input.harness}` })
    },
    async unconfigureHarness(input) {
      return ok({ success: true, message: `Disconnected ${input.harness}` })
    },
    async verifyHarness(_input) {
      return ok({
        success: true,
        latencyMs: 14,
        toolsDiscovered: 8,
        tools: ['kanban_ping', 'kanban_list_projects', 'kanban_list_tasks', 'kanban_get_task', 'kanban_create_task', 'kanban_move_task', 'kanban_report_activity', 'kanban_get_workspace_context'],
        testedAt: Date.now(),
        serverInfo: { name: 'ai-harness-project-manager', version: '1.0.0' },
        diagnostics: [
          { step: 'config', status: 'ok', message: `Valid JSON config detected with server command: 'node'` },
          { step: 'runtime', status: 'ok', message: `Entry script exists on disk.` },
          { step: 'handshake', status: 'ok', message: `Handshake successful with 'ai-harness-project-manager' v1.0.0` },
          { step: 'tools', status: 'ok', message: `Discovered 8 MCP tools.` },
          { step: 'database', status: 'ok', message: `SQLite database online & responsive (14ms latency).` }
        ]
      })
    },
    async verifyAll() {
      return ok({
        antigravity_cli: {
          success: true,
          latencyMs: 12,
          toolsDiscovered: 8,
          testedAt: Date.now(),
          diagnostics: [
            { step: 'config', status: 'ok', message: 'Valid config' },
            { step: 'handshake', status: 'ok', message: 'Handshake OK' }
          ]
        }
      })
    },
    async addCustomHarness(input) {
      return ok({ success: true, entry: { id: `custom_${Date.now()}`, harness: 'custom', name: input.name, path: input.configPath, category: 'custom', isCustom: true } })
    },
    async removeCustomHarness() {
      return ok({ success: true })
    }
  },
  diagnostics: {
    async getInfo() {
      const diag: DiagnosticsInfoDto = {
        version: '0.1.0',
        platform: 'darwin',
        arch: 'arm64',
        nodeVersion: '20.19.0',
        electronVersion: '43.4.0',
        uptimeSeconds: 342,
        memoryUsageMb: 85,
        dbPath: '/Users/developer/Library/Application Support/ai-harness-project-manager/kanban.db',
        dbSizeKb: 144,
        counts: { projects: projects.length, tasks: tasks.length, repositories: repositories.length, sessions: sessions.length, events: events.length },
        observers: { git: 'active', filesystem: 'active (1 roots)', process: 'active', mcp: 'ready (stdio & socket)' },
        recentLogs: [{ ts: new Date().toISOString(), level: 'info', component: 'app', message: 'ready' }]
      }
      return ok(diag)
    }
  },
  onSync: () => () => {}
}

export function installPreviewApi(): void {
  ;(window as unknown as { api: RendererApi }).api = previewApi
}
