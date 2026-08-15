import { useCallback, useState } from 'react'

/**
 * useState that persists to localStorage. Safe to use in both the Electron
 * renderer and the browser preview; failures degrade to in-memory state.
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw !== null ? (JSON.parse(raw) as T) : initialValue
    } catch {
      return initialValue
    }
  })

  const set = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved = typeof next === 'function' ? (next as (p: T) => T)(prev) : next
        try {
          localStorage.setItem(key, JSON.stringify(resolved))
        } catch {
          // Storage unavailable (private mode, quota) — keep in-memory state.
        }
        return resolved
      })
    },
    [key]
  )

  return [value, set]
}
