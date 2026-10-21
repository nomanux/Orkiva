import { useId, useState } from 'react'
import { Modal, ModalFooter, ModalHeader, PrimaryButton, SecondaryButton } from '../ui/Modal'
import fileCsv from '../../assets/overlays/file-csv.svg'
import filePdf from '../../assets/overlays/file-pdf.svg'
import fileZip from '../../assets/overlays/file-zip.svg'
import radioChecked from '../../assets/overlays/radio-checked.svg'

const FORMATS = [
  { id: 'CSV', label: 'CSV File', icon: fileCsv },
  { id: 'PDF', label: 'PDF File', icon: filePdf },
  { id: 'ZIP', label: 'ZIP File', icon: fileZip },
] as const
const SESSIONS = ['All Sessions', 'Displayed Session', 'Custom'] as const

export type ExportFormat = (typeof FORMATS)[number]['id']
export type ExportSession = (typeof SESSIONS)[number]

type ExportDataModalProps = {
  open: boolean
  onClose: () => void
  onExport: (format: ExportFormat, session: ExportSession) => void
}

const OPTION = 'flex flex-1 cursor-pointer items-center gap-4 rounded-xl border p-4 text-[14px] leading-[1.5] font-semibold text-black'
const optionState = (on: boolean) => (on ? 'border-primary bg-primary/10' : 'border-gs-100 bg-white hover:bg-gs-25')

export function ExportDataModal({ open, onClose, onExport }: ExportDataModalProps) {
  const titleId = useId()
  const [format, setFormat] = useState<ExportFormat>('PDF')
  const [session, setSession] = useState<ExportSession>('All Sessions')

  return (
    <Modal open={open} onClose={onClose} labelledBy={titleId} className="w-[680px] rounded-2xl">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          onExport(format, session)
        }}
      >
        <ModalHeader id={titleId} title="Export Data" onClose={onClose} className="h-14" />
        <div className="flex flex-col gap-4 p-6">
          <fieldset className="flex flex-col gap-4">
            <legend className="mb-4 text-[14px] leading-[1.5] font-medium text-black">Formats</legend>
            <div className="flex gap-4">
              {FORMATS.map((f) => (
                <label key={f.id} className={`${OPTION} ${optionState(format === f.id)}`}>
                  <input type="radio" name="format" value={f.id} checked={format === f.id} onChange={() => setFormat(f.id)} className="sr-only" />
                  <img src={f.icon} alt="" width={24} height={24} />
                  {f.label}
                </label>
              ))}
            </div>
          </fieldset>
          <fieldset className="flex flex-col gap-4">
            <legend className="mb-4 text-[14px] leading-[1.5] font-medium tracking-[0.28px] text-black">Sessions</legend>
            <div className="flex gap-4">
              {SESSIONS.map((s) => (
                <label key={s} className={`${OPTION} ${optionState(session === s)}`}>
                  <input type="radio" name="session" value={s} checked={session === s} onChange={() => setSession(s)} className="peer sr-only" />
                  {session === s ? (
                    <img src={radioChecked} alt="" width={20} height={20} />
                  ) : (
                    <span className="size-5 rounded-[10px] border border-gs-100 bg-white" />
                  )}
                  {s}
                </label>
              ))}
            </div>
          </fieldset>
        </div>
        <ModalFooter>
          <SecondaryButton onClick={onClose} className="w-28">
            Cancel
          </SecondaryButton>
          <PrimaryButton className="w-36 tracking-[-0.32px]">Export as {format}</PrimaryButton>
        </ModalFooter>
      </form>
    </Modal>
  )
}
