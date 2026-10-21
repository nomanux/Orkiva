import { useState } from 'react'
import { ChatAvatar } from './ChatAvatar'
import { InboxPopover } from './InboxPopover'
import type { Chat } from '../../data/inbox'
import searchIcon from '../../assets/inbox/search.svg'
import settingIcon from '../../assets/inbox/setting.svg'
import chevronDown from '../../assets/inbox/chevron-down.svg'
import callEnded from '../../assets/inbox/call-ended.svg'
import seenIcon from '../../assets/inbox/seen.svg'
import closeIcon from '../../assets/inbox/close.svg'

type Preferences = { activeStatus: boolean; notificationSound: boolean; doNotDisturb: boolean }

type ChatListProps = {
  chats: Chat[]
  selectedId: string
  onSelect: (id: string) => void
  preferences: Preferences
  onPreferences: (p: Preferences) => void
}

const ICON_BUTTON = 'flex size-10 cursor-pointer items-center justify-center rounded-xl hover:bg-background'

export function ChatList({ chats, selectedId, onSelect, preferences, onPreferences }: ChatListProps) {
  const [searching, setSearching] = useState(false)
  const [query, setQuery] = useState('')
  const [prefsOpen, setPrefsOpen] = useState(false)
  const [collapsed, setCollapsed] = useState<string[]>([])

  const q = query.trim().toLowerCase()
  const visible = q ? chats.filter((c) => c.name.toLowerCase().includes(q) || c.preview.toLowerCase().includes(q)) : chats
  const sections = [
    { id: 'pinned', title: 'Pinned', items: visible.filter((c) => c.pinned) },
    { id: 'people', title: 'People', items: visible.filter((c) => !c.pinned) },
  ]

  return (
    <aside className="relative flex w-[320px] shrink-0 flex-col rounded-[22px] bg-white px-4 pt-3 pb-2 shadow-[0px_0px_10px_rgba(0,0,0,0.02)]">
      <div className="flex h-12 items-center justify-between gap-2 pl-2">
        {searching ? (
          <label className="flex h-10 flex-1 items-center gap-2 rounded-xl bg-background px-3">
            <img src={searchIcon} alt="" width={18} height={18} />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Escape' && (setSearching(false), setQuery(''))}
              placeholder="Search chats"
              aria-label="Search chats"
              className="min-w-0 flex-1 bg-transparent text-[14px] outline-none placeholder:text-black/50"
            />
            <button
              type="button"
              aria-label="Close search"
              onClick={() => {
                setSearching(false)
                setQuery('')
              }}
              className="cursor-pointer"
            >
              <img src={closeIcon} alt="" width={16} height={16} />
            </button>
          </label>
        ) : (
          <>
            <h1 className="text-[20px] leading-8 font-semibold tracking-[-0.3px] text-black">Chats</h1>
            <div className="flex gap-1">
              <button type="button" aria-label="Search chats" onClick={() => setSearching(true)} className={ICON_BUTTON}>
                <img src={searchIcon} alt="" width={20} height={20} />
              </button>
              <button
                type="button"
                aria-label="Chat preferences"
                onMouseDown={(e) => e.stopPropagation()}
                aria-expanded={prefsOpen}
                onClick={() => setPrefsOpen((o) => !o)}
                className={ICON_BUTTON}
              >
                <img src={settingIcon} alt="" width={20} height={20} />
              </button>
            </div>
          </>
        )}
      </div>

      {prefsOpen && (
        <InboxPopover
          title="Preferences"
          className="top-14 left-2"
          onClose={() => setPrefsOpen(false)}
          rows={[
            { kind: 'toggle', label: 'Active Status', value: preferences.activeStatus, onChange: (v) => onPreferences({ ...preferences, activeStatus: v }) },
            { kind: 'toggle', label: 'Notifications Sound', value: preferences.notificationSound, onChange: (v) => onPreferences({ ...preferences, notificationSound: v }) },
            { kind: 'toggle', label: 'Do Not Disturb', value: preferences.doNotDisturb, onChange: (v) => onPreferences({ ...preferences, doNotDisturb: v }) },
          ]}
        />
      )}

      <div className="mt-2 flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto pr-1">
        {sections.map((section) => {
          const isCollapsed = collapsed.includes(section.id)
          if (q && section.items.length === 0) return null
          return (
            <section key={section.id} aria-label={section.title} className="flex flex-col gap-1">
              <button
                type="button"
                aria-expanded={!isCollapsed}
                onClick={() => setCollapsed((c) => (c.includes(section.id) ? c.filter((s) => s !== section.id) : [...c, section.id]))}
                className="flex cursor-pointer items-center justify-between px-2 py-1"
              >
                <span className="text-[14px] leading-[1.2] font-semibold text-ink">{section.title}</span>
                <img src={chevronDown} alt="" width={20} height={20} className={`transition-transform ${isCollapsed ? '' : 'rotate-180'}`} />
              </button>
              {!isCollapsed &&
                section.items.map((chat) => {
                  const active = chat.id === selectedId
                  return (
                    <button
                      key={chat.id}
                      type="button"
                      onClick={() => onSelect(chat.id)}
                      aria-current={active ? 'true' : undefined}
                      className={`flex h-16 w-full cursor-pointer items-center gap-3 rounded-xl border px-2.5 text-left ${
                        active ? 'border-[#f0f0f0] bg-background' : 'border-transparent hover:bg-background/60'
                      }`}
                    >
                      <ChatAvatar avatar={chat.avatar} size={44} online={chat.online && preferences.activeStatus} />
                      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                        <span className="flex items-center justify-between gap-2">
                          <span className="truncate text-[14px] leading-[1.4] font-semibold text-black">{chat.name}</span>
                          <span className="shrink-0 text-[11px] text-black/55">{chat.time}</span>
                        </span>
                        <span className="flex items-center gap-1.5">
                          {chat.status === 'call-ended' && <img src={callEnded} alt="" width={14} height={14} />}
                          <span className={`min-w-0 flex-1 truncate text-[13px] ${chat.status === 'call-ended' ? 'font-medium text-[#e5484d]' : 'text-black/60'}`}>
                            {chat.preview}
                          </span>
                          {chat.unread ? (
                            <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#7fcae6] text-[11px] font-semibold text-ink">
                              {chat.unread}
                            </span>
                          ) : chat.status === 'seen' ? (
                            <img src={seenIcon} alt="Seen" width={18} height={18} />
                          ) : null}
                        </span>
                      </span>
                    </button>
                  )
                })}
            </section>
          )
        })}
        {q && visible.length === 0 && <p className="px-2 py-6 text-center text-[13px] text-grey-text">No chats match “{query}”.</p>}
      </div>
    </aside>
  )
}
