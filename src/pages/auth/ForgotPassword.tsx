import type { FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { AuthLayout } from '../../components/auth/AuthLayout'
import { BackToLogin, PrimaryButton, TextField } from '../../components/auth/FormControls'

export function ForgotPassword() {
  const navigate = useNavigate()

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const email = new FormData(e.currentTarget).get('email')
    navigate('/check-email', { state: { email } })
  }

  return (
    <AuthLayout title="Forgot Password?" subtitle="Lost Your Key? Reset Your Password and Regain Control!">
      <form onSubmit={onSubmit} className="flex w-full flex-col gap-7">
        <TextField label="Email Address" type="email" name="email" placeholder="Email" autoComplete="email" />
        <div className="flex w-full flex-col gap-3">
          <PrimaryButton>Reset Password</PrimaryButton>
          <BackToLogin />
        </div>
      </form>
    </AuthLayout>
  )
}
