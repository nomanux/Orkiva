import { AiAssistant } from '../components/dashboard/AiAssistant'
import { MeetingNotes } from '../components/dashboard/MeetingNotes'
import { ProjectDueList } from '../components/dashboard/ProjectDueList'
import { ProjectOverview } from '../components/dashboard/ProjectOverview'
import { EndedTaskCard, PendingTaskCard, TotalTaskCard } from '../components/dashboard/StatCards'
import { TaskList } from '../components/dashboard/TaskList'
import { TaskStatistics } from '../components/dashboard/TaskStatistics'
import { UploadCard } from '../components/dashboard/UploadCard'
import { stats, user } from '../data/dashboard'

export function Dashboard() {
  return (
    <>
      <section className="mt-9 flex flex-col gap-[10.25px] whitespace-nowrap">
        <p className="text-[22px] leading-[1.5] tracking-[-0.44px] text-secondary-400">Ready to conquer your projects?</p>
        <h1 className="text-[42px] leading-[1.2] font-bold tracking-[-2.52px]">Welcome Back, {user.name} 👋</h1>
      </section>

      <div className="mt-[42px] flex gap-[10px]">
        <div className="flex min-w-0 flex-1 flex-col gap-[10px]">
          <div className="flex gap-[10px]">
            <TotalTaskCard count={stats.total} />
            <PendingTaskCard count={stats.pending} />
            <EndedTaskCard count={stats.ended} />
          </div>
          <div className="flex gap-[10px]">
            <ProjectOverview className="min-w-0 flex-[476]" />
            <div className="flex min-w-0 flex-[500] flex-col gap-[10px]">
              <TaskStatistics />
              <div className="flex gap-[10px]">
                <UploadCard title="In Progress" fileName="Project Brief. txt" fileSize="24.19 KB" percent={43} fill={143 / 213} />
                <UploadCard title="Completed" fileName="Project Brief. txt" fileSize="24.19 KB" percent={100} fill={1} />
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
