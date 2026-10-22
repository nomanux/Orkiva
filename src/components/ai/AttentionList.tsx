import { useState } from 'react'
import { Link } from 'react-router'
import { Toast } from '../ui/Toast'
import { useToast } from '../../hooks/useToast'
import { moveTask, updateTask, useProjects, useTasks } from '../../data/projects'
import { meetingState, nextMeeting, formatTime, useMeetings } from '../../data/meetingsStore'
import { personById } from '../../data/people'
import { isOverdue, projectHealth, workload } from '../../data/insights'
import { daysFromToday, daysUntil, toISO } from '../../lib/dates'

type Action = { label: string; run?: () => void; to?: string; primary?: boolean }
type Item = { key: string; tone: 'alert' | 'warn' | 'info'; title: string; detail: string; actions: Action[] }

const TONE = { alert: 'bg-error', warn: 'bg-gs-300', info: 'bg-primary' }
const SHOWN = 4

type AttentionListProps = { projectId: string | null; onAsk: (prompt: string) => void }

/** Things worth acting on now, worked out from the live data, each with one-click fixes. */
export function AttentionList({ projectId, onAsk }: AttentionListProps) {
  const toast = useToast()
  const [today] = useState(() => toISO(new Date()))
  const projects = useProjects()
  const allTasks = useTasks()
  const tasks = projectId ? allTasks.filter((t) => t.projectId === projectId) : allTasks
  const meetings = useMeetings()
  const name = (id: string) => projects.find((p) => p.id === id)?.name ?? ''

  const items: Item[] = []

  for (const t of tasks.filter(isOverdue).sort((a, b) => a.dueDate!.localeCompare(b.dueDate!))) {
    const late = -daysUntil(t.dueDate!)
    items.push({
      key: `late-${t.id}`,
      tone: 'alert',
      title: `“${t.title}” is ${late} day${late === 1 ? '' : 's'} overdue`,
      detail: `${name(t.projectId)} · ${personById(t.memberIds[0] ?? '')?.name ?? 'Unassigned'} · ${t.progress}% done`,
      actions: [
        { label: 'Mark done', primary: true, run: () => (moveTask(t.id, 'Done'), toast.show(`“${t.title}” marked as done`)) },
        { label: 'Give 3 more days', run: () => (updateTask(t.id, { dueDate: daysFromToday(3) }), toast.show(`“${t.title}” is now due in 3 days`)) },
        { label: 'Open board', to: `/projects?project=${t.projectId}` },
      ],
    })
  }

  for (const p of projects.filter((p) => p.status === 'Active' && (!projectId || p.id === projectId))) {
    const h = projectHealth(p, allTasks)
    // Across all projects only the worst are listed; a focused project also flags "Behind"
    if (h.health !== 'At risk' && !(projectId && h.health === 'Behind')) continue
    items.push({
      key: `risk-${p.id}`,
      tone: 'warn',
      title: `${p.name} is ${h.health === 'At risk' ? 'at risk' : 'behind schedule'}`,
      detail: `${h.progress}% done but ${h.expected}% of its timeline has passed${h.overdue ? ` · ${h.overdue} overdue` : ''}`,
      actions: [
        { label: 'Ask AI why', primary: true, run: () => onAsk(`Status of ${p.name}`) },
        { label: 'Open board', to: `/projects?project=${p.id}` },
      ],
    })
  }

  if (!projectId) {
    const load = workload(allTasks)
    const avg = load.reduce((s, w) => s + w.open, 0) / Math.max(1, load.length)
    for (const w of load.filter((w) => w.open >= avg * 1.6).slice(0, 2)) {
      items.push({
        key: `load-${w.personId}`,
        tone: 'warn',
        title: `${personById(w.personId)?.name} has ${w.open} open tasks`,
        detail: `Team average is ${avg.toFixed(1)}${w.overdue ? ` · ${w.overdue} overdue` : ''} — consider rebalancing`,
        actions: [{ label: 'See team workload', primary: true, run: () => onAsk('How is the team workload looking?') }],
      })
    }
  }

  const next = nextMeeting(projectId ? meetings.filter((m) => m.projectId === projectId) : meetings)
  if (next && next.date === today) {
    items.push({
      key: `meet-${next.id}`,
      tone: 'info',
      title: meetingState(next) === 'live' ? `“${next.title}” is happening now` : `“${next.title}” starts at ${formatTime(next.start)}`,
      detail: `${next.attendeeIds.length} attendees${next.projectId ? ` · ${name(next.projectId)}` : ''}`,
      actions: [
        { label: 'Prepare with AI', primary: true, run: () => onAsk('Highlight my next meeting') },
        { label: 'Meetings', to: '/meetings' },
      ],
    })
  }

  return (
    <section aria-label="Needs your attention" className="flex flex-col gap-3 rounded-[24px] bg-white p-5">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-[18px] font-semibold tracking-[-0.36px]">Needs Your Attention</h2>
        <span className="text-[13px] text-grey-text">{items.length ? `${items.length} item${items.length === 1 ? '' : 's'}` : ''}</span>
      </div>
      {items.length === 0 ? (
        <p className="py-6 text-center text-[14px] text-grey-text">All clear — nothing needs you right now. 🎉</p>
      ) : (
        <ul className="flex flex-col gap-2.5">
          {items.slice(0, SHOWN).map((item) => (
            <li key={item.key} className="flex gap-3 rounded-2xl bg-background p-3">
              <span className={`mt-1.5 size-2 shrink-0 rounded-full ${TONE[item.tone]}`} />
              <div className="min-w-0 flex-1">
                <p className="text-[14px] leading-[1.35] font-medium">{item.title}</p>
                <p className="mt-0.5 text-[12px] leading-[1.4] text-grey-text">{item.detail}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {item.actions.map((a) => {
                    const cls = `cursor-pointer rounded-full px-3 py-1 text-[12px] font-semibold ${
                      a.primary ? 'bg-primary hover:brightness-95' : 'bg-white text-ink ring-1 ring-stock hover:bg-stock'
                    }`
                    return a.to ? (
                      <Link key={a.label} to={a.to} className={cls}>
                        {a.label}
                      </Link>
                    ) : (
                      <button key={a.label} type="button" onClick={a.run} className={cls}>
                        {a.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
      {items.length > SHOWN && <p className="text-[12px] text-grey-text">+{items.length - SHOWN} more — ask “What are the risks?”</p>}
      <Toast message={toast.message} />
    </section>
  )
}
