import { useState } from 'react'
import { Card, CardTitle } from '../ui/Card'
import { FilterDropdown } from '../ui/FilterDropdown'
import barHatch from '../../assets/dashboard/bar-hatch.svg'
import { useTasks } from '../../data/projects'
import { overview, type Period } from '../../data/insights'

const RANGES: Record<string, Period> = { 'This Week': 'week', 'This Month': 'month', 'Last 6 Months': 'year' }
const TICKS = 6
const STEP = 28 // px between grid lines
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

  return (
    <Card className={`flex h-[301px] flex-col px-4 pt-4 ${className}`}>
      <div className="flex items-center justify-between">
        <CardTitle>Project Overview</CardTitle>
        <FilterDropdown options={Object.keys(RANGES)} value={range} onChange={setRange} />
      </div>
      <p className="sr-only">Tasks due per period, with the completed share filled in.</p>

      <div className="relative mt-[30px] flex" style={{ height: PLOT_HEIGHT }}>
        <div className="relative w-[33px] shrink-0">
          {ticks.map((tick, i) => (
            <span
              key={tick}
              className="absolute left-3 -translate-x-1/2 -translate-y-1/2 text-center text-[12px] tracking-[-0.24px] text-black/60"
              style={{ top: i * STEP }}
            >
              {tick}
            </span>
          ))}
        </div>

        <div className="relative flex-1">
          {ticks.map((tick, i) => (
            <span key={tick} className="absolute right-0 left-0 h-px bg-stock" style={{ top: i * STEP }} aria-hidden />
          ))}
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-around gap-1.5 px-1">
            {buckets.map((b) => (
              <div key={b.label} className="relative flex max-w-12 min-w-0 flex-1 flex-col items-center">
                <div
                  className="relative w-full rounded-lg bg-background"
                  style={{ height: Math.max(px(b.total), 4) }}
                  title={`${b.label}: ${b.done} of ${b.total} tasks done`}
                >
                  <div
                    className={`absolute inset-x-0 bottom-0 overflow-hidden rounded-lg ${b.current ? 'bg-primary' : 'bg-stock'}`}
                    style={{ height: px(b.done) }}
                  >
                    {b.current && (
                      <img src={barHatch} alt="" width={263.414} height={332.414} className="absolute top-[-89px] left-[-127px] max-w-none" />
                    )}
                  </div>
                </div>
                <span className="absolute top-full mt-[11px] text-[13px] leading-[1.2] font-medium tracking-[-0.28px] whitespace-nowrap text-black/60">
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
