import { app, Menu, type MenuItemConstructorOptions, shell, BrowserWindow } from 'electron'

function sendNavigation(view: string) {
  const windows = BrowserWindow.getAllWindows()
  for (const win of windows) {
    if (!win.isDestroyed() && !win.webContents.isDestroyed()) {
      win.webContents.send('kanban:navigate', view)
    }
  }
}

function sendAction(action: string) {
  const windows = BrowserWindow.getAllWindows()
  for (const win of windows) {
    if (!win.isDestroyed() && !win.webContents.isDestroyed()) {
      win.webContents.send('kanban:action', action)
    }
  }
}

export function setupApplicationMenu(): void {
  const isMac = process.platform === 'darwin'

  const template: MenuItemConstructorOptions[] = [
    ...(isMac
      ? ([
          {
            label: app.name,
            submenu: [
              { role: 'about' },
              { type: 'separator' },
              {
                label: 'Preferences...',
                accelerator: 'CmdOrCtrl+,',
                click: () => sendNavigation('mcp')
              },
              { type: 'separator' },
              { role: 'services' },
              { type: 'separator' },
              { role: 'hide' },
              { role: 'hideOthers' },
              { role: 'unhide' },
              { type: 'separator' },
              { role: 'quit' }
            ]
          }
        ] as MenuItemConstructorOptions[])
      : []),
    {
      label: 'File',
      submenu: [
        {
          label: 'New Task',
          accelerator: 'CmdOrCtrl+N',
          click: () => sendAction('focus-create-task')
        },
        {
          label: 'New Project',
          accelerator: 'CmdOrCtrl+Shift+N',
          click: () => sendAction('focus-create-project')
        },
        { type: 'separator' as const },
        ...(isMac ? [] : ([
          {
            label: 'Settings',
            accelerator: 'CmdOrCtrl+,',
            click: () => sendNavigation('mcp')
          },
          { type: 'separator' as const }
        ] as MenuItemConstructorOptions[])),
        isMac ? { role: 'close' } : { role: 'quit' }
      ] as MenuItemConstructorOptions[]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectAll' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Go',
      submenu: [
        { label: 'Kanban', accelerator: 'CmdOrCtrl+1', click: () => sendNavigation('kanban') },
        { label: 'Dashboard', accelerator: 'CmdOrCtrl+2', click: () => sendNavigation('dashboard') },
        { label: 'Repositories', accelerator: 'CmdOrCtrl+3', click: () => sendNavigation('repositories') },
        { label: 'Agents', accelerator: 'CmdOrCtrl+4', click: () => sendNavigation('agents') },
        { label: 'Timeline', accelerator: 'CmdOrCtrl+5', click: () => sendNavigation('timeline') },
        { label: 'MCP', accelerator: 'CmdOrCtrl+6', click: () => sendNavigation('mcp') },
        { label: 'Diagnostics', accelerator: 'CmdOrCtrl+7', click: () => sendNavigation('diagnostics') },
      ]
    },
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'zoom' },
        ...(isMac
          ? [{ type: 'separator' }, { role: 'front' }, { type: 'separator' }, { role: 'window' }]
          : [{ role: 'close' }])
      ] as MenuItemConstructorOptions[]
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'Documentation & Architecture',
          click: async () => {
            await shell.openExternal('https://modelcontextprotocol.io')
          }
        }
      ]
    }
  ]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}
