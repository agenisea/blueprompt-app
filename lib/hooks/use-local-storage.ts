'use client'

import { useCallback, useSyncExternalStore, useRef } from 'react'

export function useLocalStorage<T>(key: string, defaultValue: T) {
  // Cache the parsed value to avoid infinite loops
  const cachedValue = useRef<T>(defaultValue)
  const cachedKey = useRef<string | null>(null)

  const getSnapshot = useCallback(() => {
    const stored = localStorage.getItem(key)
    const storageKey = `${key}:${stored}`

    // Only re-parse if the storage content changed
    if (cachedKey.current !== storageKey) {
      cachedKey.current = storageKey
      try {
        cachedValue.current = stored ? JSON.parse(stored) : defaultValue
      } catch {
        cachedValue.current = defaultValue
      }
    }

    return cachedValue.current
  }, [key, defaultValue])

  const getServerSnapshot = useCallback(() => defaultValue, [defaultValue])

  const subscribe = useCallback(
    (callback: () => void) => {
      const handleStorage = (e: StorageEvent) => {
        if (e.key === key || e.key === null) callback()
      }
      window.addEventListener('storage', handleStorage)
      return () => window.removeEventListener('storage', handleStorage)
    },
    [key]
  )

  const value = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const setValue = useCallback(
    (newValue: T | ((prev: T) => T)) => {
      const current = cachedValue.current
      const valueToStore = newValue instanceof Function ? newValue(current) : newValue
      cachedValue.current = valueToStore
      cachedKey.current = null // Invalidate cache
      try {
        localStorage.setItem(key, JSON.stringify(valueToStore))
        window.dispatchEvent(new StorageEvent('storage', { key }))
      } catch {
        // Storage might be full or disabled
      }
    },
    [key]
  )

  const clear = useCallback(() => {
    try {
      localStorage.removeItem(key)
    } catch {
      // Ignore errors
    }
  }, [key])

  return [value, setValue, clear] as const
}
