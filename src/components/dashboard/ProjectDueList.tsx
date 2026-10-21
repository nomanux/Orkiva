import { useState } from 'react'
import { Card, CardTitle } from '../ui/Card'
import folderIcon from '../../assets/dashboard/folder.svg'
import menuDots from '../../assets/dashboard/menu-dots.svg'
import { dueProjects } from '../../data/dashboard'

/** Stacked-card offsets from the design: top position and tilt of each card. */
const CARD_LAYOUT = [
  { top: 60, rotate: 0 },
  { top: 110, rotate: -2.5 },
  { top: 160, rotate: 0.26 },
  { top: 211, rotate: -2.5 },
]

export function ProjectDueList() {
  const [selected, setSelected] = useState(0)

  return (
    <Card className="h-[269px] min-w-[300px] flex-[313]">
      <div className="absolute top-4 left-4">
        <CardTitle>Task Statistics</CardTitle>
      </div>
      {dueProjects.map((project, i) => {
        const active = i === selected
        return (
          <div
            key={project.name}
            role="button"
            tabIndex={0}
            onClick={() => setSelected(i)}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setSelected(i)}
            aria-pressed={active}
            className={`absolute right-4 left-4 flex h-[54px] cursor-pointer items-center justify-between rounded-xl px-3 transition-colors ${
              active
                ? 'bg-primary drop-shadow-[0px_1px_2.5px_rgba(0,0,0,0.2)]'
                : 'border-b-2 border-black/[0.02] bg-background'
            }`}
            style={{
              top: CARD_LAYOUT[i].top,
              transform: `rotate(${CARD_LAYOUT[i].rotate}deg)`,
              zIndex: active ? dueProjects.length : dueProjects.length - i - 1,
            }}
          >
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-3">
                <span className="flex size-[22px] items-center justify-center rounded-[11px] bg-white text-[11px] leading-[1.2] font-semibold">
                  {i + 1}
                </span>
                <span className="flex size-8 items-center justify-center rounded-2xl bg-white p-[6px]">
                  <img src={folderIcon} alt="" width={20} height={20} />
                </span>
              </div>
              <div className="flex w-[120px] flex-col gap-0.5 leading-[1.2]">
                <p className="text-[12px] tracking-[-0.24px] whitespace-nowrap text-ink-soft">{project.name}</p>
                <p className={`text-[11px] ${active ? "text-black/70" : "text-grey-text"}`}>{project.due} Tasks due soon</p>
              </div>
            </div>
            <button type="button" aria-label={`${project.name} options`} className="cursor-pointer">
              <img src={menuDots} alt="" width={20} height={20} className="-scale-y-100 -rotate-90" />
            </button>
          </div>
        )
      })}
    </Card>
  )
}
