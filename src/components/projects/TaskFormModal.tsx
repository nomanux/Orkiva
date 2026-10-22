import { useId, useState, type FormEvent } from 'react'
import { Modal, ModalFooter, ModalHeader, PrimaryButton, SecondaryButton } from '../ui/Modal'
import { DateField, FileDrop, MemberSelect, SelectField, TextAreaField, TextField } from '../forms/FormControls'
import type { DateValue } from '../overlays/CalendarModal'
import { PEOPLE } from '../../data/people'
import { PRIORITIES, STATUSES, type Priority, type Status, type Task } from '../../data/projects'

export type TaskDraft = Pick<Task, 'title' | 'status' | 'priority' | 'description' | 'memberIds' | 'attachments'> & { dueDate?: string }

type TaskFormModalProps = {
  open: boolean
  onClose: () => void
  onSave: (draft: TaskDraft) => void
  /** Pre-fills the form when editing; `status` alone pre-selects a column for a new task. */
  initial?: Partial<TaskDraft>
  editing?: boolean
  /** Ids of people who can be assigned; defaults to everyone. */
  people?: string[]
}

export function TaskFormModal({ open, onClose, onSave, initial, editing, people }: TaskFormModalProps) {
  const titleId = useId()
  return (
    <Modal open={open} onClose={onClose} labelledBy={titleId} className="w-[560px] rounded-2xl">
      <TaskForm titleId={titleId} onClose={onClose} onSave={onSave} initial={initial} editing={editing} people={people} />
    </Modal>
  )
}

function TaskForm({ titleId, onClose, onSave, initial, editing, people }: Omit<TaskFormModalProps, 'open'> & { titleId: string }) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [due, setDue] = useState<DateValue | undefined>(initial?.dueDate ? { start: initial.dueDate } : undefined)
  const [status, setStatus] = useState<Status | ''>(initial?.status ?? '')
  const [priority, setPriority] = useState<Priority | ''>(initial?.priority ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [memberIds, setMemberIds] = useState<string[]>(initial?.memberIds ?? [])
  const [files, setFiles] = useState<string[]>(initial?.attachments ?? [])

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!status || !priority) return
    onSave({ title: title.trim(), dueDate: due?.start, status, priority, description, memberIds, attachments: files })
  }

  return (
    <form onSubmit={submit} className="flex max-h-[calc(100vh-32px)] flex-col">
      <ModalHeader id={titleId} title={editing ? 'Edit Task' : 'Create New Task'} onClose={onClose} className="h-14" />
      <div className="flex flex-col gap-3.5 overflow-y-auto p-5">
        <TextField label="Task Name" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter your task name" />
        <DateField label="Due Date" required value={due} onChange={setDue} placeholder="Enter your date" />
        <div className="flex gap-3">
          <SelectField
            label="Status"
            required
            value={status}
            onChange={(e) => setStatus(e.target.value as Status)}
            options={STATUSES}
            placeholder="Select status"
          />
          <SelectField
            label="Priority"
            required
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
            options={PRIORITIES}
            placeholder="Select priority"
          />
        </div>
        <TextAreaField label="Description" required value={description} onChange={setDescription} placeholder="Enter your description" />
        <MemberSelect
          label="Team Members"
          required
          people={people ? PEOPLE.filter((p) => people.includes(p.id)) : PEOPLE}
          value={memberIds}
          onChange={setMemberIds}
          placeholder="Enter your team member"
        />
        <FileDrop label="Attach Files" files={files} onChange={setFiles} />
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
