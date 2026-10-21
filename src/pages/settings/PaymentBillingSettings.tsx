import { useState } from 'react'
import { OutlineButton, PillButton, SettingsSection, TextInput } from '../../components/settings/SettingsControls'
import { BODY, SMALL } from '../../components/settings/styles'
import mastercard from '../../assets/settings/mastercard.svg'
import visa from '../../assets/settings/visa.svg'
import cardDots from '../../assets/settings/card-dots.svg'
import cardOptions from '../../assets/settings/card-options.svg'
import check from '../../assets/settings/check.svg'
import bell from '../../assets/settings/bell.svg'
import downloadCircle from '../../assets/settings/download-circle.svg'

const CARDS = [
  { id: 'mc', last4: '1573', expiry: '05/27', logo: <img src={mastercard} alt="Mastercard" width={31.1992} height={20.145} /> },
  { id: 'visa', last4: '7228', expiry: '10/26', logo: <img src={visa} alt="Visa" width={44.1304} height={13.8696} /> },
]

const INVOICES = [
  { id: '#018298', date: 'Jan 20, 2025', plan: 'Pro Plan', amount: '$79' },
  { id: '#015274', date: 'Feb 20, 2025', plan: 'Basic Plan', amount: '$29' },
]

const TH = `h-9 bg-gs-25 px-4 text-left ${SMALL} font-medium text-grey-text`
const TD = `h-11 px-4 ${BODY} font-medium text-ink`

export function PaymentBillingSettings() {
  const [defaultCard, setDefaultCard] = useState('mc')

  return (
    <>
      <SettingsSection
        title="Payment"
        description="Manage your payment methods securely. Add, update, or remove your credit/debit cards."
      >
        {CARDS.map((card) => {
          const selected = card.id === defaultCard
          return (
            <div
              key={card.id}
              className="flex h-[72px] w-full items-center gap-4 rounded-[10px] border border-gs-100 p-4"
            >
              <button
                type="button"
                role="radio"
                aria-checked={selected}
                aria-label={`Use card ending in ${card.last4} as default`}
                onClick={() => setDefaultCard(card.id)}
                className={`flex size-[18px] shrink-0 cursor-pointer items-center justify-center rounded-[5px] border ${
                  selected ? 'border-primary bg-primary' : 'border-gs-100 bg-white'
                }`}
              >
                {selected && <img src={check} alt="" width={12} height={12} />}
              </button>
              <div className="flex h-9 w-14 shrink-0 items-center justify-center rounded-lg border border-gs-100 bg-white">
                {card.logo}
              </div>
              <div className="flex h-full min-w-0 flex-1 flex-col gap-1">
                <p className="flex items-center gap-1.5" aria-label={`Card ending in ${card.last4}`}>
                  {[0, 1, 2].map((i) => (
                    <img key={i} src={cardDots} alt="" width={28} height={4} />
                  ))}
                  <span className={`${BODY} font-semibold text-ink`}>{card.last4}</span>
                </p>
                <p className={`${BODY} font-medium text-grey-text`}>Expiry {card.expiry}</p>
              </div>
              <button type="button" aria-label={`Options for card ending in ${card.last4}`} className="cursor-pointer">
                <img src={cardOptions} alt="" width={16} height={16} />
              </button>
            </div>
          )
        })}
      </SettingsSection>

      <SettingsSection
        title="Billing"
        description="Review and update your billing information to ensure accurate and timely payments."
      >
        <div className="flex w-full items-center gap-4">
          <div className={`flex min-w-0 flex-1 flex-col gap-1 ${BODY}`}>
            <p className="font-semibold text-ink">Billing Period</p>
            <p className="font-medium text-grey-text">Next billing on March 18, 2025</p>
          </div>
          <div className="flex items-center gap-1.5">
            <OutlineButton className={`h-9 rounded-lg px-3 ${BODY} font-semibold text-ink`}>
              Change Billing Period
            </OutlineButton>
            <OutlineButton aria-label="Billing reminders" className="size-9 rounded-lg">
              <img src={bell} alt="" width={16} height={16} />
            </OutlineButton>
          </div>
        </div>

        <article className="w-full overflow-hidden rounded-[14px] border border-gs-100 bg-white">
          <div className="flex flex-col gap-1.5 p-4">
            <div className="flex items-center">
              <h3 className="flex-1 text-[16px] leading-[1.5] font-semibold text-ink">Basic Plan</h3>
              <PillButton className="drop-shadow-[0px_1px_1px_rgba(13,13,18,0.06)]">Downgrade</PillButton>
            </div>
            <div className="flex flex-col gap-1">
              <p className="flex items-baseline gap-1">
                <span className="text-[24px] leading-[1.3] font-semibold text-ink">$29</span>
                <span className={`${BODY} font-medium text-grey-text`}>/ month</span>
              </p>
              <p className={`${BODY} font-medium text-grey-text`}>All the basics for starting a new business</p>
            </div>
          </div>
          <div className="flex items-center gap-4 border-t border-gs-100 p-4">
            <p className={`flex-1 ${SMALL} font-semibold text-error`}>Change Plan</p>
            <PillButton className="drop-shadow-[0px_1px_1px_rgba(13,13,18,0.06)]">Change Plan</PillButton>
          </div>
        </article>

        <div className="w-full overflow-hidden rounded-[14px] border border-gs-100">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gs-100">
                <th className={`${TH} w-[130px]`}>Invoice #</th>
                <th className={`${TH} w-[140px]`}>Date</th>
                <th className={`${TH} w-[120px]`}>Plan</th>
                <th className={`${TH} w-[90px]`}>Amount</th>
                <th className={TH}>
                  <span className="sr-only">Download</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {INVOICES.map((inv) => (
                <tr key={inv.id} className="border-b border-gs-100 last:border-b-0">
                  <td className={TD}>{inv.id}</td>
                  <td className={TD}>{inv.date}</td>
                  <td className={TD}>{inv.plan}</td>
                  <td className={TD}>{inv.amount}</td>
                  <td className={TD}>
                    <OutlineButton aria-label={`Download invoice ${inv.id}`} className="size-8 rounded-lg">
                      <img src={downloadCircle} alt="" width={16} height={16} />
                    </OutlineButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SettingsSection>

      <SettingsSection title="Email address" description="Invoice will be sent to this email address.">
        <TextInput label="Email Address" required type="email" name="billingEmail" defaultValue="robertjohnson@gmail.com" />
      </SettingsSection>
    </>
  )
}
