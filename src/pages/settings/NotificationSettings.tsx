import { useState } from 'react'
import { SettingsSection, Toggle } from '../../components/settings/SettingsControls'
import { BODY, SMALL } from '../../components/settings/styles'

const NOTIFICATIONS = [
  { id: 'confirmation', title: 'Transaction Confirmation', body: 'Sent automatically to the customer after they place their order.', on: true },
  { id: 'edited', title: 'Transaction Edited', body: 'Sent to the customer after their order is edited (if you select this option).', on: false },
  { id: 'invoice', title: 'Transaction Invoice', body: 'Sent to the customer when the order has an outstanding balance.', on: true },
  { id: 'cancelled', title: 'Transaction Cancelled', body: 'Sent automatically to the customer if their order is cancelled (if you select this option).', on: true },
  { id: 'refund', title: 'Transaction Refund', body: 'Sent automatically to the customer if their order is refunded (if you select this option).', on: true },
  { id: 'paymentError', title: 'Payment Error', body: 'Sent automatically to the customer if their payment can’t be processed during checkout.', on: false },
]

export function NotificationSettings() {
  const [enabled, setEnabled] = useState(() => Object.fromEntries(NOTIFICATIONS.map((n) => [n.id, n.on])))

  return (
    <SettingsSection
      divider={false}
      title="Push Notifications"
      description="Get alerts for new orders, order processing updates, and when orders are completed or canceled."
    >
      {NOTIFICATIONS.map((n) => (
        <div key={n.id} className="flex w-full items-center gap-6 py-2">
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <p className={`${BODY} font-semibold text-ink`}>{n.title}</p>
            <p className={`${SMALL} font-medium text-grey-text`}>{n.body}</p>
          </div>
          <input type="hidden" name={n.id} value={enabled[n.id] ? 'on' : 'off'} />
          <Toggle label={n.title} checked={enabled[n.id]} onChange={(v) => setEnabled((s) => ({ ...s, [n.id]: v }))} />
        </div>
      ))}
    </SettingsSection>
  )
}
