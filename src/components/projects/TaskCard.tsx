import { useRef, useState } from 'react'
import { useDismiss } from '../../hooks/useDismiss'
import { formatShort } from '../../lib/dates'
import { personById } from '../../data/people'
import type { Task, TaskMedia } from '../../data/projects'
import menuDots from '../../assets/dashboard/menu-dots.svg'
import flagIcon from '../../assets/projects/flag.svg'
import graphUp from '../../assets/projects/graph-up.svg'
import paperclip from '../../assets/projects/paperclip.svg'
import dashboardShot from '../../assets/projects/dashboard-shot.png'
import ecommerceDot from '../../assets/projects/ecommerce-dot.svg'

const SEGMENTS = 15
const CHIP = 'flex items-center justify-center rounded-[6px] border border-stock'

type TaskCardProps = { task: Task; onEdit: () => void; onDelete: () => void }

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  useDismiss(menuRef, menuOpen, () => setMenuOpen(false))
  const members = task.memberIds.map(personById).filter((p) => !!p)
  const filled = Math.round((task.progress / 100) * SEGMENTS)

  const note = task.note && <p className="text-[14px] leading-[1.2] tracking-[-0.28px] text-black">{task.note}</p>

  return (
    <article className="flex w-full flex-col gap-3 rounded-[26px] bg-background p-4">
      <header className="flex items-center justify-between gap-2">
        {task.label ? (
          <p className="text-[14px] leading-[1.2] font-medium tracking-[-0.28px]">{task.label}</p>
        ) : (
          <ul className="flex flex-wrap gap-[10px]">
            {task.tags.map((tag) => (
              <li key={tag} className={`${CHIP} bg-background/50 px-3 py-[6px] text-[14px] leading-[1.2] font-medium tracking-[-0.28px]`}>
                {tag}
              </li>
            ))}
          </ul>
        )}
        <div ref={menuRef} className="relative flex">
          <button
            type="button"
            aria-label={`Options for ${task.title}`}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
            className={`${CHIP} cursor-pointer p-[6px] hover:bg-white`}
          >
            <img src={menuDots} alt="" width={20} height={20} className="-rotate-90" />
          </button>
          {menuOpen && (
            <ul role="menu" className="absolute top-full right-0 z-10 mt-1 w-36 overflow-hidden rounded-xl bg-white py-1 shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
              <li role="none">
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setMenuOpen(false)
                    onEdit()
                  }}
                  className="w-full cursor-pointer px-4 py-2 text-left text-[14px] font-medium hover:bg-background"
                >
                  Edit task
                </button>
              </li>
              <li role="none">
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setMenuOpen(false)
                    onDelete()
                  }}
                  className="w-full cursor-pointer px-4 py-2 text-left text-[14px] font-medium text-error hover:bg-background"
                >
                  Delete task
                </button>
              </li>
            </ul>
          )}
        </div>
      </header>

      <div className="mt-[3px] flex flex-col gap-3">
        <h3 className="text-[17px] leading-[1.2] font-semibold tracking-[-0.34px] text-black">{task.title}</h3>
        {!task.noteAfterMedia && note}
      </div>

      {task.media && <TaskMediaPreview media={task.media} />}
      {task.noteAfterMedia && note}

      {task.dueDate && (
        <span className={`${CHIP} gap-[6px] self-start p-[6px]`}>
          <img src={flagIcon} alt="" width={20} height={20} />
          <span className="text-[14px] leading-[1.2] font-medium">{formatShort(task.dueDate)}</span>
        </span>
      )}

      <div className="flex flex-col gap-3 pt-1">
        <div className="flex justify-between text-[14px] leading-[1.2] font-semibold tracking-[-0.28px]">
          <span>Progress</span>
          <span>{task.progress}%</span>
        </div>
        <div
          role="progressbar"
          aria-valuenow={task.progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${task.title} progress`}
          className="flex gap-[2px]"
        >
          {Array.from({ length: SEGMENTS }, (_, i) => (
            <span key={i} className={`h-4 max-w-6 min-w-2 flex-1 rounded-[4px] ${i < filled ? 'bg-primary' : 'bg-white'}`} />
          ))}
        </div>
      </div>

      <footer className="mt-2 flex items-center justify-between">
        <div className="flex">
          {members.map((m, i) => (
            <img
              key={m.id}
              src={m.avatar}
              alt={m.name}
              title={m.name}
              width={32}
              height={32}
              className={`rounded-full ${i < members.length - 1 ? '-mr-[15px]' : ''}`}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <span className={`${CHIP} gap-[6px] p-[6px]`} title="Comments">
            <img src={graphUp} alt="" width={20} height={20} />
            <span className="text-[16px] leading-[1.2] font-medium tracking-[-0.32px]">{task.comments}</span>
          </span>
          <span className={`${CHIP} gap-[6px] p-[6px]`} title="Attachments">
            <img src={paperclip} alt="" width={20} height={20} />
            <span className="text-[16px] leading-[1.2] font-medium tracking-[-0.32px]">{task.attachments.length}</span>
          </span>
        </div>
      </footer>
    </article>
  )
}

/** Decorative previews from the design. */
function TaskMediaPreview({ media }: { media: TaskMedia }) {
  if (media === 'framed-shot')
    return (
      <div className="flex h-[186px] items-center justify-center rounded-xl bg-white">
        <img src={dashboardShot} alt="Dashboard design preview" width={233} height={166} className="h-[166px] w-[233px] rounded-[7px] object-cover" />
      </div>
    )
  if (media === 'shot')
    return <img src={dashboardShot} alt="Website design preview" width={276} height={186} className="h-[186px] w-full rounded-[7px] object-cover" />

  const box = 'relative h-[45px] rounded-xl border border-stock bg-white'
  return (
    <div className="relative h-[100px] overflow-hidden rounded-[6px] border border-stock bg-background/50" aria-hidden>
      <p className="absolute top-[11px] left-[11px] text-[16px] leading-[1.2] font-medium tracking-[-0.32px]">Payment method via e-commerce</p>
      {media === 'payment-3' ? (
        <div className="absolute top-[42px] left-[11px] flex gap-[6px]">
          {[86, 86, 69].map((w, i) => (
            <div key={i} className={`${box} flex items-center justify-center`} style={{ width: w }}>
              <span className="size-[23px] rounded-l-[2px] bg-primary/20" />
              <span className="relative h-[23px] w-[18px] rounded-r-[2px] bg-primary">
                <span className="absolute bottom-[2px] left-[2px] h-[6px] w-[13px] rounded-[2px] bg-primary-dark" />
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="absolute top-[42px] left-[11px] flex gap-[6px]">
          <div className={`${box} w-[123px]`}>
            <span className="absolute top-[8px] left-[49px] h-1 w-[26px] rounded-[2px] bg-track" />
            <span className="absolute top-[15px] left-[43px] flex h-[14px] w-[38px] items-center gap-[2px] rounded-[2px] bg-primary px-[2px]">
              <span className="flex flex-col gap-[2px]">
                {[0, 1, 2].map((i) => (
                  <span key={i} className="block h-[2px] w-[26px] rounded-[2px] bg-track" />
                ))}
              </span>
              <img src={ecommerceDot} alt="" width={4} height={4} className="self-start" />
            </span>
            <span className="absolute top-[33px] left-[49px] h-1 w-[26px] rounded-[2px] bg-track" />
          </div>
          <div className={`${box} flex w-[123px] flex-col items-center justify-center gap-1`}>
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className="block h-[3px] w-[23px] rounded-[2px] bg-track" />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
