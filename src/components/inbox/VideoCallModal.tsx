import { useEffect, useId, useRef, useState } from 'react'
import { Modal } from '../ui/Modal'
import { ChatAvatar } from './ChatAvatar'
import { useDismiss } from '../../hooks/useDismiss'
import { CALL_PARTICIPANTS, INVITABLE, type CallParticipant } from '../../data/inbox'
import callPhoto from '../../assets/inbox/call-photo.jpg'
import roomAvatar from '../../assets/inbox/room-avatar.jpg'
import arrowLeft from '../../assets/inbox/arrow-left.svg'
import leaveIcon from '../../assets/inbox/leave.svg'
import micIcon from '../../assets/inbox/mic.svg'
import videoIcon from '../../assets/inbox/video-call.svg'
import hangupIcon from '../../assets/inbox/hangup.svg'
import volumeIcon from '../../assets/inbox/volume.svg'
import screenIcon from '../../assets/inbox/screen-share.svg'
import moreCircle from '../../assets/inbox/more-circle.svg'
import recDot from '../../assets/inbox/rec-dot.svg'
import plusIcon from '../../assets/inbox/plus.svg'
import moreHorizontal from '../../assets/inbox/more-horizontal.svg'
import searchIcon from '../../assets/inbox/search.svg'
import addPerson from '../../assets/inbox/add-person.svg'
import sendIcon from '../../assets/inbox/send.svg'

type RoomMessage = { id: string; from: 'them' | 'me'; text: string; time: string }

const GLASS = 'bg-[rgba(82,88,102,0.24)] backdrop-blur-[31px]'

function useElapsed(start = 829) {
  const [secs, setSecs] = useState(start)
  useEffect(() => {
    const id = setInterval(() => setSecs((s) => s + 1), 1000)
    return () => clearInterval(id)
  }, [])
  return `${String(Math.floor(secs / 60)).padStart(2, '0')}:${String(secs % 60).padStart(2, '0')}`
}

export function VideoCallModal({ open, onClose, name }: { open: boolean; onClose: () => void; name: string }) {
  const titleId = useId()
  return (
    <Modal open={open} onClose={onClose} labelledBy={titleId} className="h-[min(780px,calc(100vh-48px))] w-[min(1240px,calc(100vw-48px))] rounded-[18px]">
      <CallBody titleId={titleId} onClose={onClose} name={name} />
    </Modal>
  )
}

function CallBody({ titleId, onClose, name }: { titleId: string; onClose: () => void; name: string }) {
  const elapsed = useElapsed()
  const [mic, setMic] = useState(true)
  const [camera, setCamera] = useState(true)
  const [speaker, setSpeaker] = useState(true)
  const [sharing, setSharing] = useState(false)
  const [participants, setParticipants] = useState<CallParticipant[]>(CALL_PARTICIPANTS)
  const [picker, setPicker] = useState(false)
  const [messages, setMessages] = useState<RoomMessage[]>([
    { id: 'r1', from: 'them', text: 'Hey Martin, can you please review the latest design when you can?', time: 'Friday 2:20pm' },
    { id: 'r2', from: 'me', text: 'Sure thing, I’ll have a look today.', time: 'Friday 2:20pm' },
  ])
  const [draft, setDraft] = useState('')

  const control = (on: boolean) => `flex size-12 cursor-pointer items-center justify-center rounded-full transition-colors ${on ? 'bg-white' : 'bg-white/45'}`

  return (
    <div className="flex h-full gap-4 p-5">
      {/* Stage */}
      <div className="flex min-w-0 flex-[2] flex-col gap-4">
        <header className="flex items-center gap-3 rounded-[20px] bg-white">
          <button type="button" aria-label="Back to chat" onClick={onClose} className="flex size-11 cursor-pointer items-center justify-center rounded-xl bg-[#f0f0f0] hover:bg-stock">
            <img src={arrowLeft} alt="" width={22} height={22} className="-scale-y-100 rotate-90" />
          </button>
          <div className="min-w-0 flex-1">
            <h2 id={titleId} className="text-[18px] leading-[1.4] font-semibold text-black">
              Video Call
            </h2>
            <p className="truncate text-[13px] text-black/60">Video recording in progress with {name}…</p>
          </div>
          <button type="button" aria-label="Leave call" onClick={onClose} className="flex size-11 cursor-pointer items-center justify-center rounded-xl bg-[#ff6875] hover:brightness-95">
            <img src={leaveIcon} alt="" width={20} height={20} className="rotate-180" />
          </button>
        </header>

        <div className="relative min-h-0 flex-1 overflow-hidden rounded-[18px] bg-ink">
          {camera ? (
            <img src={callPhoto} alt={`${name} on video`} className="absolute inset-0 size-full object-cover" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <ChatAvatar avatar={{ photo: roomAvatar }} size={96} />
            </div>
          )}
          <div className={`absolute top-4 left-4 flex h-12 items-center gap-2 rounded-full pr-4 pl-1.5 ${GLASS}`}>
            <img src={roomAvatar} alt="" width={36} height={36} className="size-9 rounded-full object-cover" />
            <span className="text-[14px] font-medium text-white">{name}</span>
          </div>
          <div className="absolute top-4 right-4 flex gap-2">
            <span className={`flex h-12 items-center gap-2 rounded-full px-3 ${GLASS}`} aria-label={`Recording, ${elapsed}`}>
              <img src={recDot} alt="" width={20} height={20} />
              <span className="font-geist text-[14px] font-medium text-white tabular-nums">{elapsed}</span>
            </span>
            <button type="button" aria-label="More call options" className={`flex size-12 cursor-pointer items-center justify-center rounded-full ${GLASS}`}>
              <img src={moreCircle} alt="" width={28} height={28} />
            </button>
          </div>
          <div className={`absolute bottom-4 left-1/2 flex h-16 -translate-x-1/2 items-center gap-3 rounded-full px-2 ${GLASS}`}>
            <button type="button" aria-label={mic ? 'Mute microphone' : 'Unmute microphone'} aria-pressed={!mic} onClick={() => setMic((v) => !v)} className={control(mic)}>
              <img src={micIcon} alt="" width={22} height={22} />
            </button>
            <button type="button" aria-label={camera ? 'Turn camera off' : 'Turn camera on'} aria-pressed={!camera} onClick={() => setCamera((v) => !v)} className={control(camera)}>
              <img src={videoIcon} alt="" width={22} height={22} />
            </button>
            <button type="button" aria-label="End call" onClick={onClose} className="flex size-12 cursor-pointer items-center justify-center rounded-full bg-[#ff6875] hover:brightness-95">
              <img src={hangupIcon} alt="" width={22} height={22} className="brightness-0 invert" />
            </button>
            <button type="button" aria-label={speaker ? 'Mute speaker' : 'Unmute speaker'} aria-pressed={!speaker} onClick={() => setSpeaker((v) => !v)} className={control(speaker)}>
              <img src={volumeIcon} alt="" width={22} height={22} />
            </button>
            <button type="button" aria-label={sharing ? 'Stop sharing screen' : 'Share screen'} aria-pressed={sharing} onClick={() => setSharing((v) => !v)} className={`${control(true)} ${sharing ? 'ring-2 ring-primary' : ''}`}>
              <img src={screenIcon} alt="" width={22} height={22} />
            </button>
          </div>
        </div>
      </div>

      {/* Side panel */}
      <div className="flex w-[340px] shrink-0 flex-col gap-4">
        <section className="relative flex flex-col gap-3 rounded-[20px] bg-white">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-[18px] leading-[1.4] font-semibold text-black">Participants</h3>
              <p className="text-[13px] text-black/50">Total Members {String(participants.length).padStart(2, '0')}</p>
            </div>
            <button
              type="button"
              aria-label="Add participant"
                onMouseDown={(e) => e.stopPropagation()}
              aria-expanded={picker}
              onClick={() => setPicker((p) => !p)}
              className="flex size-11 cursor-pointer items-center justify-center rounded-xl bg-[#f0f0f0] hover:bg-stock"
            >
              <img src={plusIcon} alt="" width={20} height={20} />
            </button>
          </div>
          {picker && (
            <ParticipantPicker
              exclude={participants.map((p) => p.id)}
              onClose={() => setPicker(false)}
              onAdd={(p) => {
                setParticipants((list) => [...list, p])
                setPicker(false)
              }}
            />
          )}
          <ul className="flex max-h-[220px] flex-col gap-2 overflow-y-auto">
            {participants.map((p) => (
              <li key={p.id} className="flex items-center gap-3 rounded-2xl border border-stroke-soft px-3 py-2.5">
                <ChatAvatar avatar={p.avatar} size={40} />
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-[14px] font-semibold text-[#070707]">{p.name}</span>
                  <span className="truncate text-[12px] text-black/50">{p.role}</span>
                </span>
                <img src={moreHorizontal} alt="" width={18} height={4} />
              </li>
            ))}
          </ul>
        </section>

        <section className="flex min-h-0 flex-1 flex-col justify-between gap-3 rounded-[20px] bg-white">
          <h3 className="text-[16px] font-semibold text-black/45">Room Chat</h3>
          <ul className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto">
            {messages.map((m) => (
              <li key={m.id} className={`flex gap-2.5 ${m.from === 'me' ? 'justify-end pl-10' : ''}`}>
                {m.from === 'them' && (
                  <span className="relative size-8 shrink-0 self-start">
                    <img src={roomAvatar} alt="" width={32} height={32} className="size-8 rounded-full object-cover" />
                    <span className="absolute right-0 bottom-0 size-2 rounded-full border border-white bg-[#12b76a]" />
                  </span>
                )}
                <span className="flex min-w-0 flex-1 flex-col gap-1">
                  <span className="flex justify-between gap-2 text-[12px]">
                    <span className="font-medium text-strong-950">{m.from === 'me' ? 'You' : name}</span>
                    <span className="text-black/45">{m.time}</span>
                  </span>
                  <span className={`rounded-xl px-3 py-2 text-[13px] font-medium text-black shadow-[0px_1px_3px_rgba(16,24,40,0.1)] ${m.from === 'me' ? 'bg-[#f5f7fa]' : 'border border-stroke-soft bg-white'}`}>
                    {m.text}
                  </span>
                </span>
              </li>
            ))}
          </ul>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (!draft.trim()) return
              setMessages((list) => [...list, { id: `r${Date.now()}`, from: 'me', text: draft.trim(), time: 'Just now' }])
              setDraft('')
            }}
            className="flex h-11 items-center gap-2 rounded-xl border border-stroke-soft px-3 focus-within:border-primary"
          >
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Send your message…"
              aria-label="Room chat message"
              className="min-w-0 flex-1 bg-transparent text-[13px] outline-none placeholder:text-soft-400"
            />
            <button type="submit" aria-label="Send" disabled={!draft.trim()} className="cursor-pointer disabled:opacity-40">
              <img src={sendIcon} alt="" width={20} height={20} />
            </button>
          </form>
        </section>
      </div>
    </div>
  )
}

function ParticipantPicker({ exclude, onAdd, onClose }: { exclude: string[]; onAdd: (p: CallParticipant) => void; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  useDismiss(ref, true, onClose)
  const [query, setQuery] = useState('')
  const people = INVITABLE.filter((p) => !exclude.includes(p.id) && p.name.toLowerCase().includes(query.trim().toLowerCase()))

  return (
    <div ref={ref} role="dialog" aria-label="Add participant" className="absolute top-14 right-0 z-10 flex w-[360px] flex-col gap-2 rounded-xl border border-stroke-soft bg-white p-3 shadow-[0px_8px_24px_rgba(16,24,40,0.12)]">
      <label className="flex h-11 items-center gap-2 rounded-2xl bg-[#fafafa] px-4">
        <img src={searchIcon} alt="" width={18} height={18} />
        <input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search" aria-label="Search people" className="min-w-0 flex-1 bg-transparent text-[14px] outline-none placeholder:text-black/50" />
      </label>
      <ul className="flex max-h-[300px] flex-col overflow-y-auto">
        {people.map((p) => (
          <li key={p.id}>
            <button type="button" onClick={() => onAdd(p)} className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-2 py-2 text-left hover:bg-background">
              <ChatAvatar avatar={p.avatar} size={40} />
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-[14px] font-semibold text-strong-950">{p.name}</span>
                <span className="truncate text-[12px] text-black/60">{p.role}</span>
              </span>
              <img src={addPerson} alt="" width={20} height={20} />
            </button>
          </li>
        ))}
        {people.length === 0 && <li className="py-4 text-center text-[13px] text-grey-text">No one else to add.</li>}
      </ul>
    </div>
  )
}
