import { useEffect, useRef, useState } from 'react'
import dropdownIcon from '../../assets/dashboard/dropdown.svg'

type FilterDropdownProps = {
  options: string[]
  value: string
  onChange: (value: string) => void
  className?: string
}

export function FilterDropdown({ options, value, onChange, className = '' }: FilterDropdownProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const close = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [open])

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex h-8 cursor-pointer items-center gap-2 rounded-[30px] bg-background py-1 pr-1 pl-4 hover:bg-stock"
      >
        <span className="text-[12px] leading-[1.2] font-medium tracking-[-0.24px] whitespace-nowrap">{value}</span>
        <span className="flex size-6 items-center justify-center rounded-xl bg-white p-1">
          <img
            src={dropdownIcon}
            alt=""
            width={16}
            height={16}
            className={`transition-transform ${open ? 'rotate-180' : ''}`}
          />
        </span>
      </button>
      {open && (
        <ul
          role="listbox"
          className="absolute right-0 z-20 mt-1 min-w-full overflow-hidden rounded-xl bg-white py-1 shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
        >
          {options.map((option) => (
            <li key={option}>
              <button
                type="button"
                role="option"
                aria-selected={option === value}
                onClick={() => {
                  onChange(option)
                  setOpen(false)
                }}
                className={`w-full cursor-pointer px-4 py-2 text-left text-[12px] font-medium whitespace-nowrap hover:bg-background ${
                  option === value ? 'text-black' : 'text-black/60'
                }`}
              >
                {option}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
