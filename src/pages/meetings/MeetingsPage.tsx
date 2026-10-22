import { useState } from 'react'
import { AppIcon, AttendeeStack } from '../../components/calendar/EventCard'
import { ScheduleModal } from '../../components/calendar/ScheduleModal'
import { VideoCallModal } from '../../components/inbox/VideoCallModal'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { Toast } from '../../components/ui/Toast'
import { useToast } from '../../hooks/useToast'
import { formatTime, meetingState, meetingsStore, minutes, useMeetings, weekStart, addDays, type Meeting } from '../../data/meetingsStore'
import { formatLong, toISO } from '../../lib/dates'
import { useProjects } from '../../data/projects'
import videocamera from '../../assets/dashboard/videocamera.svg'
import plusIcon from '../../assets/projects/plus.svg'
import searchIcon from '../../assets/inbox/search.svg'
import trashIcon from '../../assets/overlays/trash.svg'

type Tab = 'Upcoming' | 'Past' | 'All'

const sortKey = (m: Meeting) => `${m.date} ${m.start}`

/** Not in the Figma file: designed to match the dashboard's "Meeting Notes" card and the Calendar event cards. */
export function MeetingsPage() {
  const meetings = useMeetings()
  const projects = useProjects()
  const projectName = (m: Meeting) => projects.find((p) => p.id === m.projectId)?.name
  const [tab, setTab] = useState<Tab>('Upcoming')
  const [query, setQuery] = useState('')
  const [scheduling, setScheduling] = useState(false)
  const [call, setCall] = useState<Meeting | null>(null)
  const [deleting, setDeleting] = useState<Meeting | null>(null)
  const toast = useToast()
  const [now] = useState(() => new Date())

  const sorted = [...meetings].sort((a, b) => sortKey(a).localeCompare(sortKey(b)))
  const live = sorted.find((m) => meetingState(m) === 'live' && m.status !== 'Cancelled')
  const next = live ?? sorted.find((m) => meetingState(m) === 'upcoming' && m.status !== 'Cancelled')

  const today = toISO(now)
  const monday = weekStart(now)
  const inWeek = (m: Meeting) => m.date >= toISO(monday) && m.date <= toISO(addDays(monday, 6))
  const stats = [
    { label: 'Today', value: meetings.filter((m) => m.date === today).length, hint: 'meetings' },
    { label: 'This Week', value: meetings.filter(inWeek).length, hint: 'meetings' },
    {
      label: 'Hours Scheduled',
      value: Math.round((meetings.filter(inWeek).reduce((sum, m) => sum + minutes(m.end) - minutes(m.start), 0) / 60) * 10) / 10,
      hint: 'this week',
    },
    { label: 'Tentative', value: meetings.filter((m) => m.status === 'Tentative').length, hint: 'need confirmation' },
  ]

  const q = query.trim().toLowerCase()
  const rows = sorted
    .filter((m) => (tab === 'All' ? true : tab === 'Past' ? meetingState(m) === 'ended' : meetingState(m) !== 'ended'))
    .filter((m) => !q || [m.title, m.description, projectName(m) ?? ''].some((f) => f.toLowerCase().includes(q)))
  if (tab === 'Past') rows.reverse()

  return (
    <div className="mt-6 flex flex-col gap-4">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-[24px] leading-[1.3] font-semibold text-ink">Meetings</h1>
          <p className="text-[14px] text-grey-text">Join live calls, review what’s coming up and schedule new ones.</p>
        </div>
        <button type="button" onClick={() => setScheduling(true)} className="flex h-10 cursor-pointer items-center gap-2 rounded-full bg-primary px-4 text-[14px] font-semibold text-black hover:brightness-95">
          <img src={plusIcon} alt="" width={18} height={18} />
          New Meeting
        </button>
      </div>

      <div className="grid grid-cols-4 gap-2.5">
        {stats.map((s) => (
          <div key={s.label} className="rounded-[15px] bg-white p-4">
            <p className="text-[14px] text-grey-text">{s.label}</p>
            <p className="mt-2 text-[32px] leading-[1.1] font-bold tracking-[-1.5px]">{s.value}</p>
            <p className="mt-1 text-[12px] text-black/50">{s.hint}</p>
          </div>
        ))}
      </div>

      <div className="flex items-start gap-2.5">
        <section aria-label={live ? 'Live now' : 'Next meeting'} className="flex w-[clamp(340px,30vw,440px)] shrink-0 flex-col gap-3 rounded-[15px] bg-white p-4">
          <h2 className="flex items-center gap-2 text-[16px] font-semibold text-ink">
            {live && <span className="size-2 animate-pulse rounded-full bg-[#e5484d]" aria-hidden />}
            {live ? 'Live now' : 'Next up'}
          </h2>
          {next ? (
            <article className="flex flex-col gap-3 rounded-[24px] bg-black p-5 text-white">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-[22px] leading-[1.15] font-medium tracking-[-0.6px]">{next.title}</h3>
                <AppIcon app={next.app} />
              </div>
              <p className="text-[14px] text-white/60">
                {next.date === today ? 'Today' : formatLong(next.date)} · {formatTime(next.start)} - {formatTime(next.end)}
              </p>
              <p className="line-clamp-2 text-[13px] text-white/70">{next.description}</p>
              {projectName(next) && <p className="text-[12px] font-semibold text-primary">{projectName(next)}</p>}
              <AttendeeStack ids={next.attendeeIds} size={28} />
              <button type="button" onClick={() => setCall(next)} className="mt-1 flex h-11 cursor-pointer items-center justify-center gap-2 rounded-full bg-primary text-[15px] font-semibold text-black hover:brightness-95">
                <img src={videocamera} alt="" width={20} height={20} />
                {live ? 'Join Meeting' : 'Start Early'}
              </button>
            </article>
          ) : (
            <p className="rounded-xl bg-background p-6 text-center text-[13px] text-grey-text">Nothing scheduled. Enjoy the quiet!</p>
          )}
        </section>

        <section aria-label="All meetings" className="flex min-w-0 flex-1 flex-col rounded-[15px] bg-white">
          <div className="flex items-center justify-between gap-3 border-b border-gs-100 px-4 py-3">
            <div role="tablist" className="flex gap-1 rounded-full bg-background p-1">
              {(['Upcoming', 'Past', 'All'] as const).map((t) => (
                <button
                  key={t}
                  role="tab"
                  type="button"
                  aria-selected={tab === t}
                  onClick={() => setTab(t)}
                  className={`h-8 cursor-pointer rounded-full px-4 text-[13px] font-medium ${tab === t ? 'bg-white text-black shadow-sm' : 'text-black/55 hover:text-black'}`}
                >
                  {t}
                </button>
              ))}
            </div>
            <label className="flex h-9 w-64 items-center gap-2 rounded-lg border border-gs-100 px-3 focus-within:border-primary">
              <img src={searchIcon} alt="" width={16} height={16} />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search meetings" aria-label="Search meetings" className="min-w-0 flex-1 bg-transparent text-[13px] outline-none" />
            </label>
          </div>
          <ul className="flex flex-col">
            {rows.map((m) => {
              const state = meetingState(m)
              return (
                <li key={m.id} className="flex items-center gap-4 border-b border-gs-100 px-4 py-3 last:border-b-0">
                  <AppIcon app={m.app} size={40} />
                  <div className="min-w-0 flex-1">
                    <p className={`truncate text-[14px] font-semibold text-ink ${m.status === 'Cancelled' ? 'line-through opacity-60' : ''}`}>{m.title}</p>
                    <p className="truncate text-[12px] text-grey-text">
                      {projectName(m) && <span className="font-semibold text-ink/70">{projectName(m)} · </span>}
                      {m.description}
                    </p>
                  </div>
                  <div className="w-[170px] shrink-0 text-[13px]">
                    <p className="font-medium text-ink">{m.date === today ? 'Today' : formatLong(m.date)}</p>
                    <p className="text-grey-text">
                      {formatTime(m.start)} - {formatTime(m.end)}
                    </p>
                  </div>
                  <AttendeeStack ids={m.attendeeIds} />
                  <span
                    className={`w-[92px] shrink-0 rounded-full px-2 py-1 text-center text-[11px] font-semibold ${
                      m.status === 'Cancelled'
                        ? 'bg-error-50 text-error'
                        : state === 'live'
                          ? 'bg-primary/20 text-primary-dark'
                          : state === 'ended'
                            ? 'bg-background text-black/50'
                            : m.status === 'Tentative'
                              ? 'bg-[#fff6db] text-[#9a6b00]'
                              : 'bg-[#e8f1ff] text-[#1f5fbf]'
                    }`}
                  >
                    {m.status === 'Cancelled' ? 'Cancelled' : state === 'live' ? 'Live' : state === 'ended' ? 'Ended' : m.status === 'Tentative' ? 'Tentative' : 'Upcoming'}
                  </span>
                  <div className="flex w-[132px] shrink-0 justify-end gap-1.5">
                    {state !== 'ended' && m.status !== 'Cancelled' && (
                      <button type="button" onClick={() => setCall(m)} className="h-8 cursor-pointer rounded-lg bg-primary px-3 text-[12px] font-semibold text-black hover:brightness-95">
                        {state === 'live' ? 'Join' : 'Start'}
                      </button>
                    )}
                    <button type="button" aria-label={`Delete ${m.title}`} onClick={() => setDeleting(m)} className="flex size-8 cursor-pointer items-center justify-center rounded-lg border border-gs-100 hover:bg-gs-25">
                      <img src={trashIcon} alt="" width={16} height={16} />
                    </button>
                  </div>
                </li>
              )
            })}
            {rows.length === 0 && <li className="px-4 py-10 text-center text-[13px] text-grey-text">No meetings here.</li>}
          </ul>
        </section>
      </div>

      <ScheduleModal
        open={scheduling}
        defaultDate={today}
        onClose={() => setScheduling(false)}
        onSaved={(title) => {
          setScheduling(false)
          setTab('Upcoming')
          toast.show(`Scheduled “${title}”`)
        }}
      />
      <VideoCallModal open={!!call} onClose={() => setCall(null)} name={call?.title ?? ''} />
      <ConfirmDialog
        open={!!deleting}
        onCancel={() => setDeleting(null)}
        onConfirm={() => {
          if (deleting) meetingsStore.remove(deleting.id)
          toast.show(`Deleted “${deleting?.title}”`)
          setDeleting(null)
        }}
        icon={trashIcon}
        tone="danger"
        title="Delete meeting?"
        message="Attendees will be notified that this meeting was cancelled. This action can’t be undone."
        confirmLabel="Delete"
      />
      <Toast message={toast.message} />
    </div>
  )
}
