import { z, type ZodType } from 'zod'
import { ipcMain, dialog, app } from 'electron'
import { statSync, existsSync } from 'node:fs'
import { buildBoard } from '@application'
import type { ProjectService, TaskService, RepositoryService, SessionService, EventService } from '@application'
import type { ObservationEngine } from '@engine'
import type { HarnessConfigManager } from '@mcp'
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
  GetBoardSchema,
  CreateRepositorySchema,
  ListRepositoriesSchema,
  DeleteRepositorySchema,
  ScanRepositorySchema,
  ListSessionsSchema,
  ListEventsSchema,
  ConfigureHarnessSchema
} from '@ipc'
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
        return fail(IPC_ERROR_CODES.VALIDATION, `Invalid payload for ${channel}: ${parsed.error.issues[0]?.message ?? 'unknown'}`)
      }
      return ok(await fn(parsed.data))
    } catch (err) {
      if (err instanceof DomainError) {
        return fail(err.code, err.message)
      }
      logger.error('ipc', 'handler failed', { channel, error: err instanceof Error ? err.message : String(err) })
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
  engine: ObservationEngine
  mcpManager: HarnessConfigManager
  mcpCliPath: string
  dbPath: string
}

export function registerIpcHandlers(services: AppServices, logger: Logger): void {
  const { projects, tasks, repositories, sessions, events, engine, mcpManager, mcpCliPath, dbPath } = services

  // --- Projects ---
  handle(IPC_CHANNELS.projects.list, NoPayloadSchema, () => projects.list(), logger)
  handle(IPC_CHANNELS.projects.create, CreateProjectSchema, ({ name }) => projects.create(name).project, logger)
  handle(IPC_CHANNELS.projects.update, UpdateProjectSchema, ({ id, name }) => projects.rename(id, name), logger)
  handle(IPC_CHANNELS.projects.delete, DeleteProjectSchema, ({ id }) => {
    projects.delete(id)
    return { deleted: true }
  }, logger)

  // --- Tasks ---
  handle(IPC_CHANNELS.tasks.list, ListTasksSchema, ({ projectId }) => tasks.listByProject(projectId), logger)
  handle(IPC_CHANNELS.tasks.create, CreateTaskSchema, (input) => tasks.create(input), logger)
  handle(IPC_CHANNELS.tasks.update, UpdateTaskSchema, ({ id, ...patch }) => tasks.update(id, patch), logger)
  handle(IPC_CHANNELS.tasks.move, MoveTaskSchema, ({ id, toStatus }) => tasks.move(id, toStatus, { actor: 'user' }), logger)
  handle(IPC_CHANNELS.tasks.moveToColumn, MoveTaskToColumnSchema, ({ id, columnId }) => tasks.moveToColumn(id, columnId, { actor: 'user' }), logger)
  handle(IPC_CHANNELS.tasks.delete, DeleteTaskSchema, ({ id }) => {
    tasks.delete(id)
    return { deleted: true }
  }, logger)
  handle(IPC_CHANNELS.tasks.transitions, ListTransitionsSchema, ({ taskId }) => tasks.transitionsFor(taskId), logger)

  // --- Board ---
  handle(IPC_CHANNELS.board.get, GetBoardSchema, ({ projectId }) => {
    const project = projects.list().find((p) => p.id === projectId)
    if (!project) throw new NotFoundError('Project', projectId)
    return buildBoard(project, tasks.listByProject(projectId))
  }, logger)

  // --- Repositories ---
  handle(IPC_CHANNELS.repositories.list, ListRepositoriesSchema, ({ projectId }) => repositories.listByProject(projectId), logger)
  handle(IPC_CHANNELS.repositories.listAll, NoPayloadSchema, () => repositories.listAll(), logger)
  handle(IPC_CHANNELS.repositories.create, CreateRepositorySchema, async ({ projectId, path, name }) => {
    const gitInfo = await engine.git.inspect(path)
    const repo = repositories.create({
      projectId,
      path,
      name,
      defaultBranch: gitInfo.defaultBranch,
      currentBranch: gitInfo.currentBranch,
      headCommit: gitInfo.headCommit,
      worktrees: gitInfo.worktrees
    })
    engine.filesystem.watchRepository(repo.id, repo.projectId, repo.path)
    return repo
  }, logger)

  handle(IPC_CHANNELS.repositories.scan, ScanRepositorySchema, async ({ id }) => {
    const repo = repositories.get(id)
    const gitInfo = await engine.git.inspect(repo.path)
    const updated = repositories.update(id, {
      defaultBranch: gitInfo.defaultBranch,
      currentBranch: gitInfo.currentBranch,
      headCommit: gitInfo.headCommit,
      worktrees: gitInfo.worktrees,
      lastScannedAt: Date.now()
    })
    return updated
  }, logger)

  handle(IPC_CHANNELS.repositories.delete, DeleteRepositorySchema, ({ id }) => {
    engine.filesystem.unwatchRepository(id)
    repositories.delete(id)
    return { deleted: true }
  }, logger)

  handle(IPC_CHANNELS.repositories.pickDirectory, NoPayloadSchema, async () => {
    const res = await dialog.showOpenDialog({
      properties: ['openDirectory', 'createDirectory']
    })
    if (res.canceled || res.filePaths.length === 0) return null
    return res.filePaths[0] || null
  }, logger)

  // --- Sessions & Agents ---
  handle(IPC_CHANNELS.sessions.list, ListSessionsSchema, ({ projectId, taskId }) => {
    if (taskId) return sessions.listByTask(taskId)
    if (projectId) return sessions.listByProject(projectId)
    return sessions.listActive()
  }, logger)

  handle(IPC_CHANNELS.sessions.listActive, NoPayloadSchema, () => sessions.listActive(), logger)
  handle(IPC_CHANNELS.sessions.listAgents, NoPayloadSchema, () => sessions.listAgents(), logger)

  // --- Events ---
  handle(IPC_CHANNELS.events.list, ListEventsSchema, ({ projectId, taskId, limit }) => {
    if (taskId) return events.listByTask(taskId, limit)
    if (projectId) return events.listByProject(projectId, limit)
    return events.listRecent(limit || 100)
  }, logger)

  // --- MCP ---
  handle(IPC_CHANNELS.mcp.getStatus, NoPayloadSchema, () => {
    const harnesses = mcpManager.getStatusList()
    return {
      serverRunning: true,
      socketPath: 'stdio:kanban-mcp',
      harnesses,
      recentToolCalls: []
    }
  }, logger)

  handle(IPC_CHANNELS.mcp.configureHarness, ConfigureHarnessSchema, ({ harness }) => {
    return mcpManager.configureHarness(harness, mcpCliPath)
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
}
