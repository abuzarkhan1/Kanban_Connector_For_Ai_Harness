/**
 * All IPC handlers return a discriminated result envelope instead of relying
 * on thrown-error serialization, which is lossy across the Electron bridge.
 */

export interface IpcError {
  code: string
  message: string
}

export type IpcResult<T> = { ok: true; data: T } | { ok: false; error: IpcError }

export const IPC_ERROR_CODES = {
  VALIDATION: 'IPC_VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  INVALID_TRANSITION: 'INVALID_TRANSITION',
  INTERNAL: 'INTERNAL_ERROR'
} as const

export function ok<T>(data: T): IpcResult<T> {
  return { ok: true, data }
}

export function fail(code: string, message: string): IpcResult<never> {
  return { ok: false, error: { code, message } }
}
