import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import gearIcon from '../../assets/overlays/gear.svg'
import bellIcon from '../../assets/overlays/bell.svg'
import unreadDot from '../../assets/overlays/unread-dot.svg'
import { markAllRead, markRead, useNotifications } from '../../data/notifications'
import { timeAgo } from '../../lib/dates'

const PREVIEW = 4

export function NotificationsPopover({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate()
  const items = useNotifications()
  const [showAll, setShowAll] = useState(false)
  const unreadCount = items.filter((n) => n.unread).length
  const visible = showAll ? items : items.slice(0, PREVIEW)

  return (
    <div
      role="dialog"
      aria-label="Notifications"
      className="w-[400px] overflow-hidden rounded-2xl border border-gs-100 bg-white shadow-[0px_16px_32px_-1px_rgba(128,136,151,0.2)]"
    >
      <header className="flex h-[64px] items-center justify-between border-b border-gs-100 px-6">
        <h2 className="text-[18px] leading-[1.4] font-semibold tracking-[-0.36px] text-ink">
          Notifications
          {unreadCount > 0 && <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-[12px] font-semibold">{unreadCount} new</span>}
        </h2>
        <Link to="/settings/notifications" onClick={onClose} aria-label="Notification settings" className="rounded-full p-1 hover:bg-gs-25">
          <img src={gearIcon} alt="" width={20} height={20} />
        </Link>
      </header>
      <ul className="flex max-h-[min(460px,calc(100dvh-260px))] flex-col overflow-y-auto px-6 py-2">
        {visible.length === 0 && <li className="py-10 text-center text-[14px] text-grey-text">You’re all caught up.</li>}
        {visible.map((n) => (
          <li key={n.id} className="border-b border-gs-50 last:border-b-0">
            <button
              type="button"
              onClick={() => {
                markRead(n.id)
                if (n.link) {
                  onClose()
                  navigate(n.link)
                }
              }}
              className="flex w-full cursor-pointer gap-3 py-3.5 text-left"
            >
              <span className="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#efefef] shadow-[inset_0px_-4px_6px_0px_rgba(255,255,255,0.5)]">
                <img src={bellIcon} alt="" width={20} height={20} />
              </span>
              <span className="flex min-w-0 flex-1 flex-col gap-1">
                <span className="flex items-start justify-between gap-2">
                  <span className={`text-[14px] leading-[1.45] tracking-[-0.14px] text-black ${n.unread ? 'font-semibold' : 'font-medium'}`}>{n.title}</span>
                  {n.unread && <img src={unreadDot} alt="Unread" width={8} height={8} className="mt-1.5 shrink-0" />}
                </span>
                <span className="text-[12px] leading-[1.5] tracking-[-0.24px] text-ink/70">{n.body}</span>
                <span className="text-[12px] leading-[1.5] text-grey-text">{timeAgo(n.at)}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
      <footer className="flex h-[72px] items-center gap-2 border-t border-gs-100 px-6">
        <button
          type="button"
          disabled={unreadCount === 0}
          onClick={markAllRead}
          className="flex-1 cursor-pointer text-left text-[14px] leading-[1.5] font-semibold tracking-[-0.28px] text-black hover:underline disabled:cursor-default disabled:text-grey-text disabled:no-underline"
        >
          Mark all as read
        </button>
        {items.length > PREVIEW && (
          <button
            type="button"
            onClick={() => setShowAll((s) => !s)}
            className="flex w-[182px] cursor-pointer items-center justify-center rounded-[6px] bg-primary px-4 py-3 text-[14px] leading-[1.1] font-semibold tracking-[-0.42px] text-black hover:brightness-95"
          >
            {showAll ? 'Show fewer' : `View All (${items.length})`}
          </button>
        )}
      </footer>
    </div>
  )
}
