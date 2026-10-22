import { useState } from 'react'
import { Link } from 'react-router'
import { Card, CardTitle } from '../ui/Card'
import { ScheduleModal } from '../calendar/ScheduleModal'
import { VideoCallModal } from '../inbox/VideoCallModal'
import { Toast } from '../ui/Toast'
import { useToast } from '../../hooks/useToast'
import { formatTime, meetingState, nextMeeting, useMeetings, type Meeting } from '../../data/meetingsStore'
import { relativeDue, toISO } from '../../lib/dates'
import plusButton from '../../assets/dashboard/plus-button.svg'
import dotsButtonWhite from '../../assets/dashboard/dots-button-white.svg'
import videocamera from '../../assets/dashboard/videocamera.svg'

export function MeetingNotes() {
  const meeting = nextMeeting(useMeetings())
  const [scheduling, setScheduling] = useState(false)
  const [call, setCall] = useState<Meeting | null>(null)
  const toast = useToast()
  const [today] = useState(() => toISO(new Date()))
  const live = meeting && meetingState(meeting) === 'live'

  return (
    <Card className="h-[355px] w-full">
      <div className="absolute top-4 right-4 left-4 flex items-center justify-between">
        <CardTitle>{live ? 'Happening Now' : 'Next Meeting'}</CardTitle>
        <button type="button" aria-label="Schedule a meeting" onClick={() => setScheduling(true)} className="cursor-pointer rounded-full">
          <img src={plusButton} alt="" width={38} height={38} />
        </button>
      </div>

      {/* Stacked cards behind the current meeting */}
      <div className="absolute top-[113px] right-4 left-[74px] h-[203.346px] rounded-[29.21px] bg-background" />
      <div className="absolute top-[133px] right-[34px] left-[45px] h-[195px] rounded-[29.21px] bg-muted" />

      <article className="absolute top-[155px] right-[52px] left-4 h-[184px] overflow-hidden rounded-[29.21px] bg-black p-4">
        {meeting ? (
          <>
            <div className="flex items-start justify-between gap-2">
              <h3 className="line-clamp-2 text-[24px] leading-[1.1] font-medium tracking-[-0.72px] text-white">{meeting.title}</h3>
              <Link to="/meetings" aria-label="All meetings" className="shrink-0 rounded-full">
                <img src={dotsButtonWhite} alt="" width={38} height={38} />
              </Link>
            </div>
            <p className="mt-3 text-[15px] leading-[1.1] tracking-[-0.48px] text-white/50">
              {meeting.date === today ? 'Today' : relativeDue(meeting.date)} · {formatTime(meeting.start)} - {formatTime(meeting.end)}
            </p>
            <button
              type="button"
              onClick={() => setCall(meeting)}
              className="absolute top-[123px] left-1/2 flex h-[45px] w-[min(244px,calc(100%-32px))] -translate-x-1/2 cursor-pointer items-center justify-center gap-2 rounded-[29.21px] bg-primary hover:brightness-95"
            >
              <img src={videocamera} alt="" width={22.4691} height={22.4691} />
              <span className="text-[16px] leading-[1.1] font-semibold tracking-[-0.48px]">{live ? 'Join Meeting' : 'Start Meeting'}</span>
            </button>
          </>
        ) : (
          <p className="text-[16px] text-white/60">No upcoming meetings. Tap + to schedule one.</p>
        )}
      </article>

      <ScheduleModal
        open={scheduling}
        defaultDate={today}
        onClose={() => setScheduling(false)}
        onSaved={(title) => {
          setScheduling(false)
          toast.show(`Scheduled “${title}”`)
        }}
      />
      <VideoCallModal open={!!call} onClose={() => setCall(null)} name={call?.title ?? ''} />
      <Toast message={toast.message} />
    </Card>
  )
}
