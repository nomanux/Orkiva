import { addDays, toISO } from '../lib/dates'
import { createStore, uid } from '../lib/store'
import { notify } from './notifications'
import { ME } from './people'

export const MEETING_STATUSES = ['Scheduled', 'Tentative', 'Cancelled'] as const
export type MeetingStatus = (typeof MEETING_STATUSES)[number]

export type Meeting = {
  id: string
  title: string
  date: string // yyyy-mm-dd
  start: string // HH:MM, 24h
  end: string
  description: string
  status: MeetingStatus
  /** Which app hosts it: drives the icon on the event card. */
  app: 'meet' | 'calendar'
  /** Person ids from `PEOPLE`. */
  attendeeIds: string[]
  projectId?: string
}

/** Monday of the week containing `d`. */
export function weekStart(d: Date) {
  const day = (d.getDay() + 6) % 7
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() - day)
}

type Row = [title: string, day: number, start: string, end: string, app: Meeting['app'], attendeeIds: string[], description: string, extra?: Partial<Meeting>]

// Seeded relative to the current week (day 0 = Monday) so the calendar always has something to show.
const seed = (): Meeting[] => {
  const monday = weekStart(new Date())
  const today = (new Date().getDay() + 6) % 7
  const rows: Row[] = [
    ['Weekly Stand Up', -7, '09:00', '09:30', 'meet', ['marcus', 'ryan', 'michael', 'amara'], 'Quick sync on yesterday, today and blockers.'],
    ['Primor sprint review', -5, '15:00', '16:00', 'meet', ['marcus', 'ethan', 'ryan', ME], 'Demo the booking flow to Primor’s product team.', { projectId: 'p-primor' }],
    ['Client retrospective', -3, '15:00', '16:00', 'meet', ['daniel', 'nina', ME], 'What went well on the Sulivan homepage launch.', { projectId: 'p-sulivan' }],
    ['Weekly Stand Up', 0, '08:00', '09:00', 'meet', ['marcus', 'ryan', 'michael', 'amara'], 'Quick sync on yesterday, today and blockers.'],
    ['Sprint Planning', 1, '09:30', '10:30', 'calendar', ['daniel', 'michael', 'ryan'], 'Plan the next two-week sprint for the analytics dashboard.', { projectId: 'p-analytics' }],
    ['Brand review with Trustworth', 1, '13:00', '14:00', 'meet', ['ethan', 'leila', 'olivia'], 'Present logo round 2 and the new colour system.', { projectId: 'p-trustworth' }],
    ['Weekly Stand Up', 2, '10:30', '11:30', 'meet', ['marcus', 'ryan', 'michael', 'amara'], 'Quick sync on yesterday, today and blockers.'],
    ['Backlog refinement', 3, '08:45', '09:45', 'calendar', ['marcus', 'amara'], 'Refine the Primor backlog with product.', { status: 'Tentative', projectId: 'p-primor' }],
    ['Meeting with Arc Company', today, '14:00', '16:00', 'meet', ['olivia', 'michael', ME], 'Walk Arc through the new checkout flow.'],
    ['Weekly Stand Up', 4, '11:30', '12:30', 'meet', ['marcus', 'ryan', 'michael', 'amara'], 'Quick sync on yesterday, today and blockers.'],
    ['Design Review Meeting', 4, '14:00', '15:00', 'calendar', ['ethan', 'leila', 'sarah'], 'Review and finalise the homepage and dashboard designs with the UI/UX team.', { projectId: 'p-analytics' }],
    ['Atlas API check-in', 4, '16:00', '16:30', 'meet', ['michael', ME], 'Check if Atlas has shipped the v3 API. Cancelled: no update yet.', { status: 'Cancelled', projectId: 'p-atlas' }],
    ['Weekly Stand Up', 7, '09:00', '09:30', 'meet', ['marcus', 'ryan', 'michael', 'amara'], 'Quick sync on yesterday, today and blockers.'],
    ['YellyBox onboarding workshop', 8, '10:00', '12:00', 'meet', ['sarah', 'leila', 'arjun'], 'Map the first-order journey with YellyBox’s growth team.', { projectId: 'p-yellybox' }],
    ['Campaign creative review', 9, '15:00', '16:00', 'calendar', ['olivia', 'nina', ME], 'Pick the final ad creatives for launch week.', { projectId: 'p-campaign' }],
    ['1:1 with Marcus', 10, '11:00', '11:30', 'calendar', ['marcus', ME], 'Delivery risks and hiring plan.', { status: 'Tentative' }],
  ]
  return rows.map(([title, day, start, end, app, attendeeIds, description, extra], i) => ({
    id: `m${i + 1}`,
    title,
    date: toISO(addDays(monday, day)),
    start,
    end,
    app,
    attendeeIds,
    description,
    status: 'Scheduled',
    ...extra,
  }))
}

const store = createStore('meetings', seed)

export const meetingsStore = {
  get: store.get,
  add(m: Omit<Meeting, 'id'>) {
    store.set((list) => [...list, { ...m, id: uid('m') }])
    notify({ kind: 'meeting', title: `Meeting scheduled: ${m.title}`, body: `${m.date} at ${formatTime(m.start)} with ${m.attendeeIds.length} attendees.`, link: '/meetings' })
  },
  remove(id: string) {
    store.set((list) => list.filter((m) => m.id !== id))
  },
  update(id: string, patch: Partial<Meeting>) {
    store.set((list) => list.map((m) => (m.id === id ? { ...m, ...patch } : m)))
  },
}

export const useMeetings = store.use

/** "14:00" → minutes since midnight. */
export const minutes = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

/** "14:00" → "2:00 PM"; drops ":00" when `short`. */
export function formatTime(hhmm: string, short = false) {
  const [h, m] = hhmm.split(':').map(Number)
  const suffix = h >= 12 ? 'PM' : 'AM'
  const hour = h % 12 || 12
  return short && m === 0 ? `${hour} ${suffix}` : `${hour}:${String(m).padStart(2, '0')} ${suffix}`
}

/** Live while it's on, upcoming before, ended after — relative to `now`. */
export function meetingState(m: Meeting, now = new Date()): 'live' | 'upcoming' | 'ended' {
  const today = toISO(now)
  if (m.date > today) return 'upcoming'
  if (m.date < today) return 'ended'
  const t = now.getHours() * 60 + now.getMinutes()
  if (t < minutes(m.start) - 10) return 'upcoming'
  if (t > minutes(m.end)) return 'ended'
  return 'live'
}

/** The meeting happening now, or else the next one that isn't cancelled. */
export function nextMeeting(list: Meeting[], now = new Date()) {
  const open = [...list].filter((m) => m.status !== 'Cancelled').sort((a, b) => `${a.date} ${a.start}`.localeCompare(`${b.date} ${b.start}`))
  return open.find((m) => meetingState(m, now) === 'live') ?? open.find((m) => meetingState(m, now) === 'upcoming')
}

export { addDays }
