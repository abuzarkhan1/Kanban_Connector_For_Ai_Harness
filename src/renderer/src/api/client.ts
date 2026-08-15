import type { RendererApi } from '../../../preload/api'
import type { IpcResult } from '@ipc'

export class ApiError extends Error {
  readonly code: string

  constructor(code: string, message: string) {
    super(message)
    this.name = 'ApiError'
    this.code = code
  }
}

/**
 * Unwrap an IpcResult into data or throw a typed ApiError.
 * The store catches ApiError to surface structured error messages.
 */
export function unwrap<T>(result: IpcResult<T>): T {
  if (result.ok) return result.data
  throw new ApiError(result.error.code, result.error.message)
}

/** The bridge is injected by the preload script; it exists before React mounts. */
export const api: RendererApi = window.api
