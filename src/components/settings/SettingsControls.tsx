import { useId, useState, type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes } from 'react'
import chevronDown from '../../assets/settings/chevron-down.svg'
import eyeIcon from '../../assets/settings/eye.svg'
import toggleOn from '../../assets/settings/toggle-on.svg'
import toggleOff from '../../assets/settings/toggle-off.svg'
import { BODY } from './styles'

const CONTROL =
  'flex h-10 w-full items-center gap-1.5 rounded-[10px] border border-gs-100 bg-white px-3 focus-within:border-primary'
const CONTROL_TEXT =
  'min-w-0 flex-1 bg-transparent text-[14px] leading-[1.5] text-ink outline-none placeholder:text-gs-400'

export function SettingsSection({
  title,
  description,
  children,
  divider = true,
}: {
  title: string
  description: ReactNode
  children: ReactNode
  divider?: boolean
}) {
  return (
    <section
      className={`flex w-full items-start gap-6 px-6 py-5 ${divider ? 'border-b border-gs-100 last:border-b-0' : ''}`}
    >
      <div className="flex w-[280px] shrink-0 flex-col gap-1">
        <h2 className="text-[18px] leading-[1.35] font-semibold text-ink">{title}</h2>
        <p className={`${BODY} font-medium text-grey-text`}>{description}</p>
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-4">{children}</div>
    </section>
  )
}

type FieldProps = { label: string; required?: boolean; hint?: ReactNode; className?: string; children: (id: string) => ReactNode }

export function Field({ label, required, hint, className = '', children }: FieldProps) {
  const id = useId()
  return (
    <div className={`flex flex-col gap-1.5 ${className || 'w-full'}`}>
      <label htmlFor={id} className={`${BODY} font-medium text-grey-text`}>
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
      {children(id)}
      {hint && <p className={`${BODY} text-gs-400`}>{hint}</p>}
    </div>
  )
}

type TextInputProps = InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: ReactNode; fieldClassName?: string }

export function TextInput({ label, required, hint, fieldClassName, ...props }: TextInputProps) {
  return (
    <Field label={label} required={required} hint={hint} className={fieldClassName}>
      {(id) => (
        <div className={CONTROL}>
          <input id={id} required={required} className={CONTROL_TEXT} {...props} />
        </div>
      )}
    </Field>
  )
}

export function PasswordInput({ label, required, hint, ...props }: TextInputProps) {
  const [revealed, setRevealed] = useState(false)
  return (
    <Field label={label} required={required} hint={hint}>
      {(id) => (
        <div className={CONTROL}>
          <input id={id} type={revealed ? 'text' : 'password'} required={required} className={CONTROL_TEXT} {...props} />
          <button
            type="button"
            onClick={() => setRevealed((r) => !r)}
            aria-label={revealed ? 'Hide password' : 'Show password'}
            aria-pressed={revealed}
            className={`cursor-pointer ${revealed ? 'opacity-100' : 'opacity-80 hover:opacity-100'}`}
          >
            <img src={eyeIcon} alt="" width={20} height={20} />
          </button>
        </div>
      )}
    </Field>
  )
}

type SelectInputProps = SelectHTMLAttributes<HTMLSelectElement> & { label: string; options: string[]; hint?: ReactNode }

export function SelectInput({ label, required, hint, options, ...props }: SelectInputProps) {
  return (
    <Field label={label} required={required} hint={hint}>
      {(id) => (
        <div className={`${CONTROL} relative`}>
          <select id={id} required={required} className={`${CONTROL_TEXT} cursor-pointer appearance-none pr-10`} {...props}>
            {options.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
          <img
            src={chevronDown}
            alt=""
            width={18}
            height={18}
            className="pointer-events-none absolute right-3"
          />
        </div>
      )}
    </Field>
  )
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className="shrink-0 cursor-pointer rounded-full"
    >
      <img src={checked ? toggleOn : toggleOff} alt="" width={40} height={22} />
    </button>
  )
}

type PillButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'outline' | 'muted' | 'primary' }

export function PillButton({ variant = 'outline', className = '', ...props }: PillButtonProps) {
  const styles = {
    outline: 'border border-gs-100 bg-white text-ink hover:bg-gs-25',
    muted: 'border border-gs-100 bg-gs-50 text-grey-text',
    primary: 'bg-primary bg-[linear-gradient(0deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.15)_100%)] text-black hover:brightness-95',
  }[variant]
  return (
    <button
      type="button"
      className={`flex h-8 shrink-0 cursor-pointer items-center justify-center rounded-full px-3 text-[13px] leading-[1.5] font-semibold whitespace-nowrap disabled:cursor-default ${styles} ${className}`}
      {...props}
    />
  )
}

/** Square-ish outlined button used in the billing section. */
export function OutlineButton({ className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={`flex shrink-0 cursor-pointer items-center justify-center border border-gs-100 bg-white drop-shadow-[0px_1px_1px_rgba(13,13,18,0.06)] hover:bg-gs-25 ${className}`}
      {...props}
    />
  )
}
