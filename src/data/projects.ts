import { PEOPLE } from './people'

export const STATUSES = ['Todo', 'In Progress', 'In Review', 'Done'] as const
export type Status = (typeof STATUSES)[number]

export const STATUS_LABEL: Record<Status, string> = {
  Todo: 'Todo list',
  'In Progress': 'In Progress',
  'In Review': 'In Review',
  Done: 'Done',
}

export const PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'] as const
export type Priority = (typeof PRIORITIES)[number]

/** Decorative previews drawn in the design: a dashboard screenshot (framed or full) or a payment-method sketch. */
export type TaskMedia = 'framed-shot' | 'shot' | 'payment-3' | 'payment-2'

export type Task = {
  id: string
  projectId: string
  title: string
  status: Status
  priority: Priority
  description: string
  dueDate?: string // ISO yyyy-mm-dd
  memberIds: string[]
  tags: string[]
  /** Shown instead of tags, e.g. "Website Project". */
  label?: string
  note?: string
  media?: TaskMedia
  /** Puts the note under the media instead of above it. */
  noteAfterMedia?: boolean
  progress: number
  comments: number
  attachments: string[]
}

export type Project = {
  id: string
  name: string
  type: string
  startDate?: string
  endDate?: string
  description: string
  managerId?: string
  memberIds: string[]
}

export const PROJECT_TYPES = ['Web Development', 'Mobile App', 'UI/UX Design', 'Marketing', 'Research']

const ALL = PEOPLE.map((p) => p.id)
const seed = (n: number) => Array.from({ length: n }, (_, i) => `file-${i + 1}.pdf`)

export const SEED_PROJECTS: Project[] = [
  { id: 'daily', name: 'Daily Tasks', type: 'Web Development', description: 'Day-to-day work for the design team.', managerId: 'jane', memberIds: ALL },
]

export const SEED_TASKS: Task[] = [
  {
    id: 't1', projectId: 'daily', status: 'Todo', priority: 'Medium', title: 'Search inspirations for upcoming project',
    description: 'They like our behance project Mise', note: 'Note: They like our behance project Mise',
    tags: ['#website', '#client'], memberIds: ALL, progress: 40, comments: 12, attachments: seed(8),
  },
  {
    id: 't2', projectId: 'daily', status: 'Todo', priority: 'Urgent', title: 'Component button web',
    description: 'Payment method via e-commerce', tags: ['#Urgent', '#System'], media: 'payment-3', dueDate: '2025-11-16',
    memberIds: ALL, progress: 40, comments: 12, attachments: seed(8),
  },
  {
    id: 't3', projectId: 'daily', status: 'In Progress', priority: 'High', title: 'Dashboard Design',
    description: 'Monitoring Dashboard', note: 'Monitoring Dashboard', tags: ['#dribble shot', '#product'], media: 'framed-shot',
    memberIds: ALL, progress: 40, comments: 12, attachments: seed(8),
  },
  {
    id: 't4', projectId: 'daily', status: 'In Progress', priority: 'Medium', title: 'Aqua Footer Design',
    description: 'Landing page design', note: 'Landing page design', label: 'Website Project', tags: [],
    memberIds: ALL, progress: 40, comments: 12, attachments: seed(8),
  },
  {
    id: 't5', projectId: 'daily', status: 'In Review', priority: 'Medium', title: 'Component button web',
    description: 'Note for UX Writer: please check link here for example', note: 'Note for UX Writer: please check link here for example',
    tags: ['#Research', '#UX'], media: 'payment-2', dueDate: '2025-11-16', memberIds: ALL, progress: 40, comments: 12, attachments: seed(8),
  },
  {
    id: 't6', projectId: 'daily', status: 'In Review', priority: 'Low', title: 'Redesign grab website landing and login pages',
    description: 'We have a meeting 3:12 AM', note: 'Note: We have a meeting 3:12 AM', tags: ['#website', '#client'],
    memberIds: ALL, progress: 40, comments: 12, attachments: seed(8),
  },
  {
    id: 't7', projectId: 'daily', status: 'Done', priority: 'High', title: 'Development Website',
    description: 'The process of implementing the design into a website.', note: 'The process of implementing the design into a website.',
    noteAfterMedia: true, tags: ['#Development'], media: 'shot', memberIds: ALL, progress: 40, comments: 12, attachments: seed(8),
  },
  {
    id: 't8', projectId: 'daily', status: 'Done', priority: 'Urgent', title: 'Wireframe home', description: 'Wireframes for the home page.',
    tags: ['#Urgent', '#System'], dueDate: '2025-11-16', memberIds: ALL, progress: 40, comments: 12, attachments: seed(8),
  },
]

export const PROJECT_STATS = [
  { label: 'Total Project', value: 157, percent: 84, filled: 16 },
  { label: 'Total Task', value: 124, percent: 14, filled: 4 },
  { label: 'Total Due Today', value: 47, percent: 84, filled: 10 },
  { label: 'Task Completed', value: 145, percent: 14, filled: 4 },
]
