import { useRef, useState } from 'react'
import { Link } from 'react-router'
import { Card, CardTitle } from '../ui/Card'
import { ExportDataModal, type ExportFormat } from '../overlays/ExportDataModal'
import { Toast } from '../ui/Toast'
import { useToast } from '../../hooks/useToast'
import { useDismiss } from '../../hooks/useDismiss'
import onlineDot from '../../assets/dashboard/online-dot.svg'
import downloadIcon from '../../assets/dashboard/download.svg'
import dotsButton from '../../assets/dashboard/dots-button.svg'
import { projectById, useProjects, useTasks, type Status, type Task } from '../../data/projects'
import { personById } from '../../data/people'
import { formatShort } from '../../lib/dates'

const STATUS_BARS = 10
const STATUS: Record<Status, { label: string; fill: string }> = {
  Done: { label: 'Completed', fill: 'bg-primary' },
  'In Review': { label: 'In Review', fill: 'bg-done' },
  'In Progress': { label: 'In Progress', fill: 'bg-danger' },
  Todo: { label: 'To Do', fill: 'bg-gs-300' },
}

/** Last touched first: completion date for done tasks, creation date otherwise. */
const touched = (t: Task) => t.completedAt ?? t.createdAt

const COLUMNS = 'grid grid-cols-[minmax(150px,1.4fr)_minmax(150px,1.4fr)_minmax(60px,0.7fr)_minmax(110px,1fr)_93px] gap-x-3'
const HEADER_CELL = 'text-[16px] leading-[1.2] tracking-[-0.64px] text-grey'

function StatusMeter({ status, progress }: { status: Status; progress: number }) {
  const { label, fill } = STATUS[status]
  return (
    <div className="flex items-center gap-1">
      <div className="flex gap-px" aria-hidden>
        {Array.from({ length: STATUS_BARS }, (_, i) => (
          <span key={i} className={`h-[10px] w-[2px] rounded-[1px] ${i < progress ? fill : 'bg-track'}`} />
        ))}
      </div>
      <span className="text-[11px] leading-[1.2] font-medium">{label}</span>
    </div>
  )
}

function download(name: string, type: string, text: string) {
  const url = URL.createObjectURL(new Blob([text], { type }))
  const a = Object.assign(document.createElement('a'), { href: url, download: name })
  a.click()
  URL.revokeObjectURL(url)
}

const cell = (c: string | number) => `"${String(c).replaceAll('"', '""')}"`

function downloadCsv(tasks: Task[]) {
  const rows = [
    ['Task', 'Project', 'Status', 'Priority', 'Due', 'Assignees', 'Progress'],
    ...tasks.map((t) => [
      t.title,
      projectById(t.projectId)?.name ?? '',
      t.status,
      t.priority,
      t.dueDate ?? '',
      t.memberIds.map((id) => personById(id)?.name).join('; '),
      `${t.progress}%`,
    ]),
  ]
  download('orkiva-tasks.csv', 'text/csv', rows.map((r) => r.map(cell).join(',')).join('\n'))
}

function downloadBrief(t: Task) {
  const lines = [
    t.title,
    '='.repeat(t.title.length),
    `Project:   ${projectById(t.projectId)?.name ?? '—'}`,
    `Status:    ${t.status} (${t.progress}%)`,
    `Priority:  ${t.priority}`,
    `Due:       ${t.dueDate ?? '—'}`,
    `Assignees: ${t.memberIds.map((id) => personById(id)?.name).join(', ')}`,
    '',
    t.description || 'No description.',
    '',
    `Files: ${t.attachments.join(', ') || 'none'}`,
  ]
  download(`${t.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.txt`, 'text/plain', lines.join('\n'))
}

export function TaskList() {
  const all = useTasks()
  useProjects() // re-render when a project is renamed or removed
  const tasks = [...all].sort((a, b) => touched(b).localeCompare(touched(a))).slice(0, 3)
  const [menuOpen, setMenuOpen] = useState(false)
  const [exporting, setExporting] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  useDismiss(menuRef, menuOpen, () => setMenuOpen(false))
  const toast = useToast()

  const onExport = (format: ExportFormat) => {
    setExporting(false)
    if (format === 'CSV') {
      downloadCsv(all)
      toast.show(`${all.length} tasks exported as CSV`)
    } else {
      toast.show(`${format} export isn’t available yet — try CSV`)
    }
  }

  return (
    <Card className="h-[269px] min-w-0 flex-[663] p-4">
      <div className="flex items-center justify-between">
        <CardTitle>Task List</CardTitle>
        <div ref={menuRef} className="relative flex">
          <button
            type="button"
            aria-label="Task list options"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
            className="cursor-pointer rounded-full"
          >
            <img src={dotsButton} alt="" width={38} height={38} className="-scale-y-100 -rotate-90" />
          </button>
          {menuOpen && (
            <ul role="menu" className="absolute top-full right-0 z-20 mt-1 w-40 overflow-hidden rounded-xl bg-white py-1 shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
              <li role="none">
                <Link role="menuitem" to="/projects" className="block px-4 py-2 text-[14px] font-medium hover:bg-background">
                  View all tasks
                </Link>
              </li>
              <li role="none">
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setMenuOpen(false)
                    setExporting(true)
                  }}
                  className="w-full cursor-pointer px-4 py-2 text-left text-[14px] font-medium hover:bg-background"
                >
                  Export Data
                </button>
              </li>
            </ul>
          )}
        </div>
      </div>

      <div role="table" className="mt-[21px] flex flex-col gap-4">
        <div role="row" className={COLUMNS}>
          {['Assignee', 'Project', 'Due', 'Status', 'Brief'].map((h) => (
            <span key={h} role="columnheader" className={HEADER_CELL}>
              {h}
            </span>
          ))}
        </div>
        {tasks.map((task) => {
          const owner = personById(task.memberIds[0] ?? '')
          return (
          <div key={task.id} role="row" className={`${COLUMNS} h-8 items-center`}>
            <div role="cell" className="flex items-center gap-2">
              <span className="relative size-8 shrink-0">
                {owner && <img src={owner.avatar} alt="" width={32} height={32} className="rounded-full" />}
                <img src={onlineDot} alt="" width={8} height={8} className="absolute top-[21px] left-[22px]" />
              </span>
              <span className="flex min-w-0 flex-col gap-[2px] text-[12px] leading-[1.2] tracking-[-0.36px]">
                <span className="truncate font-semibold">{owner?.name ?? 'Unassigned'}</span>
                <span className="truncate text-black/40">{owner?.role}</span>
              </span>
            </div>
            <Link
              role="cell"
              to={`/projects?project=${task.projectId}`}
              title={task.title}
              className="flex min-w-0 flex-col gap-[2px] text-[12px] leading-[1.2] tracking-[-0.36px] hover:underline"
            >
              <span className="truncate font-medium">{task.title}</span>
              <span className="truncate text-black/40">{projectById(task.projectId)?.name}</span>
            </Link>
            <span role="cell" className="text-[12px] leading-[1.2] tracking-[-0.36px]">
              {task.dueDate ? formatShort(task.dueDate) : '—'}
            </span>
            <div role="cell">
              <StatusMeter status={task.status} progress={Math.round(task.progress / 10)} />
            </div>
            <div role="cell">
              <button
                type="button"
                onClick={() => {
                  downloadBrief(task)
                  toast.show(`Downloaded brief for “${task.title}”`)
                }}
                aria-label={`Download brief for ${task.title}`}
                className="flex h-[26px] w-[93px] cursor-pointer items-center justify-between rounded-[4px] bg-primary px-2 py-[6px] hover:brightness-95"
              >
                <img src={downloadIcon} alt="" width={12} height={12} />
                <span className="text-[12px] leading-[1.2] tracking-[-0.36px]">Brief.txt</span>
              </button>
            </div>
          </div>
          )
        })}
      </div>
      <ExportDataModal open={exporting} onClose={() => setExporting(false)} onExport={onExport} />
      <Toast message={toast.message} />
    </Card>
  )
}
