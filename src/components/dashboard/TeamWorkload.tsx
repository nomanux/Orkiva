import { Card, CardTitle } from '../ui/Card'
import { useTasks } from '../../data/projects'
import { personById } from '../../data/people'
import { workload } from '../../data/insights'

/** Who holds the most open tasks, with overdue and due-this-week shares. */
export function TeamWorkload({ limit = 8, className = '' }: { limit?: number; className?: string }) {
  const rows = workload(useTasks()).slice(0, limit)
  const max = Math.max(1, ...rows.map((r) => r.open))

  return (
    <Card className={`flex min-w-[280px] flex-col p-4 ${className}`}>
      <div className="flex items-center justify-between">
        <CardTitle>Team Workload</CardTitle>
        <span className="text-[13px] text-grey-text">Open tasks</span>
      </div>
      <ul className="mt-4 flex flex-col gap-3.5">
        {rows.map(({ personId, open, overdue, dueSoon }) => {
          const person = personById(personId)
          if (!person) return null
          return (
            <li
              key={personId}
              className="flex items-center gap-3"
              title={`${person.name}: ${open} open · ${overdue} overdue · ${dueSoon} due this week`}
            >
              <img src={person.avatar} alt="" width={32} height={32} className="size-8 shrink-0 rounded-full" />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="truncate text-[14px] leading-[1.2] font-medium">{person.name}</span>
                  <span className="shrink-0 text-[13px] font-semibold">{open}</span>
                </div>
                <div className="mt-1.5 flex h-1.5 overflow-hidden rounded-full bg-background">
                  {/* Overdue first, then due this week, then the rest */}
                  <span className="h-full bg-error" style={{ width: `${(overdue / max) * 100}%` }} />
                  <span className="h-full bg-ink" style={{ width: `${(dueSoon / max) * 100}%` }} />
                  <span className="h-full bg-gs-300" style={{ width: `${((open - overdue - dueSoon) / max) * 100}%` }} />
                </div>
              </div>
            </li>
          )
        })}
      </ul>
      <ul className="mt-auto flex gap-3 pt-4 text-[12px] text-grey-text">
        <li className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-error" />
          Overdue
        </li>
        <li className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-ink" />
          Due this week
        </li>
        <li className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-gs-300" />
          Later
        </li>
      </ul>
    </Card>
  )
}
