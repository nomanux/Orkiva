import { addDays, daysUntil, fromISO, toISO } from '../lib/dates'
import { weekStart } from './meetingsStore'
import type { Project, Task } from './projects'

/** Derived numbers for the dashboard and AI assistant. Everything is computed from the live stores. */

export const isOpen = (t: Task) => t.status !== 'Done'
export const isOverdue = (t: Task) => isOpen(t) && !!t.dueDate && daysUntil(t.dueDate) < 0
export const isDueWithin = (t: Task, days: number) => isOpen(t) && !!t.dueDate && daysUntil(t.dueDate) >= 0 && daysUntil(t.dueDate) <= days

export function taskTotals(tasks: Task[]) {
  const done = tasks.filter((t) => t.status === 'Done').length
  return {
    total: tasks.length,
    pending: tasks.length - done,
    done,
    dueToday: tasks.filter((t) => isOpen(t) && t.dueDate === toISO(new Date())).length,
    overdue: tasks.filter(isOverdue).length,
  }
}

export const percent = (part: number, whole: number) => (whole ? Math.round((part / whole) * 100) : 0)

export function projectProgress(projectId: string, tasks: Task[]) {
  const own = tasks.filter((t) => t.projectId === projectId)
  return percent(own.filter((t) => t.status === 'Done').length, own.length)
}

export type Period = 'week' | 'month' | 'year'

/** Inclusive ISO range of the current week, month or year. */
export function periodRange(period: Period, offset = 0, now = new Date()) {
  if (period === 'week') {
    const start = addDays(weekStart(now), offset * 7)
    return [toISO(start), toISO(addDays(start, 6))] as const
  }
  if (period === 'month') {
    const start = new Date(now.getFullYear(), now.getMonth() + offset, 1)
    return [toISO(start), toISO(new Date(start.getFullYear(), start.getMonth() + 1, 0))] as const
  }
  return [`${now.getFullYear() + offset}-01-01`, `${now.getFullYear() + offset}-12-31`] as const
}

const inRange = (iso: string | undefined, [a, b]: readonly [string, string]) => !!iso && iso >= a && iso <= b

export function periodStats(period: Period, tasks: Task[]) {
  const current = periodRange(period)
  const previous = periodRange(period, -1)
  const due = tasks.filter((t) => inRange(t.dueDate, current))
  const completedNow = tasks.filter((t) => inRange(t.completedAt, current)).length
  const completedBefore = tasks.filter((t) => inRange(t.completedAt, previous)).length
  return {
    projects: new Set(due.map((t) => t.projectId)).size,
    done: due.filter((t) => t.status === 'Done').length,
    active: due.filter((t) => t.status === 'In Progress' || t.status === 'In Review').length,
    todo: due.filter((t) => t.status === 'Todo').length,
    /** Change in tasks completed vs the previous period. */
    change: completedBefore ? Math.round(((completedNow - completedBefore) / completedBefore) * 1000) / 10 : completedNow ? 100 : 0,
  }
}

export type Bucket = { label: string; total: number; done: number; current: boolean }

/** Tasks due per day (week), per week (month) or per month (last 6 months). */
export function overview(period: Period, tasks: Task[], now = new Date()): Bucket[] {
  const today = toISO(now)
  let ranges: { label: string; from: string; to: string }[]
  if (period === 'week') {
    const monday = weekStart(now)
    ranges = Array.from({ length: 7 }, (_, i) => {
      const day = addDays(monday, i)
      return { label: day.toLocaleDateString('en-US', { weekday: 'short' }), from: toISO(day), to: toISO(day) }
    })
  } else if (period === 'month') {
    const first = new Date(now.getFullYear(), now.getMonth(), 1)
    const last = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    ranges = []
    for (let start = first, n = 1; start <= last; start = addDays(start, 7), n++) {
      const end = addDays(start, 6) > last ? last : addDays(start, 6)
      ranges.push({ label: `Wk ${n}`, from: toISO(start), to: toISO(end) })
    }
  } else {
    ranges = Array.from({ length: 6 }, (_, i) => {
      const start = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1)
      const end = new Date(start.getFullYear(), start.getMonth() + 1, 0)
      return { label: start.toLocaleDateString('en-US', { month: 'short' }), from: toISO(start), to: toISO(end) }
    })
  }
  return ranges.map(({ label, from, to }) => {
    const due = tasks.filter((t) => t.dueDate && t.dueDate >= from && t.dueDate <= to)
    return { label, total: due.length, done: due.filter((t) => t.status === 'Done').length, current: today >= from && today <= to }
  })
}

/** Active projects ranked by how many open tasks are due in the next `days` days. */
export function dueSoon(projects: Project[], tasks: Task[], days = 7) {
  return projects
    .filter((p) => p.status !== 'Completed')
    .map((p) => ({ project: p, due: tasks.filter((t) => t.projectId === p.id && (isDueWithin(t, days) || isOverdue(t))).length }))
    .filter((x) => x.due > 0)
    .sort((a, b) => b.due - a.due)
}

/** Most urgent open tasks first: overdue, then by due date, then priority. */
const PRIORITY_RANK = { Urgent: 0, High: 1, Medium: 2, Low: 3 }
export function upcomingTasks(tasks: Task[]) {
  return tasks
    .filter(isOpen)
    .sort((a, b) => (a.dueDate ?? '9999').localeCompare(b.dueDate ?? '9999') || PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority])
}

/** Pretend file size from a name, stable between renders. */
export function fileSize(name: string) {
  const kb = ([...name].reduce((sum, c) => sum + c.charCodeAt(0), 0) * 37) % 4800 + 18
  return kb > 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb} KB`
}

export const monthName = (iso: string) => fromISO(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

export type Health = 'On track' | 'Behind' | 'At risk' | 'Done'

/**
 * Compares a project's completed share with how much of its timeline has passed.
 * More than 10 points behind schedule (or anything overdue) is "Behind"; 25 points or several overdue tasks is "At risk".
 */
export function projectHealth(project: Project, tasks: Task[]) {
  const own = tasks.filter((t) => t.projectId === project.id)
  const progress = percent(own.filter((t) => t.status === 'Done').length, own.length)
  const overdue = own.filter(isOverdue).length
  let expected = 0
  if (project.startDate && project.endDate) {
    const span = daysUntil(project.endDate) - daysUntil(project.startDate)
    expected = span > 0 ? Math.min(100, Math.max(0, Math.round((-daysUntil(project.startDate) / span) * 100))) : 100
  }
  const gap = expected - progress
  const health: Health =
    project.status === 'Completed' || (own.length > 0 && progress === 100)
      ? 'Done'
      : overdue > 1 || gap > 25
        ? 'At risk'
        : overdue > 0 || gap > 10
          ? 'Behind'
          : 'On track'
  return { progress, expected, overdue, open: own.filter(isOpen).length, total: own.length, health }
}

/** Open tasks per person, busiest first. */
export function workload(tasks: Task[]) {
  const byPerson = new Map<string, { open: number; overdue: number; dueSoon: number }>()
  for (const t of tasks.filter(isOpen)) {
    for (const id of t.memberIds) {
      const w = byPerson.get(id) ?? { open: 0, overdue: 0, dueSoon: 0 }
      w.open++
      if (isOverdue(t)) w.overdue++
      else if (isDueWithin(t, 7)) w.dueSoon++
      byPerson.set(id, w)
    }
  }
  return [...byPerson].map(([personId, w]) => ({ personId, ...w })).sort((a, b) => b.open - a.open || b.overdue - a.overdue)
}

export type Activity = { id: string; kind: 'completed' | 'created'; date: string; task: Task }

/** Latest task completions and additions, newest first (completions win ties). */
export function recentActivity(tasks: Task[], limit = 6): Activity[] {
  const events: Activity[] = tasks.flatMap((t) => [
    ...(t.completedAt ? [{ id: `${t.id}-done`, kind: 'completed' as const, date: t.completedAt, task: t }] : []),
    { id: `${t.id}-new`, kind: 'created' as const, date: t.createdAt, task: t },
  ])
  return events
    .filter((e) => e.date <= toISO(new Date()))
    .sort((a, b) => b.date.localeCompare(a.date) || (a.kind === 'completed' ? -1 : 1))
    .slice(0, limit)
}

/** Share of finished tasks that were completed on or before their due date. */
export function onTimeRate(tasks: Task[]) {
  const done = tasks.filter((t) => t.status === 'Done' && t.completedAt && t.dueDate)
  return percent(done.filter((t) => t.completedAt! <= t.dueDate!).length, done.length)
}
