import { useState } from 'react'
import { Card, CardTitle } from '../ui/Card'
import { FilterDropdown } from '../ui/FilterDropdown'
import barHatch from '../../assets/dashboard/bar-hatch.svg'
import { projectOverview } from '../../data/dashboard'

const Y_TICKS = [600, 500, 400, 300, 200, 100, 0]
const STEP = 28 // px between grid lines (100 units)
const PX_PER_UNIT = STEP / 100
const PLOT_HEIGHT = STEP * (Y_TICKS.length - 1)
const BAR_WIDTH = 48

export function ProjectOverview({ className = '' }: { className?: string }) {
  const [range, setRange] = useState('This Week')

  return (
    <Card className={`flex h-[301px] flex-col px-4 pt-4 ${className}`}>
      <div className="flex items-center justify-between">
        <CardTitle>Project Overview</CardTitle>
        <FilterDropdown options={['This Week', 'This Month', 'This Year']} value={range} onChange={setRange} />
      </div>

      {/* Bars may rise above the 600 line, as in the design, so the plot starts lower than the card top. */}
      <div className="relative mt-[42px] flex" style={{ height: PLOT_HEIGHT }}>
        <div className="relative w-[33px] shrink-0">
          {Y_TICKS.map((tick, i) => (
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
          {Y_TICKS.map((tick, i) => (
            <span key={tick} className="absolute right-0 left-0 h-px bg-stock" style={{ top: i * STEP }} aria-hidden />
          ))}
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-around">
            {projectOverview.map((d) => {
              const totalH = Math.round(d.total * PX_PER_UNIT)
              const valueH = Math.round(d.value * PX_PER_UNIT)
              return (
                <div key={d.month} className="relative flex flex-col items-center" style={{ width: BAR_WIDTH }}>
                  <div className="relative w-full rounded-lg bg-background" style={{ height: totalH }}>
                    <div
                      title={`${d.month}: ${d.value}`}
                      className={`absolute inset-x-0 bottom-0 overflow-hidden rounded-lg ${d.highlight ? 'bg-primary' : 'bg-stock'}`}
                      style={{ height: valueH }}
                    >
                      {d.highlight && (
                        <img
                          src={barHatch}
                          alt=""
                          width={263.414}
                          height={332.414}
                          className="absolute top-[-89px] left-[-127px] max-w-none"
                        />
                      )}
                    </div>
                  </div>
                  <span className="absolute top-full mt-[11px] text-[14px] leading-[1.2] font-medium tracking-[-0.28px] text-black/60">
                    {d.month}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </Card>
  )
}
