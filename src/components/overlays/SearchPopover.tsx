import { useState } from 'react'
import { useNavigate } from 'react-router'
import searchIcon from '../../assets/overlays/search.svg'
import checkCircle from '../../assets/overlays/check-circle.svg'
import briefcase from '../../assets/overlays/briefcase.svg'
import calendarSmall from '../../assets/overlays/calendar-small.svg'
import { useProjects, useTasks } from '../../data/projects'
import { PEOPLE } from '../../data/people'
import { formatTime, useMeetings } from '../../data/meetingsStore'
import { formatShort } from '../../lib/dates'

const DESTINATIONS = [
  { label: 'Tasks', icon: checkCircle, path: '/projects' },
  { label: 'Projects', icon: briefcase, path: '/projects' },
  { label: 'Calendar', icon: calendarSmall, path: '/calendar' },
]

const ROW = 'flex w-full cursor-pointer items-center gap-3 rounded-lg px-1 py-2 text-left hover:bg-gs-25'
const PER_GROUP = 4

type Result = { id: string; title: string; sub: string; path: string; icon?: string; photo?: string }

export function SearchPopover({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate()
  const projects = useProjects()
  const tasks = useTasks()
  const meetings = useMeetings()
  const [query, setQuery] = useState('')
  const q = query.trim().toLowerCase()
  const has = (...fields: (string | undefined)[]) => fields.some((f) => f?.toLowerCase().includes(q))

  const groups: { label: string; items: Result[] }[] = q
    ? [
        {
          label: 'Projects',
          items: projects
            .filter((p) => has(p.name, p.client, p.id, p.type))
            .map((p) => ({ id: p.id, title: p.name, sub: [p.client, p.status].filter(Boolean).join(' · '), path: `/projects?project=${p.id}`, icon: briefcase })),
        },
        {
          label: 'Tasks',
          items: tasks
            .filter((t) => has(t.title, t.id, ...t.tags))
            .map((t) => ({
              id: t.id,
              title: t.title,
              sub: `${projects.find((p) => p.id === t.projectId)?.name ?? ''} · ${t.status}${t.dueDate ? ` · ${formatShort(t.dueDate)}` : ''}`,
              path: `/projects?project=${t.projectId}`,
              icon: checkCircle,
            })),
        },
        {
          label: 'People',
          items: PEOPLE.filter((p) => has(p.name, p.role, p.email)).map((p) => ({ id: p.id, title: p.name, sub: p.role, path: '/inbox', photo: p.avatar })),
        },
        {
          label: 'Meetings',
          items: meetings
            .filter((m) => has(m.title, m.description))
            .map((m) => ({ id: m.id, title: m.title, sub: `${formatShort(m.date)} · ${formatTime(m.start)}`, path: '/meetings', icon: calendarSmall })),
        },
      ].filter((g) => g.items.length)
    : []
  const first = groups[0]?.items[0]

  const go = (path: string) => {
    onClose()
    navigate(path)
  }

  return (
    <div role="dialog" aria-label="Search" className="w-[400px] overflow-hidden rounded-2xl bg-white shadow-[0px_16px_32px_-1px_rgba(128,136,151,0.2)]">
      <label className="flex items-center gap-3 border-b border-gs-100 p-5">
        <img src={searchIcon} alt="" width={20} height={20} />
        <input
          autoFocus
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && first && go(first.path)}
          placeholder="Search projects, clients, tasks, people…"
          aria-label="Search"
          className="min-w-0 flex-1 bg-transparent text-[14px] leading-[1.5] font-medium tracking-[0.28px] text-ink outline-none placeholder:text-[#c1c7d0]"
        />
      </label>
      <div className="flex max-h-[min(520px,calc(100dvh-160px))] flex-col gap-3 overflow-y-auto p-5">
        {!q && (
          <div className="flex flex-col gap-2">
            <p className="text-[12px] leading-[1.5] font-medium tracking-[-0.24px] text-grey-text">Search To</p>
            <ul className="flex flex-col">
              {DESTINATIONS.map((d) => (
                <li key={d.label}>
                  <button type="button" onClick={() => go(d.path)} className={ROW}>
                    <IconTile icon={d.icon} />
                    <span className="text-[16px] leading-[1.5] font-medium tracking-[-0.32px] text-ink">{d.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        {groups.map((g) => (
          <div key={g.label} className="flex flex-col gap-1">
            <p className="text-[12px] leading-[1.5] font-medium tracking-[-0.24px] text-grey-text">
              {g.label} <span className="text-gs-300">{g.items.length}</span>
            </p>
            <ul className="flex flex-col">
              {g.items.slice(0, PER_GROUP).map((r) => (
                <li key={r.id}>
                  <button type="button" onClick={() => go(r.path)} className={ROW}>
                    {r.photo ? <img src={r.photo} alt="" width={34} height={34} className="size-[34px] rounded-full object-cover" /> : <IconTile icon={r.icon!} />}
                    <span className="min-w-0">
                      <span className="block truncate text-[14px] leading-[1.4] font-semibold text-ink">{r.title}</span>
                      <span className="block truncate text-[12px] leading-[1.4] text-grey-text">{r.sub}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
        {q && groups.length === 0 && <p className="py-[10px] text-[14px] text-grey-text">No results for “{query}”.</p>}
      </div>
    </div>
  )
}

function IconTile({ icon }: { icon: string }) {
  return (
    <span className="flex shrink-0 items-center justify-center rounded-[7.111px] border-[0.889px] border-gs-100 bg-gs-25 p-[7.111px]">
      <img src={icon} alt="" width={18} height={18} />
    </span>
  )
}
