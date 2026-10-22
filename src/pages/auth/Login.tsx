import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { AuthLayout } from '../../components/auth/AuthLayout'
import { FooterPrompt, GoogleButton, PrimaryButton, TextField } from '../../components/auth/FormControls'
import { DEMO_EMAIL, DEMO_PASSWORD, getSession, signIn } from '../../data/session'

export function Login() {
  const navigate = useNavigate()
  const { state } = useLocation() as { state: { from?: string } | null }
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState('')
  const [knownEmail] = useState(() => getSession().profile.email)

  const enter = (email: string) => {
    signIn(email)
    navigate(state?.from ?? '/', { replace: true })
  }

  // Demo auth: any email with a password of 6+ characters signs in. Nothing leaves the browser.
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    if (String(data.get('password')).length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    enter(String(data.get('email')).trim())
  }

  return (
    <AuthLayout title="Login to your account" subtitle="Demo account is pre-filled — just press Sign In.">
      <form onSubmit={onSubmit} className="flex w-full flex-col gap-7">
        <div className="flex w-full flex-col gap-4">
          <TextField label="Email Address" type="email" name="email" placeholder="Email" autoComplete="email" defaultValue={knownEmail} />
          <TextField
            label="Password"
            type="password"
            name="password"
            placeholder="Password"
            autoComplete="current-password"
            defaultValue={DEMO_PASSWORD}
            onChange={() => setError('')}
          />
          {error && (
            <p role="alert" className="-mt-2 text-[14px] font-medium text-required">
              {error}
            </p>
          )}
          <div className="flex items-center justify-between text-[16px] leading-[1.5] font-medium tracking-[-0.176px]">
            <label className="flex cursor-pointer items-center gap-2 text-soft-400">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="peer sr-only"
              />
              <span
                aria-hidden
                className="flex size-[26px] items-center justify-center rounded-[6.5px] border-[1.625px] border-stroke-soft bg-white peer-checked:border-primary peer-checked:bg-primary peer-focus-visible:ring-2 peer-focus-visible:ring-primary/50"
              >
                {remember && (
                  <svg viewBox="0 0 16 16" width={14} height={14} fill="none">
                    <path d="M3.5 8.5l3 3 6-7" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
              Remember for 30 days
            </label>
            <Link to="/forgot-password" className="text-primary-dark hover:underline">
              Forgot password
            </Link>
          </div>
        </div>

        <div className="flex w-full flex-col gap-3">
          <PrimaryButton>Sign In</PrimaryButton>
          <GoogleButton onClick={() => enter(DEMO_EMAIL)} />
          <FooterPrompt text="Don’t have an account?" linkText="Sign up" to="/signup" />
        </div>
      </form>
    </AuthLayout>
  )
}
