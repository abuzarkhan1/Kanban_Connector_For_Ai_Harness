import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { homedir } from 'node:os'
import type { McpHarnessStatusDto } from '@ipc/contracts/mcpContracts'

export type SupportedHarness = 'antigravity' | 'claude_code' | 'claude_desktop' | 'cursor' | 'windsurf'

export interface HarnessConfigLocation {
  harness: SupportedHarness
  name: string
  path: string
}

export class HarnessConfigManager {
  private getHome(): string {
    return homedir()
  }

  getLocations(): HarnessConfigLocation[] {
    const home = this.getHome()
    const isMac = process.platform === 'darwin'
    const isWindows = process.platform === 'win32'

    let claudeDesktopPath = join(home, '.claude', 'claude_desktop_config.json')
    if (isMac) {
      claudeDesktopPath = join(home, 'Library', 'Application Support', 'Claude', 'claude_desktop_config.json')
    } else if (isWindows) {
      claudeDesktopPath = join(process.env.APPDATA || home, 'Claude', 'claude_desktop_config.json')
    }

    return [
      {
        harness: 'antigravity',
        name: 'Google Antigravity CLI',
        path: join(home, '.gemini', 'config', 'mcp_config.json')
      },
      {
        harness: 'claude_code',
        name: 'Claude Code CLI',
        path: join(home, '.claude.json')
      },
      {
        harness: 'claude_desktop',
        name: 'Claude Desktop',
        path: claudeDesktopPath
      },
      {
        harness: 'cursor',
        name: 'Cursor Editor',
        path: join(home, '.cursor', 'mcp.json')
      },
      {
        harness: 'windsurf',
        name: 'Windsurf Editor',
        path: join(home, '.codeium', 'windsurf', 'mcp_config.json')
      }
    ]
  }

  getStatusList(): McpHarnessStatusDto[] {
    const locations = this.getLocations()
    return locations.map((loc) => {
      const detected = existsSync(dirname(loc.path)) || existsSync(loc.path)
      let configured = false

      if (existsSync(loc.path)) {
        try {
          const content = JSON.parse(readFileSync(loc.path, 'utf8')) as {
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
        harness: loc.harness,
        name: loc.name,
        configPath: loc.path,
        detected,
        configured
      }
    })
  }

  configureHarness(harness: SupportedHarness, cliPath: string): { success: boolean; message: string } {
    const loc = this.getLocations().find((l) => l.harness === harness)
    if (!loc) return { success: false, message: `Unknown harness: ${harness}` }

    try {
      const dir = dirname(loc.path)
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true })
      }

      let config: Record<string, unknown> = {}
      if (existsSync(loc.path)) {
        try {
          config = JSON.parse(readFileSync(loc.path, 'utf8')) as Record<string, unknown>
        } catch {
          config = {}
        }
      }

      const serverKey = 'mcpServers'
      if (!config[serverKey] || typeof config[serverKey] !== 'object') {
        config[serverKey] = {}
      }

      const servers = config[serverKey] as Record<string, unknown>
      servers['kanban'] = {
        command: 'node',
        args: [cliPath]
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
}
