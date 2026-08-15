import { z, type ZodType } from 'zod'
import { ipcMain, dialog, app } from 'electron'
import { statSync, existsSync } from 'node:fs'
import { buildBoard } from '@application'
import type { ProjectService, TaskService, RepositoryService, SessionService, EventService } from '@application'
import type { ObservationEngine } from '@engine'
import type { HarnessConfigManager } from '@mcp'
import type { EvidenceRepository } from '@persistence/repositories/evidenceRepository'
import {
  IPC_CHANNELS,
  IPC_ERROR_CODES,
  ok,
  fail,
  CreateProjectSchema,
  UpdateProjectSchema,
  DeleteProjectSchema,
  CreateTaskSchema,
  UpdateTaskSchema,
  MoveTaskSchema,
  MoveTaskToColumnSchema,
  ListTasksSchema,
  DeleteTaskSchema,
  ListTransitionsSchema,
  ListEvidenceSchema,
  GetBoardSchema,
  CreateRepositorySchema,
  ListRepositoriesSchema,
  DeleteRepositorySchema,
  ScanRepositorySchema,
  ListSessionsSchema,
  ListEventsSchema,
  ConfigureHarnessSchema,
  UnconfigureHarnessSchema,
  VerifyHarnessSchema,
  AddCustomHarnessSchema,
  RemoveCustomHarnessSchema,
  ImportDataInputSchema
} from '@ipc'
import type { Database } from 'better-sqlite3'
import type { McpVerificationResultDto } from '@ipc'
import { DomainError, NotFoundError } from '@domain/errors/domainError'
import type { Logger } from './logger'

/** Channels that carry no payload still validate the input (must be undefined). */
const NoPayloadSchema = z.undefined()

function handle<TInput, TOutput>(
  channel: string,
  schema: ZodType<TInput>,
  fn: (input: TInput) => TOutput | Promise<TOutput>,
  logger: Logger
): void {
  ipcMain.handle(channel, async (_event, raw: unknown) => {
    try {
      const parsed = schema.safeParse(raw)
      if (!parsed.success) {
        return fail(
          IPC_ERROR_CODES.VALIDATION,
          `Invalid payload for ${channel}: ${parsed.error.issues[0]?.message ?? 'unknown'}`
        )
      }
      return ok(await fn(parsed.data))
    } catch (err) {
      if (err instanceof DomainError) {
        return fail(err.code, err.message)
      }
      logger.error('ipc', 'handler failed', {
        channel,
        error: err instanceof Error ? err.message : String(err)
      })
      return fail(IPC_ERROR_CODES.INTERNAL, 'Unexpected internal error')
    }
  })
}

export interface AppServices {
  projects: ProjectService
  tasks: TaskService
  repositories: RepositoryService
  sessions: SessionService
  events: EventService
  evidence: EvidenceRepository
  engine: ObservationEngine
  mcpManager: HarnessConfigManager
  mcpCliPath: string
  dbPath: string
  db?: Database
  onMutation?: () => void
}

export function registerIpcHandlers(services: AppServices, logger: Logger): void {
  const {
    projects,
    tasks,
    repositories,
    sessions,
    events,
    evidence,
    engine,
    mcpManager,
    mcpCliPath,
    dbPath,
    db,
    onMutation
  } = services

  const notify = (): void => {
    try {
      onMutation?.()
    } catch {
      // Non-blocking
    }
  }

  // --- Projects ---
  handle(IPC_CHANNELS.projects.list, NoPayloadSchema, () => projects.list(), logger)
  handle(IPC_CHANNELS.projects.create, CreateProjectSchema, (input) => {
    const res = projects.create(input.name).project
    notify()
    return res
  }, logger)
  handle(
    IPC_CHANNELS.projects.update,
    UpdateProjectSchema,
    ({ id, ...patch }) => {
      const res = projects.rename(id, patch.name)
      notify()
      return res
    },
    logger
  )
  handle(IPC_CHANNELS.projects.delete, DeleteProjectSchema, ({ id }) => {
    projects.delete(id)
    notify()
    return { deleted: true }
  }, logger)

  // --- Tasks ---
  handle(IPC_CHANNELS.tasks.list, ListTasksSchema, ({ projectId }) => tasks.listByProject(projectId), logger)
  handle(IPC_CHANNELS.tasks.create, CreateTaskSchema, (input) => {
    const res = tasks.create(input)
    notify()
    return res
  }, logger)
  handle(
    IPC_CHANNELS.tasks.update,
    UpdateTaskSchema,
    ({ id, ...patch }) => {
      const res = tasks.update(id, patch)
      notify()
      return res
    },
    logger
  )
  handle(IPC_CHANNELS.tasks.move, MoveTaskSchema, ({ id, toStatus }) => {
    const res = tasks.move(id, toStatus)
    notify()
    return res
  }, logger)
  handle(
    IPC_CHANNELS.tasks.moveToColumn,
    MoveTaskToColumnSchema,
    ({ id, columnId }) => {
      const res = tasks.moveToColumn(id, columnId)
      notify()
      return res
    },
    logger
  )
  handle(IPC_CHANNELS.tasks.delete, DeleteTaskSchema, ({ id }) => {
    tasks.delete(id)
    notify()
    return { deleted: true }
  }, logger)
  handle(IPC_CHANNELS.tasks.transitions, ListTransitionsSchema, ({ taskId }) =>
    tasks.transitionsFor(taskId), logger
  )
  handle(IPC_CHANNELS.tasks.evidence, ListEvidenceSchema, ({ taskId }) =>
    evidence.listByTask(taskId), logger
  )

  // --- Board ---
  handle(
    IPC_CHANNELS.board.get,
    GetBoardSchema,
    ({ projectId }) => {
      const project = projects.get(projectId)
      if (!project) throw new NotFoundError('Project', projectId)
      const taskList = tasks.listByProject(projectId)
      return buildBoard(project, taskList)
    },
    logger
  )

  // --- Repositories ---
  handle(
    IPC_CHANNELS.repositories.list,
    ListRepositoriesSchema,
    ({ projectId }) => repositories.listByProject(projectId),
    logger
  )
  handle(IPC_CHANNELS.repositories.listAll, NoPayloadSchema, () => repositories.listAll(), logger)
  handle(
    IPC_CHANNELS.repositories.create,
    CreateRepositorySchema,
    async (input) => {
      const repo = repositories.create(input)
      engine.filesystem.watchRepository(repo.id, repo.projectId, repo.path)
      if (repo.worktrees) {
        for (const wt of repo.worktrees) {
          engine.filesystem.watchRepository(repo.id, repo.projectId, wt.path)
        }
      }
      return repo
    },
    logger
  )
  handle(
    IPC_CHANNELS.repositories.delete,
    DeleteRepositorySchema,
    ({ id }) => {
      engine.filesystem.unwatchRepository(id)
      repositories.delete(id)
      return { deleted: true }
    },
    logger
  )
  handle(
    IPC_CHANNELS.repositories.scan,
    ScanRepositorySchema,
    async ({ id }) => {
      const repo = repositories.get(id)
      const inspection = await engine.git.inspect(repo.path)
      const updated = repositories.update(id, {
        currentBranch: inspection.currentBranch,
        defaultBranch: inspection.defaultBranch,
        headCommit: inspection.headCommit,
        worktrees: inspection.worktrees
      })
      if (updated.worktrees) {
        for (const wt of updated.worktrees) {
          engine.filesystem.watchRepository(updated.id, updated.projectId, wt.path)
        }
      }
      return updated
    },
    logger
  )

  handle(IPC_CHANNELS.repositories.pickDirectory, NoPayloadSchema, async () => {
    const res = await dialog.showOpenDialog({
      properties: ['openDirectory', 'createDirectory']
    })
    if (res.canceled || res.filePaths.length === 0) return null
    return res.filePaths[0] || null
  }, logger)

  // --- Sessions & Agents ---
  handle(IPC_CHANNELS.sessions.list, ListSessionsSchema, (input) => {
    const { projectId, taskId } = input || {}
    if (taskId) return sessions.listByTask(taskId)
    if (projectId) return sessions.listByProject(projectId)
    return sessions.listActive()
  }, logger)

  handle(IPC_CHANNELS.sessions.listActive, NoPayloadSchema, () => sessions.listActive(), logger)
  handle(IPC_CHANNELS.sessions.listAgents, NoPayloadSchema, () => sessions.listAgents(), logger)

  // --- Events ---
  handle(IPC_CHANNELS.events.list, ListEventsSchema, (input) => {
    const { projectId, taskId, limit } = input || {}
    if (taskId) return events.listByTask(taskId, limit)
    if (projectId) return events.listByProject(projectId, limit)
    return events.listRecent(limit || 100)
  }, logger)

  // --- MCP ---
  handle(IPC_CHANNELS.mcp.getStatus, NoPayloadSchema, () => {
    const harnesses = mcpManager.getStatusList()
    const mcpEvents = events.listRecent(50).filter((e) => e.category === 'mcp')
    
    const recentToolCalls = mcpEvents.map((e) => ({
      id: e.id,
      tool: String(e.payload?.tool || e.type),
      taskId: e.taskId,
      source: e.source,
      payload: e.payload,
      timestamp: e.timestamp
    }))

    const latest = recentToolCalls[0]
    const lastActiveSession = latest
      ? { tool: latest.tool, timestamp: latest.timestamp, source: latest.source }
      : undefined

    return {
      serverRunning: true,
      socketPath: 'stdio:kanban-mcp',
      harnesses,
      recentToolCalls,
      lastActiveSession
    }
  }, logger)

  handle(IPC_CHANNELS.mcp.configureHarness, ConfigureHarnessSchema, ({ harness, configPath }) => {
    return mcpManager.configureHarness(harness, mcpCliPath, configPath)
  }, logger)

  handle(IPC_CHANNELS.mcp.unconfigureHarness, UnconfigureHarnessSchema, ({ harness }) => {
    return mcpManager.unconfigureHarness(harness)
  }, logger)

  handle(IPC_CHANNELS.mcp.verifyHarness, VerifyHarnessSchema, async ({ harness }) => {
    return await mcpManager.verifyHarnessConnection(harness, mcpCliPath)
  }, logger)

  handle(IPC_CHANNELS.mcp.verifyAll, NoPayloadSchema, async () => {
    const list = mcpManager.getStatusList().filter((h) => h.configured)
    const results: Record<string, McpVerificationResultDto> = {}
    for (const h of list) {
      results[h.id] = await mcpManager.verifyHarnessConnection(h.id, mcpCliPath)
    }
    return results
  }, logger)

  handle(IPC_CHANNELS.mcp.addCustomHarness, AddCustomHarnessSchema, ({ name, configPath }) => {
    const entry = mcpManager.saveCustomLocation(name, configPath)
    return { success: true, entry }
  }, logger)

  handle(IPC_CHANNELS.mcp.removeCustomHarness, RemoveCustomHarnessSchema, ({ id }) => {
    const deleted = mcpManager.removeCustomLocation(id)
    return { success: deleted }
  }, logger)

  // --- Diagnostics ---
  handle(IPC_CHANNELS.diagnostics.getInfo, NoPayloadSchema, () => {
    let dbSizeKb = 0
    if (existsSync(dbPath)) {
      dbSizeKb = Math.round(statSync(dbPath).size / 1024)
    }

    const mem = process.memoryUsage()
    return {
      version: app.getVersion(),
      platform: process.platform,
      arch: process.arch,
      nodeVersion: process.versions.node,
      electronVersion: process.versions.electron,
      uptimeSeconds: Math.round(process.uptime()),
      memoryUsageMb: Math.round(mem.heapUsed / 1024 / 1024),
      dbPath,
      dbSizeKb,
      counts: {
        projects: projects.list().length,
        tasks: projects.list().reduce((sum, p) => sum + tasks.listByProject(p.id).length, 0),
        repositories: repositories.listAll().length,
        sessions: sessions.listActive().length,
        events: events.count()
      },
      observers: {
        git: 'active',
        filesystem: `active (${engine.filesystem.activeWatchersCount()} roots)`,
        process: 'active',
        mcp: 'ready (stdio & socket)'
      },
      recentLogs: logger.getRecentLogs()
    }
  }, logger)

  handle(IPC_CHANNELS.diagnostics.exportData, NoPayloadSchema, () => {
    if (!db) {
      throw new Error('Database handle not available')
    }
    const tableNames = [
      'projects',
      'tasks',
      'task_labels',
      'transitions',
      'repositories',
      'workspaces',
      'agents',
      'sessions',
      'events',
      'evidence',
      'settings'
    ]
    const data: Record<string, Record<string, unknown>[]> = {}
    for (const table of tableNames) {
      try {
        data[table] = db.prepare(`SELECT * FROM ${table}`).all() as Record<string, unknown>[]
      } catch {
        data[table] = []
      }
    }
    return {
      exportedAt: Date.now(),
      version: app.getVersion(),
      data
    }
  }, logger)

  handle(IPC_CHANNELS.diagnostics.importData, ImportDataInputSchema, ({ jsonContent }) => {
    if (!db) {
      throw new Error('Database handle not available')
    }
    let parsed: { data?: Record<string, Record<string, unknown>[]> }
    try {
      parsed = JSON.parse(jsonContent) as { data?: Record<string, Record<string, unknown>[]> }
    } catch {
      throw new Error('Invalid JSON format')
    }

    if (!parsed || typeof parsed !== 'object' || !parsed.data) {
      throw new Error('Invalid backup file format: missing data payload')
    }

    const importedCounts: Record<string, number> = {}
    const tables = [
      'projects',
      'tasks',
      'task_labels',
      'transitions',
      'repositories',
      'workspaces',
      'agents',
      'sessions',
      'events',
      'evidence',
      'settings'
    ]

    const runImport = db.transaction(() => {
      for (const table of tables) {
        const rows = parsed.data?.[table]
        if (!Array.isArray(rows) || rows.length === 0) continue

        let count = 0
        for (const row of rows) {
          const keys = Object.keys(row)
          if (keys.length === 0) continue
          const placeholders = keys.map(() => '?').join(', ')
          const columns = keys.map((k) => `"${k}"`).join(', ')
          const values = keys.map((k) => row[k])
          const stmt = db.prepare(`INSERT OR REPLACE INTO ${table} (${columns}) VALUES (${placeholders})`)
          stmt.run(...values)
          count++
        }
        importedCounts[table] = count
      }
    })

    runImport()
    notify()

    return {
      success: true,
      importedCounts,
      message: 'Backup imported successfully'
    }
  }, logger)
}
