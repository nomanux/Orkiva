import { Link } from 'react-router'
import { Card, CardTitle } from '../ui/Card'
import { useProjects, useTasks } from '../../data/projects'
import { personById } from '../../data/people'
import { projectHealth, type Health } from '../../data/insights'
import { formatShort } from '../../lib/dates'

const HEALTH: Record<Health, { dot: string; text: string }> = {
  'On track': { dot: 'bg-primary', text: 'text-primary-dark' },
  Behind: { dot: 'bg-gs-300', text: 'text-grey-text' },
  'At risk': { dot: 'bg-error', text: 'text-error' },
  Done: { dot: 'bg-ink', text: 'text-ink' },
}

const ROW = 'grid grid-cols-[minmax(170px,1.6fr)_minmax(140px,1.5fr)_70px_80px_90px] items-center gap-x-4'

/** Every active project: progress against its timeline, open work and a health verdict. */
export function ProjectHealth() {
  const tasks = useTasks()
  const rows = useProjects()
    .filter((p) => p.status !== 'Completed')
    .map((p) => ({ project: p, ...projectHealth(p, tasks) }))
    .sort((a, b) => (a.project.endDate ?? '9999').localeCompare(b.project.endDate ?? '9999'))
  const counts = rows.reduce<Record<string, number>>((acc, r) => ({ ...acc, [r.health]: (acc[r.health] ?? 0) + 1 }), {})

  return (
    <Card className="min-w-0 flex-[2] p-4">
      <div className="flex items-center justify-between gap-3">
        <CardTitle>Project Health</CardTitle>
        <ul className="flex gap-3 text-[13px] text-grey-text">
          {(['On track', 'Behind', 'At risk'] as const).map((h) => (
            <li key={h} className="flex items-center gap-1.5">
              <span className={`size-2.5 rounded-full ${HEALTH[h].dot}`} />
              {h} <span className="font-semibold text-ink">{counts[h] ?? 0}</span>
            </li>
          ))}
        </ul>
      </div>

      <div role="table" className="mt-4">
        <div role="row" className={`${ROW} border-b border-stock pb-2 text-[13px] text-grey`}>
          <span role="columnheader">Project</span>
          <span role="columnheader">Progress</span>
          <span role="columnheader">Open</span>
          <span role="columnheader">Deadline</span>
          <span role="columnheader">Status</span>
        </div>
        {rows.map(({ project, progress, expected, open, overdue, health }) => (
          <Link
            key={project.id}
            role="row"
            to={`/projects?project=${project.id}`}
            className={`${ROW} -mx-2 rounded-lg border-b border-background px-2 py-2.5 last:border-0 hover:bg-background`}
          >
            <span role="cell" className="min-w-0">
              <span className="block truncate text-[14px] leading-[1.25] font-medium">{project.name}</span>
              <span className="block truncate text-[13px] leading-[1.3] text-grey-text">
                {project.client ?? project.type}
                {project.managerId && ` · ${personById(project.managerId)?.name.split(' ')[0]}`}
              </span>
            </span>
            <span role="cell" className="flex items-center gap-2" title={`${progress}% done · ${expected}% of the timeline has passed`}>
              <span className="relative h-1.5 flex-1 rounded-full bg-stock">
                <span className="absolute inset-y-0 left-0 rounded-full bg-primary" style={{ width: `${progress}%` }} />
                {/* Where the project should be by now */}
                {expected > 0 && <span className="absolute -top-1 h-3.5 w-0.5 rounded-full bg-ink/70" style={{ left: `calc(${expected}% - 1px)` }} />}
              </span>
              <span className="w-9 text-right text-[13px] font-semibold">{progress}%</span>
            </span>
            <span role="cell" className="text-[13px]">
              {open}
              {overdue > 0 && <span className="ml-1 text-error">({overdue} late)</span>}
            </span>
            <span role="cell" className="text-[13px]">
              {project.endDate ? formatShort(project.endDate) : '—'}
            </span>
            <span role="cell" className={`flex items-center gap-1.5 text-[13px] font-medium ${HEALTH[health].text}`}>
              <span className={`size-2 rounded-full ${HEALTH[health].dot}`} />
              {project.status === 'On Hold' ? 'On hold' : health}
            </span>
          </Link>
        ))}
      </div>
      <p className="mt-2 flex items-center gap-1.5 text-[12px] text-grey-text">
        <span className="inline-block h-3 w-0.5 rounded-full bg-ink/70" /> marks where a project should be by today, based on its start and end dates.
      </p>
    </Card>
  )
}
