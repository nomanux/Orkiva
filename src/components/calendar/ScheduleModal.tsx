import { useId, useState, type FormEvent } from 'react'
import { Modal, ModalFooter, ModalHeader, PrimaryButton, SecondaryButton } from '../ui/Modal'
import { DateField, SelectField, TextAreaField, TextField } from '../forms/FormControls'
import type { DateValue } from '../overlays/CalendarModal'
import { MEETING_STATUSES, formatTime, meetingsStore, type MeetingStatus, ATTENDEE_PHOTOS } from '../../data/meetingsStore'

// Every half hour from 07:00 to 19:30, labelled "14:00 (2:00 PM)" as in the design.
const TIMES = Array.from({ length: 26 }, (_, i) => {
  const mins = 7 * 60 + i * 30
  const hhmm = `${String(Math.floor(mins / 60)).padStart(2, '0')}:${String(mins % 60).padStart(2, '0')}`
  return { value: hhmm, label: `${hhmm} (${formatTime(hhmm)})` }
})
const DURATIONS = ['30 min', '1 hour', '1.5 hours', '2 hours']
const DURATION_MIN: Record<string, number> = { '30 min': 30, '1 hour': 60, '1.5 hours': 90, '2 hours': 120 }

type ScheduleModalProps = { open: boolean; onClose: () => void; onSaved?: (title: string) => void; defaultDate?: string }

export function ScheduleModal({ open, onClose, onSaved, defaultDate }: ScheduleModalProps) {
  const titleId = useId()
  return (
    <Modal open={open} onClose={onClose} labelledBy={titleId} className="w-[520px] rounded-2xl">
      <ScheduleForm titleId={titleId} onClose={onClose} onSaved={onSaved} defaultDate={defaultDate} />
    </Modal>
  )
}

function ScheduleForm({ titleId, onClose, onSaved, defaultDate }: Omit<ScheduleModalProps, 'open'> & { titleId: string }) {
  const [title, setTitle] = useState('')
  const [date, setDate] = useState<DateValue | undefined>(defaultDate ? { start: defaultDate } : undefined)
  const [timeLabel, setTimeLabel] = useState('')
  const [duration, setDuration] = useState('1 hour')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState<MeetingStatus | ''>('Scheduled')

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const start = TIMES.find((t) => t.label === timeLabel)?.value
    if (!date || !start || !status) return
    const endMins = Number(start.slice(0, 2)) * 60 + Number(start.slice(3)) + DURATION_MIN[duration]
    const end = `${String(Math.floor(endMins / 60)).padStart(2, '0')}:${String(endMins % 60).padStart(2, '0')}`
    meetingsStore.add({
      title: title.trim(),
      date: date.start,
      start,
      end,
      description,
      status,
      app: 'meet',
      attendees: ATTENDEE_PHOTOS.slice(0, 3),
    })
    onSaved?.(title.trim())
  }

  return (
    <form onSubmit={submit} className="flex max-h-[calc(100vh-32px)] flex-col">
      <ModalHeader id={titleId} title="Create New Schedule" onClose={onClose} className="h-14" />
      <div className="flex flex-col gap-3.5 overflow-y-auto p-5">
        <TextField label="Title" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Design Review Meeting" />
        <DateField label="Date" required value={date} onChange={setDate} placeholder="Select a date" />
        <div className="flex gap-3">
          <SelectField
            label="Time"
            required
            value={timeLabel}
            onChange={(e) => setTimeLabel(e.target.value)}
            options={TIMES.map((t) => t.label)}
            placeholder="Select a time"
          />
          <SelectField label="Duration" required value={duration} onChange={(e) => setDuration(e.target.value)} options={DURATIONS} placeholder="Duration" />
        </div>
        <TextAreaField label="Description" required value={description} onChange={setDescription} placeholder="What is this meeting about?" />
        <SelectField
          label="Status"
          required
          value={status}
          onChange={(e) => setStatus(e.target.value as MeetingStatus)}
          options={MEETING_STATUSES}
          placeholder="Select status"
        />
      </div>
      <ModalFooter>
        <SecondaryButton onClick={onClose} className="w-28">
          Cancel
        </SecondaryButton>
        <PrimaryButton className="w-28">Save</PrimaryButton>
      </ModalFooter>
    </form>
  )
}
