import { Link } from 'react-router'
import { Card } from '../ui/Card'
import { projectById, useTasks, type Task } from '../../data/projects'
import { personById } from '../../data/people'
import { isOverdue, upcomingTasks } from '../../data/insights'
import { daysUntil, formatShort, relativeDue } from '../../lib/dates'

function Avatars({ ids }: { ids: string[] }) {
  return (
    <span className="flex shrink-0">
      {ids.slice(0, 3).map((id) => {
        const p = personById(id)
        return p && <img key={id} src={p.avatar} alt={p.name} title={p.name} width={24} height={24} className="-ml-1.5 size-6 rounded-full ring-2 ring-white first:ml-0" />
      })}
    </span>
  )
}

function Highlight({ title, task, chip, chipClass, empty }: { title: string; task?: Task; chip: string; chipClass: string; empty: string }) {
  return (
    <Card className="flex h-[127px] min-w-0 flex-1 flex-col px-4 pt-3.5 pb-3.5">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-[14px] leading-[1.2] font-semibold tracking-[-0.28px] text-ink">{title}</h3>
        {task && <span className={`shrink-0 rounded-full px-2 py-0.5 text-[12px] leading-[1.3] font-semibold ${chipClass}`}>{chip}</span>}
      </div>
      {task ? (
        <Link to={`/projects?project=${task.projectId}`} className="group mt-auto flex flex-col gap-2">
          <span className="min-w-0">
            <span className="block truncate text-[14px] leading-[1.25] font-medium group-hover:underline">{task.title}</span>
            <span className="block truncate text-[13px] leading-[1.3] text-grey-text">{projectById(task.projectId)?.name}</span>
          </span>
          <span className="flex items-center justify-between gap-2">
            <Avatars ids={task.memberIds} />
            {task.status !== 'Done' && (
              <span className="flex min-w-0 flex-1 items-center gap-2" title={`${task.progress}% complete`}>
                <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-stock">
                  <span className="block h-full rounded-full bg-primary" style={{ width: `${task.progress}%` }} />
                </span>
                <span className="text-[12px] font-semibold">{task.progress}%</span>
              </span>
            )}
            {task.status === 'Done' && task.completedAt && (
              <span className="text-[12px] text-grey-text">Finished {formatShort(task.completedAt)}</span>
            )}
          </span>
        </Link>
      ) : (
        <p className="mt-auto text-[13px] text-grey-text">{empty}</p>
      )}
    </Card>
  )
}

/** The most urgent open task. */
export function NextDeadlineCard() {
  const task = upcomingTasks(useTasks()).find((t) => t.dueDate)
  const overdue = task ? isOverdue(task) : false
  const soon = task?.dueDate ? daysUntil(task.dueDate) <= 1 : false
  return (
    <Highlight
      title="Next Deadline"
      task={task}
      chip={task?.dueDate ? relativeDue(task.dueDate) : ''}
      chipClass={overdue ? 'bg-error-50 text-error' : soon ? 'bg-ink text-white' : 'bg-background text-ink'}
      empty="No upcoming deadlines."
    />
  )
}

/** The task finished most recently. */
export function JustCompletedCard() {
  const task = useTasks()
    .filter((t) => t.status === 'Done' && t.completedAt)
    .sort((a, b) => b.completedAt!.localeCompare(a.completedAt!))[0]
  return (
    <Highlight
      title="Recently Completed"
      task={task}
      chip="Done"
      chipClass="bg-primary/15 text-primary-dark"
      empty="Nothing finished yet."
    />
  )
}
