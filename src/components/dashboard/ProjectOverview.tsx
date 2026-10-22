import { useState } from 'react'
import { Card, CardTitle } from '../ui/Card'
import { FilterDropdown } from '../ui/FilterDropdown'
import barHatch from '../../assets/dashboard/bar-hatch.svg'
import { useTasks } from '../../data/projects'
import { overview, percent, type Period } from '../../data/insights'

const RANGES: Record<string, Period> = { 'This Week': 'week', 'This Month': 'month', 'Last 6 Months': 'year' }
const TICKS = 4
const STEP = 34 // px between grid lines
const PLOT_HEIGHT = STEP * TICKS

/** Rounds the axis up to a friendly step (1, 2, 5, 10, 20…) so labels stay whole numbers. */
function niceStep(max: number) {
  const raw = Math.max(1, max) / TICKS
  const mag = 10 ** Math.floor(Math.log10(raw))
  return [1, 2, 5, 10].map((m) => m * mag).find((s) => s >= raw) ?? 10 * mag
}

export function ProjectOverview({ className = '' }: { className?: string }) {
  const [range, setRange] = useState('This Week')
  const buckets = overview(RANGES[range], useTasks())
  const step = Math.max(1, niceStep(Math.max(...buckets.map((b) => b.total))))
  const ticks = Array.from({ length: TICKS + 1 }, (_, i) => (TICKS - i) * step)
  const px = (n: number) => Math.round((n / step) * STEP)
  const due = buckets.reduce((sum, b) => sum + b.total, 0)
  const done = buckets.reduce((sum, b) => sum + b.done, 0)

  return (
    <Card className={`flex h-[301px] flex-col px-4 pt-4 ${className}`}>
      <div className="flex items-center justify-between">
        <CardTitle>Project Overview</CardTitle>
        <FilterDropdown options={Object.keys(RANGES)} value={range} onChange={setRange} />
      </div>

      <div className="mt-1 flex items-center justify-between gap-3">
        <p className="text-[13px] leading-[1.3] text-grey-text">
          <span className="font-semibold text-ink">{done}</span> of <span className="font-semibold text-ink">{due}</span> due tasks done ·{' '}
          {percent(done, due)}%
        </p>
        <ul className="flex shrink-0 gap-3 text-[12px] leading-none text-grey-text" aria-label="Legend">
          <li className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-primary" />
            Done
          </li>
          <li className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-primary/25" />
            Open
          </li>
        </ul>
      </div>

      <div className="relative mt-[22px] flex" style={{ height: PLOT_HEIGHT }}>
        <div className="relative w-[28px] shrink-0">
          {ticks.map((tick, i) => (
            <span
              key={tick}
              className="absolute left-2.5 -translate-x-1/2 -translate-y-1/2 text-center text-[12px] tracking-[-0.24px] text-black/50"
              style={{ top: i * STEP }}
            >
              {tick}
            </span>
          ))}
        </div>

        <div className="relative flex-1">
          {ticks.map((tick, i) => (
            <span key={tick} className={`absolute right-0 left-0 h-px ${i === TICKS ? 'bg-track' : 'bg-background'}`} style={{ top: i * STEP }} aria-hidden />
          ))}
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-around gap-1.5 px-1">
            {buckets.map((b) => (
              <div key={b.label} className="relative flex max-w-11 min-w-0 flex-1 flex-col items-center">
                {b.total > 0 && (
                  <span className="absolute bottom-full mb-1 text-[12px] leading-none font-semibold text-ink">
                    {b.done}/{b.total}
                  </span>
                )}
                <div
                  className={`relative w-full overflow-hidden rounded-lg ${b.total ? 'bg-primary/25' : 'bg-background'}`}
                  style={{ height: Math.max(px(b.total), 4) }}
                  title={`${b.label}: ${b.done} of ${b.total} tasks done`}
                >
                  <div className="absolute inset-x-0 bottom-0 overflow-hidden rounded-lg bg-primary" style={{ height: px(b.done) }}>
                    {b.current && (
                      <img src={barHatch} alt="" width={263.414} height={332.414} className="absolute top-[-89px] left-[-127px] max-w-none" />
                    )}
                  </div>
                </div>
                <span
                  className={`absolute top-full mt-2.5 rounded-full px-1.5 py-0.5 text-[13px] leading-[1.2] tracking-[-0.28px] whitespace-nowrap ${
                    b.current ? 'bg-ink font-semibold text-white' : 'font-medium text-black/60'
                  }`}
                >
                  {b.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}
