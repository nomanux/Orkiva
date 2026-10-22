import { Link } from 'react-router'
import { Card, CardTitle } from '../ui/Card'
import folderIcon from '../../assets/dashboard/folder.svg'
import { useProjects, useTasks } from '../../data/projects'
import { dueSoon, isDueWithin, isOverdue } from '../../data/insights'
import { daysUntil, relativeDue } from '../../lib/dates'

const SHOWN = 4

/** Projects with work due in the next 7 days (or already late), each with its most urgent task. */
export function ProjectDueList() {
  const tasks = useTasks()
  const rows = dueSoon(useProjects(), tasks).map(({ project }) => {
    const due = tasks
      .filter((t) => t.projectId === project.id && (isDueWithin(t, 7) || isOverdue(t)))
      .sort((a, b) => a.dueDate!.localeCompare(b.dueDate!))
    return { project, due, overdue: due.filter(isOverdue).length, next: due[0] }
  })

  return (
    <Card className="flex h-[269px] min-w-[300px] flex-[313] flex-col p-4">
      <div className="flex items-baseline justify-between gap-2">
        <CardTitle>Due This Week</CardTitle>
        {rows.length > 0 && (
          <Link to="/projects" className="text-[13px] font-medium text-grey-text hover:text-ink hover:underline">
            {rows.length} project{rows.length === 1 ? '' : 's'} · next 7 days
          </Link>
        )}
      </div>

      {rows.length === 0 ? (
        <p className="m-auto text-[14px] text-grey-text">Nothing due this week 🎉</p>
      ) : (
        <ul className="mt-3 flex flex-col">
          {rows.slice(0, SHOWN).map(({ project, due, overdue, next }) => {
            const days = daysUntil(next.dueDate!)
            return (
              <li key={project.id} className="border-b border-background last:border-0">
                <Link
                  to={`/projects?project=${project.id}`}
                  title={due.map((t) => `• ${t.title} (${relativeDue(t.dueDate!)})`).join('\n')}
                  className="-mx-2 flex items-center gap-3 rounded-xl px-2 py-[7px] hover:bg-background"
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-background">
                    <img src={folderIcon} alt="" width={18} height={18} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[14px] leading-[1.3] font-medium text-ink">{project.name}</span>
                    <span className="block truncate text-[12px] leading-[1.4] text-grey-text">
                      {due.length} task{due.length === 1 ? '' : 's'}
                      {overdue > 0 && <span className="text-error"> · {overdue} late</span>} · {next.title}
                    </span>
                  </span>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[12px] font-semibold whitespace-nowrap ${
                      days < 0 ? 'bg-error-50 text-error' : days <= 1 ? 'bg-primary-soft text-primary-ink' : 'bg-background text-ink'
                    }`}
                  >
                    {relativeDue(next.dueDate!)}
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </Card>
  )
}
