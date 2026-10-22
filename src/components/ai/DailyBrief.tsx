import { useState } from 'react'
import { Link } from 'react-router'
import { useProjects, useTasks } from '../../data/projects'
import { formatTime, useMeetings } from '../../data/meetingsStore'
import { personById } from '../../data/people'
import { isOpen, isOverdue, projectHealth, upcomingTasks } from '../../data/insights'
import { relativeDue, toISO } from '../../lib/dates'

type DailyBriefProps = { projectId: string | null; onAsk: (prompt: string) => void }

/** Today at a glance: four headline numbers (each opens a matching question) and the day's agenda. */
export function DailyBrief({ projectId, onAsk }: DailyBriefProps) {
  const [today] = useState(() => toISO(new Date()))
  const projects = useProjects()
  const scoped = <T extends { projectId?: string }>(list: T[]) => (projectId ? list.filter((x) => x.projectId === projectId) : list)
  const allTasks = useTasks()
  const tasks = scoped(allTasks)
  const meetings = scoped(useMeetings())
    .filter((m) => m.date === today && m.status !== 'Cancelled')
    .sort((a, b) => a.start.localeCompare(b.start))
  const dueToday = tasks.filter((t) => isOpen(t) && t.dueDate === today)
  const overdue = tasks.filter(isOverdue)
  const atRisk = projects
    .filter((p) => p.status === 'Active' && (!projectId || p.id === projectId))
    .filter((p) => projectHealth(p, allTasks).health === 'At risk')
  const project = projects.find((p) => p.id === projectId)

  const tiles = [
    { label: 'Due today', value: dueToday.length, prompt: 'What’s on today?', alert: false },
    { label: 'Overdue', value: overdue.length, prompt: 'What’s overdue?', alert: overdue.length > 0 },
    { label: 'Meetings today', value: meetings.length, prompt: 'Highlight my next meeting', alert: false },
    {
      label: project ? 'Health' : 'Projects at risk',
      value: project ? projectHealth(project, allTasks).health : atRisk.length,
      prompt: project ? `Status of ${project.name}` : 'What are the risks?',
      alert: atRisk.length > 0,
    },
  ]

  const agenda = [
    ...meetings.map((m) => ({
      key: m.id,
      time: formatTime(m.start),
      title: m.title,
      meta: `Meeting until ${formatTime(m.end)} · ${m.attendeeIds.length} people`,
      to: '/meetings',
      chip: null as null | { text: string; late: boolean },
    })),
    ...[...overdue, ...dueToday].map((t) => ({
      key: t.id,
      time: 'Task',
      title: t.title,
      meta: `${projects.find((p) => p.id === t.projectId)?.name} · ${personById(t.memberIds[0] ?? '')?.name ?? 'Unassigned'}`,
      to: `/projects?project=${t.projectId}`,
      chip: { text: relativeDue(t.dueDate!), late: isOverdue(t) },
    })),
  ]
  const comingUp = agenda.length ? [] : upcomingTasks(tasks).slice(0, 3)

  return (
    <section aria-label="Daily brief" className="flex flex-col gap-4 rounded-[24px] bg-white p-5">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-[18px] font-semibold tracking-[-0.36px]">Daily Brief</h2>
        <span className="text-[13px] text-grey-text">{project ? project.name : 'All projects'} · click a number to ask about it</span>
      </div>

      <div className="grid grid-cols-4 gap-2.5">
        {tiles.map((t) => (
          <button
            key={t.label}
            type="button"
            onClick={() => onAsk(t.prompt)}
            className="flex cursor-pointer flex-col items-start gap-1 rounded-2xl bg-background px-4 py-3 text-left transition-colors hover:bg-primary-soft"
          >
            <span className={`text-[28px] leading-[1.1] font-bold tracking-[-1px] ${t.alert ? 'text-error' : 'text-ink'}`}>{t.value}</span>
            <span className="text-[13px] text-grey-text">{t.label}</span>
          </button>
        ))}
      </div>

      <div>
        <h3 className="mb-1 text-[14px] font-semibold">{agenda.length ? 'Today’s agenda' : 'Nothing scheduled today — coming up next'}</h3>
        <ul className="flex flex-col">
          {agenda.slice(0, 5).map((a) => (
            <li key={a.key} className="border-b border-background last:border-0">
              <Link to={a.to} className="-mx-2 flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-background">
                <span className="w-[68px] shrink-0 text-[13px] font-semibold text-grey-text">{a.time}</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[14px] font-medium">{a.title}</span>
                  <span className="block truncate text-[12px] text-grey-text">{a.meta}</span>
                </span>
                {a.chip && (
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[12px] font-semibold ${a.chip.late ? 'bg-error-50 text-error' : 'bg-primary-soft text-primary-ink'}`}>
                    {a.chip.text}
                  </span>
                )}
              </Link>
            </li>
          ))}
          {comingUp.map((t) => (
            <li key={t.id} className="border-b border-background last:border-0">
              <Link to={`/projects?project=${t.projectId}`} className="-mx-2 flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-background">
                <span className="min-w-0 flex-1 truncate text-[14px] font-medium">{t.title}</span>
                <span className="shrink-0 rounded-full bg-background px-2 py-0.5 text-[12px] font-semibold">{t.dueDate ? relativeDue(t.dueDate) : 'No date'}</span>
              </Link>
            </li>
          ))}
          {!agenda.length && !comingUp.length && <li className="py-2 text-[14px] text-grey-text">No open tasks. 🎉</li>}
        </ul>
        {agenda.length > 5 && (
          <button type="button" onClick={() => onAsk('What’s on today?')} className="mt-1 cursor-pointer text-[13px] font-medium text-primary-dark hover:underline">
            +{agenda.length - 5} more — ask for the full day
          </button>
        )}
      </div>
    </section>
  )
}
