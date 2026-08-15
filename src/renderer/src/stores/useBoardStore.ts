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
  McpVerificationResultDto,
  DiagnosticsInfoDto
} from '@ipc'
import type { ColumnId, InternalStatus } from '@domain/state-machine/status'
import { defaultStatusForColumn } from '@domain/state-machine/status'
import { api, unwrap } from '../api/client'
import { useToastStore } from './useToastStore'

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
  mcpVerifications: Record<string, McpVerificationResultDto>
  verifyingHarness: string | null
  diagnostics: DiagnosticsInfoDto | null
  loading: boolean
  error: string | null

  initLiveSync: () => () => void
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
  configureHarness: (harnessId: string, customPath?: string) => Promise<{ success: boolean; message: string }>
  unconfigureHarness: (harnessId: string) => Promise<{ success: boolean; message: string }>
  verifyHarness: (harnessId: string) => Promise<McpVerificationResultDto>
  verifyAllHarnesses: () => Promise<Record<string, McpVerificationResultDto>>
  addCustomHarness: (name: string, configPath: string) => Promise<{ success: boolean; message: string }>
  removeCustomHarness: (id: string) => Promise<void>
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
  mcpVerifications: {},
  verifyingHarness: null,
  diagnostics: null,
  loading: false,
  error: null,

  initLiveSync: () => {
    const cleanupIpc =
      typeof api.onSync === 'function'
        ? api.onSync(() => {
            const { currentView, selectedProjectId } = get()
            if (selectedProjectId) {
              void get().refreshBoard()
            }
            if (currentView === 'agents' || currentView === 'dashboard') {
              void get().loadSessionsAndAgents()
            }
            if (currentView === 'timeline' || currentView === 'dashboard') {
              void get().loadEvents()
            }
            if (currentView === 'repositories' || currentView === 'dashboard') {
              void get().loadRepositories()
            }
            if (currentView === 'mcp') {
              void get().loadMcpStatus()
            }
            if (currentView === 'diagnostics') {
              void get().loadDiagnostics()
            }
          })
        : () => {}

    const interval = setInterval(() => {
      const { currentView, selectedProjectId } = get()
      if (selectedProjectId) {
        void get().refreshBoard()
      }
      if (currentView === 'agents' || currentView === 'dashboard') {
        void get().loadSessionsAndAgents()
      }
      if (currentView === 'timeline') {
        void get().loadEvents()
      }
      if (currentView === 'repositories') {
        void get().loadRepositories()
      }
      if (currentView === 'mcp') {
        void get().loadMcpStatus()
      }
      if (currentView === 'diagnostics') {
        void get().loadDiagnostics()
      }
    }, 10000)

    return () => {
      cleanupIpc()
      clearInterval(interval)
    }
  },

  setCurrentView: (view) => {
    set({ currentView: view })
    // Lazy-load view data
    if (view === 'repositories') void get().loadRepositories()
    if (view === 'agents') void get().loadSessionsAndAgents()
    if (view === 'timeline') void get().loadEvents()
    if (view === 'mcp') void get().loadMcpStatus()
    if (view === 'diagnostics') void get().loadDiagnostics()
    if (view === 'dashboard') {
      void get().loadRepositories()
      void get().loadSessionsAndAgents()
      void get().loadEvents()
      void get().refreshBoard()
    }
  },

  loadProjects: async () => {
    set({ loading: true, error: null })
    try {
      const projects = unwrap(await api.projects.list())
      const selectedProjectId = get().selectedProjectId
      const exists = selectedProjectId && projects.some((p) => p.id === selectedProjectId)
      const nextSelected = exists ? selectedProjectId : (projects[0]?.id ?? null)

      set({ projects, selectedProjectId: nextSelected, loading: false })
      if (nextSelected) {
        await get().refreshBoard()
      } else {
        set({ board: null })
      }
    } catch (err) {
      set({ error: toError(err), loading: false })
    }
  },

  selectProject: async (projectId) => {
    set({ selectedProjectId: projectId, selectedTaskId: null, error: null })
    if (projectId) {
      await get().refreshBoard()
      void get().loadRepositories()
      void get().loadSessionsAndAgents()
    } else {
      set({ board: null })
    }
  },

  createProject: async (name) => {
    set({ loading: true, error: null })
    try {
      const project = unwrap(await api.projects.create({ name }))
      const projects = [...get().projects, project]
      set({ projects, selectedProjectId: project.id, loading: false })
      await get().refreshBoard()
      useToastStore.getState().addToast('success', 'Project created')
    } catch (err) {
      set({ error: toError(err), loading: false })
    }
  },

  updateProject: async (projectId, name) => {
    set({ loading: true, error: null })
    try {
      const updated = unwrap(await api.projects.update({ id: projectId, name }))
      const projects = get().projects.map((p) => (p.id === projectId ? updated : p))
      set({ projects, loading: false })
      if (get().selectedProjectId === projectId && get().board) {
        set({ board: { ...get().board!, projectName: updated.name } })
      }
    } catch (err) {
      set({ error: toError(err), loading: false })
    }
  },

  deleteProject: async (projectId) => {
    set({ loading: true, error: null })
    try {
      unwrap(await api.projects.delete({ id: projectId }))
      const projects = get().projects.filter((p) => p.id !== projectId)
      const nextSelected = projects[0]?.id ?? null
      set({ projects, selectedProjectId: nextSelected, selectedTaskId: null, loading: false })
      if (nextSelected) {
        await get().refreshBoard()
      } else {
        set({ board: null })
      }
      useToastStore.getState().addToast('success', 'Project deleted')
    } catch (err) {
      set({ error: toError(err), loading: false })
    }
  },

  createTask: async (input) => {
    set({ error: null })
    try {
      unwrap(await api.tasks.create(input))
      await get().refreshBoard()
      useToastStore.getState().addToast('success', 'Task created')
    } catch (err) {
      set({ error: toError(err) })
    }
  },

  updateTask: async (id, patch) => {
    set({ error: null })
    try {
      unwrap(await api.tasks.update({ id, ...patch }))
      await get().refreshBoard()
    } catch (err) {
      set({ error: toError(err) })
    }
  },

  moveTask: async (id, toStatus) => {
    const prevBoard = get().board
    if (prevBoard) {
      const nextColumns = prevBoard.columns.map((col) => ({
        ...col,
        tasks: col.tasks.map((t) => (t.id === id ? { ...t, status: toStatus, updatedAt: Date.now() } : t))
      }))
      set({ board: { ...prevBoard, columns: nextColumns } })
    }
    set({ error: null })
    try {
      unwrap(await api.tasks.move({ id, toStatus }))
      await get().refreshBoard()
      useToastStore.getState().addToast('success', `Task moved to ${toStatus}`)
    } catch (err) {
      set({ board: prevBoard, error: toError(err) })
    }
  },

  moveTaskToColumn: async (id, columnId) => {
    const prevBoard = get().board
    if (prevBoard) {
      const allTasks = prevBoard.columns.flatMap((c) => c.tasks)
      const movingTask = allTasks.find((t) => t.id === id)
      if (movingTask) {
        const nextStatus = defaultStatusForColumn(columnId)
        const updatedTask = { ...movingTask, status: nextStatus, updatedAt: Date.now() }
        const nextColumns = prevBoard.columns.map((col) => {
          if (col.id === columnId) {
            return { ...col, tasks: [...col.tasks.filter((t) => t.id !== id), updatedTask] }
          }
          return { ...col, tasks: col.tasks.filter((t) => t.id !== id) }
        })
        set({ board: { ...prevBoard, columns: nextColumns } })
      }
    }

    set({ error: null })
    try {
      unwrap(await api.tasks.moveToColumn({ id, columnId }))
      await get().refreshBoard()
      useToastStore.getState().addToast('success', `Task moved to ${defaultStatusForColumn(columnId)}`)
    } catch (err) {
      set({ board: prevBoard, error: toError(err) })
    }
  },

  deleteTask: async (id) => {
    set({ error: null })
    try {
      unwrap(await api.tasks.delete({ id }))
      if (get().selectedTaskId === id) {
        set({ selectedTaskId: null })
      }
      await get().refreshBoard()
      useToastStore.getState().addToast('success', 'Task deleted')
    } catch (err) {
      set({ error: toError(err) })
    }
  },

  selectTask: (id) => {
    set({ selectedTaskId: id })
  },

  clearError: () => {
    set({ error: null })
  },

  refreshBoard: async () => {
    const projectId = get().selectedProjectId
    if (!projectId) return
    try {
      const board = unwrap(await api.board.get({ projectId }))
      set({ board })
    } catch (err) {
      set({ error: toError(err) })
    }
  },

  // Repositories
  loadRepositories: async () => {
    const projectId = get().selectedProjectId
    try {
      const repos = projectId
        ? unwrap(await api.repositories.list({ projectId }))
        : unwrap(await api.repositories.listAll())
      set({ repositories: repos })
    } catch {
      // Non-blocking
    }
  },

  addRepository: async (path, name) => {
    const projectId = get().selectedProjectId
    if (!projectId) return
    set({ error: null })
    try {
      unwrap(await api.repositories.create({ projectId, path, name }))
      await get().loadRepositories()
      useToastStore.getState().addToast('success', 'Repository registered')
    } catch (err) {
      set({ error: toError(err) })
    }
  },

  deleteRepository: async (id) => {
    set({ error: null })
    try {
      unwrap(await api.repositories.delete({ id }))
      await get().loadRepositories()
    } catch (err) {
      set({ error: toError(err) })
    }
  },

  scanRepository: async (id) => {
    set({ error: null })
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

  configureHarness: async (harnessId, customPath) => {
    try {
      const res = unwrap(await api.mcp.configureHarness({ harness: harnessId, configPath: customPath }))
      await get().loadMcpStatus()
      if (res.success) {
        useToastStore.getState().addToast('success', res.message)
      } else {
        useToastStore.getState().addToast('error', res.message)
      }
      return res
    } catch (err) {
      return { success: false, message: toError(err) }
    }
  },

  unconfigureHarness: async (harnessId) => {
    try {
      const res = unwrap(await api.mcp.unconfigureHarness({ harness: harnessId }))
      await get().loadMcpStatus()
      return res
    } catch (err) {
      return { success: false, message: toError(err) }
    }
  },

  verifyHarness: async (harnessId) => {
    set({ verifyingHarness: harnessId })
    try {
      const res = unwrap(await api.mcp.verifyHarness({ harness: harnessId }))
      const prev = get().mcpVerifications
      set({
        mcpVerifications: { ...prev, [harnessId]: res },
        verifyingHarness: null
      })
      return res
    } catch (err) {
      const fallbackResult: McpVerificationResultDto = {
        success: false,
        testedAt: Date.now(),
        diagnostics: [{ step: 'runtime', status: 'error', message: toError(err) }],
        error: toError(err)
      }
      const prev = get().mcpVerifications
      set({
        mcpVerifications: { ...prev, [harnessId]: fallbackResult },
        verifyingHarness: null
      })
      return fallbackResult
    }
  },

  verifyAllHarnesses: async () => {
    set({ verifyingHarness: 'all' })
    try {
      const results = unwrap(await api.mcp.verifyAll())
      set({ mcpVerifications: results, verifyingHarness: null })
      return results
    } catch {
      set({ verifyingHarness: null })
      return {}
    }
  },

  addCustomHarness: async (name, configPath) => {
    try {
      unwrap(await api.mcp.addCustomHarness({ name, configPath }))
      await get().loadMcpStatus()
      return { success: true, message: `Added custom harness: ${name}` }
    } catch (err) {
      return { success: false, message: toError(err) }
    }
  },

  removeCustomHarness: async (id) => {
    try {
      unwrap(await api.mcp.removeCustomHarness({ id }))
      await get().loadMcpStatus()
    } catch {
      // Non-blocking
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
