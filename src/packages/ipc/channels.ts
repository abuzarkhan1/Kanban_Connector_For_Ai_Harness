/**
 * Central registry of IPC channel names.
 *
 * The main process, preload bridge and renderer all reference these constants;
 * a channel may never be invented ad-hoc in one place without being registered
 * here.
 */
export const IPC_CHANNELS = {
  projects: {
    list: 'projects:list',
    create: 'projects:create',
    update: 'projects:update',
    delete: 'projects:delete'
  },
  tasks: {
    list: 'tasks:list',
    create: 'tasks:create',
    update: 'tasks:update',
    move: 'tasks:move',
    moveToColumn: 'tasks:move-to-column',
    delete: 'tasks:delete',
    transitions: 'tasks:transitions',
    evidence: 'tasks:evidence'
  },
  board: {
    get: 'board:get'
  },
  repositories: {
    list: 'repositories:list',
    listAll: 'repositories:list-all',
    create: 'repositories:create',
    delete: 'repositories:delete',
    scan: 'repositories:scan',
    pickDirectory: 'repositories:pick-directory'
  },
  sessions: {
    list: 'sessions:list',
    listActive: 'sessions:list-active',
    listAgents: 'sessions:list-agents'
  },
  events: {
    list: 'events:list'
  },
  mcp: {
    getStatus: 'mcp:get-status',
    configureHarness: 'mcp:configure-harness',
    unconfigureHarness: 'mcp:unconfigure-harness',
    verifyHarness: 'mcp:verify-harness',
    verifyAll: 'mcp:verify-all',
    addCustomHarness: 'mcp:add-custom-harness',
    removeCustomHarness: 'mcp:remove-custom-harness'
  },
  diagnostics: {
    getInfo: 'diagnostics:get-info',
    exportData: 'diagnostics:export-data',
    importData: 'diagnostics:import-data'
  }
} as const
