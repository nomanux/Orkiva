import { useLocation, useNavigate } from 'react-router'
import { AuthLayout } from '../../components/auth/AuthLayout'
import { BackToLogin, PrimaryButton } from '../../components/auth/FormControls'
import { DEMO_EMAIL } from '../../data/session'

export function CheckEmail() {
  const navigate = useNavigate()
  const { state } = useLocation() as { state: { email?: string } | null }
  const email = state?.email || DEMO_EMAIL

  return (
    <AuthLayout title="Check your email" subtitle={`We sent a verification link to ${email}`}>
      <div className="flex w-full flex-col gap-3">
        <PrimaryButton type="button" onClick={() => navigate('/verify', { state: { ...state, email } })}>
          Enter the code Manually
        </PrimaryButton>
        <BackToLogin />
      </div>
    </AuthLayout>
  )
}
