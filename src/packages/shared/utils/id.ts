/**
 * Framework-neutral identifier creation.
 *
 * Uses the Web Crypto API (available in Node >= 19 and all modern browsers),
 * so this utility stays usable from both the renderer and the main process
 * without importing any Node- or Electron-specific module.
 */
export function createId(): string {
  return globalThis.crypto.randomUUID()
}
