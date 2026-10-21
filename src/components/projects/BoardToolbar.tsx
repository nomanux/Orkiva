import { useRef, useState } from 'react'
import { useDismiss } from '../../hooks/useDismiss'
import { formatToday } from '../../lib/dates'
import type { Project } from '../../data/projects'
import chevronDown from '../../assets/projects/chevron-down.svg'
import sortIcon from '../../assets/projects/sort.svg'
import plusIcon from '../../assets/projects/plus.svg'
import team1 from '../../assets/projects/team-1.png'
import team2 from '../../assets/projects/team-2.png'
import team3 from '../../assets/projects/team-3.png'
import team4 from '../../assets/projects/team-4.png'
import team5 from '../../assets/projects/team-5.png'

const TEAM = [team1, team2, team3, team4, team5]

type BoardToolbarProps = {
  projects: Project[]
  currentId: string
  onSelect: (id: string) => void
  onCreateProject: () => void
  onDeleteProject: () => void
  onCreateTask: () => void
  onToggleFilters: () => void
  filtersActive: boolean
}

export function BoardToolbar({
  projects,
  currentId,
  onSelect,
  onCreateProject,
  onDeleteProject,
  onCreateTask,
  onToggleFilters,
  filtersActive,
}: BoardToolbarProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  useDismiss(menuRef, menuOpen, () => setMenuOpen(false))
  const current = projects.find((p) => p.id === currentId)
  const [now] = useState(() => new Date())

  const item = 'block w-full cursor-pointer px-4 py-2.5 text-left text-[14px] font-medium hover:bg-background'

  return (
    <section className="flex h-[82px] items-center rounded-[15px] border border-stock bg-white pr-4 pl-[15px]">
      <div className="flex w-[246px] flex-col gap-[6px] leading-[1.2] text-black">
        <p className="text-[20px] font-semibold tracking-[-0.4px]">{now.toLocaleDateString('en-US', { month: 'long' })}</p>
        <p className="text-[14px] text-grey-text">Today is {formatToday(now)}</p>
      </div>
      <span className="mx-4 h-12 w-px bg-stock" aria-hidden />

      <div ref={menuRef} className="relative">
        <button
          type="button"
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
          className="flex cursor-pointer items-center gap-3 leading-[1.2] text-black"
        >
          <span className="text-[20px] font-semibold tracking-[-0.4px]">Board -</span>
          <span className="text-[16px] font-medium tracking-[-0.32px]">{current?.name}</span>
          <img src={chevronDown} alt="" width={16} height={16} className={`transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
        </button>
        {menuOpen && (
          <ul role="menu" className="absolute top-full left-0 z-20 mt-2 w-60 overflow-hidden rounded-xl bg-white py-1 shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
            {projects.map((p) => (
              <li key={p.id} role="none">
                <button
                  type="button"
                  role="menuitemradio"
                  aria-checked={p.id === currentId}
                  onClick={() => {
                    onSelect(p.id)
                    setMenuOpen(false)
                  }}
                  className={`${item} ${p.id === currentId ? 'font-semibold text-ink' : 'text-grey-text'}`}
                >
                  {p.name}
                </button>
              </li>
            ))}
            <li role="separator" className="my-1 border-t border-gs-100" />
            <li role="none">
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setMenuOpen(false)
                  onCreateProject()
                }}
                className={item}
              >
                + Create New Project
              </button>
            </li>
            <li role="none">
              <button
                type="button"
                role="menuitem"
                disabled={projects.length < 2}
                onClick={() => {
                  setMenuOpen(false)
                  onDeleteProject()
                }}
                className={`${item} text-error disabled:cursor-not-allowed disabled:opacity-40`}
              >
                Delete Project
              </button>
            </li>
          </ul>
        )}
      </div>

      <div className="ml-auto flex items-center" aria-label="Team members">
        {TEAM.map((src, i) => (
          <img key={src} src={src} alt="" width={46} height={46} className={`rounded-full ${i < TEAM.length - 1 ? '-mr-5' : ''}`} />
        ))}
      </div>
      <span className="mr-4 ml-[42px] h-12 w-px bg-stock" aria-hidden />

      <button
        type="button"
        onClick={onToggleFilters}
        aria-pressed={filtersActive}
        className={`flex h-11 cursor-pointer items-center gap-2 rounded-[6px] border px-4 ${
          filtersActive ? 'border-primary bg-primary/10' : 'border-stock hover:bg-background'
        }`}
      >
        <img src={sortIcon} alt="" width={24} height={24} />
        <span className="text-[15px] leading-[1.2] font-medium text-black">Filters</span>
      </button>
      <button
        type="button"
        onClick={onCreateTask}
        className="ml-3 flex h-11 cursor-pointer items-center gap-2 rounded-[6px] bg-primary px-4 hover:brightness-95"
      >
        <img src={plusIcon} alt="" width={20} height={20} />
        <span className="text-[15px] leading-[1.2] font-semibold text-black">Create task</span>
      </button>
    </section>
  )
}
