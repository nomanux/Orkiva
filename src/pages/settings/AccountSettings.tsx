import { SettingsSection, TextInput } from '../../components/settings/SettingsControls'

export function AccountSettings() {
  return (
    <SettingsSection divider={false} title="Account Setting" description="View and update your account details, profile, and more.">
      <TextInput label="Full Name" required name="fullName" defaultValue="Robert Johnson" autoComplete="name" />
      <TextInput
        label="Email Address"
        required
        type="email"
        name="email"
        defaultValue="robertjohnson@gmail.com"
        autoComplete="email"
      />
      <TextInput label="Phone Number (optional)" type="tel" name="phone" defaultValue="+1 (212) 555 4567" autoComplete="tel" />
    </SettingsSection>
  )
}
