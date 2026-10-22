import { createStore, uid } from '../lib/store'

export type NotificationKind = 'comment' | 'assigned' | 'status' | 'meeting' | 'deadline' | 'system' | 'project'

export type AppNotification = {
  id: string
  kind: NotificationKind
  title: string
  body: string
  /** Epoch ms. */
  at: number
  unread: boolean
  /** Where clicking the notification goes. */
  link?: string
}

const minsAgo = (m: number) => Date.now() - m * 60_000

const seed = (): AppNotification[] => [
  {
    id: 'n1', kind: 'comment', unread: true, at: minsAgo(12), link: '/projects?project=p-primor',
    title: 'Ethan Walker commented on “Patient onboarding flow”',
    body: '“Moved the insurance scan to step two — it tested better with older patients.”',
  },
  {
    id: 'n2', kind: 'status', unread: true, at: minsAgo(48), link: '/projects?project=p-primor',
    title: 'Amara Okafor moved a task to In Review',
    body: '“Login bug: OTP code expires too early” is ready for your review.',
  },
  {
    id: 'n3', kind: 'meeting', unread: true, at: minsAgo(95), link: '/calendar',
    title: 'Meeting with Arc Company today at 2:00 PM',
    body: 'Walk Arc through the new checkout flow. 3 attendees have accepted.',
  },
  {
    id: 'n4', kind: 'deadline', unread: false, at: minsAgo(60 * 5), link: '/projects?project=p-atlas',
    title: '“OAuth connection to Atlas” is overdue',
    body: 'It was due 3 days ago. Michael Brown is the assignee.',
  },
  {
    id: 'n5', kind: 'assigned', unread: false, at: minsAgo(60 * 9), link: '/projects?project=p-campaign',
    title: 'Olivia Martinez assigned you a task',
    body: '“Webinar: Planning Q1 with AI” in Q4 Marketing Campaign.',
  },
  {
    id: 'n6', kind: 'system', unread: false, at: minsAgo(60 * 26),
    title: 'Scheduled maintenance on Saturday',
    body: 'Orkiva will be read-only from 02:00 to 03:00 UTC while we upgrade the database.',
  },
]

export const notificationsStore = createStore('notifications', seed)
export const useNotifications = notificationsStore.use

export function notify(n: Omit<AppNotification, 'id' | 'at' | 'unread'>) {
  notificationsStore.set((list) => [{ ...n, id: uid('n'), at: Date.now(), unread: true }, ...list].slice(0, 30))
}

export const markRead = (id: string) =>
  notificationsStore.set((list) => list.map((n) => (n.id === id ? { ...n, unread: false } : n)))

export const markAllRead = () => notificationsStore.set((list) => list.map((n) => ({ ...n, unread: false })))

export const clearNotifications = () => notificationsStore.set([])
