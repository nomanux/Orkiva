import { useState, type ReactNode } from 'react'
import { PillButton, SettingsSection } from '../../components/settings/SettingsControls'
import { BODY, SMALL } from '../../components/settings/styles'
import checkmark from '../../assets/settings/checkmark.svg'
import divider from '../../assets/settings/divider.svg'
import { PLANS, type Plan } from './plans'

export function PlanCard({ plan, action }: { plan: Plan; action: ReactNode }) {
  return (
    <article className="w-full overflow-hidden rounded-[14px] border border-gs-100 bg-white">
      <header className="flex items-center gap-4 border-b border-gs-100 p-4">
        <h3 className="flex-1 text-[16px] leading-[1.5] font-semibold text-ink">{plan.name}</h3>
        {action}
      </header>
      <div className="flex flex-col gap-4 p-4">
        <div className="flex flex-col gap-1">
          <p className="flex items-baseline gap-1">
            <span className="text-[24px] leading-[1.3] font-semibold text-ink">${plan.price}</span>
            <span className={`${BODY} font-medium text-grey-text`}>/ month</span>
          </p>
          <p className={`${BODY} font-medium text-grey-text`}>{plan.tagline}</p>
        </div>
        <img src={divider} alt="" width={630} height={1} className="h-px w-full rotate-180" />
        <ul className="grid grid-cols-2 gap-x-2 gap-y-1">
          {plan.features.map((f) => (
            <li key={f} className="flex items-center gap-1.5">
              <img src={checkmark} alt="" width={16} height={16} />
              <span className={`${SMALL} font-medium text-ink`}>{f}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  )
}

export function PlanPricingSettings() {
  const [current, setCurrent] = useState<Plan['id']>('pro')
  const currentIndex = PLANS.findIndex((p) => p.id === current)

  return (
    <SettingsSection
      divider={false}
      title="Plan & Pricing"
      description="Manage your subscription plans. Choose a plan that best suits your needs, compare features, and adjust your subscription as needed."
    >
      {PLANS.map((plan, i) => (
        <PlanCard
          key={plan.id}
          plan={plan}
          action={
            plan.id === current ? (
              <PillButton variant="muted" disabled>
                Current Plan
              </PillButton>
            ) : i < currentIndex ? (
              <PillButton onClick={() => setCurrent(plan.id)}>Downgrade</PillButton>
            ) : (
              <PillButton variant="primary" onClick={() => setCurrent(plan.id)}>
                {plan.trial ? 'Free Trial - 30 Days' : 'Upgrade'}
              </PillButton>
            )
          }
        />
      ))}
    </SettingsSection>
  )
}
