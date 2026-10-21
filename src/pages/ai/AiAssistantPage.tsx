import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { HISTORY, reply, type AssistantReply } from '../../data/assistant'
import { useDismiss } from '../../hooks/useDismiss'
import { user } from '../../data/dashboard'
import avatar from '../../assets/dashboard/avatar-masud.png'
import dashboardShot from '../../assets/projects/dashboard-shot.png'
import menuDots from '../../assets/ai/menu-dots.svg'
import menuDotsLg from '../../assets/ai/menu-dots-lg.svg'
import face1 from '../../assets/ai/face-1.png'
import face2 from '../../assets/ai/face-2.png'
import face3 from '../../assets/ai/face-3.png'
import glowGreen from '../../assets/ai/glow-green.svg'
import glowPurple from '../../assets/ai/glow-purple.svg'
import calendarIcon from '../../assets/ai/calendar.svg'
import checklistIcon from '../../assets/ai/checklist.svg'
import plusLg from '../../assets/ai/plus-lg.svg'
import plusIcon from '../../assets/ai/plus.svg'
import sparkle from '../../assets/ai/sparkle.svg'
import paperclipSm from '../../assets/ai/paperclip-sm.svg'
import layersIcon from '../../assets/ai/layers.svg'
import chevronDown from '../../assets/ai/chevron-down.svg'
import arrowRightDown from '../../assets/ai/arrow-right-down.svg'
import micIcon from '../../assets/ai/mic.svg'
import sendIcon from '../../assets/ai/send.svg'
import gallery from '../../assets/ai/gallery.svg'
import gallerySm from '../../assets/ai/gallery-sm.svg'
import galleryDark from '../../assets/ai/gallery-dark.svg'
import pieIcon from '../../assets/ai/pie.svg'
import cardIcon from '../../assets/ai/cardholder.svg'
import sendLg from '../../assets/ai/send-lg.svg'
import assistantAvatar from '../../assets/ai/assistant.png'
import galleryXl from '../../assets/ai/gallery-xl.svg'
import closeCircle from '../../assets/ai/close-circle.svg'
import paperclip from '../../assets/ai/paperclip.svg'
import plusOutline from '../../assets/ai/plus-outline.svg'
import micOutline from '../../assets/ai/mic-outline.svg'
import folderIcon from '../../assets/ai/folder.svg'
import galleryTool from '../../assets/ai/gallery-tool.svg'
import translateIcon from '../../assets/ai/translate.svg'
import micTool from '../../assets/ai/mic-tool.svg'
import toolFiles from '../../assets/ai/tool-files.png'
import toolImages from '../../assets/ai/tool-images.png'
import toolTranslate from '../../assets/ai/tool-translate.png'
import toolVoice from '../../assets/ai/tool-voice.png'

const WORKSPACES = ['Agency', 'Team', 'Personal', 'Marketing', 'Leads']
const MODELS = ['Auto', 'Fast', 'Deep Research']

type QuickAction = { id: string; title: string; icon: string; glow: string; faces?: string[]; to?: string }
const DEFAULT_ACTIONS: QuickAction[] = [
  { id: 'q1', title: 'Align my calendar with this week tasks', icon: calendarIcon, glow: glowGreen },
  { id: 'q2', title: 'Create meeting highlight', icon: checklistIcon, glow: glowPurple, faces: [face1, face2, face3] },
]

type ChatMessage = { id: string; from: 'user' | 'assistant'; text?: string; reply?: AssistantReply }

export function AiAssistantPage() {
  const [chat, setChat] = useState<ChatMessage[] | null>(null)

  const start = (prompt: string) => setChat([{ id: `u${Date.now()}`, from: 'user', text: prompt }])

  return chat ? <ChatView initial={chat} onClose={() => setChat(null)} onRestart={start} /> : <Home onAsk={start} />
}

/* ---------- Start screen ---------- */

function Home({ onAsk }: { onAsk: (prompt: string) => void }) {
  const [workspace, setWorkspace] = useState('Team')
  const [actions, setActions] = useState(DEFAULT_ACTIONS)
  const [adding, setAdding] = useState(false)
  const [newAction, setNewAction] = useState('')

  return (
    <div className="mt-6 flex flex-col gap-6">
      <div>
        <h1 className="text-[40px] leading-[1.2] font-semibold tracking-[-2px] text-black">Hello, {user.name}</h1>
        <p className="text-[40px] leading-[1.2] font-semibold tracking-[-2px] text-black/25">How can I help you?</p>
      </div>

      <section aria-label="Workspaces" className="flex flex-col gap-3">
        <h2 className="text-[16px] font-semibold text-black">Workspaces</h2>
        <div role="radiogroup" className="flex flex-wrap gap-2.5">
          {WORKSPACES.map((w) => (
            <button
              key={w}
              type="button"
              role="radio"
              aria-checked={workspace === w}
              onClick={() => setWorkspace(w)}
              className={`h-10 cursor-pointer rounded-full border px-5 text-[14px] font-medium ${
                workspace === w ? 'border-primary bg-primary text-black' : 'border-stock bg-transparent text-black/50 hover:text-black'
              }`}
            >
              {w}
            </button>
          ))}
        </div>
      </section>

      <section aria-label="Quick actions" className="flex flex-col gap-5 rounded-[24px] border border-stock bg-white p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-[22px] font-semibold tracking-[-0.44px] text-black">Quick Action</h2>
          <div className="flex gap-2">
            <button type="button" aria-label="Add quick action" onClick={() => setAdding(true)} className="flex size-9 cursor-pointer items-center justify-center rounded-md border border-stock hover:bg-background">
              <img src={plusIcon} alt="" width={18} height={18} />
            </button>
            <button type="button" aria-label="More" className="flex size-9 cursor-pointer items-center justify-center rounded-md border border-stock hover:bg-background">
              <img src={menuDots} alt="" width={18} height={18} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          {actions.map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => onAsk(a.title)}
              className="relative flex h-[210px] cursor-pointer flex-col overflow-hidden rounded-[28px] bg-background p-5 text-left transition-colors hover:bg-stock/70"
            >
              <img src={a.glow} alt="" width={119} height={124} className="pointer-events-none absolute -top-[22px] -left-[18px]" />
              <span className="flex items-start justify-between">
                <span className="relative flex size-16 items-center justify-center rounded-[16px] border border-white bg-white/15 backdrop-blur-[5.5px]">
                  <img src={a.icon} alt="" width={26} height={26} />
                </span>
                <img src={menuDotsLg} alt="" width={24} height={24} />
              </span>
              <span className="mt-auto text-[20px] leading-[1.3] font-medium tracking-[-0.4px] text-black/55">{a.title}</span>
              {a.faces && (
                <span className="mt-2 flex">
                  {a.faces.map((f, i) => (
                    <img key={i} src={f} alt="" width={32} height={32} className={`rounded-full ring-2 ring-background ${i ? '-ml-3' : ''}`} />
                  ))}
                </span>
              )}
            </button>
          ))}
          {adding ? (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                if (!newAction.trim()) return
                setActions((list) => [...list, { id: `q${Date.now()}`, title: newAction.trim(), icon: checklistIcon, glow: glowPurple }])
                setNewAction('')
                setAdding(false)
              }}
              className="flex h-[210px] flex-col justify-between rounded-[28px] border-2 border-dashed border-stock p-5"
            >
              <label className="text-[13px] font-medium text-grey-text" htmlFor="new-action">
                New quick action
              </label>
              <textarea
                id="new-action"
                autoFocus
                value={newAction}
                onChange={(e) => setNewAction(e.target.value)}
                placeholder="e.g. Summarise this week’s blockers"
                className="flex-1 resize-none bg-transparent py-2 text-[16px] outline-none placeholder:text-black/35"
              />
              <span className="flex justify-end gap-2">
                <button type="button" onClick={() => setAdding(false)} className="h-8 cursor-pointer rounded-lg px-3 text-[13px] font-medium hover:bg-background">
                  Cancel
                </button>
                <button type="submit" className="h-8 cursor-pointer rounded-lg bg-primary px-3 text-[13px] font-semibold">
                  Add
                </button>
              </span>
            </form>
          ) : (
            <button
              type="button"
              aria-label="Add quick action"
              onClick={() => setAdding(true)}
              className="flex h-[210px] cursor-pointer items-center justify-center rounded-[28px] bg-background/40 transition-colors hover:bg-background"
            >
              <img src={plusLg} alt="" width={56} height={56} className="opacity-40" />
            </button>
          )}
        </div>

        <PromptBox onSubmit={onAsk} />
      </section>
    </div>
  )
}

function PromptBox({ onSubmit }: { onSubmit: (text: string) => void }) {
  const [text, setText] = useState('')
  const [model, setModel] = useState('Auto')
  const [modelOpen, setModelOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useDismiss(ref, modelOpen, () => setModelOpen(false))

  const submit = (e?: FormEvent) => {
    e?.preventDefault()
    if (text.trim()) onSubmit(text.trim())
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-3 rounded-2xl bg-background p-4 focus-within:ring-2 focus-within:ring-primary/30">
      <label className="flex items-start gap-3">
        <img src={sparkle} alt="" width={22} height={22} className="mt-0.5 -scale-x-100" />
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              submit()
            }
          }}
          rows={1}
          placeholder="Ask me anything about…"
          aria-label="Ask the assistant"
          className="min-h-7 flex-1 resize-none bg-transparent text-[15px] leading-7 outline-none placeholder:text-black/45"
        />
      </label>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button type="button" aria-label="Attach file" className="flex size-8 cursor-pointer items-center justify-center rounded-md border border-black/10 hover:bg-white">
            <img src={paperclipSm} alt="" width={16} height={16} />
          </button>
          <button type="button" aria-label="Add context" className="flex size-8 cursor-pointer items-center justify-center rounded-md border border-black/10 hover:bg-white">
            <img src={layersIcon} alt="" width={16} height={16} />
          </button>
          <div ref={ref} className="relative flex">
            <button
              type="button"
              aria-haspopup="listbox"
              aria-expanded={modelOpen}
              onMouseDown={(e) => e.stopPropagation()}
              onClick={() => setModelOpen((o) => !o)}
              className="flex h-8 cursor-pointer items-center gap-1.5 rounded-md border border-black/10 px-2.5 text-[12px] text-black/60 hover:bg-white"
            >
              <img src={arrowRightDown} alt="" width={9} height={9} />
              {model}
              <img src={chevronDown} alt="" width={14} height={14} />
            </button>
            {modelOpen && (
              <ul role="listbox" className="absolute bottom-full left-0 z-20 mb-1 w-40 overflow-hidden rounded-xl bg-white py-1 shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
                {MODELS.map((m) => (
                  <li key={m}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={model === m}
                      onClick={() => (setModel(m), setModelOpen(false))}
                      className={`w-full cursor-pointer px-3 py-2 text-left text-[13px] hover:bg-background ${model === m ? 'font-semibold' : ''}`}
                    >
                      {m}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button type="button" aria-label="Voice input" className="cursor-pointer rounded-full p-1 hover:bg-white">
            <img src={micIcon} alt="" width={24} height={24} />
          </button>
          <button type="submit" aria-label="Send" disabled={!text.trim()} className="flex size-10 cursor-pointer items-center justify-center rounded-lg bg-primary hover:brightness-95 disabled:cursor-default disabled:opacity-50">
            <img src={sendIcon} alt="" width={20} height={20} />
          </button>
        </div>
      </div>
    </form>
  )
}

/* ---------- Chat ---------- */

const TOOLS = [
  { label: 'Chat Files', icon: folderIcon, art: toolFiles, prompt: 'Summarise the files shared in this chat' },
  { label: 'Images', icon: galleryTool, art: toolImages, prompt: 'Help me with an image' },
  { label: 'Translate', icon: translateIcon, art: toolTranslate, prompt: 'Translate this for me' },
  { label: 'Audio Chat', icon: micTool, art: toolVoice, prompt: 'Start an audio chat' },
]

function ChatView({ initial, onClose, onRestart }: { initial: ChatMessage[]; onClose: () => void; onRestart: (prompt: string) => void }) {
  const navigate = useNavigate()
  const [messages, setMessages] = useState<ChatMessage[]>(initial)
  const [draft, setDraft] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)
  const last = messages[messages.length - 1]
  // The assistant is "typing" whenever the latest message is still unanswered.
  const thinking = last?.from === 'user'

  // Answer whenever the latest message is from the user.
  useEffect(() => {
    if (last?.from !== 'user' || !last.text) return
    const id = setTimeout(() => {
      setMessages((list) => [...list, { id: `a${Date.now()}`, from: 'assistant', reply: reply(last.text!) }])
    }, 900)
    return () => clearTimeout(id)
  }, [last])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages.length, thinking])

  const send = (text: string) => {
    if (!text.trim() || thinking) return
    setMessages((list) => [...list, { id: `u${Date.now()}`, from: 'user', text: text.trim() }])
    setDraft('')
  }

  return (
    <div className="mt-6 flex h-[calc(100dvh-144px)] min-h-[560px] gap-5">
      <aside className="flex w-[288px] shrink-0 flex-col gap-4 overflow-y-auto">
        <h2 className="text-[20px] font-semibold tracking-[-0.4px] text-black">Chat results</h2>
        <h3 className="text-[16px] font-semibold text-black">Today</h3>
        {HISTORY.today.map((h) => (
          <button key={h.id} type="button" onClick={() => onRestart(h.prompt)} className="flex cursor-pointer flex-col gap-3 rounded-[22px] bg-white p-3 text-left hover:ring-2 hover:ring-primary/40">
            <span className="flex items-center gap-2">
              <span className="flex size-9 items-center justify-center rounded-full bg-background">
                <img src={gallerySm} alt="" width={16} height={16} />
              </span>
              <span>
                <span className="block text-[14px] font-semibold text-black">{h.title}</span>
                <span className="block text-[11px] text-black/50">{h.date}</span>
              </span>
            </span>
            <span className="relative block overflow-hidden rounded-[18px] bg-[#f0f0f0] p-2">
              <img src={dashboardShot} alt="" className="h-[150px] w-full rounded-[7px] object-cover object-top" />
              <span className="absolute right-4 bottom-4 left-4 flex items-center gap-3 rounded-[14px] border border-white bg-white/50 px-3 py-2 backdrop-blur-[8px]">
                <img src={gallery} alt="" width={18} height={18} />
                <span>
                  <span className="block text-[13px] font-medium text-black">project images</span>
                  <span className="block text-[11px] text-black/55">Smart Project Planning System</span>
                </span>
              </span>
            </span>
          </button>
        ))}
        <h3 className="mt-2 text-[16px] font-semibold text-black">Yesterday</h3>
        <div className="flex flex-col gap-2 rounded-[22px] border border-stock bg-white p-3">
          <span className="flex items-center gap-2 border-b border-stock pb-3">
            <span className="flex size-9 items-center justify-center rounded-full bg-black/10">
              <img src={galleryDark} alt="" width={16} height={16} />
            </span>
            <span>
              <span className="block text-[14px] font-semibold text-black">AI Search</span>
              <span className="block text-[11px] text-black/50">Yesterday. 04th August 2025</span>
            </span>
          </span>
          {HISTORY.yesterday.map((h) => (
            <button key={h.id} type="button" onClick={() => onRestart(h.title)} className="flex cursor-pointer items-start gap-2 rounded-[10px] bg-background px-2.5 py-2 text-left hover:bg-stock">
              <img src={h.icon === 'card' ? cardIcon : pieIcon} alt="" width={18} height={18} />
              <span className="min-w-0">
                <span className="block truncate text-[12px] font-semibold text-black">{h.title}</span>
                <span className="block truncate text-[11px] text-black/50">{h.sub}</span>
              </span>
            </button>
          ))}
        </div>
      </aside>

      <section aria-label="Chat" className="flex min-w-0 flex-1 flex-col rounded-[24px] bg-white">
        <header className="flex items-center justify-between px-6 pt-5 pb-3">
          <span className="flex size-11 items-center justify-center rounded-full bg-background">
            <img src={galleryXl} alt="" width={24} height={24} />
          </span>
          <h1 className="text-[24px] font-medium tracking-[-0.5px] text-black">New Chat</h1>
          <button type="button" aria-label="Close chat" onClick={onClose} className="cursor-pointer rounded-full">
            <img src={closeCircle} alt="" width={44} height={44} />
          </button>
        </header>

        <div ref={scrollRef} className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <img src={assistantAvatar} alt="Orkiva Assistant" width={48} height={48} className="rounded-full" />
            <p className="text-[20px] leading-[1.2] font-medium tracking-[-0.4px] text-black">
              Hi,
              <br />
              <span className="font-semibold opacity-50">How can I help you?</span>
            </p>
          </div>

          {messages.map((m, i) =>
            m.from === 'user' ? (
              <div key={m.id} className="flex items-start justify-end gap-3">
                <p className="max-w-[60%] rounded-2xl bg-background px-4 py-3 text-[15px] leading-[1.45] text-black">{m.text}</p>
                <img src={avatar} alt={user.name} width={40} height={40} className="rounded-full" />
              </div>
            ) : (
              <div key={m.id} className="flex flex-col gap-3">
                <div className="flex items-start gap-3">
                  <img src={assistantAvatar} alt="" width={40} height={40} className="rounded-full" />
                  <div className="max-w-[70%] rounded-2xl bg-background px-4 py-3 text-[15px] leading-[1.45]">
                    {m.reply && 'text' in m.reply ? (
                      <p className="text-black/70">{m.reply.text}</p>
                    ) : (
                      <ol className="flex flex-col gap-3">
                        {m.reply?.points.map((p, n) => (
                          <li key={n}>
                            <span className="font-semibold text-black">
                              {n + 1}. {p.title}
                            </span>{' '}
                            {p.body.map((s, k) => (
                              <span key={k} className={s.bold ? 'font-semibold text-black' : 'text-black/55'}>
                                {s.text}
                              </span>
                            ))}
                          </li>
                        ))}
                      </ol>
                    )}
                  </div>
                </div>
                {i === 1 && (
                  <div className="ml-[52px] flex flex-wrap gap-3">
                    {TOOLS.map((t) => (
                      <button
                        key={t.label}
                        type="button"
                        onClick={() => (t.label === 'Images' ? send(t.prompt) : t.label === 'Audio Chat' ? navigate('/inbox') : send(t.prompt))}
                        className="flex w-[140px] cursor-pointer flex-col gap-2 rounded-[18px] border border-[#c7c7c7] bg-[rgba(163,163,163,0.1)] p-3 text-left backdrop-blur-[4px] hover:border-primary"
                      >
                        <span className="flex items-center gap-2">
                          <span className="flex size-8 items-center justify-center rounded-full bg-background">
                            <img src={t.icon} alt="" width={16} height={16} />
                          </span>
                          <span className="text-[13px] font-medium text-black">{t.label}</span>
                        </span>
                        <span className="flex h-[72px] items-center justify-center rounded-[14px] bg-white">
                          <img src={t.art} alt="" width={52} height={52} className="size-[52px] object-contain" />
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ),
          )}
          {thinking && (
            <div className="flex items-center gap-3" aria-live="polite">
              <img src={assistantAvatar} alt="" width={40} height={40} className="rounded-full" />
              <span className="flex gap-1 rounded-2xl bg-background px-4 py-3" aria-label="Assistant is typing">
                {[0, 1, 2].map((d) => (
                  <span key={d} className="size-1.5 animate-bounce rounded-full bg-black/40" style={{ animationDelay: `${d * 120}ms` }} />
                ))}
              </span>
            </div>
          )}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            send(draft)
          }}
          className="flex items-center gap-3 px-6 pt-2 pb-6"
        >
          <label className="flex h-14 flex-1 items-center gap-3 rounded-full bg-background pr-2 pl-6 focus-within:ring-2 focus-within:ring-primary/30">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Ask me anything…"
              aria-label="Message the assistant"
              className="min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-black/45"
            />
            <button type="button" aria-label="Voice input" className="cursor-pointer rounded-full p-1 hover:bg-white">
              <img src={micOutline} alt="" width={22} height={22} />
            </button>
            <button type="button" aria-label="Attach file" className="cursor-pointer rounded-full p-1 hover:bg-white">
              <img src={paperclip} alt="" width={22} height={22} />
            </button>
            <button type="button" aria-label="More tools" className="cursor-pointer rounded-full p-1 hover:bg-white">
              <img src={plusOutline} alt="" width={22} height={22} />
            </button>
          </label>
          <button type="submit" aria-label="Send" disabled={!draft.trim() || thinking} className="flex size-14 shrink-0 cursor-pointer items-center justify-center rounded-full bg-primary hover:brightness-95 disabled:opacity-50">
            <img src={sendLg} alt="" width={24} height={24} />
          </button>
        </form>
      </section>
    </div>
  )
}
