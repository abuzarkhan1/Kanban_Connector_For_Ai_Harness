import { exec } from 'node:child_process'
import { promisify } from 'node:util'
import type { ObservedEvent } from '@domain/entities/ObservedEvent'
import { createObservedEvent } from '@domain/entities/ObservedEvent'
import type { HarnessType } from '@domain/entities/Agent'

const execAsync = promisify(exec)

export interface DiscoveredProcess {
  pid: number
  ppid: number
  command: string
  harnessType?: HarnessType
  isTestRunner?: boolean
}

export type ProcessEventListener = (event: ObservedEvent) => void

const HARNESS_PATTERNS: Array<{ type: HarnessType; regex: RegExp }> = [
  { type: 'antigravity', regex: /\b(agy|antigravity)\b/i },
  { type: 'claude_code', regex: /\bclaude\b/i },
  { type: 'codex', regex: /\bcodex\b/i },
  { type: 'aider', regex: /\baider\b/i },
  { type: 'opencode', regex: /\bopencode\b/i },
  { type: 'gemini', regex: /\bgemini\b/i },
  { type: 'cursor', regex: /\bCursor\.app\b|\bcursor-server\b/i },
  { type: 'windsurf', regex: /\bWindsurf\.app\b|\bcodeium\b/i }
]

const TEST_PATTERNS = [
  /\bvitest\b/i,
  /\bjest\b/i,
  /\bpytest\b/i,
  /\bcargo\s+test\b/i,
  /\bgo\s+test\b/i,
  /\bnpm\s+(run\s+)?test\b/i
]

export class ProcessWatcher {
  private timer: NodeJS.Timeout | null = null
  private knownPids = new Map<number, DiscoveredProcess>()
  private listeners: ProcessEventListener[] = []
  private isScanning = false

  onEvent(listener: ProcessEventListener): () => void {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener)
    }
  }

  start(intervalMs: number = 4000): void {
    if (this.timer) return
    void this.scan()
    this.timer = setInterval(() => void this.scan(), intervalMs)
  }

  stop(): void {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
    this.knownPids.clear()
  }

  async scan(): Promise<DiscoveredProcess[]> {
    if (this.isScanning) return Array.from(this.knownPids.values())
    this.isScanning = true

    try {
      const currentProcesses = await this.listProcesses()
      const currentPidMap = new Map<number, DiscoveredProcess>()

      for (const proc of currentProcesses) {
        currentPidMap.set(proc.pid, proc)

        // If new process
        if (!this.knownPids.has(proc.pid)) {
          if (proc.harnessType) {
            this.emit(
              createObservedEvent({
                source: 'process-watcher',
                category: 'harness',
                type: 'HARNESS_DETECTED',
                processId: proc.pid,
                payload: {
                  harnessType: proc.harnessType,
                  command: proc.command,
                  pid: proc.pid,
                  ppid: proc.ppid
                }
              })
            )
          }

          if (proc.isTestRunner) {
            this.emit(
              createObservedEvent({
                source: 'process-watcher',
                category: 'test',
                type: 'TEST_STARTED',
                processId: proc.pid,
                payload: {
                  command: proc.command,
                  pid: proc.pid
                }
              })
            )
          }
        }
      }

      // Check exited processes
      for (const [pid, proc] of this.knownPids.entries()) {
        if (!currentPidMap.has(pid)) {
          if (proc.harnessType) {
            this.emit(
              createObservedEvent({
                source: 'process-watcher',
                category: 'harness',
                type: 'HARNESS_SESSION_ENDED',
                processId: pid,
                payload: {
                  harnessType: proc.harnessType,
                  pid
                }
              })
            )
          }

          if (proc.isTestRunner) {
            this.emit(
              createObservedEvent({
                source: 'process-watcher',
                category: 'test',
                type: 'TEST_PASSED',
                processId: pid,
                payload: {
                  command: proc.command,
                  pid
                }
              })
            )
          }
        }
      }

      this.knownPids = currentPidMap
      return currentProcesses
    } catch {
      return []
    } finally {
      this.isScanning = false
    }
  }

  private async listProcesses(): Promise<DiscoveredProcess[]> {
    const isWindows = process.platform === 'win32'
    const cmd = isWindows
      ? 'wmic process get ProcessId,ParentProcessId,CommandLine /format:csv'
      : 'ps -ax -o pid=,ppid=,command='

    try {
      const { stdout } = await execAsync(cmd, { timeout: 3000 })
      return this.parseProcessOutput(stdout, isWindows)
    } catch {
      return []
    }
  }

  private parseProcessOutput(stdout: string, isWindows: boolean): DiscoveredProcess[] {
    const results: DiscoveredProcess[] = []
    const lines = stdout.split('\n')

    for (const rawLine of lines) {
      const line = rawLine.trim()
      if (!line) continue

      let pid = 0
      let ppid = 0
      let command = ''

      if (isWindows) {
        const parts = line.split(',')
        if (parts.length >= 3) {
          command = parts[1] || ''
          ppid = parseInt(parts[2] || '0', 10)
          pid = parseInt(parts[3] || '0', 10)
        }
      } else {
        const match = line.match(/^(\d+)\s+(\d+)\s+(.*)$/)
        if (match) {
          pid = parseInt(match[1] || '0', 10)
          ppid = parseInt(match[2] || '0', 10)
          command = match[3] || ''
        }
      }

      if (!pid || !command) continue

      // Identify harness
      let harnessType: HarnessType | undefined
      for (const pattern of HARNESS_PATTERNS) {
        if (pattern.regex.test(command)) {
          harnessType = pattern.type
          break
        }
      }

      // Identify test runner
      let isTestRunner = false
      for (const pattern of TEST_PATTERNS) {
        if (pattern.test(command)) {
          isTestRunner = true
          break
        }
      }

      if (harnessType || isTestRunner) {
        results.push({ pid, ppid, command, harnessType, isTestRunner })
      }
    }

    return results
  }

  private emit(event: ObservedEvent): void {
    for (const listener of this.listeners) {
      try {
        listener(event)
      } catch {
        // Safe dispatch
      }
    }
  }
}
