import { useState } from 'react'
import { useNavigate } from 'react-router'
import searchIcon from '../../assets/overlays/search.svg'
import checkCircle from '../../assets/overlays/check-circle.svg'
import briefcase from '../../assets/overlays/briefcase.svg'
import calendarSmall from '../../assets/overlays/calendar-small.svg'
import { SEED_TASKS } from '../../data/projects'

const DESTINATIONS = [
  { label: 'Tasks', icon: checkCircle, path: '/projects' },
  { label: 'Projects', icon: briefcase, path: '/projects' },
  { label: 'Calendar', icon: calendarSmall, path: '/calendar' },
]

const ROW = 'flex w-full cursor-pointer items-center gap-3 rounded-lg py-[10px] text-left hover:bg-gs-25'

export function SearchPopover({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const q = query.trim().toLowerCase()
  const matches = q ? SEED_TASKS.filter((t) => t.title.toLowerCase().includes(q)).slice(0, 5) : []

  const go = (path: string) => {
    onClose()
    navigate(path)
  }

  return (
    <div role="dialog" aria-label="Search" className="w-[351px] overflow-hidden rounded-2xl bg-white shadow-[0px_16px_32px_-1px_rgba(128,136,151,0.2)]">
      <label className="flex items-center gap-3 border-b border-gs-100 p-5">
        <img src={searchIcon} alt="" width={20} height={20} />
        <input
          autoFocus
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && matches[0] && go('/projects')}
          placeholder="Search"
          aria-label="Search"
          className="min-w-0 flex-1 bg-transparent text-[14px] leading-[1.5] font-medium tracking-[0.28px] text-ink outline-none placeholder:text-[#c1c7d0]"
        />
      </label>
      <div className="flex flex-col gap-2 p-5">
        <p className="text-[12px] leading-[1.5] font-medium tracking-[-0.24px] text-grey-text">{q ? 'Matching tasks' : 'Search To'}</p>
        <ul className="flex flex-col">
          {q &&
            matches.map((t) => (
              <li key={t.id}>
                <button type="button" onClick={() => go('/projects')} className={ROW}>
                  <IconTile icon={checkCircle} />
                  <span className="truncate text-[16px] leading-[1.5] font-medium tracking-[-0.32px] text-ink">{t.title}</span>
                </button>
              </li>
            ))}
          {q && matches.length === 0 && <li className="py-[10px] text-[14px] text-grey-text">No results for “{query}”.</li>}
          {!q &&
            DESTINATIONS.map((d) => (
              <li key={d.label}>
                <button type="button" onClick={() => go(d.path)} className={ROW}>
                  <IconTile icon={d.icon} />
                  <span className="text-[16px] leading-[1.5] font-medium tracking-[-0.32px] text-ink">{d.label}</span>
                </button>
              </li>
            ))}
        </ul>
      </div>
    </div>
  )
}

function IconTile({ icon }: { icon: string }) {
  return (
    <span className="flex items-center justify-center rounded-[7.111px] border-[0.889px] border-gs-100 bg-gs-25 p-[7.111px]">
      <img src={icon} alt="" width={18} height={18} />
    </span>
  )
}
