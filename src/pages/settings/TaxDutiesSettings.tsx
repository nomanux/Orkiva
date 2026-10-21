import { SelectInput, SettingsSection, TextInput } from '../../components/settings/SettingsControls'
import { BODY, SMALL } from '../../components/settings/styles'
import flagUs from '../../assets/settings/flag-us.svg'
import globe from '../../assets/settings/globe.svg'

const ROWS = [
  { region: 'United States', icon: flagUs, collecting: 'Taxes', percentage: '20%' },
  { region: 'Rest of World', icon: globe, collecting: '-', percentage: '-' },
]

const TH = `h-9 bg-gs-25 px-4 text-left ${SMALL} font-medium text-grey-text`
const TD = `h-11 px-4 ${BODY} font-medium text-ink`

export function TaxDutiesSettings() {
  return (
    <>
      <SettingsSection
        title="Tax & duties"
        description="Review the taxes and duties associated with your purchases and subscriptions."
      >
        <div className="w-full overflow-hidden rounded-[14px] border border-gs-100">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gs-100">
                <th className={`${TH} w-[260px]`}>Country or Region</th>
                <th className={TH}>Collecting</th>
                <th className={TH}>Percentage</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => (
                <tr key={row.region} className="border-b border-gs-100 last:border-b-0">
                  <td className={TD}>
                    <span className="flex items-center gap-3">
                      <img src={row.icon} alt="" width={20} height={20} />
                      {row.region}
                    </span>
                  </td>
                  <td className={TD}>{row.collecting}</td>
                  <td className={TD}>{row.percentage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SettingsSection>

      <SettingsSection
        title="Tax form review"
        description="Manage where you collect taxes and duties. Check with a tax expert if you’re unsure where you have a tax obligation."
      >
        <TextInput label="Full Name" required name="taxFullName" defaultValue="Robert Johnson" />
        <SelectInput
          label="Treaty Country"
          required
          name="treatyCountry"
          defaultValue="United States"
          options={['United States', 'Canada', 'United Kingdom', 'Germany', 'Bangladesh', 'Australia']}
        />
        <TextInput label="Permanent Residence" required name="permanentResidence" defaultValue="123 Elm Street, Springfield, IL 62704" />
        <TextInput label="Mailing Address" required name="mailingAddress" defaultValue="456 Maple Avenue, Rivertown, TX 75001" />
      </SettingsSection>
    </>
  )
}
