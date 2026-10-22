import { useRef, useState, type DragEvent, type ReactNode } from 'react'
import { TASK_DRAG_TYPE } from './TaskCard'
import caretRight from '../../assets/projects/caret-right.svg'
import plusSmall from '../../assets/projects/plus-small.svg'
import menuDots from '../../assets/dashboard/menu-dots.svg'

type KanbanColumnProps = {
  title: string
  count: number
  onAdd: () => void
  collapsed: boolean
  onToggle: () => void
  /** Called with the id of a task card dropped on this column. */
  onDropTask: (taskId: string) => void
  children: ReactNode
}

export function KanbanColumn({ title, count, onAdd, collapsed, onToggle, onDropTask, children }: KanbanColumnProps) {
  const [over, setOver] = useState(false)
  // dragenter/leave fire for every child, so count depth to know when the pointer really left
  const depth = useRef(0)
  const accepts = (e: DragEvent) => e.dataTransfer.types.includes(TASK_DRAG_TYPE)

  return (
    <section
      aria-label={title}
      onDragEnter={(e) => {
        if (!accepts(e)) return
        depth.current++
        setOver(true)
      }}
      onDragOver={(e) => {
        if (!accepts(e)) return
        e.preventDefault()
        e.dataTransfer.dropEffect = 'move'
      }}
      onDragLeave={(e) => {
        if (!accepts(e)) return
        if (--depth.current <= 0) {
          depth.current = 0
          setOver(false)
        }
      }}
      onDrop={(e) => {
        if (!accepts(e)) return
        e.preventDefault()
        depth.current = 0
        setOver(false)
        onDropTask(e.dataTransfer.getData(TASK_DRAG_TYPE))
      }}
      className={`flex min-w-[300px] flex-1 flex-col self-start rounded-[26px] border bg-white p-[15px] transition-colors ${
        over ? 'border-primary bg-primary/5 ring-2 ring-primary/30' : 'border-stock'
      }`}
    >
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
        </div>
      )}
    </section>
  )
}
