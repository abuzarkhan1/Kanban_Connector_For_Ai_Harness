import chokidar, { type FSWatcher } from 'chokidar'
import type { ObservedEvent } from '@domain/entities/ObservedEvent'
import { createObservedEvent } from '@domain/entities/ObservedEvent'

export type EventListener = (event: ObservedEvent) => void

const IGNORED_PATTERNS = [
  /(^|[/\\])\../, // dotfiles/dotdirs
  '**/node_modules/**',
  '**/.git/**',
  '**/dist/**',
  '**/build/**',
  '**/out/**',
  '**/.cache/**',
  '**/target/**',
  '**/vendor/**',
  '**/*.lock',
  '**/package-lock.json',
  '**/pnpm-lock.yaml',
  '**/yarn.lock',
  '**/.DS_Store'
]

export class FilesystemWatcher {
  private watchers = new Map<string, FSWatcher>()
  private debounceTimers = new Map<string, NodeJS.Timeout>()
  private listeners: EventListener[] = []

  onEvent(listener: EventListener): () => void {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener)
    }
  }

  watchRepository(repoId: string, projectId: string, repoPath: string): void {
    if (this.watchers.has(repoId)) return

    try {
      const watcher = chokidar.watch(repoPath, {
        ignored: IGNORED_PATTERNS,
        persistent: true,
        ignoreInitial: true,
        awaitWriteFinish: {
          stabilityThreshold: 300,
          pollInterval: 100
        }
      })

      const handleFsChange = (type: 'FILE_CREATED' | 'FILE_MODIFIED' | 'FILE_DELETED', filepath: string): void => {
        const key = `${repoId}:${type}:${filepath}`
        const existingTimer = this.debounceTimers.get(key)
        if (existingTimer) clearTimeout(existingTimer)

        const timer = setTimeout(() => {
          this.debounceTimers.delete(key)
          const event = createObservedEvent({
            source: 'filesystem-watcher',
            category: 'filesystem',
            type,
            projectId,
            repositoryId: repoId,
            payload: { filepath, repoPath }
          })
          this.emit(event)
        }, 400)

        this.debounceTimers.set(key, timer)
      }

      watcher.on('add', (path) => handleFsChange('FILE_CREATED', path))
      watcher.on('change', (path) => handleFsChange('FILE_MODIFIED', path))
      watcher.on('unlink', (path) => handleFsChange('FILE_DELETED', path))

      this.watchers.set(repoId, watcher)
    } catch {
      // Degraded watch mode
    }
  }

  unwatchRepository(repoId: string): void {
    const watcher = this.watchers.get(repoId)
    if (watcher) {
      void watcher.close()
      this.watchers.delete(repoId)
    }
  }

  closeAll(): void {
    for (const [id, watcher] of this.watchers.entries()) {
      void watcher.close()
      this.watchers.delete(id)
    }
    for (const timer of this.debounceTimers.values()) {
      clearTimeout(timer)
    }
    this.debounceTimers.clear()
  }

  activeWatchersCount(): number {
    return this.watchers.size
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
