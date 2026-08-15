import { app, Tray, Menu, nativeImage, BrowserWindow, type NativeImage } from 'electron'

let tray: Tray | null = null

function createTrayIcon(): NativeImage {
  // 16x16 monochrome template icon for macOS and standard tray icon for Win/Linux
  const size = 16
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 16 16">
      <rect x="2" y="2" width="5" height="12" rx="1.5" fill="#ffffff" fill-opacity="0.9"/>
      <rect x="9" y="2" width="5" height="7" rx="1.5" fill="#ffffff" fill-opacity="0.9"/>
      <rect x="9" y="11" width="5" height="3" rx="1.5" fill="#ffffff" fill-opacity="0.4"/>
    </svg>
  `
  const img = nativeImage.createFromBuffer(Buffer.from(svg))
  img.setTemplateImage(true)
  return img
}

export function setupSystemTray(mainWindow: BrowserWindow): Tray {
  if (tray) return tray

  const icon = createTrayIcon()
  tray = new Tray(icon)
  tray.setToolTip('AI Harness Project Manager')

  const sendNavigate = (view: string) => {
    if (!mainWindow.isDestroyed() && !mainWindow.webContents.isDestroyed()) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      if (!mainWindow.isVisible()) mainWindow.show()
      mainWindow.focus()
      mainWindow.webContents.send('kanban:navigate', view)
    }
  }

  const updateMenu = () => {
    const isVisible = mainWindow.isVisible() && !mainWindow.isMinimized()
    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'AI Harness Project Manager',
        enabled: false
      },
      { type: 'separator' },
      {
        label: isVisible ? 'Hide Window' : 'Show Window',
        click: () => {
          if (isVisible) {
            mainWindow.hide()
          } else {
            if (mainWindow.isMinimized()) mainWindow.restore()
            mainWindow.show()
            mainWindow.focus()
          }
          updateMenu()
        }
      },
      { type: 'separator' },
      {
        label: 'Go to Kanban',
        click: () => sendNavigate('kanban')
      },
      {
        label: 'Go to Dashboard',
        click: () => sendNavigate('dashboard')
      },
      {
        label: 'Go to Repositories',
        click: () => sendNavigate('repositories')
      },
      {
        label: 'Go to MCP Settings',
        click: () => sendNavigate('mcp')
      },
      {
        label: 'Go to Diagnostics',
        click: () => sendNavigate('diagnostics')
      },
      { type: 'separator' },
      {
        label: 'Quit',
        click: () => {
          app.quit()
        }
      }
    ])
    tray?.setContextMenu(contextMenu)
  }

  updateMenu()

  tray.on('click', () => {
    if (mainWindow.isVisible()) {
      mainWindow.focus()
    } else {
      mainWindow.show()
      mainWindow.focus()
    }
    updateMenu()
  })

  mainWindow.on('show', updateMenu)
  mainWindow.on('hide', updateMenu)
  mainWindow.on('minimize', updateMenu)
  mainWindow.on('restore', updateMenu)

  return tray
}

export function destroySystemTray(): void {
  if (tray) {
    tray.destroy()
    tray = null
  }
}
