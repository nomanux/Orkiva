import { createStore } from '../lib/store'

export type Profile = { name: string; email: string; phone: string; company: string }

export const DEMO_EMAIL = 'james@orkiva.io'
export const DEMO_PASSWORD = 'orkiva123'

const DEFAULT_PROFILE: Profile = { name: 'James Anderson', email: DEMO_EMAIL, phone: '+1 (212) 555 4567', company: 'Orkiva' }

/** Demo auth: everything lives in localStorage, nothing is sent anywhere. */
const store = createStore('session', () => ({ signedIn: false, profile: DEFAULT_PROFILE }))

export const useSession = store.use
export const getSession = store.get

export function signIn(email: string) {
  store.set((s) => ({ signedIn: true, profile: email === s.profile.email ? s.profile : { ...s.profile, email } }))
}

export function signUp(name: string, email: string, phone: string) {
  store.set({ signedIn: true, profile: { ...DEFAULT_PROFILE, name, email, phone: phone || DEFAULT_PROFILE.phone } })
}

export const signOut = () => store.set((s) => ({ ...s, signedIn: false }))

export const updateProfile = (patch: Partial<Profile>) => store.set((s) => ({ ...s, profile: { ...s.profile, ...patch } }))

/** "James Anderson" → "James A." */
export const shortName = (name: string) => {
  const [first, ...rest] = name.trim().split(/\s+/)
  return rest.length ? `${first} ${rest[rest.length - 1][0]}.` : first
}

export const firstName = (name: string) => name.trim().split(/\s+/)[0]
