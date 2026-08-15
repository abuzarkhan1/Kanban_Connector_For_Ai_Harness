import { join } from 'node:path'
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { BrowserWindow, shell, app } from 'electron'

interface WindowBounds {
  x?: number
  y?: number
  width: number
  height: number
  isMaximized?: boolean
}

function getWindowStatePath(): string {
  return join(app.getPath('userData'), 'window-state.json')
}

function loadWindowState(): WindowBounds {
  const path = getWindowStatePath()
  if (existsSync(path)) {
    try {
      return JSON.parse(readFileSync(path, 'utf8')) as WindowBounds
    } catch {
      // Fallback
    }
  }
  return { width: 1360, height: 860 }
}

function saveWindowState(window: BrowserWindow): void {
  try {
    const isMaximized = window.isMaximized()
    const bounds = window.getBounds()
    const state: WindowBounds = {
      x: bounds.x,
      y: bounds.y,
      width: bounds.width,
      height: bounds.height,
      isMaximized
    }
    writeFileSync(getWindowStatePath(), JSON.stringify(state), 'utf8')
  } catch {
    // Ignore
  }
}

export function createMainWindow(): BrowserWindow {
  const state = loadWindowState()

  const iconPath = join(__dirname, '../../resources/icon.png')
  const iconExists = existsSync(iconPath)

  if (process.platform === 'darwin' && app.dock && iconExists) {
    app.dock.setIcon(iconPath)
  }

  const window = new BrowserWindow({
    x: state.x,
    y: state.y,
    width: state.width,
    height: state.height,
    minWidth: 960,
    minHeight: 600,
    title: 'AI Harness Project Manager',
    icon: iconExists ? iconPath : undefined,
    show: false,
    backgroundColor: '#07080a',
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  })

  if (state.isMaximized) {
    window.maximize()
  }

  window.on('ready-to-show', () => {
    window.show()
  })

  window.on('close', () => {
    saveWindowState(window)
  })

  // Open external links in the system browser, never in the app window.
  window.webContents.setWindowOpenHandler(({ url }) => {
    void shell.openExternal(url)
    return { action: 'deny' }
  })

  // Load the renderer from the dev server in development, from disk otherwise.
  const devServerUrl = process.env['ELECTRON_RENDERER_URL']
  if (devServerUrl) {
    void window.loadURL(devServerUrl)
  } else {
    void window.loadFile(join(__dirname, '../renderer/index.html'))
  }

  return window
}
