import { useState } from 'react'
import { Card, CardTitle } from '../ui/Card'
import { FilterDropdown } from '../ui/FilterDropdown'
import arrowUpRight from '../../assets/dashboard/arrow-up-right-green.svg'
import { taskStatistics } from '../../data/dashboard'

const SEGMENTS = [
  { key: 'total', label: 'Total', className: 'bg-primary' },
  { key: 'done', label: 'Done', className: 'bg-done' },
  { key: 'inProgress', label: 'In Progress', className: 'bg-background' },
] as const

export function TaskStatistics() {
  const [period, setPeriod] = useState('Monthly')
  const { totalProjects, change } = taskStatistics

  return (
    <Card className="h-[164px] w-full px-4 pt-4">
      <div className="flex items-start justify-between">
        <CardTitle>Task Statistics</CardTitle>
        <FilterDropdown
          className="[&>button]:pl-[13px]"
          options={['Weekly', 'Monthly', 'Yearly']}
          value={period}
          onChange={setPeriod}
        />
      </div>

      <p className="mt-[22px] text-[12px] leading-[1.2] tracking-[-0.36px] text-grey-text">Total Project</p>
      <div className="-mt-[3px] flex items-center justify-between">
        <div className="flex items-center gap-[3px]">
          <p className="text-[32px] leading-[1.2] font-bold tracking-[-1.92px]">{totalProjects}</p>
          <span className="flex h-5 items-center gap-0.5 rounded-[40px] bg-primary/12 px-1.5">
            <img src={arrowUpRight} alt="" width={12} height={12} />
            <span className="text-[11px] leading-[1.2] font-semibold text-primary-dark">{change}%</span>
          </span>
        </div>
        <ul className="mb-[8px] flex gap-3 self-end">
          {SEGMENTS.map((s) => (
            <li key={s.key} className="flex items-center gap-[6px]">
              <span className={`size-2 rounded-lg ${s.className}`} />
              <span className="text-[12px] leading-[1.2] tracking-[-0.24px] text-black/50">{s.label}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-[4px] flex justify-between gap-[2px]" aria-hidden>
        {SEGMENTS.flatMap((s) =>
          Array.from({ length: taskStatistics[s.key] }, (_, i) => (
            <span key={`${s.key}-${i}`} className={`h-[25px] w-1 shrink-0 rounded-[4px] ${s.className}`} />
          )),
        )}
      </div>
    </Card>
  )
}
