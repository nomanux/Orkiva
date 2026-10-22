import { useId, useState, type FormEvent } from 'react'
import { Modal, ModalFooter, ModalHeader, PrimaryButton, SecondaryButton } from '../ui/Modal'
import { DateField, MemberSelect, SelectField, TextAreaField, TextField } from '../forms/FormControls'
import type { DateValue } from '../overlays/CalendarModal'
import { PEOPLE } from '../../data/people'
import { PROJECT_TYPES, type Project } from '../../data/projects'

export type ProjectDraft = Omit<Project, 'id'>

type ProjectFormModalProps = {
  open: boolean
  onClose: () => void
  onSave: (draft: ProjectDraft) => void
}

export function ProjectFormModal({ open, onClose, onSave }: ProjectFormModalProps) {
  const titleId = useId()
  return (
    <Modal open={open} onClose={onClose} labelledBy={titleId} className="w-[560px] rounded-2xl">
      <ProjectForm titleId={titleId} onClose={onClose} onSave={onSave} />
    </Modal>
  )
}

function ProjectForm({ titleId, onClose, onSave }: Omit<ProjectFormModalProps, 'open'> & { titleId: string }) {
  const [name, setName] = useState('')
  const [client, setClient] = useState('')
  const [type, setType] = useState('')
  const [dates, setDates] = useState<DateValue>()
  const [description, setDescription] = useState('')
  const [managerName, setManagerName] = useState('')
  const [memberIds, setMemberIds] = useState<string[]>([])

  const submit = (e: FormEvent) => {
    e.preventDefault()
    onSave({
      name: name.trim(),
      client: client.trim() || undefined,
      type,
      startDate: dates?.start,
      endDate: dates?.end,
      description,
      managerId: PEOPLE.find((p) => p.name === managerName)?.id,
      memberIds,
    })
  }

  return (
    <form onSubmit={submit} className="flex max-h-[calc(100vh-32px)] flex-col">
      <ModalHeader id={titleId} title="Create New Project" onClose={onClose} className="h-14" />
      <div className="flex flex-col gap-3.5 overflow-y-auto p-5">
        <TextField label="Project Name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. SiteCraft" />
        <TextField label="Client" value={client} onChange={(e) => setClient(e.target.value)} placeholder="e.g. Primor Health (optional)" />
        <SelectField
          label="Project Type"
          required
          value={type}
          onChange={(e) => setType(e.target.value)}
          options={PROJECT_TYPES}
          placeholder="Select project type"
        />
        <DateField label="Date" required mode="range" value={dates} onChange={setDates} placeholder="Select start and end date" />
        <TextAreaField label="Description" required value={description} onChange={setDescription} placeholder="Describe the project" />
        <SelectField
          label="Project Manager"
          required
          value={managerName}
          onChange={(e) => setManagerName(e.target.value)}
          options={PEOPLE.map((p) => p.name)}
          placeholder="Select a project manager"
        />
        <MemberSelect
          label="Team Members"
          required
          people={PEOPLE}
          value={memberIds}
          onChange={setMemberIds}
          placeholder="Select team members"
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
