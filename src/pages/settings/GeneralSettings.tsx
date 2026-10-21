import {
  SelectInput,
  SettingsSection,
  TextInput,
} from "../../components/settings/SettingsControls";

export function GeneralSettings() {
  return (
    <>
      <SettingsSection
        title="Account Details"
        description="Your users will use this information to contact you."
      >
        <TextInput
          label="Company Name"
          required
          name="companyName"
          defaultValue="orkiva"
        />
        <SelectInput
          label="Industry"
          required
          name="industry"
          defaultValue="orkivation"
          options={[
            "orkivation",
            "Technology",
            "Finance",
            "Healthcare",
            "Retail",
            "Other",
          ]}
        />
        <SelectInput
          label="Currency"
          required
          name="currency"
          defaultValue="US Dollar"
          options={[
            "US Dollar",
            "Euro",
            "British Pound",
            "Bangladeshi Taka",
            "Japanese Yen",
          ]}
        />
      </SettingsSection>
      <SettingsSection
        title="Address"
        description="This address will appear on your invoice."
      >
        <TextInput
          label="Address Name"
          required
          name="addressName"
          defaultValue="Apartment"
        />
        <SelectInput
          label="Country or Region"
          required
          name="country"
          defaultValue="United States"
          options={[
            "United States",
            "Canada",
            "United Kingdom",
            "Germany",
            "Bangladesh",
            "Australia",
          ]}
        />
        <TextInput
          label="City"
          required
          name="city"
          defaultValue="Los Angeles"
        />
        <div className="flex w-full gap-4">
          <TextInput
            label="Address"
            required
            name="address"
            defaultValue="123 Sunset Boulevard, Los Angeles, CA"
            fieldClassName="min-w-0 flex-1"
          />
          <TextInput
            label="Postal Code"
            required
            name="postalCode"
            defaultValue="90028"
            inputMode="numeric"
            fieldClassName="w-[140px] shrink-0"
          />
        </div>
      </SettingsSection>
    </>
  );
}
