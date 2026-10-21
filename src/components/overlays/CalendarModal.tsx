import { useId, useState } from 'react'
import { Modal } from '../ui/Modal'
import chevronLeft from '../../assets/overlays/chevron-left.svg'
import chevronRight from '../../assets/overlays/chevron-right.svg'
import { fromISO, toISO } from '../../lib/dates'

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export type DateValue = { start: string; end?: string }

type CalendarModalProps = {
  open: boolean
  onClose: () => void
  onSet: (value: DateValue) => void
  initial?: DateValue
  /** `range` lets the second click pick an end date. */
  mode?: 'single' | 'range'
}

/** Six-week grid starting on the Sunday on or before the 1st of the month. */
function monthGrid(year: number, month: number) {
  const first = new Date(year, month, 1)
  const start = new Date(year, month, 1 - first.getDay())
  return Array.from({ length: 42 }, (_, i) => new Date(start.getFullYear(), start.getMonth(), start.getDate() + i))
}

export function CalendarModal({ open, onClose, onSet, initial, mode = 'single' }: CalendarModalProps) {
  const titleId = useId()
  return (
    <Modal open={open} onClose={onClose} labelledBy={titleId} className="w-[400px] rounded-2xl">
      <CalendarBody titleId={titleId} onClose={onClose} onSet={onSet} initial={initial} mode={mode} />
    </Modal>
  )
}

function CalendarBody({ titleId, onClose, onSet, initial, mode }: Omit<CalendarModalProps, 'open'> & { titleId: string }) {
  const [today] = useState(() => toISO(new Date()))
  const [value, setValue] = useState<DateValue | undefined>(initial)
  const [view, setView] = useState(() => {
    const d = fromISO(initial?.start ?? today)
    return { year: d.getFullYear(), month: d.getMonth() }
  })

  const days = monthGrid(view.year, view.month)
  const monthLabel = new Date(view.year, view.month, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  const shift = (delta: number) =>
    setView(({ year, month }) => {
      const d = new Date(year, month + delta, 1)
      return { year: d.getFullYear(), month: d.getMonth() }
    })

  const pick = (iso: string) => {
    if (mode === 'range' && value && !value.end && iso > value.start) setValue({ start: value.start, end: iso })
    else setValue({ start: iso })
  }

  const isEndpoint = (iso: string) => iso === value?.start || iso === value?.end
  const inRange = (iso: string) => !!value?.end && iso > value.start && iso < value.end

  return (
    <div className="flex flex-col">
      <header className="flex items-center justify-between border-b border-gs-100 px-5 py-4">
        <NavButton label="Previous month" icon={chevronLeft} onClick={() => shift(-1)} />
        <h2 id={titleId} aria-live="polite" className="text-[18px] leading-[1.3] font-semibold tracking-[-0.36px] text-ink">
          {monthLabel}
        </h2>
        <NavButton label="Next month" icon={chevronRight} onClick={() => shift(1)} />
      </header>

      <div role="grid" aria-labelledby={titleId} className="grid grid-cols-7 gap-y-0.5 px-5 py-4 text-center">
        {WEEKDAYS.map((d) => (
          <div key={d} role="columnheader" className="flex h-9 items-center justify-center text-[13px] leading-[1.5] font-medium text-grey-text">
            {d}
          </div>
        ))}
        {days.map((d) => {
          const iso = toISO(d)
          const outside = d.getMonth() !== view.month
          const selected = isEndpoint(iso)
          return (
            <div key={iso} role="gridcell" className={`flex h-9 items-center justify-center ${inRange(iso) ? 'bg-primary/15' : ''}`}>
              <button
                type="button"
                onClick={() => pick(iso)}
                aria-pressed={selected}
                aria-label={d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                className={`size-9 cursor-pointer rounded-full font-geist text-[14px] leading-[1.5] ${
                  selected
                    ? 'bg-primary font-semibold text-black'
                    : `${outside ? 'text-grey-text' : 'text-ink'} hover:bg-gs-25 ${iso === today ? 'ring-1 ring-gs-100' : ''}`
                }`}
              >
                {d.getDate()}
              </button>
            </div>
          )
        })}
      </div>

      <footer className="flex gap-3 border-t border-gs-100 px-5 py-4">
        <button
          type="button"
          onClick={onClose}
          className="h-10 flex-1 cursor-pointer rounded-lg border border-gs-100 bg-white text-[14px] leading-[1.5] font-semibold text-ink drop-shadow-[0px_1px_1px_rgba(13,13,18,0.06)] hover:bg-gs-25"
        >
          Cancel
        </button>
        <button
          type="button"
          disabled={!value}
          onClick={() => value && onSet(value)}
          className="h-10 flex-1 cursor-pointer rounded-lg bg-primary bg-[linear-gradient(0deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.15)_100%)] text-[14px] leading-[1.5] font-semibold text-black drop-shadow-[0px_1px_1px_rgba(13,13,18,0.06)] hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Set Date
        </button>
      </footer>
    </div>
  )
}

function NavButton({ label, icon, onClick }: { label: string; icon: string; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex size-8 cursor-pointer items-center justify-center rounded-lg border border-gs-100 bg-white hover:bg-gs-25"
    >
      <img src={icon} alt="" width={18} height={18} />
    </button>
  )
}
