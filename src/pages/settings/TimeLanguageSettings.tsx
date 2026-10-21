import { useEffect, useState } from 'react'
import { SelectInput, SettingsSection } from '../../components/settings/SettingsControls'

const TIME_ZONES: Record<string, string> = {
  'Pacific Standard Time (PST)': 'America/Los_Angeles',
  'Mountain Standard Time (MST)': 'America/Denver',
  'Central Standard Time (CST)': 'America/Chicago',
  'Eastern Standard Time (EST)': 'America/New_York',
  'Greenwich Mean Time (GMT)': 'Europe/London',
  'Central European Time (CET)': 'Europe/Paris',
  'Bangladesh Standard Time (BST)': 'Asia/Dhaka',
  'Japan Standard Time (JST)': 'Asia/Tokyo',
}

const LANGUAGES = ['English (United States)', 'English (United Kingdom)', 'বাংলা (Bangla)', 'Español', 'Français', 'Deutsch']

function useCurrentTime(timeZone: string) {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000)
    return () => clearInterval(id)
  }, [])
  return new Intl.DateTimeFormat('en-US', { timeZone, hour: 'numeric', minute: '2-digit' }).format(now)
}

export function TimeLanguageSettings() {
  const [zone, setZone] = useState('Pacific Standard Time (PST)')
  const time = useCurrentTime(TIME_ZONES[zone])

  return (
    <>
      <SettingsSection
        title="Time"
        description="Set your preferred time zone to ensure that all activities align with your local time."
      >
        <SelectInput
          label="Time Zone"
          name="timeZone"
          value={zone}
          onChange={(e) => setZone(e.target.value)}
          options={Object.keys(TIME_ZONES)}
          hint={<span aria-live="polite">The current time is {time}.</span>}
        />
      </SettingsSection>
      <SettingsSection
        title="Set your language"
        description="Choose the language. All text and communication will be displayed in the language you select."
      >
        <SelectInput label="Language" name="language" defaultValue={LANGUAGES[0]} options={LANGUAGES} />
      </SettingsSection>
    </>
  )
}
