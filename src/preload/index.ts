import { contextBridge, ipcRenderer } from 'electron'
import { IPC_CHANNELS } from '@ipc/channels'
import type { RendererApi } from './api'

/**
 * The preload script is the only place the renderer touches Electron.
 *
 * Only a narrow, explicitly typed set of methods is exposed via
 * contextBridge; the raw ipcRenderer is never leaked into the page.
 */
const api: RendererApi = {
  projects: {
    list: () => ipcRenderer.invoke(IPC_CHANNELS.projects.list),
    create: (input) => ipcRenderer.invoke(IPC_CHANNELS.projects.create, input),
    update: (input) => ipcRenderer.invoke(IPC_CHANNELS.projects.update, input),
    delete: (input) => ipcRenderer.invoke(IPC_CHANNELS.projects.delete, input)
  },
  tasks: {
    list: (input) => ipcRenderer.invoke(IPC_CHANNELS.tasks.list, input),
    create: (input) => ipcRenderer.invoke(IPC_CHANNELS.tasks.create, input),
    update: (input) => ipcRenderer.invoke(IPC_CHANNELS.tasks.update, input),
    move: (input) => ipcRenderer.invoke(IPC_CHANNELS.tasks.move, input),
    moveToColumn: (input) => ipcRenderer.invoke(IPC_CHANNELS.tasks.moveToColumn, input),
    delete: (input) => ipcRenderer.invoke(IPC_CHANNELS.tasks.delete, input),
    transitions: (input) => ipcRenderer.invoke(IPC_CHANNELS.tasks.transitions, input),
    evidence: (input) => ipcRenderer.invoke(IPC_CHANNELS.tasks.evidence, input)
  },
  board: {
    get(input) {
      return ipcRenderer.invoke(IPC_CHANNELS.board.get, input)
    }
  },
  repositories: {
    list: (input) => ipcRenderer.invoke(IPC_CHANNELS.repositories.list, input),
    listAll: () => ipcRenderer.invoke(IPC_CHANNELS.repositories.listAll),
    create: (input) => ipcRenderer.invoke(IPC_CHANNELS.repositories.create, input),
    delete: (input) => ipcRenderer.invoke(IPC_CHANNELS.repositories.delete, input),
    scan: (input) => ipcRenderer.invoke(IPC_CHANNELS.repositories.scan, input),
    pickDirectory: () => ipcRenderer.invoke(IPC_CHANNELS.repositories.pickDirectory)
  },
  sessions: {
    list: (input) => ipcRenderer.invoke(IPC_CHANNELS.sessions.list, input),
    listActive: () => ipcRenderer.invoke(IPC_CHANNELS.sessions.listActive),
    listAgents: () => ipcRenderer.invoke(IPC_CHANNELS.sessions.listAgents)
  },
  events: {
    list: (input) => ipcRenderer.invoke(IPC_CHANNELS.events.list, input)
  },
  mcp: {
    getStatus: () => ipcRenderer.invoke(IPC_CHANNELS.mcp.getStatus),
    configureHarness: (input) => ipcRenderer.invoke(IPC_CHANNELS.mcp.configureHarness, input),
    unconfigureHarness: (input) => ipcRenderer.invoke(IPC_CHANNELS.mcp.unconfigureHarness, input),
    verifyHarness: (input) => ipcRenderer.invoke(IPC_CHANNELS.mcp.verifyHarness, input),
    verifyAll: () => ipcRenderer.invoke(IPC_CHANNELS.mcp.verifyAll),
    addCustomHarness: (input) => ipcRenderer.invoke(IPC_CHANNELS.mcp.addCustomHarness, input),
    removeCustomHarness: (input) => ipcRenderer.invoke(IPC_CHANNELS.mcp.removeCustomHarness, input)
  },
  diagnostics: {
    getInfo: () => ipcRenderer.invoke(IPC_CHANNELS.diagnostics.getInfo),
    exportData: () => ipcRenderer.invoke(IPC_CHANNELS.diagnostics.exportData),
    importData: (input) => ipcRenderer.invoke(IPC_CHANNELS.diagnostics.importData, input)
  },
  onSync: (callback) => {
    const handler = (_event: Electron.IpcRendererEvent, data: { timestamp: number; type?: string }) => {
      callback(data)
    }
    ipcRenderer.on('kanban:sync', handler)
    return () => {
      ipcRenderer.removeListener('kanban:sync', handler)
    }
  },
  onNavigate: (callback) => {
    const handler = (_event: Electron.IpcRendererEvent, view: string) => {
      callback(view)
    }
    ipcRenderer.on('kanban:navigate', handler)
    return () => {
      ipcRenderer.removeListener('kanban:navigate', handler)
    }
  },
  onAction: (callback) => {
    const handler = (_event: Electron.IpcRendererEvent, action: string) => {
      callback(action)
    }
    ipcRenderer.on('kanban:action', handler)
    return () => {
      ipcRenderer.removeListener('kanban:action', handler)
    }
  }
}

contextBridge.exposeInMainWorld('api', api)
