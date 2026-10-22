import { createContext, useContext } from 'react'
import { createStore } from '../../lib/store'

/** Saved values per settings section, keyed by input `name`. */
export const settingsStore = createStore<Record<string, Record<string, string>>>('settings', () => ({}))

/** Values saved for the section currently on screen. */
export const SavedSettings = createContext<Record<string, string>>({})

/** Saved value for a named field, or the design's default. */
export function useSaved(name: string | undefined, fallback?: string) {
  const saved = useContext(SavedSettings)
  return name && name in saved ? saved[name] : fallback
}
