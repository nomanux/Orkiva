import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import { AuthLayout } from '../../components/auth/AuthLayout'
import { FooterPrompt, GoogleButton, PrimaryButton, TextField } from '../../components/auth/FormControls'

export function Login() {
  const navigate = useNavigate()
  const [remember, setRemember] = useState(false)

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    navigate('/')
  }

  return (
    <AuthLayout title="Login to your account" subtitle="Unlock Your Progress - Securely Access Your Project Hub!">
      <form onSubmit={onSubmit} className="flex w-full flex-col gap-7">
        <div className="flex w-full flex-col gap-4">
          <TextField label="Email Address" type="email" name="email" placeholder="Email" autoComplete="email" />
          <TextField
            label="Password"
            type="password"
            name="password"
            placeholder="Password"
            autoComplete="current-password"
          />
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
            <Link to="/forgot-password" className="text-primary hover:underline">
              Forgot password
            </Link>
          </div>
        </div>

        <div className="flex w-full flex-col gap-3">
          <PrimaryButton>Sign In</PrimaryButton>
          <GoogleButton onClick={() => navigate('/')} />
          <FooterPrompt text="Don’t have an account?" linkText="Sign up" to="/signup" />
        </div>
      </form>
    </AuthLayout>
  )
}
