import { useState } from 'react'
import { Card, CardTitle } from '../ui/Card'
import { FilterDropdown } from '../ui/FilterDropdown'
import arrowUpRight from '../../assets/dashboard/arrow-up-right-green.svg'
import { useTasks } from '../../data/projects'
import { periodStats, type Period } from '../../data/insights'

const PERIODS: Record<string, Period> = { Weekly: 'week', Monthly: 'month', Yearly: 'year' }
const BARS = 78 // the bar strip is always this many ticks wide, split by share

const SEGMENTS = [
  { key: 'done', label: 'Done', className: 'bg-primary' },
  { key: 'active', label: 'In Progress', className: 'bg-done' },
  { key: 'todo', label: 'To Do', className: 'bg-background' },
] as const

export function TaskStatistics() {
  const [period, setPeriod] = useState('Monthly')
  const stats = periodStats(PERIODS[period], useTasks())
  const total = stats.done + stats.active + stats.todo
  const counts = SEGMENTS.map((s) => (total ? Math.round((stats[s.key] / total) * BARS) : 0))
  const up = stats.change >= 0

  return (
    <Card className="h-[164px] w-full px-4 pt-4">
      <div className="flex items-start justify-between">
        <CardTitle>Task Statistics</CardTitle>
        <FilterDropdown className="[&>button]:pl-[13px]" options={Object.keys(PERIODS)} value={period} onChange={setPeriod} />
      </div>

      <p className="mt-[22px] text-[12px] leading-[1.2] tracking-[-0.36px] text-grey-text">
        {total} tasks due across {stats.projects} project{stats.projects === 1 ? '' : 's'}
      </p>
      <div className="-mt-[3px] flex items-center justify-between">
        <div className="flex items-center gap-[3px]">
          <p className="text-[32px] leading-[1.2] font-bold tracking-[-1.92px]">{stats.projects}</p>
          <span
            className={`flex h-5 items-center gap-0.5 rounded-[40px] px-1.5 ${up ? 'bg-primary/12' : 'bg-error-50'}`}
            title="Tasks completed compared with the previous period"
          >
            <img src={arrowUpRight} alt="" width={12} height={12} className={up ? '' : 'rotate-90 hue-rotate-[230deg]'} />
            <span className={`text-[11px] leading-[1.2] font-semibold ${up ? 'text-primary-dark' : 'text-error'}`}>
              {Math.abs(stats.change)}%
            </span>
          </span>
        </div>
        <ul className="mb-[8px] flex gap-3 self-end">
          {SEGMENTS.map((s) => (
            <li key={s.key} className="flex items-center gap-[6px]">
              <span className={`size-2 rounded-lg ${s.className}`} />
              <span className="text-[12px] leading-[1.2] tracking-[-0.24px] text-black/50">
                {s.label} {stats[s.key]}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-[4px] flex justify-between gap-[2px]" aria-hidden>
        {total === 0
          ? Array.from({ length: BARS }, (_, i) => <span key={i} className="h-[25px] w-1 shrink-0 rounded-[4px] bg-background" />)
          : SEGMENTS.flatMap((s, si) =>
              Array.from({ length: counts[si] }, (_, i) => <span key={`${s.key}-${i}`} className={`h-[25px] w-1 shrink-0 rounded-[4px] ${s.className}`} />),
            )}
      </div>
    </Card>
  )
}
