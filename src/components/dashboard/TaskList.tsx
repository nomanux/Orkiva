import { useRef, useState } from 'react'
import { Card, CardTitle } from '../ui/Card'
import { ExportDataModal, type ExportFormat } from '../overlays/ExportDataModal'
import { Toast } from '../ui/Toast'
import { useToast } from '../../hooks/useToast'
import { useDismiss } from '../../hooks/useDismiss'
import onlineDot from '../../assets/dashboard/online-dot.svg'
import downloadIcon from '../../assets/dashboard/download.svg'
import dotsButton from '../../assets/dashboard/dots-button.svg'
import { tasks, type TaskStatus } from '../../data/dashboard'

const STATUS_BARS = 10
const STATUS = {
  completed: { label: 'Completed', fill: 'bg-primary' },
  'in-progress': { label: 'In Progress', fill: 'bg-danger' },
} satisfies Record<TaskStatus, { label: string; fill: string }>

const COLUMNS = 'grid grid-cols-[minmax(150px,1.4fr)_minmax(150px,1.4fr)_minmax(60px,0.7fr)_minmax(110px,1fr)_93px] gap-x-3'
const HEADER_CELL = 'text-[16px] leading-[1.2] tracking-[-0.64px] text-grey'

function StatusMeter({ status, progress }: { status: TaskStatus; progress: number }) {
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

function downloadCsv() {
  const rows = [['Name', 'Handle', 'Project', 'Date', 'Status'], ...tasks.map((t) => [t.name, t.handle, t.project, t.date, STATUS[t.status].label])]
  const csv = rows.map((r) => r.map((c) => `"${c.replaceAll('"', '""')}"`).join(',')).join('\n')
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
  const a = Object.assign(document.createElement('a'), { href: url, download: 'orkiva-tasks.csv' })
  a.click()
  URL.revokeObjectURL(url)
}

export function TaskList() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [exporting, setExporting] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  useDismiss(menuRef, menuOpen, () => setMenuOpen(false))
  const toast = useToast()

  const onExport = (format: ExportFormat) => {
    setExporting(false)
    if (format === 'CSV') {
      downloadCsv()
      toast.show('Task list exported as CSV')
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
          {['Name', 'Project', 'Time', 'Status', 'Receipt'].map((h) => (
            <span key={h} role="columnheader" className={HEADER_CELL}>
              {h}
            </span>
          ))}
        </div>
        {tasks.map((task) => (
          <div key={task.name} role="row" className={`${COLUMNS} h-8 items-center`}>
            <div role="cell" className="flex items-center gap-2">
              <span className="relative size-8 shrink-0">
                <img src={task.avatar} alt="" width={32} height={32} className="rounded-full" />
                <img src={onlineDot} alt="" width={8} height={8} className="absolute top-[21px] left-[22px]" />
              </span>
              <span className="flex flex-col gap-[2px] text-[12px] leading-[1.2] tracking-[-0.36px]">
                <span className="font-semibold">{task.name}</span>
                <span className="text-black/40">{task.handle}</span>
              </span>
            </div>
            <span role="cell" className="text-[12px] leading-[1.2] font-medium tracking-[-0.36px]">
              {task.project}
            </span>
            <span role="cell" className="text-[12px] leading-[1.2] tracking-[-0.36px]">
              {task.date}
            </span>
            <div role="cell">
              <StatusMeter status={task.status} progress={task.progress} />
            </div>
            <div role="cell">
              <button
                type="button"
                className="flex h-[26px] w-[93px] cursor-pointer items-center justify-between rounded-[4px] bg-primary px-2 py-[6px] hover:brightness-95"
              >
                <img src={downloadIcon} alt="" width={12} height={12} />
                <span className="text-[12px] leading-[1.2] tracking-[-0.36px]">Receipt.pdf</span>
              </button>
            </div>
          </div>
        ))}
      </div>
      <ExportDataModal open={exporting} onClose={() => setExporting(false)} onExport={onExport} />
      <Toast message={toast.message} />
    </Card>
  )
}
