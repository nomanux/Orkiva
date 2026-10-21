import { useEffect, useRef, useState, type ReactNode } from 'react'
import { ChatAvatar } from './ChatAvatar'
import { InboxPopover } from './InboxPopover'
import type { Chat, Message } from '../../data/inbox'
import onlineDot from '../../assets/inbox/online-dot.svg'
import searchIcon from '../../assets/inbox/search-header.svg'
import callIcon from '../../assets/inbox/call.svg'
import videoIcon from '../../assets/inbox/video.svg'
import moreVertical from '../../assets/inbox/more-vertical.svg'
import closeIcon from '../../assets/inbox/close.svg'
import callMissed from '../../assets/inbox/call-missed.svg'
import emojiIcon from '../../assets/inbox/emoji.svg'
import galleryIcon from '../../assets/inbox/gallery.svg'
import paperclipIcon from '../../assets/inbox/paperclip.svg'
import sendIcon from '../../assets/inbox/send.svg'

export type ChatSettings = { muted: boolean; restricted: boolean }

type ConversationProps = {
  chat: Chat
  settings: ChatSettings
  onSettings: (s: ChatSettings) => void
  onTogglePin: () => void
  onSend: (text: string) => void
  onCall: () => void
  onVideoCall: () => void
  onBlock: () => void
  onReport: () => void
}

const HEADER_BUTTON = 'flex size-10 cursor-pointer items-center justify-center rounded-xl bg-background hover:bg-stock'

/** Wraps matches of `q` in <mark> for in-conversation search. */
function highlight(text: string, q: string): ReactNode {
  if (!q) return text
  const parts = text.split(new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'))
  return parts.map((p, i) => (p.toLowerCase() === q.toLowerCase() ? <mark key={i} className="rounded bg-primary/40 px-0.5 text-ink">{p}</mark> : p))
}

export function Conversation({ chat, settings, onSettings, onTogglePin, onSend, onCall, onVideoCall, onBlock, onReport }: ConversationProps) {
  const [actionsOpen, setActionsOpen] = useState(false)
  const [searching, setSearching] = useState(false)
  const [query, setQuery] = useState('')
  const [draft, setDraft] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const q = query.trim()
  const matchCount = q ? chat.messages.filter((m) => 'text' in m && m.text.toLowerCase().includes(q.toLowerCase())).length : 0

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
  }, [chat.id, chat.messages.length])

  const send = (text = draft) => {
    if (!text.trim()) return
    onSend(text.trim())
    setDraft('')
  }

  return (
    <section aria-label={`Conversation with ${chat.name}`} className="relative flex min-w-0 flex-1 flex-col overflow-hidden rounded-[22px] bg-white">
      <header className="flex items-center justify-between gap-4 border-b border-gs-100 px-5 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <ChatAvatar avatar={chat.headerPhoto ? { photo: chat.headerPhoto } : chat.avatar} size={40} />
          <div className="min-w-0">
            <p className="flex items-center gap-2 text-[16px] leading-[1.4] font-semibold text-black">
              <span className="truncate">{chat.name}</span>
              {chat.online && <img src={onlineDot} alt="Online" width={8} height={8} />}
            </p>
            <p className="truncate text-[13px] text-black/60">{chat.role}</p>
          </div>
        </div>
        <div className="flex shrink-0 gap-2">
          <button type="button" aria-label="Search in conversation" aria-pressed={searching} onClick={() => setSearching((s) => !s)} className={HEADER_BUTTON}>
            <img src={searchIcon} alt="" width={20} height={20} />
          </button>
          <button type="button" aria-label={`Call ${chat.name}`} onClick={onCall} className={HEADER_BUTTON}>
            <img src={callIcon} alt="" width={20} height={20} />
          </button>
          <button type="button" aria-label={`Video call ${chat.name}`} onClick={onVideoCall} className={HEADER_BUTTON}>
            <img src={videoIcon} alt="" width={20} height={20} />
          </button>
          <button
            type="button"
            aria-label="Conversation actions"
                onMouseDown={(e) => e.stopPropagation()}
            aria-expanded={actionsOpen}
            onClick={() => setActionsOpen((o) => !o)}
            className={HEADER_BUTTON}
          >
            <img src={moreVertical} alt="" width={20} height={20} />
          </button>
        </div>
      </header>

      {actionsOpen && (
        <InboxPopover
          title="Action"
          className="top-[60px] right-5"
          onClose={() => setActionsOpen(false)}
          rows={[
            { kind: 'toggle', label: 'Mute Notifications', value: settings.muted, onChange: (v) => onSettings({ ...settings, muted: v }) },
            { kind: 'toggle', label: 'Restrict', value: settings.restricted, onChange: (v) => onSettings({ ...settings, restricted: v }) },
            { kind: 'toggle', label: 'Pin', value: chat.pinned, onChange: onTogglePin },
            { kind: 'link', label: 'Block User', onClick: () => (setActionsOpen(false), onBlock()) },
            { kind: 'link', label: 'Report User', danger: true, onClick: () => (setActionsOpen(false), onReport()) },
          ]}
        />
      )}

      {searching && (
        <div className="flex items-center gap-2 border-b border-gs-100 bg-white px-5 py-2">
          <img src={searchIcon} alt="" width={18} height={18} />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Escape' && (setSearching(false), setQuery(''))}
            placeholder="Search in this conversation"
            aria-label="Search in this conversation"
            className="min-w-0 flex-1 bg-transparent text-[14px] outline-none placeholder:text-black/50"
          />
          {q && <span className="text-[12px] text-grey-text" aria-live="polite">{matchCount} {matchCount === 1 ? 'match' : 'matches'}</span>}
          <button type="button" aria-label="Close search" onClick={() => (setSearching(false), setQuery(''))} className="cursor-pointer">
            <img src={closeIcon} alt="" width={16} height={16} />
          </button>
        </div>
      )}

      <div ref={scrollRef} className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto bg-background px-6 py-5">
        <p className="text-center text-[13px] font-medium text-black/60">02 January 2024 - 04:56 PM</p>
        {chat.messages.map((m) => (
          <MessageRow key={m.id} message={m} chat={chat} query={q} />
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          send()
        }}
        className="flex items-center gap-3 bg-background px-6 pb-5"
      >
        <div className="flex h-[52px] flex-1 items-center gap-3 rounded-2xl bg-white px-4 focus-within:ring-2 focus-within:ring-primary/40">
          <div className="flex gap-1">
            <button type="button" aria-label="Add emoji" onClick={() => setDraft((d) => d + '😊')} className="cursor-pointer rounded-full p-1 hover:bg-background">
              <img src={emojiIcon} alt="" width={20} height={20} />
            </button>
            <button type="button" aria-label="Attach image" onClick={() => fileRef.current?.click()} className="cursor-pointer rounded-full p-1 hover:bg-background">
              <img src={galleryIcon} alt="" width={20} height={20} />
            </button>
            <button type="button" aria-label="Attach file" onClick={() => fileRef.current?.click()} className="cursor-pointer rounded-full p-1 hover:bg-background">
              <img src={paperclipIcon} alt="" width={20} height={20} />
            </button>
            <input
              ref={fileRef}
              type="file"
              hidden
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) send(`📎 ${file.name}`)
                e.target.value = ''
              }}
            />
          </div>
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={settings.restricted ? 'Messaging is restricted for this chat' : 'Send your message…'}
            disabled={settings.restricted}
            aria-label="Message"
            className="min-w-0 flex-1 bg-transparent text-[14px] text-ink outline-none placeholder:text-black/50 disabled:cursor-not-allowed"
          />
          <button type="submit" aria-label="Send message" disabled={!draft.trim()} className="cursor-pointer rounded-full p-1 hover:bg-background disabled:cursor-default disabled:opacity-40">
            <img src={sendIcon} alt="" width={22} height={22} />
          </button>
        </div>
      </form>
    </section>
  )
}

function MessageRow({ message, chat, query }: { message: Message; chat: Chat; query: string }) {
  if ('kind' in message) {
    return (
      <div className="flex justify-end">
        <div className="flex w-[260px] items-center gap-3 rounded-xl bg-white px-3 py-2.5">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#fb4f57]">
            <img src={callMissed} alt="" width={18} height={18} />
          </span>
          <span className="flex flex-1 flex-col gap-0.5">
            <span className="text-[14px] font-semibold text-black">Incoming Call</span>
            <span className="flex justify-between text-[12px] text-black/60">
              <span>Missed</span>
              <span>{message.time}</span>
            </span>
          </span>
        </div>
      </div>
    )
  }

  const dim = query && !message.text.toLowerCase().includes(query.toLowerCase())
  const bubble = (
    <p className="rounded-xl bg-white px-3.5 py-2.5 text-[14px] leading-[1.55] font-medium text-black/70">{highlight(message.text, query)}</p>
  )

  if (message.from === 'me') {
    return (
      <div className={`ml-auto max-w-[min(72%,760px)] transition-opacity ${dim ? 'opacity-30' : ''}`} aria-label="You">
        {bubble}
      </div>
    )
  }
  return (
    <div className={`flex max-w-[min(72%,760px)] flex-col gap-1 transition-opacity ${dim ? 'opacity-30' : ''}`}>
      <div className="flex items-start gap-3">
        <ChatAvatar avatar={chat.avatar} size={36} />
        {bubble}
      </div>
      {message.reactions && (
        <div className="flex justify-end gap-1">
          {message.reactions.map((r) => (
            <span key={r} className="flex h-7 w-10 items-center justify-center rounded-full bg-white text-[16px]">
              {r}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
