import { useId, useState, type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode } from 'react'
import { Link } from 'react-router'
import eyeIcon from '../../assets/auth/eye.svg'
import googleIcon from '../../assets/auth/google.svg'
import flagUs from '../../assets/auth/flag-us.svg'
import arrowDownS from '../../assets/auth/arrow-down-s.svg'
import arrowLeft from '../../assets/auth/arrow-left.svg'

const NO_LIGATURES = { fontFeatureSettings: '"calt" 0, "liga" 0' }
const FIELD_BOX =
  'flex h-11 w-full items-center overflow-hidden rounded-[10px] border border-stock bg-white shadow-[0px_1px_2px_0px_rgba(10,13,20,0.03)] focus-within:border-primary'
const INPUT_TEXT =
  'min-w-0 flex-1 bg-transparent text-[14px] leading-5 font-medium tracking-[-0.084px] text-strong-950 outline-none placeholder:text-soft-400'

function FieldLabel({ htmlFor, children }: { htmlFor: string; children: ReactNode }) {
  return (
    <label
      htmlFor={htmlFor}
      className="flex gap-px text-[14px] leading-5 font-medium tracking-[-0.084px] whitespace-nowrap text-strong-950"
      style={NO_LIGATURES}
    >
      {children}
      <span className="text-required" aria-hidden>
        *
      </span>
    </label>
  )
}

type TextFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> & { label: string }

export function TextField({ label, type = 'text', className = '', ...props }: TextFieldProps) {
  const id = useId()
  const [revealed, setRevealed] = useState(false)
  const isPassword = type === 'password'

  return (
    <div className={`flex w-full flex-col gap-1 ${className}`}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <div className={`${FIELD_BOX} gap-2 pr-[10px] pl-3`}>
        <input
          id={id}
          type={isPassword && revealed ? 'text' : type}
          required
          className={INPUT_TEXT}
          style={NO_LIGATURES}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setRevealed((r) => !r)}
            aria-label={revealed ? 'Hide password' : 'Show password'}
            aria-pressed={revealed}
            className={`cursor-pointer transition-opacity ${revealed ? 'opacity-100' : 'opacity-70 hover:opacity-100'}`}
          >
            <img src={eyeIcon} alt="" width={24} height={24} />
          </button>
        )}
      </div>
    </div>
  )
}

export function PhoneField({ label, ...props }: Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> & { label: string }) {
  const id = useId()
  return (
    <div className="flex w-full flex-col gap-1">
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <div className={FIELD_BOX}>
        <button
          type="button"
          aria-label="Country code: United States +1"
          className="flex h-full shrink-0 cursor-pointer items-center gap-2 py-[10px] pr-2 pl-[10px]"
        >
          <img src={flagUs} alt="" width={20} height={20} />
          <span className="flex items-center gap-[2px]">
            <span className="text-[14px] leading-5 font-medium tracking-[-0.084px] text-strong-950" style={NO_LIGATURES}>
              +1
            </span>
            <img src={arrowDownS} alt="" width={20} height={20} />
          </span>
        </button>
        <div className="flex h-full flex-1 items-center border-l border-stroke-soft pr-[10px] pl-3">
          <input id={id} type="tel" required className={INPUT_TEXT} style={NO_LIGATURES} {...props} />
        </div>
      </div>
    </div>
  )
}

export function PrimaryButton({ className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="submit"
      className={`flex h-11 w-full cursor-pointer items-center justify-center rounded-[10px] bg-primary px-[14px] text-[16px] leading-[1.5] font-medium tracking-[-0.176px] text-button-text drop-shadow-[0px_0px_10px_rgba(0,0,0,0.02)] hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      style={NO_LIGATURES}
      {...props}
    />
  )
}

export function GoogleButton({ onClick }: { onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-11 w-full cursor-pointer items-center justify-center gap-3 rounded-[10px] border border-stock bg-white px-[14px] drop-shadow-[0px_0px_10px_rgba(0,0,0,0.02)] hover:bg-background"
    >
      <img src={googleIcon} alt="" width={24} height={24} />
      <span className="text-[16px] leading-[1.5] font-medium tracking-[-0.176px] text-black" style={NO_LIGATURES}>
        Sign In with Google
      </span>
    </button>
  )
}

export function FooterPrompt({ text, linkText, to }: { text: string; linkText: string; to: string }) {
  return (
    <p
      className="flex w-full justify-center gap-1 text-[16px] leading-[1.5] font-medium tracking-[-0.176px] text-soft-400"
      style={NO_LIGATURES}
    >
      {text}
      <Link to={to} className="text-primary-dark hover:underline">
        {linkText}
      </Link>
    </p>
  )
}

export function BackToLogin() {
  return (
    <Link
      to="/login"
      className="flex w-full items-center justify-center gap-1 text-[16px] leading-[1.5] font-medium tracking-[-0.176px] text-soft-400 hover:text-strong-950"
      style={NO_LIGATURES}
    >
      <img src={arrowLeft} alt="" width={24} height={24} className="-scale-y-100 rotate-90" />
      Back to login Screen
    </Link>
  )
}
