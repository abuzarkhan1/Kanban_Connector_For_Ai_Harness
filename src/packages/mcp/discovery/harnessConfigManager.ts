import { existsSync, readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { homedir } from 'node:os'
import { spawn, execSync } from 'node:child_process'
import type {
  McpHarnessStatusDto,
  McpVerificationResultDto,
  SupportedHarness
} from '@ipc/contracts/mcpContracts'

export interface HarnessConfigLocation {
  id: string
  harness: SupportedHarness
  name: string
  path: string
  category: 'antigravity' | 'claude' | 'editor' | 'custom'
  isCustom?: boolean
}

export class HarnessConfigManager {
  private customLocationsFile: string

  constructor(customStorageDir?: string) {
    const baseDir = customStorageDir || join(homedir(), '.ai-harness-project-manager')
    this.customLocationsFile = join(baseDir, 'custom_harnesses.json')
  }

  private getHome(): string {
    return homedir()
  }

  /**
   * Resolves the absolute path to the Node.js executable.
   * This is critical for macOS and Linux GUI desktop applications (like Antigravity Desktop,
   * Antigravity IDE, Claude Desktop, Cursor) which launch with minimal non-login $PATH environments
   * that do not include version manager shims (NVM, FNM, Volta, ASDF, Homebrew).
   */
  resolveNodeExecutable(): string {
    const home = this.getHome()
    const isWindows = process.platform === 'win32'

    // 1. Check if process.execPath is a direct node executable (and not Electron binary)
    if (process.execPath && !process.execPath.toLowerCase().includes('electron')) {
      const base = process.execPath.split(/[\\/]/).pop() || ''
      if (base.startsWith('node')) {
        return process.execPath
      }
    }

    // 2. Search NVM directory (very common on macOS and Linux)
    const nvmDir = join(home, '.nvm', 'versions', 'node')
    if (existsSync(nvmDir)) {
      try {
        const versions = readdirSync(nvmDir)
          .filter((v) => !v.startsWith('.'))
          .sort((a, b) => b.localeCompare(a, undefined, { numeric: true, sensitivity: 'base' }))
        for (const ver of versions) {
          const bin = join(nvmDir, ver, 'bin', isWindows ? 'node.exe' : 'node')
          if (existsSync(bin)) {
            return bin
          }
        }
      } catch {
        // Continue fallback search
      }
    }

    // 3. Search FNM, Volta, ASDF
    const fnmBin = join(home, '.fnm', 'current', 'bin', isWindows ? 'node.exe' : 'node')
    if (existsSync(fnmBin)) return fnmBin
    const fnmAlt = join(home, '.local', 'share', 'fnm', 'current', 'bin', isWindows ? 'node.exe' : 'node')
    if (existsSync(fnmAlt)) return fnmAlt

    const voltaBin = join(home, '.volta', 'bin', isWindows ? 'node.exe' : 'node')
    if (existsSync(voltaBin)) return voltaBin

    const asdfBin = join(home, '.asdf', 'shims', isWindows ? 'node.exe' : 'node')
    if (existsSync(asdfBin)) return asdfBin

    // 4. Search Homebrew and standard Unix paths
    const standardUnix = [
      '/opt/homebrew/bin/node',
      '/usr/local/bin/node',
      '/usr/bin/node',
      join(home, '.cargo', 'bin', 'node'),
      join(home, 'bin', 'node')
    ]
    for (const p of standardUnix) {
      if (existsSync(p)) return p
    }

    // 5. Search Windows standard paths
    if (isWindows) {
      const winPaths = [
        'C:\\Program Files\\nodejs\\node.exe',
        'C:\\Program Files (x86)\\nodejs\\node.exe',
        join(process.env.APPDATA || '', 'npm', 'node.exe'),
        join(process.env.LOCALAPPDATA || '', 'Programs', 'node', 'node.exe')
      ]
      for (const p of winPaths) {
        if (existsSync(p)) return p
      }
    }

    // 6. Try `which node` / `where node`
    try {
      const cmd = isWindows ? 'where node' : 'which node'
      const out = execSync(cmd, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }).trim().split('\n')[0].trim()
      if (out && existsSync(out)) {
        return out
      }
    } catch {
      // Fallback to bare command
    }

    return 'node'
  }

  /**
   * Builds an enhanced PATH string containing all standard and version-managed bin directories.
   */
  resolveNodePathEnv(): string {
    const nodeBin = this.resolveNodeExecutable()
    const isWindows = process.platform === 'win32'
    const sep = isWindows ? ';' : ':'
    const binDir = dirname(nodeBin)
    const extraPaths = [
      binDir,
      '/opt/homebrew/bin',
      '/usr/local/bin',
      '/usr/bin',
      '/bin',
      '/usr/sbin',
      '/sbin'
    ]
    const currentPath = process.env.PATH || ''
    const merged = Array.from(new Set([...extraPaths, ...currentPath.split(sep)])).filter(Boolean)
    return merged.join(sep)
  }

  getCustomLocations(): HarnessConfigLocation[] {
    if (!existsSync(this.customLocationsFile)) return []
    try {
      const data = JSON.parse(readFileSync(this.customLocationsFile, 'utf8')) as HarnessConfigLocation[]
      return Array.isArray(data) ? data : []
    } catch {
      return []
    }
  }

  saveCustomLocation(name: string, configPath: string): HarnessConfigLocation {
    const customList = this.getCustomLocations()
    const id = `custom_${Date.now()}`
    const entry: HarnessConfigLocation = {
      id,
      harness: 'custom',
      name,
      path: configPath,
      category: 'custom',
      isCustom: true
    }
    customList.push(entry)
    const dir = dirname(this.customLocationsFile)
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
    writeFileSync(this.customLocationsFile, JSON.stringify(customList, null, 2), 'utf8')
    return entry
  }

  removeCustomLocation(id: string): boolean {
    const customList = this.getCustomLocations().filter((item) => item.id !== id)
    const dir = dirname(this.customLocationsFile)
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
    writeFileSync(this.customLocationsFile, JSON.stringify(customList, null, 2), 'utf8')
    return true
  }

  getLocations(): HarnessConfigLocation[] {
    const home = this.getHome()
    const isMac = process.platform === 'darwin'
    const isWindows = process.platform === 'win32'

    // Claude Desktop Path
    let claudeDesktopPath = join(home, '.claude', 'claude_desktop_config.json')
    if (isMac) {
      claudeDesktopPath = join(home, 'Library', 'Application Support', 'Claude', 'claude_desktop_config.json')
    } else if (isWindows) {
      claudeDesktopPath = join(process.env.APPDATA || home, 'Claude', 'claude_desktop_config.json')
    }

    // VS Code Roo Code Path
    let vscodeRooPath = join(home, '.config', 'Code', 'User', 'globalStorage', 'rooveterinaryinc.roo-cline', 'settings', 'mcp_settings.json')
    if (isMac) {
      vscodeRooPath = join(home, 'Library', 'Application Support', 'Code', 'User', 'globalStorage', 'rooveterinaryinc.roo-cline', 'settings', 'mcp_settings.json')
    } else if (isWindows) {
      vscodeRooPath = join(process.env.APPDATA || home, 'Code', 'User', 'globalStorage', 'rooveterinaryinc.roo-cline', 'settings', 'mcp_settings.json')
    }

    // VS Code Cline Path
    let vscodeClinePath = join(home, '.config', 'Code', 'User', 'globalStorage', 'saoudrizwan.claude-dev', 'settings', 'cline_mcp_settings.json')
    if (isMac) {
      vscodeClinePath = join(home, 'Library', 'Application Support', 'Code', 'User', 'globalStorage', 'saoudrizwan.claude-dev', 'settings', 'cline_mcp_settings.json')
    } else if (isWindows) {
      vscodeClinePath = join(process.env.APPDATA || home, 'Code', 'User', 'globalStorage', 'saoudrizwan.claude-dev', 'settings', 'cline_mcp_settings.json')
    }

    // Antigravity Desktop 2.0 and IDE fallbacks
    let agyDesktopPath = join(home, '.gemini', 'antigravity', 'mcp_config.json')
    let agyIdePath = join(home, '.gemini', 'antigravity-ide', 'mcp_config.json')
    if (isMac) {
      const appSupp = join(home, 'Library', 'Application Support')
      if (!existsSync(agyDesktopPath) && existsSync(join(appSupp, 'Antigravity'))) {
        agyDesktopPath = join(appSupp, 'Antigravity', 'User', 'globalStorage', 'mcp.json')
      }
      if (!existsSync(agyIdePath) && existsSync(join(appSupp, 'Antigravity IDE'))) {
        agyIdePath = join(appSupp, 'Antigravity IDE', 'User', 'globalStorage', 'mcp.json')
      }
    }

    const builtIn: HarnessConfigLocation[] = [
      // 1. Antigravity Suite
      {
        id: 'antigravity_cli',
        harness: 'antigravity',
        name: 'Google Antigravity CLI',
        path: join(home, '.gemini', 'config', 'mcp_config.json'),
        category: 'antigravity'
      },
      {
        id: 'antigravity_desktop',
        harness: 'antigravity',
        name: 'Google Antigravity Desktop (2.0)',
        path: agyDesktopPath,
        category: 'antigravity'
      },
      {
        id: 'antigravity_ide',
        harness: 'antigravity',
        name: 'Google Antigravity IDE',
        path: agyIdePath,
        category: 'antigravity'
      },

      // 2. Claude Suite
      {
        id: 'claude_code',
        harness: 'claude',
        name: 'Claude Code CLI',
        path: join(home, '.claude.json'),
        category: 'claude'
      },
      {
        id: 'claude_desktop',
        harness: 'claude',
        name: 'Claude Desktop App',
        path: claudeDesktopPath,
        category: 'claude'
      },

      // 3. AI IDEs & Extensions
      {
        id: 'cursor',
        harness: 'cursor',
        name: 'Cursor Editor',
        path: join(home, '.cursor', 'mcp.json'),
        category: 'editor'
      },
      {
        id: 'windsurf',
        harness: 'windsurf',
        name: 'Windsurf Editor',
        path: join(home, '.codeium', 'windsurf', 'mcp_config.json'),
        category: 'editor'
      },
      {
        id: 'vscode_roo',
        harness: 'vscode_roo',
        name: 'VS Code (Roo Code)',
        path: vscodeRooPath,
        category: 'editor'
      },
      {
        id: 'vscode_cline',
        harness: 'vscode_cline',
        name: 'VS Code (Cline)',
        path: vscodeClinePath,
        category: 'editor'
      }
    ]

    return [...builtIn, ...this.getCustomLocations()]
  }

  getStatusList(): McpHarnessStatusDto[] {
    const locations = this.getLocations()
    return locations.map((loc) => {
      const detected = existsSync(dirname(loc.path)) || existsSync(loc.path)
      let configured = false

      if (existsSync(loc.path)) {
        try {
          const raw = readFileSync(loc.path, 'utf8')
          const cleanJson = raw.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '')
          const content = JSON.parse(cleanJson) as {
            mcpServers?: Record<string, unknown>
            mcp_servers?: Record<string, unknown>
          }
          const servers = content.mcpServers || content.mcp_servers || {}
          configured = Boolean(servers['kanban'] || servers['ai-harness-pm'])
        } catch {
          configured = false
        }
      }

      return {
        id: loc.id,
        harness: loc.harness,
        name: loc.name,
        configPath: loc.path,
        category: loc.category,
        detected,
        configured,
        isCustom: loc.isCustom
      }
    })
  }

  configureHarness(harnessIdOrType: string, cliPath: string, customPath?: string): { success: boolean; message: string } {
    let loc = this.getLocations().find((l) => l.id === harnessIdOrType || l.harness === harnessIdOrType)
    if (!loc && customPath) {
      loc = {
        id: harnessIdOrType,
        harness: 'custom',
        name: harnessIdOrType,
        path: customPath,
        category: 'custom'
      }
    }
    if (!loc) return { success: false, message: `Unknown harness: ${harnessIdOrType}` }

    try {
      const dir = dirname(loc.path)
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true })
      }

      let config: Record<string, unknown> = {}
      if (existsSync(loc.path)) {
        try {
          const raw = readFileSync(loc.path, 'utf8').replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '')
          config = JSON.parse(raw) as Record<string, unknown>
        } catch {
          config = {}
        }
      }

      const serverKey = 'mcpServers'
      if (!config[serverKey] || typeof config[serverKey] !== 'object') {
        config[serverKey] = {}
      }

      const nodeCommand = this.resolveNodeExecutable()
      const pathEnv = this.resolveNodePathEnv()

      const servers = config[serverKey] as Record<string, unknown>
      servers['kanban'] = {
        command: nodeCommand,
        args: [cliPath],
        env: {
          PATH: pathEnv
        }
      }

      writeFileSync(loc.path, JSON.stringify(config, null, 2), 'utf8')
      return { success: true, message: `Successfully configured ${loc.name} at ${loc.path}` }
    } catch (err) {
      return {
        success: false,
        message: `Failed to write config: ${err instanceof Error ? err.message : String(err)}`
      }
    }
  }

  unconfigureHarness(harnessIdOrType: string): { success: boolean; message: string } {
    const loc = this.getLocations().find((l) => l.id === harnessIdOrType || l.harness === harnessIdOrType)
    if (!loc) return { success: false, message: `Unknown harness: ${harnessIdOrType}` }

    try {
      if (!existsSync(loc.path)) {
        return { success: true, message: `Config file does not exist, nothing to remove.` }
      }

      const raw = readFileSync(loc.path, 'utf8').replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '')
      const config = JSON.parse(raw) as Record<string, unknown>
      const servers = (config.mcpServers || config.mcp_servers) as Record<string, unknown> | undefined

      if (servers && (servers['kanban'] || servers['ai-harness-pm'])) {
        delete servers['kanban']
        delete servers['ai-harness-pm']
        writeFileSync(loc.path, JSON.stringify(config, null, 2), 'utf8')
      }

      return { success: true, message: `Disconnected Kanban MCP from ${loc.name}` }
    } catch (err) {
      return {
        success: false,
        message: `Failed to remove config: ${err instanceof Error ? err.message : String(err)}`
      }
    }
  }

  async verifyHarnessConnection(harnessIdOrType: string, cliPath: string): Promise<McpVerificationResultDto> {
    const loc = this.getLocations().find((l) => l.id === harnessIdOrType || l.harness === harnessIdOrType)
    const testedAt = Date.now()
    const diagnostics: McpVerificationResultDto['diagnostics'] = []

    if (!loc) {
      return {
        success: false,
        testedAt,
        diagnostics: [{ step: 'config', status: 'error', message: `Harness ${harnessIdOrType} is not registered.` }],
        error: `Unknown harness target: ${harnessIdOrType}`
      }
    }

    // Step 1: Config check
    if (!existsSync(loc.path)) {
      diagnostics.push({ step: 'config', status: 'error', message: `Config file not found at ${loc.path}` })
      return { success: false, testedAt, diagnostics, error: 'Configuration file missing.' }
    }

    let command = this.resolveNodeExecutable()
    let args = [cliPath]
    let serverEnv: Record<string, string> = {}

    try {
      const raw = readFileSync(loc.path, 'utf8').replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '')
      const parsed = JSON.parse(raw) as {
        mcpServers?: Record<string, { command?: string; args?: string[]; env?: Record<string, string> }>
        mcp_servers?: Record<string, { command?: string; args?: string[]; env?: Record<string, string> }>
      }
      const srv = parsed.mcpServers?.['kanban'] || parsed.mcpServers?.['ai-harness-pm'] || parsed.mcp_servers?.['kanban']
      if (!srv) {
        diagnostics.push({ step: 'config', status: 'error', message: `No 'kanban' server entry found in ${loc.path}` })
        return { success: false, testedAt, diagnostics, error: 'Server entry missing in config file.' }
      }
      if (srv.command) command = srv.command
      if (Array.isArray(srv.args)) args = srv.args
      if (srv.env) serverEnv = srv.env

      // Check if command is relative node and needs resolution
      if (command === 'node' || !existsSync(command)) {
        const resolved = this.resolveNodeExecutable()
        if (resolved !== 'node') {
          command = resolved
        }
      }

      diagnostics.push({
        step: 'config',
        status: 'ok',
        message: `Valid JSON config detected with command: '${command}'`
      })
    } catch (err) {
      diagnostics.push({ step: 'config', status: 'error', message: `Invalid JSON syntax in config: ${String(err)}` })
      return { success: false, testedAt, diagnostics, error: 'JSON parsing failure.' }
    }

    // Step 2: Binary check
    const targetScript = args[0] || cliPath
    if (existsSync(targetScript)) {
      diagnostics.push({ step: 'runtime', status: 'ok', message: `Entry script exists at ${targetScript}` })
    } else {
      diagnostics.push({ step: 'runtime', status: 'warn', message: `Target script path ${targetScript} cannot be directly verified on disk.` })
    }

    // Step 3: Stdio JSON-RPC Live Handshake Probe
    return new Promise<McpVerificationResultDto>((resolve) => {
      const startTime = performance.now()
      let stdoutBuffer = ''
      let resolved = false
      let toolsDiscovered = 0
      let toolNames: string[] = []
      let serverInfo: { name: string; version: string } | undefined

      const pathEnv = serverEnv.PATH || this.resolveNodePathEnv()

      const child = spawn(command, args, {
        stdio: ['pipe', 'pipe', 'pipe'],
        env: { ...process.env, ...serverEnv, PATH: pathEnv, KANBAN_MCP_PROBE: 'true' }
      })

      const cleanup = (): void => {
        if (!child.killed) {
          try {
            child.stdin.end()
            child.kill('SIGTERM')
          } catch {
            // Ignore
          }
        }
      }

      const timer = setTimeout(() => {
        if (!resolved) {
          resolved = true
          cleanup()
          diagnostics.push({ step: 'handshake', status: 'error', message: 'Timed out waiting for JSON-RPC MCP handshake response (3500ms).' })
          resolve({
            success: false,
            testedAt,
            diagnostics,
            error: 'MCP stdio server handshake timed out.'
          })
        }
      }, 3500)

      child.on('error', (err) => {
        if (!resolved) {
          resolved = true
          clearTimeout(timer)
          cleanup()
          diagnostics.push({ step: 'runtime', status: 'error', message: `Failed to spawn process (${command}): ${err.message}` })
          resolve({
            success: false,
            testedAt,
            diagnostics,
            error: `Process spawn failure: ${err.message}`
          })
        }
      })

      child.stdout.on('data', (chunk: Buffer) => {
        stdoutBuffer += chunk.toString('utf8')
        const lines = stdoutBuffer.split('\n')
        stdoutBuffer = lines.pop() || ''

        for (const line of lines) {
          const trimmed = line.trim()
          if (!trimmed) continue
          try {
            const msg = JSON.parse(trimmed) as {
              id?: number
              result?: {
                serverInfo?: { name: string; version: string }
                tools?: Array<{ name: string }>
                status?: string
              }
            }

            if (msg.id === 1 && msg.result) {
              // Handshake initialize response
              serverInfo = msg.result.serverInfo
              diagnostics.push({
                step: 'handshake',
                status: 'ok',
                message: `Handshake successful with '${serverInfo?.name || 'mcp-server'}' v${serverInfo?.version || '1.0.0'}`
              })

              // Send tools/list request
              child.stdin.write(JSON.stringify({ jsonrpc: '2.0', id: 2, method: 'tools/list', params: {} }) + '\n')
            } else if (msg.id === 2 && msg.result?.tools) {
              // Tool discovery response
              toolNames = msg.result.tools.map((t) => t.name)
              toolsDiscovered = toolNames.length
              diagnostics.push({
                step: 'tools',
                status: 'ok',
                message: `Discovered ${toolsDiscovered} MCP tools: ${toolNames.slice(0, 4).join(', ')}${toolsDiscovered > 4 ? '...' : ''}`
              })

              // Call kanban_ping tool
              child.stdin.write(
                JSON.stringify({
                  jsonrpc: '2.0',
                  id: 3,
                  method: 'tools/call',
                  params: { name: 'kanban_ping', arguments: {} }
                }) + '\n'
              )
            } else if (msg.id === 3 && msg.result) {
              // Ping tool response
              const latencyMs = Math.round(performance.now() - startTime)
              diagnostics.push({
                step: 'database',
                status: 'ok',
                message: `SQLite database online & responsive. Round-trip latency: ${latencyMs}ms`
              })

              if (!resolved) {
                resolved = true
                clearTimeout(timer)
                cleanup()
                resolve({
                  success: true,
                  latencyMs,
                  toolsDiscovered,
                  tools: toolNames,
                  testedAt,
                  serverInfo,
                  diagnostics
                })
              }
            }
          } catch {
            // Non-JSON line ignored
          }
        }
      })

      // Send initial MCP initialize JSON-RPC message
      const initMessage = {
        jsonrpc: '2.0',
        id: 1,
        method: 'initialize',
        params: {
          protocolVersion: '2024-11-05',
          capabilities: {},
          clientInfo: { name: 'kanban-connection-probe', version: '1.0.0' }
        }
      }
      child.stdin.write(JSON.stringify(initMessage) + '\n')
    })
  }
}
