import { useState } from 'react'
import { Link } from 'react-router'
import gearIcon from '../../assets/overlays/gear.svg'
import bellIcon from '../../assets/overlays/bell.svg'
import unreadDot from '../../assets/overlays/unread-dot.svg'

const BODY = 'Dummy text sections filled with fun lorem ipsum make it easier to swap out one web page, letter, or email version with another.'

const INITIAL = [
  { id: 'n1', title: 'New Project Contributor', time: '1h ago', unread: true },
  { id: 'n2', title: 'System Maintenance Scheduled', time: '4h ago', unread: true },
  { id: 'n3', title: 'New Project Contributor', time: '6h ago', unread: false },
]

export function NotificationsPopover({ onClose }: { onClose: () => void }) {
  const [items, setItems] = useState(INITIAL)
  const unreadCount = items.filter((n) => n.unread).length

  return (
    <div
      role="dialog"
      aria-label="Notifications"
      className="w-[400px] overflow-hidden rounded-2xl border border-gs-100 bg-white shadow-[0px_16px_32px_-1px_rgba(128,136,151,0.2)]"
    >
      <header className="flex h-[72px] items-center justify-between border-b border-gs-100 px-6">
        <h2 className="text-[18px] leading-[1.4] font-semibold tracking-[-0.36px] text-ink">
          Notifications
          {unreadCount > 0 && <span className="sr-only"> ({unreadCount} unread)</span>}
        </h2>
        <Link to="/settings/notifications" onClick={onClose} aria-label="Notification settings" className="rounded-full p-1 hover:bg-gs-25">
          <img src={gearIcon} alt="" width={20} height={20} />
        </Link>
      </header>
      <ul className="flex flex-col px-6 py-4">
        {items.map((n) => (
          <li key={n.id}>
            <button
              type="button"
              onClick={() => setItems((list) => list.map((i) => (i.id === n.id ? { ...i, unread: false } : i)))}
              className="flex w-full cursor-pointer gap-3 py-4 text-left"
            >
              <span className="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#efefef] shadow-[inset_0px_-4px_6px_0px_rgba(255,255,255,0.5)]">
                <img src={bellIcon} alt="" width={20} height={20} />
              </span>
              <span className="flex min-w-0 flex-1 flex-col gap-1">
                <span className="flex flex-col gap-[2px]">
                  <span className="flex items-center justify-between">
                    <span className="text-[14px] leading-[1.5] font-semibold tracking-[-0.14px] text-black">{n.title}</span>
                    {n.unread && <img src={unreadDot} alt="Unread" width={8} height={8} />}
                  </span>
                  <span className="text-[12px] leading-[1.5] tracking-[-0.24px] text-ink/80">{BODY}</span>
                </span>
                <span className="text-[12px] leading-[1.5] text-grey-text">{n.time}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
      <footer className="flex h-[88px] items-center gap-2 border-t border-gs-100 px-6">
        <button
          type="button"
          disabled={unreadCount === 0}
          onClick={() => setItems((list) => list.map((i) => ({ ...i, unread: false })))}
          className="flex-1 cursor-pointer text-left text-[14px] leading-[1.5] font-semibold tracking-[-0.28px] text-black hover:underline disabled:cursor-default disabled:text-grey-text disabled:no-underline"
        >
          Mark all as read
        </button>
        <Link
          to="/inbox"
          onClick={onClose}
          className="flex w-[182px] items-center justify-center rounded-[6px] bg-primary px-4 py-3 text-[14px] leading-[1.1] font-semibold tracking-[-0.42px] text-black hover:brightness-95"
        >
          View All Notifications
        </Link>
      </footer>
    </div>
  )
}
