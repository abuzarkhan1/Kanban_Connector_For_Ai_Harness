import type { HarnessType } from '@domain/entities/Agent'
import type { ObservedEvent } from '@domain/entities/ObservedEvent'
import type { DiscoveredProcess } from '../watchers/processWatcher'

export interface HarnessCapabilities {
  level: 0 | 1 | 2 | 3
  supportsMcp: boolean
  supportsPty: boolean
  supportsHooks: boolean
}

export interface HarnessAdapter {
  readonly id: string
  readonly type: HarnessType
  readonly name: string
  detect(process: DiscoveredProcess): boolean
  capabilities(): HarnessCapabilities
  normalize(rawEvent: unknown): ObservedEvent | null
}

export class AntigravityAdapter implements HarnessAdapter {
  readonly id = 'antigravity-adapter'
  readonly type: HarnessType = 'antigravity'
  readonly name = 'Google Antigravity CLI (agy)'

  detect(process: DiscoveredProcess): boolean {
    return process.harnessType === 'antigravity'
  }

  capabilities(): HarnessCapabilities {
    return {
      level: 3,
      supportsMcp: true,
      supportsPty: true,
      supportsHooks: true
    }
  }

  normalize(_rawEvent: unknown): ObservedEvent | null {
    return null
  }
}

export class ClaudeCodeAdapter implements HarnessAdapter {
  readonly id = 'claude-code-adapter'
  readonly type: HarnessType = 'claude_code'
  readonly name = 'Claude Code'

  detect(process: DiscoveredProcess): boolean {
    return process.harnessType === 'claude_code'
  }

  capabilities(): HarnessCapabilities {
    return {
      level: 3,
      supportsMcp: true,
      supportsPty: true,
      supportsHooks: false
    }
  }

  normalize(_rawEvent: unknown): ObservedEvent | null {
    return null
  }
}

export class GenericHarnessAdapter implements HarnessAdapter {
  constructor(
    readonly id: string,
    readonly type: HarnessType,
    readonly name: string
  ) {}

  detect(process: DiscoveredProcess): boolean {
    return process.harnessType === this.type
  }

  capabilities(): HarnessCapabilities {
    return {
      level: 1,
      supportsMcp: true,
      supportsPty: false,
      supportsHooks: false
    }
  }

  normalize(_rawEvent: unknown): ObservedEvent | null {
    return null
  }
}

export class AdapterRegistry {
  private adapters = new Map<HarnessType, HarnessAdapter>()

  constructor() {
    this.register(new AntigravityAdapter())
    this.register(new ClaudeCodeAdapter())
    this.register(new GenericHarnessAdapter('codex-adapter', 'codex', 'Codex CLI'))
    this.register(new GenericHarnessAdapter('aider-adapter', 'aider', 'Aider'))
    this.register(new GenericHarnessAdapter('opencode-adapter', 'opencode', 'OpenCode'))
    this.register(new GenericHarnessAdapter('gemini-adapter', 'gemini', 'Gemini CLI'))
    this.register(new GenericHarnessAdapter('cursor-adapter', 'cursor', 'Cursor Agent'))
    this.register(new GenericHarnessAdapter('windsurf-adapter', 'windsurf', 'Windsurf Cascade'))
    this.register(new GenericHarnessAdapter('generic-adapter', 'generic', 'Generic Harness'))
  }

  register(adapter: HarnessAdapter): void {
    this.adapters.set(adapter.type, adapter)
  }

  get(type: HarnessType): HarnessAdapter | undefined {
    return this.adapters.get(type)
  }

  findForProcess(proc: DiscoveredProcess): HarnessAdapter | undefined {
    if (!proc.harnessType) return undefined
    return this.adapters.get(proc.harnessType)
  }

  list(): HarnessAdapter[] {
    return Array.from(this.adapters.values())
  }
}
