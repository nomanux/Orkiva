import { useRef, useState, type CSSProperties } from 'react'
import { useDismiss } from '../../hooks/useDismiss'
import { formatTime, meetingState, type Meeting } from '../../data/meetingsStore'
import googleMeet from '../../assets/calendar/google-meet.svg'
import googleCalendar from '../../assets/calendar/google-calendar.svg'
import menuDots from '../../assets/calendar/menu-dots.svg'
import clockIcon from '../../assets/calendar/clock.svg'
import videoAdd from '../../assets/calendar/video-add.svg'

type EventCardProps = { meeting: Meeting; onJoin: () => void; onDelete: () => void; compact?: boolean; style?: CSSProperties }

export function AppIcon({ app, size = 36 }: { app: Meeting['app']; size?: number }) {
  return (
    <span className="flex shrink-0 items-center justify-center rounded-full border border-white bg-[rgba(255,253,243,0.5)]" style={{ width: size, height: size }}>
      {app === 'meet' ? (
        <img src={googleMeet} alt="Google Meet" width={18} height={15} />
      ) : (
        <img src={googleCalendar} alt="Google Calendar" width={18} height={18} />
      )}
    </span>
  )
}

export function AttendeeStack({ photos, size = 24 }: { photos: string[]; size?: number }) {
  return (
    <span className="flex">
      {photos.map((p, i) => (
        <img key={i} src={p} alt="" width={size} height={size} className="rounded-full ring-2 ring-background" style={{ marginLeft: i ? -size * 0.3 : 0 }} />
      ))}
    </span>
  )
}

export function EventCard({ meeting, onJoin, onDelete, style }: EventCardProps) {
  const [menu, setMenu] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useDismiss(ref, menu, () => setMenu(false))
  const state = meetingState(meeting)
  const cancelled = meeting.status === 'Cancelled'

  return (
    <article
      style={style}
      className={`absolute right-1.5 left-1.5 flex flex-col gap-2 overflow-hidden rounded-[10px] border border-white bg-background p-3 shadow-[0px_0px_7px_rgba(0,0,0,0.12)] ${cancelled ? 'opacity-50' : ''}`}
    >
      <div className="flex items-center justify-between">
        <AppIcon app={meeting.app} />
        <div ref={ref} className="relative flex">
          <button
            type="button"
            aria-label={`Options for ${meeting.title}`}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={() => setMenu((m) => !m)}
            className="cursor-pointer rounded-md p-0.5 hover:bg-white"
          >
            <img src={menuDots} alt="" width={18} height={18} />
          </button>
          {menu && (
            <ul role="menu" className="absolute top-full right-0 z-20 mt-1 w-36 overflow-hidden rounded-xl bg-white py-1 shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
              <li role="none">
                <button type="button" role="menuitem" onClick={() => (setMenu(false), onJoin())} className="w-full cursor-pointer px-4 py-2 text-left text-[13px] font-medium hover:bg-background">
                  Join meeting
                </button>
              </li>
              <li role="none">
                <button type="button" role="menuitem" onClick={() => (setMenu(false), onDelete())} className="w-full cursor-pointer px-4 py-2 text-left text-[13px] font-medium text-error hover:bg-background">
                  Delete
                </button>
              </li>
            </ul>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <h3 className={`text-[15px] leading-[1.25] font-semibold tracking-[-0.3px] text-black ${cancelled ? 'line-through' : ''}`}>{meeting.title}</h3>
        <p className="flex items-center gap-1.5 text-[13px] text-black/80">
          <img src={clockIcon} alt="" width={16} height={16} />
          {formatTime(meeting.start, true)} - {formatTime(meeting.end, true)}
        </p>
      </div>
      <AttendeeStack photos={meeting.attendees} />
      <div className="mt-auto">
        {state === 'live' && !cancelled ? (
          <button
            type="button"
            onClick={onJoin}
            className="flex h-9 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary text-[13px] font-semibold text-black hover:brightness-95"
          >
            <img src={videoAdd} alt="" width={16} height={16} />
            Join a Meeting
          </button>
        ) : (
          <p className={`text-[13px] font-semibold ${state === 'upcoming' ? 'text-[#b37f00]' : 'text-black/40'}`}>
            {cancelled ? 'Cancelled' : state === 'upcoming' ? (meeting.status === 'Tentative' ? 'Upcoming · Tentative' : 'Upcoming') : 'Ended'}
          </p>
        )}
      </div>
    </article>
  )
}
