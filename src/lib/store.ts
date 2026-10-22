import { useSyncExternalStore } from 'react'

/** Bump when seed data changes shape so old saved copies are discarded. */
const VERSION = 'v2'
const PREFIX = `orkiva:${VERSION}:`
const resets = new Set<() => void>()

function load<T>(key: string, fallback: () => T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    if (raw) return JSON.parse(raw) as T
  } catch {
    // Private mode or corrupted entry: fall back to the seed.
  }
  return fallback()
}

/**
 * A tiny global store saved to localStorage. Every page reads the same instance,
 * so a task created on the board shows up on the dashboard, in search and so on.
 */
export function createStore<T>(key: string, seed: () => T) {
  let state = load(key, seed)
  const listeners = new Set<() => void>()

  const set = (next: T | ((prev: T) => T)) => {
    state = typeof next === 'function' ? (next as (prev: T) => T)(state) : next
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(state))
    } catch {
      // Storage full or blocked: keep working in memory.
    }
    listeners.forEach((l) => l())
  }

  const subscribe = (l: () => void) => {
    listeners.add(l)
    return () => listeners.delete(l)
  }

  resets.add(() => {
    try {
      localStorage.removeItem(PREFIX + key)
    } catch {
      // ignore
    }
    state = seed()
    listeners.forEach((l) => l())
  })

  return {
    get: () => state,
    set,
    subscribe,
    use: () => useSyncExternalStore(subscribe, () => state),
  }
}

/** Restores every store to its seed data. */
export function resetAllStores() {
  resets.forEach((r) => r())
}

let counter = 0
export const uid = (prefix: string) => `${prefix}-${Date.now().toString(36)}${(counter++).toString(36)}`
