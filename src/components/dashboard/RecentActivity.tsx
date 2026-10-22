import { Link } from 'react-router'
import { Card, CardTitle } from '../ui/Card'
import { projectById, useTasks } from '../../data/projects'
import { personById } from '../../data/people'
import { recentActivity } from '../../data/insights'
import { daysUntil, formatShort } from '../../lib/dates'

const when = (iso: string) => {
  const ago = -daysUntil(iso)
  return ago === 0 ? 'Today' : ago === 1 ? 'Yesterday' : ago < 7 ? `${ago} days ago` : formatShort(iso)
}

/** Latest completions and new tasks across all projects. */
export function RecentActivity() {
  const events = recentActivity(useTasks(), 8)

  return (
    <Card className="min-w-[280px] flex-1 p-4">
      <div className="flex items-center justify-between">
        <CardTitle>Recent Activity</CardTitle>
        <Link to="/projects" className="text-[13px] font-medium text-grey-text hover:text-ink hover:underline">
          View all
        </Link>
      </div>
      <ol className="relative mt-4 flex flex-col gap-3.5">
        {events.map(({ id, kind, date, task }) => {
          const who = personById(task.memberIds[0] ?? '')
          return (
            <li key={id} className="relative flex gap-3">
              <span
                className={`mt-1 flex size-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                  kind === 'completed' ? 'bg-primary text-black' : 'bg-background text-ink'
                }`}
                aria-hidden
              >
                {kind === 'completed' ? '✓' : '+'}
              </span>
              <Link to={`/projects?project=${task.projectId}`} className="group min-w-0 flex-1">
                <p className="truncate text-[14px] leading-[1.3]">
                  <span className="font-medium">{who?.name.split(' ')[0] ?? 'Someone'}</span>{' '}
                  <span className="text-grey-text">{kind === 'completed' ? 'completed' : 'was assigned'}</span>{' '}
                  <span className="font-medium group-hover:underline">{task.title}</span>
                </p>
                <p className="truncate text-[12px] leading-[1.4] text-grey-text">
                  {projectById(task.projectId)?.name} · {when(date)}
                </p>
              </Link>
            </li>
          )
        })}
        {events.length === 0 && <li className="text-[13px] text-grey-text">No activity yet.</li>}
      </ol>
    </Card>
  )
}
