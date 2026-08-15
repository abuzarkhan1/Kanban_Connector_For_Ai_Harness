import { create } from 'zustand'
import type {
  BoardDto,
  CreateTaskInput,
  ProjectDto,
  UpdateTaskPatch,
  RepositoryDto,
  SessionDto,
  AgentDto,
  ObservedEventDto,
  McpStatusDto,
  DiagnosticsInfoDto
} from '@ipc'
import type { ColumnId, InternalStatus } from '@domain/state-machine/status'
import { api, unwrap } from '../api/client'

export type NavigationView =
  | 'kanban'
  | 'dashboard'
  | 'repositories'
  | 'agents'
  | 'timeline'
  | 'mcp'
  | 'diagnostics'

interface BoardStoreState {
  currentView: NavigationView
  projects: ProjectDto[]
  selectedProjectId: string | null
  board: BoardDto | null
  selectedTaskId: string | null
  repositories: RepositoryDto[]
  sessions: SessionDto[]
  agents: AgentDto[]
  events: ObservedEventDto[]
  mcpStatus: McpStatusDto | null
  diagnostics: DiagnosticsInfoDto | null
  loading: boolean
  error: string | null

  setCurrentView: (view: NavigationView) => void
  loadProjects: () => Promise<void>
  selectProject: (projectId: string | null) => Promise<void>
  createProject: (name: string) => Promise<void>
  updateProject: (projectId: string, name: string) => Promise<void>
  deleteProject: (projectId: string) => Promise<void>
  createTask: (input: CreateTaskInput) => Promise<void>
  updateTask: (id: string, patch: UpdateTaskPatch) => Promise<void>
  moveTask: (id: string, toStatus: InternalStatus) => Promise<void>
  moveTaskToColumn: (id: string, columnId: ColumnId) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  selectTask: (id: string | null) => void
  clearError: () => void
  refreshBoard: () => Promise<void>

  // Additional Subsystems Actions
  loadRepositories: () => Promise<void>
  addRepository: (path: string, name?: string) => Promise<void>
  deleteRepository: (id: string) => Promise<void>
  scanRepository: (id: string) => Promise<void>
  pickDirectory: () => Promise<string | null>

  loadSessionsAndAgents: () => Promise<void>
  loadEvents: () => Promise<void>
  loadMcpStatus: () => Promise<void>
  configureHarness: (harness: 'antigravity' | 'claude_code' | 'claude_desktop' | 'cursor' | 'windsurf') => Promise<{ success: boolean; message: string }>
  loadDiagnostics: () => Promise<void>
}

function toError(err: unknown): string {
  return err instanceof Error ? err.message : String(err)
}

export const useBoardStore = create<BoardStoreState>((set, get) => ({
  currentView: 'kanban',
  projects: [],
  selectedProjectId: null,
  board: null,
  selectedTaskId: null,
  repositories: [],
  sessions: [],
  agents: [],
  events: [],
  mcpStatus: null,
  diagnostics: null,
  loading: false,
  error: null,

  setCurrentView: (view) => {
    set({ currentView: view })
    if (view === 'repositories') void get().loadRepositories()
    if (view === 'agents') void get().loadSessionsAndAgents()
    if (view === 'timeline') void get().loadEvents()
    if (view === 'mcp') void get().loadMcpStatus()
    if (view === 'diagnostics') void get().loadDiagnostics()
  },

  loadProjects: async () => {
    set({ loading: true, error: null })
    try {
      const projects = unwrap(await api.projects.list())
      set({ projects })
      const current = get().selectedProjectId
      if (current && !projects.some((p) => p.id === current)) {
        set({ selectedProjectId: null, board: null, selectedTaskId: null })
      } else if (!current && projects.length > 0) {
        await get().selectProject(projects[0]?.id || null)
      }
    } catch (err) {
      set({ error: toError(err) })
    } finally {
      set({ loading: false })
    }
  },

  selectProject: async (projectId) => {
    set({ selectedProjectId: projectId, selectedTaskId: null, error: null })
    if (!projectId) {
      set({ board: null })
      return
    }
    try {
      const board = unwrap(await api.board.get({ projectId }))
      set({ board })
      void get().loadRepositories()
      void get().loadSessionsAndAgents()
    } catch (err) {
      set({ error: toError(err) })
    }
  },

  createProject: async (name) => {
    try {
      const created = unwrap(await api.projects.create({ name }))
      await get().loadProjects()
      await get().selectProject(created.id)
    } catch (err) {
      set({ error: toError(err) })
    }
  },

  updateProject: async (projectId, name) => {
    try {
      unwrap(await api.projects.update({ id: projectId, name }))
      await get().loadProjects()
      await get().refreshBoard()
    } catch (err) {
      set({ error: toError(err) })
    }
  },

  deleteProject: async (projectId) => {
    try {
      unwrap(await api.projects.delete({ id: projectId }))
      await get().loadProjects()
      if (get().selectedProjectId === projectId) {
        await get().selectProject(null)
      } else {
        await get().refreshBoard()
      }
    } catch (err) {
      set({ error: toError(err) })
    }
  },

  createTask: async (input) => {
    try {
      unwrap(await api.tasks.create(input))
      await get().refreshBoard()
      void get().loadEvents()
    } catch (err) {
      set({ error: toError(err) })
    }
  },

  updateTask: async (id, patch) => {
    try {
      unwrap(await api.tasks.update({ id, ...patch }))
      await get().refreshBoard()
    } catch (err) {
      set({ error: toError(err) })
    }
  },

  moveTask: async (id, toStatus) => {
    try {
      unwrap(await api.tasks.move({ id, toStatus }))
      await get().refreshBoard()
      void get().loadEvents()
    } catch (err) {
      set({ error: toError(err) })
    }
  },

  moveTaskToColumn: async (id, columnId) => {
    try {
      unwrap(await api.tasks.moveToColumn({ id, columnId }))
      await get().refreshBoard()
      void get().loadEvents()
    } catch (err) {
      set({ error: toError(err) })
    }
  },

  deleteTask: async (id) => {
    try {
      unwrap(await api.tasks.delete({ id }))
      set({ selectedTaskId: null })
      await get().refreshBoard()
    } catch (err) {
      set({ error: toError(err) })
    }
  },

  selectTask: (id) => set({ selectedTaskId: id }),

  clearError: () => set({ error: null }),

  refreshBoard: async () => {
    const projectId = get().selectedProjectId
    if (!projectId) return
    const board = unwrap(await api.board.get({ projectId }))
    set({ board })
  },

  // Repositories Actions
  loadRepositories: async () => {
    const projectId = get().selectedProjectId
    try {
      const repositories = projectId
        ? unwrap(await api.repositories.list({ projectId }))
        : unwrap(await api.repositories.listAll())
      set({ repositories })
    } catch (err) {
      set({ error: toError(err) })
    }
  },

  addRepository: async (path, name) => {
    const projectId = get().selectedProjectId
    if (!projectId) return
    try {
      unwrap(await api.repositories.create({ projectId, path, name }))
      await get().loadRepositories()
    } catch (err) {
      set({ error: toError(err) })
    }
  },

  deleteRepository: async (id) => {
    try {
      unwrap(await api.repositories.delete({ id }))
      await get().loadRepositories()
    } catch (err) {
      set({ error: toError(err) })
    }
  },

  scanRepository: async (id) => {
    try {
      unwrap(await api.repositories.scan({ id }))
      await get().loadRepositories()
    } catch (err) {
      set({ error: toError(err) })
    }
  },

  pickDirectory: async () => {
    try {
      return unwrap(await api.repositories.pickDirectory())
    } catch {
      return null
    }
  },

  // Sessions & Agents
  loadSessionsAndAgents: async () => {
    const projectId = get().selectedProjectId
    try {
      const [sessions, agents] = await Promise.all([
        api.sessions.list(projectId ? { projectId } : {}).then(unwrap),
        api.sessions.listAgents().then(unwrap)
      ])
      set({ sessions, agents })
    } catch {
      // Non-blocking
    }
  },

  // Events & Timeline
  loadEvents: async () => {
    const projectId = get().selectedProjectId
    try {
      const events = unwrap(await api.events.list(projectId ? { projectId, limit: 100 } : { limit: 100 }))
      set({ events })
    } catch {
      // Non-blocking
    }
  },

  // MCP
  loadMcpStatus: async () => {
    try {
      const mcpStatus = unwrap(await api.mcp.getStatus())
      set({ mcpStatus })
    } catch {
      // Non-blocking
    }
  },

  configureHarness: async (harness) => {
    try {
      const res = unwrap(await api.mcp.configureHarness({ harness }))
      await get().loadMcpStatus()
      return res
    } catch (err) {
      return { success: false, message: toError(err) }
    }
  },

  // Diagnostics
  loadDiagnostics: async () => {
    try {
      const diagnostics = unwrap(await api.diagnostics.getInfo())
      set({ diagnostics })
    } catch {
      // Non-blocking
    }
  }
}))
