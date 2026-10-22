import { useState } from 'react'
import { ChatList } from '../../components/inbox/ChatList'
import { Conversation, type ChatSettings } from '../../components/inbox/Conversation'
import { VideoCallModal } from '../../components/inbox/VideoCallModal'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { Toast } from '../../components/ui/Toast'
import { useToast } from '../../hooks/useToast'
import { blockChat, updateChat, useChats, type Chat } from '../../data/inbox'
import trashIcon from '../../assets/overlays/trash.svg'

const DEFAULT_SETTINGS: ChatSettings = { muted: false, restricted: false }

export function InboxPage() {
  const chats = useChats()
  const [selectedId, setSelectedId] = useState<string | undefined>(chats[0]?.id)
  const [settings, setSettings] = useState<Record<string, ChatSettings>>({})
  const [preferences, setPreferences] = useState({ activeStatus: true, notificationSound: false, doNotDisturb: true })
  const [videoOpen, setVideoOpen] = useState(false)
  const [blocking, setBlocking] = useState(false)
  const toast = useToast()

  const chat = chats.find((c) => c.id === selectedId) ?? chats[0]
  const update = (id: string, patch: Partial<Chat> | ((c: Chat) => Partial<Chat>)) =>
    updateChat(id, (c) => (typeof patch === 'function' ? patch(c) : patch))

  if (!chat) return <p className="mt-24 text-center text-[18px] text-grey-text">No conversations left. Reset demo data from the profile menu to restore them.</p>

  const select = (id: string) => {
    setSelectedId(id)
    update(id, { unread: undefined })
  }

  return (
    // Fills the viewport below the top bar so only the chat list and messages scroll.
    <div className="mt-6 flex h-[calc(100dvh-144px)] min-h-[560px] gap-5">
      <ChatList chats={chats} selectedId={chat.id} onSelect={select} preferences={preferences} onPreferences={setPreferences} />
      <Conversation
        key={chat.id}
        chat={chat}
        settings={settings[chat.id] ?? DEFAULT_SETTINGS}
        onSettings={(s) => {
          setSettings((all) => ({ ...all, [chat.id]: s }))
          toast.show(s.muted ? `Notifications muted for ${chat.name}` : 'Chat settings updated')
        }}
        onTogglePin={() => {
          update(chat.id, (c) => ({ pinned: !c.pinned }))
          toast.show(chat.pinned ? `Unpinned ${chat.name}` : `Pinned ${chat.name}`)
        }}
        onSend={(text) =>
          update(chat.id, (c) => ({
            messages: [...c.messages, { id: `m${Date.now()}`, from: 'me', text }],
            preview: `You: ${text}`,
            time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
            status: 'seen',
          }))
        }
        onCall={() => toast.show(`Calling ${chat.name}…`)}
        onVideoCall={() => setVideoOpen(true)}
        onBlock={() => setBlocking(true)}
        onReport={() => toast.show(`Thanks — we’ll review ${chat.name}’s account.`)}
      />

      <VideoCallModal open={videoOpen} onClose={() => setVideoOpen(false)} name={chat.name} />
      <ConfirmDialog
        open={blocking}
        onCancel={() => setBlocking(false)}
        onConfirm={() => {
          blockChat(chat.id)
          setSelectedId(chats.find((c) => c.id !== chat.id)?.id)
          setBlocking(false)
          toast.show(`${chat.name} has been blocked`)
        }}
        icon={trashIcon}
        tone="danger"
        title="Block user?"
        message={`${chat.name} won’t be able to message or call you. You can unblock them later from settings.`}
        confirmLabel="Block"
      />
      <Toast message={toast.message} />
    </div>
  )
}
