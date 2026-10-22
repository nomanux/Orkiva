import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router'
import aiOrb from '../../assets/dashboard/ai-orb.png'
import aiOrbMask from '../../assets/dashboard/ai-orb-mask.png'
import sparkle from '../../assets/dashboard/sparkle.svg'
import { appendMessage, reply, startConversation, useConversations, type ChatMessage } from '../../data/assistant'
import { firstName, useSession } from '../../data/session'

const SUGGESTIONS = ["What's overdue?", 'Plan my week', 'Team workload', 'How are my projects progressing?']
const THINKING_MS = 450

/** The brand orb, tinted green through a masked color-blend layer. */
function Orb({ size }: { size: number }) {
  return (
    <span className="relative isolate block shrink-0" style={{ width: size, height: size }}>
      <img src={aiOrb} alt="" width={size} height={size} className="absolute inset-0 size-full object-cover" />
      <span
        className="absolute inset-0 bg-primary mix-blend-color"
        style={{
          maskImage: `url(${aiOrbMask})`,
          maskSize: `${size}px ${size}px`,
          WebkitMaskImage: `url(${aiOrbMask})`,
          WebkitMaskSize: `${size}px ${size}px`,
        }}
      />
    </span>
  )
}

function Message({ m, onNavigate }: { m: ChatMessage; onNavigate: () => void }) {
  if (m.from === 'user') {
    return <p className="max-w-[85%] self-end rounded-2xl rounded-br-md bg-primary-soft px-3 py-2 text-[14px] leading-[1.4] text-primary-ink">{m.text}</p>
  }
  const r = m.reply
  return (
    <div className="flex max-w-[92%] flex-col gap-2 self-start rounded-2xl rounded-bl-md bg-background px-3 py-2.5 text-[14px] leading-[1.45]">
      {r?.text && <p>{r.text}</p>}
      {r?.points && (
        <ul className="flex flex-col gap-1.5">
          {r.points.map((p, i) => (
            <li key={i} className="text-[13px]">
              <span className="font-semibold">{p.title}</span>
              <span className="block text-grey-text">
                {p.body.map((s, j) => (s.bold ? <b key={j} className="font-semibold text-ink">{s.text}</b> : <span key={j}>{s.text}</span>))}
              </span>
            </li>
          ))}
        </ul>
      )}
      {r?.link && (
        <Link to={r.link.to} onClick={onNavigate} className="self-start rounded-full bg-primary px-3 py-1 text-[13px] font-semibold hover:brightness-95">
          {r.link.label} →
        </Link>
      )}
    </div>
  )
}

/** Floating "Ask AI Orkiva" button with a compact chat panel, available on every app page. */
export function AiLauncher() {
  const { pathname } = useLocation()
  const name = firstName(useSession().profile.name)
  const [open, setOpen] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [prompt, setPrompt] = useState('')
  const [thinking, setThinking] = useState(false)
  const conversation = useConversations().find((c) => c.id === conversationId)
  const listRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (!open) return
    inputRef.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [conversation?.messages.length, thinking])

  // The full assistant page already is the chat
  if (pathname.startsWith('/ai-assistant')) return null

  const ask = (text: string) => {
    const q = text.trim()
    if (!q || thinking) return
    let id = conversationId
    if (id) appendMessage(id, { from: 'user', text: q })
    else setConversationId((id = startConversation(q)))
    setPrompt('')
    setThinking(true)
    const target = id
    setTimeout(() => {
      appendMessage(target, { from: 'assistant', reply: reply(q) })
      setThinking(false)
    }, THINKING_MS)
  }

  return (
    <>
      {open && (
        <section
          role="dialog"
          aria-label="AI Orkiva"
          className="fixed right-6 bottom-[92px] z-50 flex h-[min(560px,calc(100vh-128px))] w-[380px] flex-col overflow-hidden rounded-[20px] bg-white shadow-[0_16px_48px_rgba(15,23,42,0.18)]"
        >
          <header className="flex items-center gap-2.5 border-b border-stock px-4 py-3">
            <Orb size={28} />
            <div className="min-w-0 flex-1">
              <h2 className="text-[15px] leading-[1.2] font-semibold">AI Orkiva</h2>
              <p className="text-[12px] leading-[1.3] text-grey-text">Answers from your live data</p>
            </div>
            {conversation && (
              <button
                type="button"
                onClick={() => setConversationId(null)}
                className="cursor-pointer rounded-full px-2 py-1 text-[12px] font-medium text-grey-text hover:bg-background hover:text-ink"
              >
                New chat
              </button>
            )}
            <button
              type="button"
              aria-label="Close"
              onClick={() => setOpen(false)}
              className="flex size-8 cursor-pointer items-center justify-center rounded-full text-[18px] leading-none text-grey-text hover:bg-background hover:text-ink"
            >
              ×
            </button>
          </header>

          <div ref={listRef} className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-4">
            {!conversation ? (
              <div className="m-auto flex flex-col items-center text-center">
                <Orb size={56} />
                <p className="mt-3 text-[16px] font-semibold">Hi {name}, how can I help?</p>
                <p className="mt-1 text-[13px] text-grey-text">Ask about deadlines, workload or project status.</p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => ask(s)}
                      className="cursor-pointer rounded-full border border-stock px-3 py-1.5 text-[13px] hover:border-primary hover:bg-primary-soft"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              conversation.messages.map((m) => <Message key={m.id} m={m} onNavigate={() => setOpen(false)} />)
            )}
            {thinking && <p className="self-start rounded-2xl bg-background px-3 py-2 text-[13px] text-grey-text">Thinking…</p>}
          </div>

          <form
            className="border-t border-stock p-3"
            onSubmit={(e) => {
              e.preventDefault()
              ask(prompt)
            }}
          >
            <div className="flex items-end gap-2 rounded-xl bg-background px-3 py-2">
              <img src={sparkle} alt="" width={16} height={16} className="mb-1.5 -scale-x-100" />
              <textarea
                ref={inputRef}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    e.currentTarget.form?.requestSubmit()
                  }
                }}
                rows={1}
                placeholder="Ask AI Orkiva…"
                aria-label="Message AI Orkiva"
                className="max-h-24 min-h-7 flex-1 resize-none bg-transparent py-1 text-[14px] leading-[1.4] outline-none placeholder:text-grey-text"
              />
              <button
                type="submit"
                disabled={!prompt.trim() || thinking}
                className="cursor-pointer rounded-lg bg-primary px-3 py-1.5 text-[13px] font-semibold hover:brightness-95 disabled:cursor-default disabled:opacity-40"
              >
                Send
              </button>
            </div>
            <Link
              to={conversation ? `/ai-assistant?c=${conversation.id}` : '/ai-assistant'}
              onClick={() => setOpen(false)}
              className="mt-2 block text-center text-[12px] font-medium text-grey-text hover:text-ink hover:underline"
            >
              Open full assistant →
            </Link>
          </form>
        </section>
      )}

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={open ? 'Close AI Orkiva' : 'Ask AI Orkiva'}
        className="fixed right-6 bottom-6 z-50 flex h-14 cursor-pointer items-center gap-2 rounded-full bg-ink py-2 pr-5 pl-2 text-white shadow-[0_10px_30px_rgba(15,23,42,0.3)] transition hover:-translate-y-0.5"
      >
        <span className="rounded-full bg-white p-1">
          <Orb size={32} />
        </span>
        <span className="text-[14px] font-semibold">{open ? 'Close' : 'Ask AI Orkiva'}</span>
      </button>
    </>
  )
}
