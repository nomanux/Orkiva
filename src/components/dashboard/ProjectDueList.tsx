import { useState } from 'react'
import { Link } from 'react-router'
import { Card, CardTitle } from '../ui/Card'
import folderIcon from '../../assets/dashboard/folder.svg'
import menuDots from '../../assets/dashboard/menu-dots.svg'
import { useProjects, useTasks } from '../../data/projects'
import { dueSoon } from '../../data/insights'

/** Stacked-card offsets from the design: top position and tilt of each card. */
const CARD_LAYOUT = [
  { top: 60, rotate: 0 },
  { top: 110, rotate: -2.5 },
  { top: 160, rotate: 0.26 },
  { top: 211, rotate: -2.5 },
]

export function ProjectDueList() {
  const [selected, setSelected] = useState(0)
  const due = dueSoon(useProjects(), useTasks()).slice(0, CARD_LAYOUT.length)

  return (
    <Card className="h-[269px] min-w-[300px] flex-[313]">
      <div className="absolute top-4 left-4">
        <CardTitle>Due This Week</CardTitle>
      </div>
      {due.length === 0 && <p className="absolute top-24 right-4 left-4 text-center text-[13px] text-grey-text">Nothing due this week 🎉</p>}
      {due.map(({ project, due: count }, i) => {
        const active = i === selected
        return (
          <div
            key={project.id}
            role="button"
            tabIndex={0}
            onClick={() => setSelected(i)}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setSelected(i)}
            aria-pressed={active}
            className={`absolute right-4 left-4 flex h-[54px] cursor-pointer items-center justify-between rounded-xl px-3 transition-colors ${
              active ? 'bg-primary drop-shadow-[0px_1px_2.5px_rgba(0,0,0,0.2)]' : 'border-b-2 border-black/[0.02] bg-background'
            }`}
            style={{
              top: CARD_LAYOUT[i].top,
              transform: `rotate(${CARD_LAYOUT[i].rotate}deg)`,
              zIndex: active ? due.length : due.length - i - 1,
            }}
          >
            <div className="flex min-w-0 items-center gap-2">
              <div className="flex items-center gap-3">
                <span className="flex size-[22px] items-center justify-center rounded-[11px] bg-white text-[11px] leading-[1.2] font-semibold">
                  {i + 1}
                </span>
                <span className="flex size-8 items-center justify-center rounded-2xl bg-white p-[6px]">
                  <img src={folderIcon} alt="" width={20} height={20} />
                </span>
              </div>
              <div className="flex min-w-0 flex-col gap-0.5 leading-[1.2]">
                <p className="truncate text-[12px] tracking-[-0.24px] text-ink-soft">{project.name}</p>
                <p className={`text-[11px] ${active ? 'text-black/70' : 'text-grey-text'}`}>
                  {count} task{count === 1 ? '' : 's'} due soon
                </p>
              </div>
            </div>
            <Link
              to={`/projects?project=${project.id}`}
              onClick={(e) => e.stopPropagation()}
              aria-label={`Open ${project.name} board`}
              className="shrink-0"
            >
              <img src={menuDots} alt="" width={20} height={20} className="-scale-y-100 -rotate-90" />
            </Link>
          </div>
        )
      })}
    </Card>
  )
}
