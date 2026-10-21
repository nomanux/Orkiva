import {
  SettingsSection,
  TextInput,
} from "../../components/settings/SettingsControls";

const LINKS = [
  { label: "Instagram", url: "https://www.instagram.com/orkiva" },
  { label: "Facebook", url: "https://www.facebook.com/orkiva" },
  { label: "Twitter", url: "https://www.twitter.com/orkiva" },
  { label: "YouTube", url: "https://www.youtube.com/orkiva" },
];

export function LinkAccountSettings() {
  return (
    <SettingsSection
      divider={false}
      title="Link Account"
      description="Your customers will use this information to contact you."
    >
      {LINKS.map((l) => (
        <TextInput
          key={l.label}
          label={l.label}
          type="url"
          name={l.label.toLowerCase()}
          defaultValue={l.url}
        />
      ))}
    </SettingsSection>
  );
}
