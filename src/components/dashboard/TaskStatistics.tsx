import { useState } from 'react'
import { Card, CardTitle } from '../ui/Card'
import { FilterDropdown } from '../ui/FilterDropdown'
import arrowUpRight from '../../assets/dashboard/arrow-up-right-green.svg'
import { useTasks } from '../../data/projects'
import { periodStats, type Period } from '../../data/insights'

const PERIODS: Record<string, { period: Period; noun: string }> = {
  Weekly: { period: 'week', noun: 'week' },
  Monthly: { period: 'month', noun: 'month' },
  Yearly: { period: 'year', noun: 'year' },
}
const BARS = 78 // the bar strip is always this many ticks wide, split by share

const SEGMENTS = [
  { key: 'done', label: 'Done', className: 'bg-primary' },
  { key: 'active', label: 'In Progress', className: 'bg-done' },
  { key: 'todo', label: 'To Do', className: 'bg-stock' },
] as const

export function TaskStatistics() {
  const [choice, setChoice] = useState('Monthly')
  const { period, noun } = PERIODS[choice]
  const stats = periodStats(period, useTasks())
  const total = stats.done + stats.active + stats.todo
  const counts = SEGMENTS.map((s) => (total ? Math.round((stats[s.key] / total) * BARS) : 0))
  const up = stats.change >= 0

  return (
    <Card className="flex h-[164px] w-full flex-col px-4 pt-4 pb-3.5">
      <div className="flex items-start justify-between">
        <CardTitle>Task Statistics</CardTitle>
        <FilterDropdown className="[&>button]:pl-[13px]" options={Object.keys(PERIODS)} value={choice} onChange={setChoice} />
      </div>

      <div className="mt-auto flex items-end justify-between gap-3">
        <div className="flex min-w-0 items-baseline gap-2">
          <p className="text-[32px] leading-none font-bold tracking-[-1.92px]">{total}</p>
          <p className="truncate text-[13px] leading-[1.2] text-grey-text">
            tasks due this {noun} · {stats.projects} project{stats.projects === 1 ? '' : 's'}
          </p>
        </div>
        <span
          className={`flex h-6 shrink-0 items-center gap-1 rounded-[40px] px-2 ${up ? 'bg-primary/12' : 'bg-error-50'}`}
          title={`Tasks completed this ${noun} compared with last ${noun}`}
        >
          <img src={arrowUpRight} alt="" width={12} height={12} className={up ? '' : 'rotate-90 hue-rotate-[230deg]'} />
          <span className={`text-[12px] leading-none font-semibold whitespace-nowrap ${up ? 'text-primary-dark' : 'text-error'}`}>
            {up ? '+' : '−'}
            {Math.abs(stats.change)}% vs last {noun}
          </span>
        </span>
      </div>

      <div className="mt-2.5 flex justify-between gap-[2px]" aria-hidden>
        {total === 0
          ? Array.from({ length: BARS }, (_, i) => <span key={i} className="h-[22px] w-1 min-w-0 shrink rounded-[4px] bg-background" />)
          : SEGMENTS.flatMap((s, si) =>
              Array.from({ length: counts[si] }, (_, i) => <span key={`${s.key}-${i}`} className={`h-[22px] w-1 min-w-0 shrink rounded-[4px] ${s.className}`} />),
            )}
      </div>

      <ul className="mt-2.5 flex gap-4">
        {SEGMENTS.map((s) => (
          <li key={s.key} className="flex items-center gap-1.5 text-[13px] leading-[1.2]">
            <span className={`size-2.5 rounded-full ${s.className}`} />
            <span className="text-grey-text">{s.label}</span>
            <span className="font-semibold text-ink">{stats[s.key]}</span>
          </li>
        ))}
      </ul>
    </Card>
  )
}
