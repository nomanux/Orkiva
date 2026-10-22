import { MeetingNotes } from '../components/dashboard/MeetingNotes'
import { ProjectDueList } from '../components/dashboard/ProjectDueList'
import { ProjectHealth } from '../components/dashboard/ProjectHealth'
import { ProjectOverview } from '../components/dashboard/ProjectOverview'
import { RecentActivity } from '../components/dashboard/RecentActivity'
import { JustCompletedCard, NextDeadlineCard } from '../components/dashboard/TaskHighlights'
import { TaskList } from '../components/dashboard/TaskList'
import { TaskStatistics } from '../components/dashboard/TaskStatistics'
import { TeamWorkload } from '../components/dashboard/TeamWorkload'
import { ProjectStatCard } from '../components/projects/ProjectStatCard'
import { useTasks } from '../data/projects'
import { useSession, shortName } from '../data/session'
import { onTimeRate, percent, periodRange, taskTotals } from '../data/insights'

export function Dashboard() {
  const { profile } = useSession()
  const tasks = useTasks()
  const totals = taskTotals(tasks)
  const active = tasks.filter((t) => t.status === 'In Progress' || t.status === 'In Review').length
  const projectCount = new Set(tasks.map((t) => t.projectId)).size
  const [weekFrom, weekTo] = periodRange('week')
  const doneThisWeek = tasks.filter((t) => t.completedAt && t.completedAt >= weekFrom && t.completedAt <= weekTo).length
  const onTime = onTimeRate(tasks)
  const greeting = totals.overdue
    ? `${totals.overdue} task${totals.overdue > 1 ? 's are' : ' is'} overdue — let’s get back on track.`
    : totals.dueToday
      ? `${totals.dueToday} task${totals.dueToday > 1 ? 's' : ''} due today. Ready to conquer your projects?`
      : 'Ready to conquer your projects?'

  const stats = [
    {
      label: 'Total Task',
      value: totals.total,
      hint: `across ${projectCount} projects`,
      meter: { label: 'Completed', percent: percent(totals.done, totals.total), detail: `${totals.done} of ${totals.total} tasks are done` },
    },
    {
      label: 'Pending Task',
      value: totals.pending,
      hint: `${totals.dueToday} due today · ${totals.overdue} overdue`,
      meter: { label: 'In progress', percent: percent(active, totals.pending), detail: `${active} of ${totals.pending} open tasks are being worked on` },
    },
    {
      label: 'Completed Task',
      value: totals.done,
      hint: `${doneThisWeek} finished this week`,
      meter: { label: 'On time', percent: onTime, detail: `${onTime}% of finished tasks were completed by their due date` },
    },
  ]

  return (
    <>
      <section className="mt-9 flex flex-col gap-[10.25px] whitespace-nowrap">
        <p className="text-[22px] leading-[1.5] tracking-[-0.44px] text-secondary-400">{greeting}</p>
        <h1 className="text-[42px] leading-[1.2] font-bold tracking-[-2.52px]">Welcome Back, {shortName(profile.name)} 👋</h1>
      </section>

      <div className="mt-[42px] flex gap-[10px]">
        <div className="flex min-w-0 flex-1 flex-col gap-[10px]">
          <div className="flex gap-[10px]">
            {stats.map((s) => (
              <ProjectStatCard key={s.label} to="/projects" {...s} />
            ))}
          </div>
          <div className="flex gap-[10px]">
            <ProjectOverview className="min-w-0 flex-[476]" />
            <div className="flex min-w-0 flex-[500] flex-col gap-[10px]">
              <TaskStatistics />
              <div className="flex gap-[10px]">
                <NextDeadlineCard />
                <JustCompletedCard />
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
          <TeamWorkload limit={6} className="flex-1" />
        </div>
      </div>

      <div className="mt-[10px] flex gap-[10px]">
        <ProjectHealth />
        <RecentActivity />
      </div>
    </>
  )
}
