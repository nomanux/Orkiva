import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { AuthLayout } from '../../components/auth/AuthLayout'
import { FooterPrompt, GoogleButton, PhoneField, PrimaryButton, TextField } from '../../components/auth/FormControls'

export function SignUp() {
  const navigate = useNavigate()
  const [error, setError] = useState('')

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    if (data.get('password') !== data.get('confirmPassword')) {
      setError('Passwords do not match.')
      return
    }
    setError('')
    navigate('/check-email', { state: { email: data.get('email') } })
  }

  return (
    <AuthLayout title="Create an account" subtitle="Empower Your Projects, Simplify Your Success!">
      <form onSubmit={onSubmit} className="flex w-full flex-col gap-7">
        <div className="flex w-full flex-col gap-4">
          <div className="flex w-full gap-4">
            <TextField label="First Name" name="firstName" placeholder="First name" autoComplete="given-name" />
            <TextField label="Last Name" name="lastName" placeholder="Last name" autoComplete="family-name" />
          </div>
          <div className="flex w-full gap-4">
            <TextField label="Email Address" type="email" name="email" placeholder="Email" autoComplete="email" />
            <PhoneField label="Phone Number" name="phone" placeholder="(555) 000-0000" autoComplete="tel-national" />
          </div>
          <div className="flex w-full gap-4">
            <TextField
              label="Password"
              type="password"
              name="password"
              placeholder="Password"
              autoComplete="new-password"
              minLength={8}
            />
            <TextField
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              placeholder="Confirm password"
              autoComplete="new-password"
            />
          </div>
          {error && (
            <p role="alert" className="-mt-1 text-[14px] font-medium text-required">
              {error}
            </p>
          )}
        </div>

        <div className="flex w-full flex-col gap-3">
          <PrimaryButton>Create Account</PrimaryButton>
          <GoogleButton onClick={() => navigate('/')} />
          <FooterPrompt text="Already have an account?" linkText="Login" to="/login" />
        </div>
      </form>
    </AuthLayout>
  )
}
