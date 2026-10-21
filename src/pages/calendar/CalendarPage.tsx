import { useRef, useState } from 'react'
import { ScheduleModal } from '../../components/calendar/ScheduleModal'
import { EventCard } from '../../components/calendar/EventCard'
import { VideoCallModal } from '../../components/inbox/VideoCallModal'
import { Toast } from '../../components/ui/Toast'
import { useToast } from '../../hooks/useToast'
import { useDismiss } from '../../hooks/useDismiss'
import { addDays, meetingsStore, minutes, useMeetings, weekStart, type Meeting } from '../../data/meetingsStore'
import { toISO } from '../../lib/dates'
import calendarIcon from '../../assets/calendar/calendar.svg'
import sortIcon from '../../assets/calendar/sort.svg'
import menuDotsCard from '../../assets/calendar/menu-dots-card.svg'
import chatDots from '../../assets/calendar/chat-dots.svg'
import chevronLeft from '../../assets/overlays/chevron-left.svg'
import chevronRight from '../../assets/overlays/chevron-right.svg'
import plusIcon from '../../assets/projects/plus.svg'

type View = 'Day' | 'Week' | 'Month'

const PROJECTS = [
  { title: 'Mobile App Design', accent: 'border-l-[rgba(255,86,95,0.4)]' },
  { title: 'Web Development', accent: 'border-l-white' },
  { title: 'Mobile App Design', accent: 'border-l-[#fde68a]' },
  { title: 'Brand Guidelines', accent: 'border-l-[rgba(255,86,95,0.4)]' },
  { title: 'Marketing Website', accent: 'border-l-[#d9f99d]' },
  { title: 'Analytics Dashboard', accent: 'border-l-[#bbf7d0]' },
  { title: 'Onboarding Revamp', accent: 'border-l-[#fde68a]' },
]
const COUNTERS = [
  { n: 4, bg: 'bg-[#cdeea9]' },
  { n: 6, bg: 'bg-[#fb875a]' },
  { n: 2, bg: 'bg-[#fbd93c]' },
  { n: 1, bg: 'bg-[#ff565f]' },
]

const DAY_START = 8 // 8 AM
const DAY_END = 18 // 6 PM
const HOUR = 132 // px per hour

const fmt = (d: Date, o: Intl.DateTimeFormatOptions) => d.toLocaleDateString('en-GB', o)

export function CalendarPage() {
  const meetings = useMeetings()
  const [anchor, setAnchor] = useState(() => new Date())
  const [view, setView] = useState<View>('Week')
  const [selectedProject, setSelectedProject] = useState(1)
  const [scheduling, setScheduling] = useState(false)
  const [call, setCall] = useState<Meeting | null>(null)
  const [filterOpen, setFilterOpen] = useState(false)
  const [hideCancelled, setHideCancelled] = useState(false)
  const [apps, setApps] = useState({ meet: true, calendar: true })
  const filterRef = useRef<HTMLDivElement>(null)
  const carousel = useRef<HTMLDivElement>(null)
  useDismiss(filterRef, filterOpen, () => setFilterOpen(false))
  const toast = useToast()

  const days =
    view === 'Day' ? [anchor] : Array.from({ length: 5 }, (_, i) => addDays(weekStart(anchor), i))
  const visible = meetings.filter((m) => apps[m.app] && !(hideCancelled && m.status === 'Cancelled'))

  const shift = (dir: number) =>
    setAnchor((a) => (view === 'Day' ? addDays(a, dir) : view === 'Week' ? addDays(a, dir * 7) : new Date(a.getFullYear(), a.getMonth() + dir, 1)))

  const rangeLabel =
    view === 'Day'
      ? fmt(anchor, { day: '2-digit', month: 'short', year: 'numeric' })
      : view === 'Week'
        ? `${fmt(days[0], { day: '2-digit', month: 'short' })} - ${fmt(days[4], { day: '2-digit', month: 'short', year: 'numeric' })}`
        : fmt(anchor, { month: 'long', year: 'numeric' })

  const remove = (m: Meeting) => {
    meetingsStore.remove(m.id)
    toast.show(`Deleted “${m.title}”`)
  }

  return (
    <div className="mt-6 flex flex-col gap-4">
      <section aria-label="Ongoing projects" className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h1 className="text-[22px] leading-[1.4] font-semibold tracking-[-0.44px] text-black">Ongoing Projects</h1>
          <div className="flex gap-1">
            {[-1, 1].map((dir) => (
              <button
                key={dir}
                type="button"
                aria-label={dir < 0 ? 'Scroll projects left' : 'Scroll projects right'}
                onClick={() => carousel.current?.scrollBy({ left: dir * 480, behavior: 'smooth' })}
                className="flex size-8 cursor-pointer items-center justify-center rounded-full bg-white hover:bg-stock"
              >
                <img src={dir < 0 ? chevronLeft : chevronRight} alt="" width={18} height={18} />
              </button>
            ))}
          </div>
        </div>
        <div ref={carousel} className="flex snap-x gap-2.5 overflow-x-auto pb-1 [scrollbar-width:none]">
          {PROJECTS.map((p, i) => {
            const active = i === selectedProject
            return (
              <button
                key={i}
                type="button"
                onClick={() => setSelectedProject(i)}
                aria-pressed={active}
                className={`flex h-[200px] w-[224px] shrink-0 snap-start cursor-pointer flex-col rounded-[20px] border-l-[6px] p-4 text-left ${
                  active ? 'border-l-white bg-primary' : `bg-white ${p.accent}`
                }`}
              >
                <span className="flex items-start justify-between">
                  <span className="text-[12px] text-black">12 JUN 2025</span>
                  <img src={menuDotsCard} alt="" width={18} height={18} className="rotate-90" />
                </span>
                <span className="mt-1.5 text-[15px] leading-[1.3] font-semibold tracking-[-0.3px] text-black">{p.title}</span>
                <span className={`mt-2 line-clamp-3 text-[12px] leading-[1.35] ${active ? 'text-black/60' : 'text-black/50'}`}>
                  Based on the user interview and competitor research, I came up with a design direction for review.
                </span>
                <span className="mt-auto flex items-end justify-between">
                  <span className="flex items-center gap-1">
                    <span className="flex">
                      {COUNTERS.map((c, j) => (
                        <span key={j} className={`-mr-2 flex size-6 items-center justify-center rounded-full border border-white text-[11px] font-semibold text-black last:mr-0 ${c.bg}`}>
                          {c.n}
                        </span>
                      ))}
                    </span>
                    <span className="ml-1 text-[12px] font-medium text-black">Design Team</span>
                  </span>
                  <span className="flex items-center gap-1 rounded-full bg-background px-1.5 py-0.5 text-[11px] font-semibold">
                    <img src={chatDots} alt="" width={10} height={10} />5
                  </span>
                </span>
              </button>
            )
          })}
        </div>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h2 className="text-[20px] leading-[1.4] font-semibold tracking-[-0.4px] text-black">
            {anchor.toLocaleDateString('en-GB', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
          </h2>
          <button type="button" onClick={() => setAnchor(new Date())} className="h-10 cursor-pointer rounded-full bg-white px-4 text-[15px] font-medium hover:bg-stock">
            Today
          </button>
        </div>
        <div className="flex items-center gap-2.5">
          <div role="tablist" aria-label="Calendar view" className="flex h-11 items-center gap-1 rounded-full bg-white p-1">
            {(['Day', 'Week', 'Month'] as const).map((v) => (
              <button
                key={v}
                role="tab"
                type="button"
                aria-selected={view === v}
                onClick={() => setView(v)}
                className={`h-9 cursor-pointer rounded-full px-4 text-[15px] font-medium ${view === v ? 'bg-background text-black' : 'text-black/50 hover:text-black'}`}
              >
                {v}
              </button>
            ))}
          </div>
          <div className="flex h-11 items-center gap-1 rounded-full bg-white px-1.5">
            <button type="button" aria-label="Previous" onClick={() => shift(-1)} className="flex size-8 cursor-pointer items-center justify-center rounded-full hover:bg-background">
              <img src={chevronLeft} alt="" width={16} height={16} />
            </button>
            <span className="flex items-center gap-2 px-1 text-[15px] font-medium whitespace-nowrap">
              <img src={calendarIcon} alt="" width={18} height={18} />
              {rangeLabel}
            </span>
            <button type="button" aria-label="Next" onClick={() => shift(1)} className="flex size-8 cursor-pointer items-center justify-center rounded-full hover:bg-background">
              <img src={chevronRight} alt="" width={16} height={16} />
            </button>
          </div>
          <div ref={filterRef} className="relative flex">
            <button
              type="button"
              aria-expanded={filterOpen}
              onMouseDown={(e) => e.stopPropagation()}
              onClick={() => setFilterOpen((o) => !o)}
              className="flex h-11 cursor-pointer items-center gap-2 rounded-full bg-white px-4 text-[15px] font-medium hover:bg-stock"
            >
              <img src={sortIcon} alt="" width={18} height={18} />
              Filter
            </button>
            {filterOpen && (
              <div role="dialog" aria-label="Filter events" className="absolute top-full right-0 z-30 mt-2 flex w-56 flex-col gap-2 rounded-xl bg-white p-3 shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
                {(
                  [
                    ['meet', 'Google Meet'],
                    ['calendar', 'Google Calendar'],
                  ] as const
                ).map(([key, label]) => (
                  <label key={key} className="flex cursor-pointer items-center gap-2 text-[13px] font-medium">
                    <input type="checkbox" checked={apps[key]} onChange={(e) => setApps((a) => ({ ...a, [key]: e.target.checked }))} className="accent-primary-dark" />
                    {label}
                  </label>
                ))}
                <label className="flex cursor-pointer items-center gap-2 border-t border-gs-100 pt-2 text-[13px] font-medium">
                  <input type="checkbox" checked={hideCancelled} onChange={(e) => setHideCancelled(e.target.checked)} className="accent-primary-dark" />
                  Hide cancelled
                </label>
              </div>
            )}
          </div>
          <button type="button" onClick={() => setScheduling(true)} className="flex h-11 cursor-pointer items-center gap-2 rounded-full bg-primary px-4 text-[15px] font-semibold text-black hover:brightness-95">
            <img src={plusIcon} alt="" width={18} height={18} />
            New Schedule
          </button>
        </div>
      </div>

      {view === 'Month' ? (
        <MonthView anchor={anchor} meetings={visible} onPick={(d) => (setAnchor(d), setView('Day'))} />
      ) : (
        <TimeGrid days={days} meetings={visible} onJoin={setCall} onDelete={remove} />
      )}

      <ScheduleModal
        open={scheduling}
        defaultDate={toISO(anchor)}
        onClose={() => setScheduling(false)}
        onSaved={(title) => {
          setScheduling(false)
          toast.show(`Scheduled “${title}”`)
        }}
      />
      <VideoCallModal open={!!call} onClose={() => setCall(null)} name={call?.title ?? ''} />
      <Toast message={toast.message} />
    </div>
  )
}

function TimeGrid({ days, meetings, onJoin, onDelete }: { days: Date[]; meetings: Meeting[]; onJoin: (m: Meeting) => void; onDelete: (m: Meeting) => void }) {
  const hours = Array.from({ length: DAY_END - DAY_START + 1 }, (_, i) => DAY_START + i)
  const [now] = useState(() => new Date())
  const today = toISO(now)
  const gmt = -now.getTimezoneOffset() / 60
  const cols = `96px repeat(${days.length}, minmax(0, 1fr))`

  return (
    <section aria-label="Schedule" className="overflow-hidden rounded-[15px] bg-white">
      <div className="grid bg-background/80 text-[14px] font-medium text-black" style={{ gridTemplateColumns: cols }}>
        <span className="px-4 py-3 text-black/60">GMT{gmt >= 0 ? '+' : ''}{gmt}</span>
        {days.map((d) => (
          <span key={d.toISOString()} className={`py-3 text-center ${toISO(d) === today ? 'text-primary-dark' : ''}`}>
            {d.toLocaleDateString('en-GB', { weekday: 'short' })} {String(d.getDate()).padStart(2, '0')}
          </span>
        ))}
      </div>
      <div className="h-[calc(100dvh-560px)] min-h-[420px] overflow-y-auto">
        <div className="relative grid" style={{ gridTemplateColumns: cols, height: (DAY_END - DAY_START) * HOUR + 40 }}>
          <div className="relative m-2 rounded-[10px] bg-background">
            {hours.map((h) => (
              <span key={h} className="absolute left-0 w-full text-center text-[13px] text-black/80" style={{ top: (h - DAY_START) * HOUR + 12 }}>
                {h % 12 || 12} {h < 12 ? 'AM' : 'PM'}
              </span>
            ))}
          </div>
          {days.map((d) => {
            const iso = toISO(d)
            return (
              <div key={iso} className="relative border-l border-dashed border-gs-100">
                {meetings
                  .filter((m) => m.date === iso)
                  .map((m) => {
                    const top = ((minutes(m.start) - DAY_START * 60) / 60) * HOUR + 8
                    const height = Math.max(((minutes(m.end) - minutes(m.start)) / 60) * HOUR - 8, 196)
                    return <EventCard key={m.id} meeting={m} onJoin={() => onJoin(m)} onDelete={() => onDelete(m)} style={{ top, minHeight: height }} />
                  })}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function MonthView({ anchor, meetings, onPick }: { anchor: Date; meetings: Meeting[]; onPick: (d: Date) => void }) {
  const first = new Date(anchor.getFullYear(), anchor.getMonth(), 1)
  const start = weekStart(first)
  const cells = Array.from({ length: 42 }, (_, i) => addDays(start, i))
  const [now] = useState(() => new Date())
  const today = toISO(now)

  return (
    <section aria-label="Month" className="overflow-hidden rounded-[15px] bg-white">
      <div className="grid grid-cols-7 bg-background/80 text-[13px] font-medium text-black/60">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
          <span key={d} className="px-3 py-2.5">
            {d}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {cells.map((d) => {
          const iso = toISO(d)
          const items = meetings.filter((m) => m.date === iso)
          const inMonth = d.getMonth() === anchor.getMonth()
          return (
            <button
              key={iso}
              type="button"
              onClick={() => onPick(d)}
              className={`flex min-h-[104px] cursor-pointer flex-col gap-1 border-t border-l border-gs-100 p-2 text-left hover:bg-background/60 ${inMonth ? '' : 'bg-background/40'}`}
            >
              <span className={`flex size-6 items-center justify-center rounded-full text-[13px] ${iso === today ? 'bg-primary font-semibold' : inMonth ? 'text-black' : 'text-black/35'}`}>
                {d.getDate()}
              </span>
              {items.slice(0, 2).map((m) => (
                <span key={m.id} className="truncate rounded-md bg-primary/15 px-1.5 py-0.5 text-[11px] font-medium text-ink">
                  {m.start} {m.title}
                </span>
              ))}
              {items.length > 2 && <span className="text-[11px] text-grey-text">+{items.length - 2} more</span>}
            </button>
          )
        })}
      </div>
    </section>
  )
}
