import { useRef, useState } from 'react'
import { useDismiss } from '../../hooks/useDismiss'
import { formatToday } from '../../lib/dates'
import { formatShort } from '../../lib/dates'
import { personById } from '../../data/people'
import { percent } from '../../data/insights'
import type { Project, Task } from '../../data/projects'
import chevronDown from '../../assets/projects/chevron-down.svg'
import sortIcon from '../../assets/projects/sort.svg'
import plusIcon from '../../assets/projects/plus.svg'

const MAX_FACES = 5
const STATUS_DOT = { Active: 'bg-primary', 'On Hold': 'bg-[#fbd93c]', Completed: 'bg-gs-300' }

type BoardToolbarProps = {
  projects: Project[]
  project: Project
  tasks: Task[]
  onSelect: (id: string) => void
  onCreateProject: () => void
  onDeleteProject: () => void
  onCreateTask: () => void
  onToggleFilters: () => void
  filtersActive: boolean
}

export function BoardToolbar({
  projects,
  project,
  tasks,
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
  const currentId = project.id
  const [now] = useState(() => new Date())
  const team = project.memberIds.map(personById).filter((p) => !!p)
  const done = percent(tasks.filter((t) => t.status === 'Done').length, tasks.length)
  const manager = personById(project.managerId ?? '')

  const item = 'block w-full cursor-pointer px-4 py-2.5 text-left text-[14px] font-medium hover:bg-background'

  return (
    <section className="flex h-[82px] items-center rounded-[15px] border border-stock bg-white pr-4 pl-[15px]">
      <div className="flex w-[246px] flex-col gap-[6px] leading-[1.2] text-black">
        <p className="text-[20px] font-semibold tracking-[-0.4px]">{now.toLocaleDateString('en-US', { month: 'long' })}</p>
        <p className="text-[14px] text-grey-text">Today is {formatToday(now)}</p>
      </div>
      <span className="mx-4 h-12 w-px bg-stock" aria-hidden />

      <div ref={menuRef} className="relative min-w-0">
        <button
          type="button"
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
          className="flex cursor-pointer items-center gap-3 leading-[1.2] text-black"
        >
          <span className="text-[20px] font-semibold tracking-[-0.4px]">Board -</span>
          <span className="text-[16px] font-medium tracking-[-0.32px]">{project.name}</span>
          <img src={chevronDown} alt="" width={16} height={16} className={`transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
        </button>
        <p className="mt-1.5 flex items-center gap-1.5 truncate text-[13px] leading-[1.2] whitespace-nowrap text-grey-text">
          <span className={`size-2 rounded-full ${STATUS_DOT[project.status ?? 'Active']}`} aria-hidden />
          {project.status ?? 'Active'}
          {project.client && ` · ${project.client}`} · {done}% done
          {project.endDate && ` · ends ${formatShort(project.endDate)}`}
          {manager && ` · PM ${manager.name}`}
        </p>
        {menuOpen && (
          <ul role="menu" className="absolute top-8 left-0 z-20 max-h-[420px] w-72 overflow-y-auto rounded-xl bg-white py-1 shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
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
                  className={`${item} flex items-center gap-2 ${p.id === currentId ? 'font-semibold text-ink' : 'text-grey-text'}`}
                >
                  <span className={`size-2 shrink-0 rounded-full ${STATUS_DOT[p.status ?? 'Active']}`} aria-hidden />
                  <span className="truncate">{p.name}</span>
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

      <div className="ml-auto flex items-center" aria-label={`Team: ${team.map((p) => p.name).join(', ')}`}>
        {team.slice(0, MAX_FACES).map((p, i, shown) => (
          <img
            key={p.id}
            src={p.avatar}
            alt=""
            title={`${p.name} — ${p.role}`}
            width={46}
            height={46}
            className={`size-[46px] rounded-full object-cover ring-2 ring-white ${i < shown.length - 1 || team.length > MAX_FACES ? '-mr-5' : ''}`}
          />
        ))}
        {team.length > MAX_FACES && (
          <span className="relative flex size-[46px] items-center justify-center rounded-full bg-background text-[14px] font-semibold ring-2 ring-white">
            +{team.length - MAX_FACES}
          </span>
        )}
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
