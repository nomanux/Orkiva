import type { ReactNode } from 'react'
import caretRight from '../../assets/projects/caret-right.svg'
import plusSmall from '../../assets/projects/plus-small.svg'
import menuDots from '../../assets/dashboard/menu-dots.svg'

type KanbanColumnProps = {
  title: string
  count: number
  onAdd: () => void
  collapsed: boolean
  onToggle: () => void
  children: ReactNode
}

export function KanbanColumn({ title, count, onAdd, collapsed, onToggle, children }: KanbanColumnProps) {
  return (
    <section aria-label={title} className="flex min-w-[300px] flex-1 flex-col self-start rounded-[26px] border border-stock bg-white p-[15px]">
      <header className="flex items-center justify-between border-b border-stock pb-[15px]">
        <button type="button" onClick={onToggle} aria-expanded={!collapsed} className="flex cursor-pointer items-center gap-[6px]">
          <img src={caretRight} alt="" width={16} height={16} className={`transition-transform ${collapsed ? '' : 'rotate-90'}`} />
          <h2 className="text-[16px] leading-[1.2] font-semibold tracking-[-0.32px] text-ink">{title}</h2>
          <span className="text-[13px] font-medium text-grey-text">({count})</span>
        </button>
        <div className="flex items-center gap-2">
          <button type="button" onClick={onAdd} aria-label={`Add task to ${title}`} className="cursor-pointer rounded hover:bg-background">
            <img src={plusSmall} alt="" width={16} height={16} />
          </button>
          <img src={menuDots} alt="" width={20} height={20} className="-rotate-90" />
        </div>
      </header>
      {!collapsed && (
        <div className="flex flex-col gap-4 pt-4">
          {children}
          {count === 0 && <p className="py-6 text-center text-[14px] text-grey-text">No tasks yet.</p>}
        </div>
      )}
    </section>
  )
}
