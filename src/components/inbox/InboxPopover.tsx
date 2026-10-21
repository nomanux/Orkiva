import { Fragment, useRef } from 'react'
import { useDismiss } from '../../hooks/useDismiss'
import { Toggle } from '../settings/SettingsControls'
import closeIcon from '../../assets/inbox/close.svg'
import chevron from '../../assets/inbox/chevron-action.svg'

export type PopoverRow =
  | { kind: 'toggle'; label: string; value: boolean; onChange: (v: boolean) => void }
  | { kind: 'link'; label: string; onClick: () => void; danger?: boolean }

type InboxPopoverProps = { title: string; rows: PopoverRow[]; onClose: () => void; className?: string }

/** The small settings panel used by "Preferences" (chat list) and "Action" (conversation). */
export function InboxPopover({ title, rows, onClose, className = '' }: InboxPopoverProps) {
  const ref = useRef<HTMLDivElement>(null)
  useDismiss(ref, true, onClose)

  return (
    <div
      ref={ref}
      role="dialog"
      aria-label={title}
      className={`absolute z-30 flex w-[300px] flex-col gap-3 rounded-xl border border-stroke-soft bg-white px-4 py-3 shadow-[0px_1px_3px_rgba(16,24,40,0.1),0px_1px_2px_rgba(16,24,40,0.06)] ${className}`}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-[15px] leading-[1.5] font-semibold text-strong-950">{title}</h2>
        <button type="button" aria-label="Close" onClick={onClose} className="cursor-pointer rounded-md p-0.5 hover:bg-background">
          <img src={closeIcon} alt="" width={20} height={20} />
        </button>
      </div>
      {rows.map((row) => (
        <Fragment key={row.label}>
          <span className="h-px w-full bg-stroke-soft" aria-hidden />
          {row.kind === 'toggle' ? (
            <div className="flex h-7 items-center justify-between">
              <span className="text-[14px] leading-[1.5] text-black/70">{row.label}</span>
              <Toggle label={row.label} checked={row.value} onChange={row.onChange} />
            </div>
          ) : (
            <button
              type="button"
              onClick={row.onClick}
              className={`-mx-1 flex h-7 cursor-pointer items-center justify-between rounded-md px-1 text-left text-[14px] leading-[1.5] hover:bg-background ${
                row.danger ? 'text-error' : 'text-black/70'
              }`}
            >
              {row.label}
              <img src={chevron} alt="" width={20} height={20} className="-rotate-90" />
            </button>
          )}
        </Fragment>
      ))}
    </div>
  )
}
