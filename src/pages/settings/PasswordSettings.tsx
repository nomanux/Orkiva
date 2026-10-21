import { PasswordInput, SettingsSection } from '../../components/settings/SettingsControls'

export function PasswordSettings() {
  return (
    <SettingsSection divider={false} title="Password" description="Change or view your password">
      <PasswordInput label="Current Password" required name="currentPassword" autoComplete="current-password" placeholder="••••••••••" />
      <PasswordInput
        label="New Password"
        required
        name="newPassword"
        autoComplete="new-password"
        minLength={8}
        placeholder="••••••••••"
        hint="Must be at least 8 characters"
      />
    </SettingsSection>
  )
}
