import { useSyncExternalStore } from 'react'
import { toISO } from '../lib/dates'
import person1 from '../assets/calendar/person-1.png'
import person2 from '../assets/calendar/person-2.png'
import person3 from '../assets/calendar/person-3.png'
import person4 from '../assets/calendar/person-4.png'
import person5 from '../assets/calendar/person-5.png'
import person6 from '../assets/calendar/person-6.png'

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
  attendees: string[]
}

export const ATTENDEE_PHOTOS = [person1, person2, person3, person4, person5, person6]

/** Monday of the week containing `d`. */
export function weekStart(d: Date) {
  const day = (d.getDay() + 6) % 7
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() - day)
}

const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n)

// Seeded relative to the current week so the calendar always has something to show.
const monday = weekStart(new Date())
const seed: Meeting[] = [
  { id: 'm1', title: 'Weekly Stand Up', date: toISO(monday), start: '08:00', end: '09:00', app: 'meet', status: 'Scheduled', description: 'Quick sync on yesterday, today and blockers.', attendees: [person1, person2, person3, person4] },
  { id: 'm2', title: 'Sprint Planning', date: toISO(addDays(monday, 1)), start: '09:30', end: '10:30', app: 'calendar', status: 'Scheduled', description: 'Plan the next two-week sprint.', attendees: [person5, person6] },
  { id: 'm3', title: 'Weekly Stand Up', date: toISO(addDays(monday, 2)), start: '10:30', end: '11:30', app: 'meet', status: 'Scheduled', description: 'Quick sync on yesterday, today and blockers.', attendees: [person1, person2, person3, person4] },
  { id: 'm4', title: 'Sprint Planning', date: toISO(addDays(monday, 3)), start: '08:45', end: '09:45', app: 'calendar', status: 'Tentative', description: 'Refine the backlog with product.', attendees: [person5, person6] },
  { id: 'm5', title: 'Weekly Stand Up', date: toISO(addDays(monday, 4)), start: '11:30', end: '12:30', app: 'meet', status: 'Scheduled', description: 'Quick sync on yesterday, today and blockers.', attendees: [person1, person2, person3, person4] },
  { id: 'm6', title: 'Meeting with Arc Company', date: toISO(new Date()), start: '14:00', end: '16:00', app: 'meet', status: 'Scheduled', description: 'Walk Arc through the new checkout flow.', attendees: [person2, person4, person6] },
  { id: 'm7', title: 'Design Review Meeting', date: toISO(addDays(monday, 4)), start: '14:00', end: '15:00', app: 'calendar', status: 'Scheduled', description: 'Review and finalize the homepage and dashboard design with the UI/UX team.', attendees: [person1, person3, person5] },
  { id: 'm8', title: 'Client Retrospective', date: toISO(addDays(monday, -3)), start: '15:00', end: '16:00', app: 'meet', status: 'Scheduled', description: 'What went well on the Primor launch.', attendees: [person2, person3] },
]

let meetings = seed
const listeners = new Set<() => void>()
const emit = () => listeners.forEach((l) => l())

export const meetingsStore = {
  add(m: Omit<Meeting, 'id'>) {
    meetings = [...meetings, { ...m, id: `m${Date.now()}` }]
    emit()
  },
  remove(id: string) {
    meetings = meetings.filter((m) => m.id !== id)
    emit()
  },
}

export function useMeetings() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l)
      return () => listeners.delete(l)
    },
    () => meetings,
  )
}

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

export { addDays }
