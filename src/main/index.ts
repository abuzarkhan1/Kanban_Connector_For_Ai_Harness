import { join } from 'node:path'
import { app, BrowserWindow } from 'electron'
import {
  ProjectRepository,
  TaskRepository,
  TransitionRepository,
  RepositoryRepository,
  SessionRepository,
  EventRepository,
  EvidenceRepository,
  AgentRepository
} from '@persistence'
import {
  ProjectService,
  TaskService,
  RepositoryService,
  SessionService,
  EventService
} from '@application'
import { ObservationEngine } from '@engine'
import { HarnessConfigManager } from '@mcp'
import { loadConfig } from './config'
import { createLogger, type Logger } from './logger'
import { initDatabase } from './db'
import { registerIpcHandlers } from './ipc'
import { createMainWindow } from './window'
import { setupApplicationMenu } from './menu'

const SMOKE_TEST = process.argv.includes('--smoke-test')

let logger: Logger
let closeDatabase: (() => void) | null = null
let engine: ObservationEngine | null = null

function finish(code: number): void {
  engine?.stop()
  closeDatabase?.()
  app.exit(code)
}

// Ensure single instance lock to protect SQLite WAL DB from multiple concurrent processes
const hasLock = app.requestSingleInstanceLock()
if (!hasLock && !SMOKE_TEST) {
  app.quit()
} else {
  app.on('second-instance', () => {
    const windows = BrowserWindow.getAllWindows()
    if (windows.length > 0) {
      const win = windows[0]
      if (win) {
        if (win.isMinimized()) win.restore()
        win.focus()
      }
    }
  })
}

// Global exception handlers
process.on('uncaughtException', (err) => {
  logger?.error('main', 'uncaughtException', { error: err instanceof Error ? err.stack || err.message : String(err) })
})

process.on('unhandledRejection', (reason) => {
  logger?.error('main', 'unhandledRejection', { error: reason instanceof Error ? reason.stack || reason.message : String(reason) })
})

async function bootstrap(): Promise<void> {
  const userDataDir = app.getPath('userData')
  const config = loadConfig(userDataDir)
  logger = createLogger({ level: config.logLevel, filePath: join(userDataDir, 'logs', config.logFileName) })
  logger.info('app', 'starting', { version: app.getVersion(), platform: process.platform })

  setupApplicationMenu()

  const db = initDatabase(userDataDir, config, logger)
  closeDatabase = () => db.close()

  const projectRepo = new ProjectRepository(db.raw)
  const taskRepo = new TaskRepository(db.raw)
  const transitionRepo = new TransitionRepository(db.raw)
  const repoRepo = new RepositoryRepository(db.raw)
  const sessionRepo = new SessionRepository(db.raw)
  const eventRepo = new EventRepository(db.raw)
  const evidenceRepo = new EvidenceRepository(db.raw)
  const agentRepo = new AgentRepository(db.raw)

  const projectService = new ProjectService(projectRepo)
  const taskService = new TaskService(projectRepo, taskRepo, transitionRepo)
  const repositoryService = new RepositoryService(projectRepo, repoRepo)
  const sessionService = new SessionService(sessionRepo, agentRepo)
  const eventService = new EventService(eventRepo)

  engine = new ObservationEngine(
    repositoryService,
    taskService,
    sessionService,
    eventService,
    evidenceRepo
  )
  engine.start()

  const mcpManager = new HarnessConfigManager()
  const mcpCliPath = join(__dirname, '../../bin/kanban-mcp.js')
  const dbPath = join(userDataDir, config.dbFileName)

  const services = {
    projects: projectService,
    tasks: taskService,
    repositories: repositoryService,
    sessions: sessionService,
    events: eventService,
    evidence: evidenceRepo,
    engine,
    mcpManager,
    mcpCliPath,
    dbPath
  }

  registerIpcHandlers(services, logger)
  const window = createMainWindow()

  logger.info('app', 'ready')

  if (SMOKE_TEST) {
    runSmokeTest(window)
  }
}

/**
 * Verification mode used by CI and local checks: prove the full stack boots —
 * main process, database, IPC, preload bridge and the React renderer — and
 * exit non-zero if anything is broken.
 */
function runSmokeTest(window: BrowserWindow): void {
  const rendererErrors: string[] = []

  window.webContents.on('console-message', (_event, level, message) => {
    if (level >= 3) rendererErrors.push(message)
  })
  window.webContents.on('did-fail-load', (_event, errorCode, errorDescription) => {
    rendererErrors.push(`did-fail-load ${errorCode}: ${errorDescription}`)
  })

  window.webContents.once('did-finish-load', () => {
    setTimeout(async () => {
      let apiBridgeOk = false
      let reactMounted = false
      try {
        apiBridgeOk = (await window.webContents.executeJavaScript('typeof window.api !== "undefined"')) as boolean
        reactMounted = (await window.webContents.executeJavaScript('document.getElementById("root")?.children.length > 0')) as boolean
      } catch (err) {
        rendererErrors.push(`executeJavaScript failed: ${err instanceof Error ? err.message : String(err)}`)
      }

      logger.info('app', 'smoke renderer check', { apiBridgeOk, reactMounted, rendererErrors: rendererErrors.length })
      const passed = apiBridgeOk && reactMounted && rendererErrors.length === 0
      logger.info('app', passed ? 'smoke test passed' : 'smoke test FAILED')
      finish(passed ? 0 : 1)
    }, 1500)
  })
}

app.whenReady().then(bootstrap).catch((err: unknown) => {
  console.error('Failed to start application', err)
  app.exit(1)
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  // macOS: re-create the window only when none exists.
  if (BrowserWindow.getAllWindows().length === 0) {
    void app.whenReady().then(() => {
      createMainWindow()
    })
  }
})

app.on('will-quit', () => {
  engine?.stop()
  closeDatabase?.()
})
