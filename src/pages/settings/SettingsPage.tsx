import { useEffect, useState, type FormEvent } from 'react'
import { NavLink, Navigate, useParams } from 'react-router'
import { AccountSettings } from './AccountSettings'
import { GeneralSettings } from './GeneralSettings'
import { LinkAccountSettings } from './LinkAccountSettings'
import { NotificationSettings } from './NotificationSettings'
import { PasswordSettings } from './PasswordSettings'
import { PaymentBillingSettings } from './PaymentBillingSettings'
import { PlanPricingSettings } from './PlanPricingSettings'
import { TaxDutiesSettings } from './TaxDutiesSettings'
import { TimeLanguageSettings } from './TimeLanguageSettings'
import { BODY } from '../../components/settings/styles'

const SECTIONS = [
  { slug: 'general', label: 'General', Component: GeneralSettings },
  { slug: 'plan', label: 'Plan & Pricing', Component: PlanPricingSettings },
  { slug: 'account', label: 'My Account', Component: AccountSettings },
  { slug: 'billing', label: 'Payment & Billing', Component: PaymentBillingSettings },
  { slug: 'tax', label: 'Tax & Duties', Component: TaxDutiesSettings },
  { slug: 'links', label: 'Link Account', Component: LinkAccountSettings },
  { slug: 'time-language', label: 'Time & Language', Component: TimeLanguageSettings },
  { slug: 'password', label: 'Password', Component: PasswordSettings },
  { slug: 'notifications', label: 'Notifications', Component: NotificationSettings },
]

const FORM_ID = 'settings-form'

export function SettingsPage() {
  const { section } = useParams()
  const active = SECTIONS.find((s) => s.slug === section)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!saved) return
    const id = setTimeout(() => setSaved(false), 2500)
    return () => clearTimeout(id)
  }, [saved])

  if (!active) return <Navigate to="/settings/general" replace />

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    setSaved(true)
  }

  return (
    <>
      <div className="mt-8 flex items-end justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-[24px] leading-[1.3] font-semibold text-ink">Settings</h1>
          <p className="text-[14px] leading-[1.5] tracking-[0.28px] text-grey-text">
            Configure and oversee all project phases seamlessly.
          </p>
        </div>
        <button
          type="submit"
          form={FORM_ID}
          className="h-10 cursor-pointer rounded-full bg-primary bg-[linear-gradient(0deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.15)_100%)] px-4 text-[14px] leading-[1.5] font-semibold tracking-[0.28px] text-black hover:brightness-95"
        >
          Save Changes
        </button>
      </div>

      <div className="mt-6 flex w-full items-stretch overflow-hidden rounded-[14px] border border-gs-100 bg-white">
        <nav aria-label="Settings" className="w-[220px] shrink-0 border-r border-gs-100 p-4">
          <ul className="flex flex-col gap-3">
            {SECTIONS.map((s) => (
              <li key={s.slug}>
                <NavLink
                  to={`/settings/${s.slug}`}
                  className={({ isActive }) =>
                    `flex w-full items-center rounded-lg border px-3 py-[7px] whitespace-nowrap ${BODY} ${
                      isActive
                        ? 'border-gs-100 bg-gs-25 font-semibold text-ink'
                        : 'border-transparent font-medium text-grey-text hover:bg-gs-25'
                    }`
                  }
                >
                  {s.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <form id={FORM_ID} key={active.slug} onSubmit={onSubmit} className="flex min-w-0 flex-1 flex-col" aria-label={active.label}>
          <active.Component />
        </form>
      </div>

      <div
        role="status"
        className={`fixed bottom-6 left-1/2 z-40 -translate-x-1/2 rounded-full bg-ink px-5 py-3 text-[14px] font-semibold text-white shadow-lg transition-opacity ${
          saved ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        {saved ? 'Changes saved' : ''}
      </div>
    </>
  )
}
