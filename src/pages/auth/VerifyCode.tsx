import { Fragment, useRef, useState, type ClipboardEvent, type FormEvent, type KeyboardEvent } from 'react'
import { useNavigate } from 'react-router'
import { AuthLayout } from '../../components/auth/AuthLayout'
import { BackToLogin, PrimaryButton } from '../../components/auth/FormControls'

const CODE_LENGTH = 6
const SEPARATOR_AFTER = 2 // dash between the 3rd and 4th digit

export function VerifyCode() {
  const navigate = useNavigate()
  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(''))
  const inputs = useRef<(HTMLInputElement | null)[]>([])

  const focus = (i: number) => inputs.current[Math.max(0, Math.min(CODE_LENGTH - 1, i))]?.focus()

  const setDigit = (i: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1)
    setDigits((d) => d.map((v, j) => (j === i ? digit : v)))
    if (digit) focus(i + 1)
  }

  const onKeyDown = (i: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[i]) focus(i - 1)
    if (e.key === 'ArrowLeft') focus(i - 1)
    if (e.key === 'ArrowRight') focus(i + 1)
  }

  const onPaste = (e: ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, CODE_LENGTH)
    if (!pasted) return
    e.preventDefault()
    setDigits(Array.from({ length: CODE_LENGTH }, (_, i) => pasted[i] ?? ''))
    focus(pasted.length)
  }

  const complete = digits.every(Boolean)

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (complete) navigate('/reset-password')
  }

  return (
    <AuthLayout title="Enter the code" subtitle="“Unlock Your Account: Enter the Code to Regain Control!”">
      <form onSubmit={onSubmit} className="flex w-full flex-col gap-7">
        <fieldset className="flex w-full items-center justify-center gap-3">
          <legend className="sr-only">Verification code</legend>
          {digits.map((digit, i) => (
            <Fragment key={i}>
              <input
                ref={(el) => {
                  inputs.current[i] = el
                }}
                value={digit}
                onChange={(e) => setDigit(i, e.target.value)}
                onKeyDown={(e) => onKeyDown(i, e)}
                onPaste={onPaste}
                onFocus={(e) => e.target.select()}
                inputMode="numeric"
                autoComplete={i === 0 ? 'one-time-code' : 'off'}
                maxLength={1}
                aria-label={`Digit ${i + 1}`}
                placeholder="0"
                className="h-16 w-full min-w-0 flex-1 rounded-lg border border-stroke-soft bg-white p-2 text-center text-[36px] font-bold text-primary caret-primary drop-shadow-[0px_1px_1px_rgba(16,24,40,0.05)] outline-none placeholder:text-stroke-soft focus:border-primary"
              />
              {i === SEPARATOR_AFTER && <span className="h-[5px] w-5 shrink-0 rounded-[4px] bg-dark-gray-50" aria-hidden />}
            </Fragment>
          ))}
        </fieldset>
        <div className="flex w-full flex-col gap-3">
          <PrimaryButton disabled={!complete}>Verify Email</PrimaryButton>
          <BackToLogin />
        </div>
      </form>
    </AuthLayout>
  )
}
