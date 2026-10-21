import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { AuthLayout } from '../../components/auth/AuthLayout'
import { BackToLogin, PrimaryButton, TextField } from '../../components/auth/FormControls'

export function ResetPassword() {
  const navigate = useNavigate()
  const [error, setError] = useState('')

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    if (data.get('password') !== data.get('confirmPassword')) {
      setError('Passwords do not match.')
      return
    }
    navigate('/login')
  }

  return (
    <AuthLayout title="Forgot Password?" subtitle="Lost Your Key? Reset Your Password and Regain Control!">
      <form onSubmit={onSubmit} className="flex w-full flex-col gap-7">
        <div className="flex w-full flex-col gap-4">
          <TextField
            label="New Password"
            type="password"
            name="password"
            placeholder="New Password"
            autoComplete="new-password"
            minLength={8}
          />
          <TextField
            label="Confirm New Password"
            type="password"
            name="confirmPassword"
            placeholder="Repeat your new password"
            autoComplete="new-password"
          />
          {error && (
            <p role="alert" className="-mt-3 text-[14px] font-medium text-required">
              {error}
            </p>
          )}
        </div>
        <div className="flex w-full flex-col gap-3">
          <PrimaryButton>Reset Password</PrimaryButton>
          <BackToLogin />
        </div>
      </form>
    </AuthLayout>
  )
}
