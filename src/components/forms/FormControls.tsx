import { useId, useRef, useState, type DragEvent, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes } from 'react'
import { CalendarModal, type DateValue } from '../overlays/CalendarModal'
import { useDismiss } from '../../hooks/useDismiss'
import calendarIcon from '../../assets/overlays/calendar.svg'
import chevronDown from '../../assets/overlays/chevron-down.svg'
import chipClose from '../../assets/overlays/chip-close.svg'
import resizeHandle from '../../assets/overlays/resize-handle.svg'
import { formatRange } from '../../lib/dates'
import type { Person } from '../../data/people'

const BOX = 'flex h-10 w-full items-center gap-2 rounded-[10px] border border-gs-100 bg-white px-3 focus-within:border-primary'
const TEXT = 'min-w-0 flex-1 bg-transparent text-[14px] leading-[1.5] outline-none placeholder:text-gs-400'

export function Field({ label, htmlFor, required, children }: { label: string; htmlFor?: string; required?: boolean; children: ReactNode }) {
  return (
    <div className="flex w-full min-w-0 flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-[13px] leading-[1.4] font-medium text-grey-text">
        {label}
        {required && (
          <>
            {' '}
            <span className="text-error" aria-hidden>
              *
            </span>
          </>
        )}
      </label>
      {children}
    </div>
  )
}

export function TextField({ label, required, ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  const id = useId()
  return (
    <Field label={label} htmlFor={id} required={required}>
      <div className={BOX}>
        <input id={id} required={required} className={`${TEXT} text-ink`} {...props} />
      </div>
    </Field>
  )
}

type SelectFieldProps = SelectHTMLAttributes<HTMLSelectElement> & { label: string; options: readonly string[]; placeholder: string }

export function SelectField({ label, required, options, placeholder, value, ...props }: SelectFieldProps) {
  const id = useId()
  return (
    <Field label={label} htmlFor={id} required={required}>
      <div className={`${BOX} relative`}>
        <select
          id={id}
          required={required}
          value={value}
          className={`${TEXT} cursor-pointer appearance-none pr-7 ${value ? 'text-ink' : 'text-gs-400'}`}
          {...props}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((o) => (
            <option key={o} value={o} className="text-ink">
              {o}
            </option>
          ))}
        </select>
        <img src={chevronDown} alt="" width={20} height={20} className="pointer-events-none absolute right-3" />
      </div>
    </Field>
  )
}

type TextAreaFieldProps = { label: string; required?: boolean; value: string; onChange: (v: string) => void; placeholder: string; maxLength?: number }

export function TextAreaField({ label, required, value, onChange, placeholder, maxLength = 200 }: TextAreaFieldProps) {
  const id = useId()
  return (
    <Field label={label} htmlFor={id} required={required}>
      <div className="flex min-h-[76px] w-full flex-col rounded-[10px] border border-gs-100 bg-white px-3 py-2 focus-within:border-primary">
        <textarea
          id={id}
          required={required}
          value={value}
          maxLength={maxLength}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={2}
          className={`${TEXT} resize-none text-ink`}
        />
        <div className="flex items-end">
          <span className="flex-1 font-geist text-[11px] leading-[1.5] text-gs-400" aria-live="polite">
            {value.length}/{maxLength}
          </span>
          <img src={resizeHandle} alt="" width={8.00018} height={10.0142} />
        </div>
      </div>
    </Field>
  )
}

type DateFieldProps = { label: string; required?: boolean; value?: DateValue; onChange: (v: DateValue) => void; placeholder: string; mode?: 'single' | 'range' }

export function DateField({ label, required, value, onChange, placeholder, mode = 'single' }: DateFieldProps) {
  const id = useId()
  const [open, setOpen] = useState(false)
  return (
    <Field label={label} htmlFor={id} required={required}>
      <button id={id} type="button" onClick={() => setOpen(true)} className={`${BOX} cursor-pointer text-left`} aria-haspopup="dialog">
        <span className={`${TEXT} ${value ? 'text-ink' : 'text-gs-400'}`}>{value ? formatRange(value.start, value.end) : placeholder}</span>
        <img src={calendarIcon} alt="" width={20} height={20} />
      </button>
      {/* Hidden input so the native form validation catches a missing date. */}
      {required && (
        <input
          tabIndex={-1}
          aria-hidden
          required
          value={value?.start ?? ''}
          onChange={() => {}}
          className="pointer-events-none -mt-2 h-0 w-full opacity-0"
        />
      )}
      <CalendarModal
        open={open}
        mode={mode}
        initial={value}
        onClose={() => setOpen(false)}
        onSet={(v) => {
          onChange(v)
          setOpen(false)
        }}
      />
    </Field>
  )
}

type MemberSelectProps = { label: string; required?: boolean; people: Person[]; value: string[]; onChange: (ids: string[]) => void; placeholder: string }

export function MemberSelect({ label, required, people, value, onChange, placeholder }: MemberSelectProps) {
  const id = useId()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useDismiss(ref, open, () => setOpen(false))
  const toggle = (pid: string) => onChange(value.includes(pid) ? value.filter((v) => v !== pid) : [...value, pid])
  const selected = people.filter((p) => value.includes(p.id))

  return (
    <Field label={label} htmlFor={id} required={required}>
      <div ref={ref} className="relative">
        <div className={`${BOX} h-auto min-h-10 justify-between py-1.5`}>
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-[6px]">
            {selected.length === 0 && <span className="text-[14px] text-gs-400">{placeholder}</span>}
            {selected.map((p) => (
              <span key={p.id} className="flex h-6 items-center gap-1 rounded-[4px] border border-gs-100 bg-white py-[2px] pr-1 pl-2">
                <span className="text-[13px] leading-[1.5] font-medium whitespace-nowrap text-ink">{p.name}</span>
                <button type="button" aria-label={`Remove ${p.name}`} onClick={() => toggle(p.id)} className="cursor-pointer">
                  <img src={chipClose} alt="" width={16} height={16} />
                </button>
              </span>
            ))}
          </div>
          <button
            id={id}
            type="button"
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-label={`Choose ${label.toLowerCase()}`}
            onClick={() => setOpen((o) => !o)}
            className="cursor-pointer"
          >
            <img src={chevronDown} alt="" width={20} height={20} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
          </button>
        </div>
        {required && (
          <input
            tabIndex={-1}
            aria-hidden
            required
            value={value.join(',')}
            onChange={() => {}}
            className="pointer-events-none absolute bottom-0 left-4 h-0 w-0 opacity-0"
          />
        )}
        {open && (
          <ul
            role="listbox"
            aria-multiselectable
            className="absolute right-0 left-0 z-10 mt-1 max-h-56 overflow-auto rounded-xl border border-gs-100 bg-white py-1 shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
          >
            {people.map((p) => {
              const on = value.includes(p.id)
              return (
                <li key={p.id} role="option" aria-selected={on}>
                  <button
                    type="button"
                    onClick={() => toggle(p.id)}
                    className="flex w-full cursor-pointer items-center gap-3 px-3 py-2 text-left text-[14px] font-medium text-ink hover:bg-gs-25"
                  >
                    <img src={p.avatar} alt="" width={24} height={24} className="rounded-full" />
                    <span className="flex min-w-0 flex-1 flex-col leading-[1.3]">
                      {p.name}
                      {'role' in p && <span className="text-[12px] font-normal text-gs-400">{p.role}</span>}
                    </span>
                    {on && <span className="text-[12px] font-semibold text-primary-dark">Selected</span>}
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </Field>
  )
}

type FileDropProps = { label: string; required?: boolean; files: string[]; onChange: (names: string[]) => void }

export function FileDrop({ label, required, files, onChange }: FileDropProps) {
  const id = useId()
  const [dragging, setDragging] = useState(false)
  const add = (list: FileList | null) => list && onChange([...files, ...Array.from(list, (f) => f.name)])
  const active = dragging || files.length > 0

  const onDrop = (e: DragEvent) => {
    e.preventDefault()
    setDragging(false)
    add(e.dataTransfer.files)
  }

  return (
    <Field label={label} htmlFor={id} required={required}>
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`relative flex min-h-[64px] w-full flex-col items-center justify-center gap-2 rounded-[10px] border px-3 py-2.5 ${
          active ? 'border-primary bg-primary/10' : 'border-gs-100 bg-white'
        }`}
      >
        <p className="text-[14px] leading-[1.5] text-gs-400">
          Drag &amp; Drop your files or{' '}
          <label htmlFor={id} className="cursor-pointer font-medium text-black hover:underline">
            Browse
          </label>
        </p>
        <input
          id={id}
          type="file"
          multiple
          required={required && files.length === 0}
          onChange={(e) => add(e.target.files)}
          className="absolute h-px w-px opacity-0"
        />
        {files.length > 0 && (
          <ul className="flex flex-wrap justify-center gap-[6px]">
            {files.map((name, i) => (
              <li key={`${name}-${i}`} className="flex h-6 items-center gap-1 rounded-[4px] border border-gs-100 bg-white py-[2px] pr-1 pl-2 text-[13px] font-medium text-ink">
                {name}
                <button type="button" aria-label={`Remove ${name}`} onClick={() => onChange(files.filter((_, j) => j !== i))} className="cursor-pointer">
                  <img src={chipClose} alt="" width={16} height={16} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Field>
  )
}
