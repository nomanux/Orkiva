import { SettingsSection, TextInput } from '../../components/settings/SettingsControls'
import { useSession } from '../../data/session'

/** Saving this section updates the signed-in profile shown in the top bar. */
export function AccountSettings() {
  const { profile } = useSession()
  return (
    <SettingsSection divider={false} title="Account Setting" description="View and update your account details, profile, and more.">
      <TextInput label="Full Name" required name="fullName" defaultValue={profile.name} autoComplete="name" />
      <TextInput
        label="Email Address"
        required
        type="email"
        name="email"
        defaultValue={profile.email}
        autoComplete="email"
      />
      <TextInput label="Phone Number (optional)" type="tel" name="phone" defaultValue={profile.phone} autoComplete="tel" />
    </SettingsSection>
  )
}
