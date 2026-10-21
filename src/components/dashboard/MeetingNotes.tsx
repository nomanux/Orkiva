import { Card, CardTitle } from '../ui/Card'
import plusButton from '../../assets/dashboard/plus-button.svg'
import dotsButtonWhite from '../../assets/dashboard/dots-button-white.svg'
import videocamera from '../../assets/dashboard/videocamera.svg'
import { meeting } from '../../data/dashboard'

export function MeetingNotes() {
  return (
    <Card className="h-[355px] w-full">
      <div className="absolute top-4 right-4 left-4 flex items-center justify-between">
        <CardTitle>Meeting Notes</CardTitle>
        <button type="button" aria-label="Add meeting note" className="cursor-pointer rounded-full">
          <img src={plusButton} alt="" width={38} height={38} />
        </button>
      </div>

      {/* Stacked cards behind the current meeting */}
      <div className="absolute top-[113px] right-4 left-[74px] h-[203.346px] rounded-[29.21px] bg-background" />
      <div className="absolute top-[133px] right-[34px] left-[45px] h-[195px] rounded-[29.21px] bg-muted" />

      <article className="absolute top-[155px] right-[52px] left-4 h-[184px] overflow-hidden rounded-[29.21px] bg-black p-4">
        <div className="flex items-start justify-between">
          <h3 className="w-[189px] text-[24px] leading-[1.1] font-medium tracking-[-0.72px] text-white">{meeting.title}</h3>
          <button type="button" aria-label="Meeting options" className="cursor-pointer rounded-full">
            <img src={dotsButtonWhite} alt="" width={38} height={38} />
          </button>
        </div>
        <p className="mt-4 text-[16px] leading-[1.1] tracking-[-0.48px] text-white/50">Time: {meeting.time}</p>
        <button
          type="button"
          className="absolute top-[123px] left-1/2 flex h-[45px] w-[min(244px,calc(100%-32px))] -translate-x-1/2 cursor-pointer items-center justify-center gap-2 rounded-[29.21px] bg-primary hover:brightness-95"
        >
          <img src={videocamera} alt="" width={22.4691} height={22.4691} />
          <span className="text-[16px] leading-[1.1] font-semibold tracking-[-0.48px]">Start Meeting</span>
        </button>
      </article>
    </Card>
  )
}
