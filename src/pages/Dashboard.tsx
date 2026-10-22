import { AiAssistant } from '../components/dashboard/AiAssistant'
import { MeetingNotes } from '../components/dashboard/MeetingNotes'
import { ProjectDueList } from '../components/dashboard/ProjectDueList'
import { ProjectOverview } from '../components/dashboard/ProjectOverview'
import { EndedTaskCard, PendingTaskCard, TotalTaskCard } from '../components/dashboard/StatCards'
import { TaskList } from '../components/dashboard/TaskList'
import { TaskStatistics } from '../components/dashboard/TaskStatistics'
import { UploadCard } from '../components/dashboard/UploadCard'
import { useTasks } from '../data/projects'
import { useSession, shortName } from '../data/session'
import { taskTotals } from '../data/insights'

export function Dashboard() {
  const { profile } = useSession()
  const totals = taskTotals(useTasks())
  const greeting = totals.overdue
    ? `${totals.overdue} task${totals.overdue > 1 ? 's are' : ' is'} overdue — let’s get back on track.`
    : totals.dueToday
      ? `${totals.dueToday} task${totals.dueToday > 1 ? 's' : ''} due today. Ready to conquer your projects?`
      : 'Ready to conquer your projects?'

  return (
    <>
      <section className="mt-9 flex flex-col gap-[10.25px] whitespace-nowrap">
        <p className="text-[22px] leading-[1.5] tracking-[-0.44px] text-secondary-400">{greeting}</p>
        <h1 className="text-[42px] leading-[1.2] font-bold tracking-[-2.52px]">Welcome Back, {shortName(profile.name)} 👋</h1>
      </section>

      <div className="mt-[42px] flex gap-[10px]">
        <div className="flex min-w-0 flex-1 flex-col gap-[10px]">
          <div className="flex gap-[10px]">
            <TotalTaskCard count={totals.total} />
            <PendingTaskCard count={totals.pending} />
            <EndedTaskCard count={totals.done} />
          </div>
          <div className="flex gap-[10px]">
            <ProjectOverview className="min-w-0 flex-[476]" />
            <div className="flex min-w-0 flex-[500] flex-col gap-[10px]">
              <TaskStatistics />
              <div className="flex gap-[10px]">
                <UploadCard title="In Progress" />
                <UploadCard title="Completed" />
              </div>
            </div>
          </div>
          <div className="flex gap-[10px]">
            <TaskList />
            <ProjectDueList />
          </div>
        </div>
        <div className="flex w-[clamp(360px,27vw,460px)] shrink-0 flex-col gap-[10px]">
          <MeetingNotes />
          <AiAssistant />
        </div>
      </div>
    </>
  )
}
