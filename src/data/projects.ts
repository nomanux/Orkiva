import { createStore, uid } from '../lib/store'
import { daysFromToday, toISO } from '../lib/dates'
import { notify } from './notifications'
import { ME, personById } from './people'

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
  createdAt: string
  completedAt?: string
}

export const PROJECT_STATUSES = ['Active', 'On Hold', 'Completed'] as const
export type ProjectStatus = (typeof PROJECT_STATUSES)[number]

export type Project = {
  id: string
  name: string
  type: string
  client?: string
  status?: ProjectStatus
  startDate?: string
  endDate?: string
  description: string
  managerId?: string
  memberIds: string[]
}

export const PROJECT_TYPES = ['Web Development', 'Mobile App', 'UI/UX Design', 'Marketing', 'Research']

const d = daysFromToday

const seedProjects = (): Project[] => [
  {
    id: 'p-primor', name: 'Primor Mobile App', type: 'Mobile App', client: 'Primor Health', status: 'Active',
    startDate: d(-75), endDate: d(30), managerId: 'marcus', memberIds: ['marcus', 'ethan', 'ryan', 'michael', 'amara', 'leila', 'sarah'],
    description: 'iOS and Android app for Primor Health patients to book visits, chat with doctors and track prescriptions.',
  },
  {
    id: 'p-sulivan', name: 'Sulivan E-commerce Website', type: 'Web Development', client: 'Sulivan & Co.', status: 'Active',
    startDate: d(-34), endDate: d(21), managerId: 'daniel', memberIds: ['daniel', 'ryan', 'michael', 'leila', 'nina'],
    description: 'Headless storefront on Shopify with a faster checkout, product filters and order emails.',
  },
  {
    id: 'p-analytics', name: 'Orkiva Analytics Dashboard', type: 'Web Development', client: 'Internal', status: 'Active',
    startDate: d(-64), endDate: d(12), managerId: 'daniel', memberIds: ['daniel', 'michael', 'ryan', 'arjun', 'ethan', 'james'],
    description: 'Real-time project health metrics for workspace owners, with exports and role-based access.',
  },
  {
    id: 'p-trustworth', name: 'Trustworth Brand Refresh', type: 'UI/UX Design', client: 'Trustworth Bank', status: 'Active',
    startDate: d(-22), endDate: d(14), managerId: 'ethan', memberIds: ['ethan', 'leila', 'nina', 'olivia', 'sarah'],
    description: 'New logo, colour and type system and brand voice for Trustworth’s 2026 relaunch.',
  },
  {
    id: 'p-campaign', name: 'Q4 Marketing Campaign', type: 'Marketing', client: 'Internal', status: 'Active',
    startDate: d(-14), endDate: d(40), managerId: 'olivia', memberIds: ['olivia', 'nina', 'arjun', 'ryan', 'james'],
    description: 'Launch campaign for Orkiva AI: landing page, paid social, email nurture and a webinar.',
  },
  {
    id: 'p-yellybox', name: 'YellyBox Onboarding Revamp', type: 'UI/UX Design', client: 'YellyBox', status: 'Active',
    startDate: d(-16), endDate: d(45), managerId: 'sarah', memberIds: ['sarah', 'leila', 'ryan', 'arjun'],
    description: 'Cut time-to-first-order for new YellyBox customers with a guided, personalised onboarding.',
  },
  {
    id: 'p-atlas', name: 'Atlas CRM Integration', type: 'Web Development', client: 'Atlas', status: 'On Hold',
    startDate: d(-48), endDate: d(60), managerId: 'michael', memberIds: ['michael', 'arjun', 'james'],
    description: 'Two-way sync of contacts and deals between Orkiva and Atlas CRM. Paused until Atlas ships their v3 API.',
  },
  {
    id: 'p-minicam', name: 'Minicam Market Research', type: 'Research', client: 'Minicam', status: 'Completed',
    startDate: d(-110), endDate: d(-42), managerId: 'arjun', memberIds: ['arjun', 'sarah', 'olivia'],
    description: 'Sizing the prosumer action-camera market in Europe and testing three pricing models.',
  },
  {
    id: 'p-alexa', name: 'Alexa AI Landing Page', type: 'Web Development', client: 'Alexa AI', status: 'Completed',
    startDate: d(-160), endDate: d(-98), managerId: 'marcus', memberIds: ['marcus', 'leila', 'ryan', 'nina'],
    description: 'Marketing site and waitlist for Alexa AI’s voice assistant launch.',
  },
]

type Row = [title: string, status: Status, priority: Priority, due: number, members: string[], tags: string[], extra?: Partial<Task>]

const BASE_PROGRESS: Record<Status, number> = { Todo: 0, 'In Progress': 35, 'In Review': 85, Done: 100 }

function rows(projectId: string, files: string[], list: Row[]): Task[] {
  return list.map(([title, status, priority, due, memberIds, tags, extra], i) => {
    // Small deterministic variation so cards don't all look the same.
    const jitter = (title.length * 7 + i * 13) % 30
    return {
      id: `${projectId}-t${i + 1}`,
      projectId,
      title,
      status,
      priority,
      description: extra?.note ?? '',
      dueDate: d(due),
      memberIds,
      tags,
      progress: status === 'Done' ? 100 : status === 'Todo' ? (jitter % 3) * 5 : Math.min(95, BASE_PROGRESS[status] + jitter),
      comments: (title.length + i * 3) % 15,
      attachments: files.slice(0, (title.length + i) % (files.length + 1)),
      // Never in the future: tasks due later were still created recently.
      createdAt: d(Math.min(-1 - (i % 6), due - 10 - (i % 4) * 3)),
      completedAt: status === 'Done' ? d(Math.min(0, i % 5 === 0 ? due + 2 : due - (i % 3))) : undefined,
      ...extra,
    }
  })
}

const seedTasks = (): Task[] => [
  ...rows('p-primor', ['primor-user-flows.fig', 'api-spec-v2.pdf', 'sprint-12-notes.docx', 'brand-assets.zip'], [
    ['Patient onboarding flow', 'In Progress', 'High', 3, ['ethan', 'leila'], ['#design', '#mobile'], { media: 'framed-shot', note: 'Welcome, insurance scan and consent screens.' }],
    ['Appointment booking API', 'In Progress', 'Urgent', 1, ['michael', 'ryan'], ['#backend', '#api']],
    ['Login bug: OTP code expires too early', 'In Review', 'Urgent', 0, ['amara', 'ryan'], ['#bug', '#QA'], { note: 'Repro on Android 14 when the app is backgrounded.' }],
    ['Doctor chat push notifications', 'Todo', 'Medium', 8, ['ryan'], ['#mobile']],
    ['Prescription tracker screens', 'Todo', 'High', 5, ['leila', 'ethan'], ['#design']],
    ['Usability test round 1', 'Done', 'Medium', -6, ['sarah', 'ethan'], ['#research'], { note: '5 of 6 patients booked a visit without help.' }],
    ['Wireframe home & navigation', 'Done', 'High', -16, ['ethan'], ['#UX']],
    ['CI pipeline for iOS & Android', 'Done', 'Medium', -24, ['ryan', 'michael'], ['#devops']],
    ['Information architecture', 'Done', 'Medium', -52, ['ethan', 'sarah'], ['#UX']],
    ['Discovery workshop with Primor', 'Done', 'High', -68, ['marcus', 'sarah'], ['#client']],
  ]),
  ...rows('p-sulivan', ['checkout-specs.pdf', 'sulivan-catalog.csv', 'homepage-v3.fig'], [
    ['Checkout payment step', 'In Progress', 'Urgent', 2, ['ryan', 'leila'], ['#checkout', '#client'], { media: 'payment-3', note: 'Card, Apple Pay and PayPal options.' }],
    ['Product listing filters', 'In Progress', 'Medium', 6, ['ryan'], ['#frontend']],
    ['Payment button component', 'In Review', 'High', 1, ['leila', 'ryan'], ['#System'], { media: 'payment-2', note: 'Note for UX writer: please check the button labels.' }],
    ['Inventory sync with Shopify', 'Todo', 'High', 9, ['michael'], ['#backend', '#integration']],
    ['Order confirmation emails', 'Todo', 'Medium', 11, ['michael', 'nina'], ['#email']],
    ['SEO meta tags & sitemap', 'Todo', 'Low', 15, ['nina'], ['#SEO']],
    ['Homepage hero redesign', 'Done', 'High', -8, ['leila'], ['#website'], { media: 'shot', noteAfterMedia: true, note: 'Approved by Sulivan on the last review call.' }],
    ['Cart drawer interactions', 'Done', 'Medium', -3, ['ryan'], ['#frontend']],
    ['Kickoff & requirements', 'Done', 'High', -30, ['daniel', 'nina'], ['#client']],
  ]),
  ...rows('p-analytics', ['kpi-definitions.pdf', 'warehouse-schema.png', 'dashboard-v2.fig'], [
    ['Dashboard design', 'In Review', 'High', 1, ['ethan'], ['#dribbble shot', '#product'], { media: 'framed-shot', note: 'Monitoring dashboard for project health.' }],
    ['Real-time task metrics endpoint', 'In Progress', 'High', 4, ['michael', 'daniel'], ['#backend']],
    ['Chart components (bar, donut, sparkline)', 'In Progress', 'Medium', 6, ['ryan'], ['#frontend']],
    ['Role-based access for reports', 'Todo', 'Urgent', 2, ['daniel'], ['#security']],
    ['CSV & PDF export', 'Todo', 'Medium', 10, ['arjun', 'ryan'], ['#frontend']],
    ['Data model & warehouse schema', 'Done', 'High', -25, ['arjun', 'michael'], ['#data']],
    ['KPI definitions workshop', 'Done', 'Medium', -37, [ME, 'arjun'], ['#product']],
    ['Tech stack decision', 'Done', 'Medium', -48, ['daniel'], ['#engineering']],
    ['Competitor dashboard audit', 'Done', 'Low', -60, ['ethan', 'arjun'], ['#research']],
  ]),
  ...rows('p-trustworth', ['logo-round-2.pdf', 'brand-voice.docx', 'type-specimen.fig'], [
    ['Logo exploration, round 2', 'In Review', 'High', 2, ['ethan', 'leila'], ['#brand']],
    ['Colour & type system', 'In Progress', 'High', 4, ['leila'], ['#brand', '#system']],
    ['Brand voice guidelines', 'In Progress', 'Medium', 7, ['nina', 'olivia'], ['#copy']],
    ['Stationery & social templates', 'Todo', 'Low', 12, ['leila'], ['#brand']],
    ['Stakeholder interviews', 'Done', 'Medium', -10, ['sarah', 'ethan'], ['#research']],
    ['Moodboard & competitor audit', 'Done', 'Low', -15, ['ethan'], ['#research']],
  ]),
  ...rows('p-campaign', ['campaign-brief.pdf', 'ad-sizes.xlsx', 'webinar-outline.docx'], [
    ['Paid social ad creatives', 'Todo', 'High', 3, ['olivia', 'nina'], ['#ads']],
    ['Campaign landing page', 'In Progress', 'High', 5, ['ryan', 'olivia'], ['#website']],
    ['Email nurture sequence (5 emails)', 'In Progress', 'Medium', 9, ['nina'], ['#email']],
    ['Influencer shortlist', 'In Review', 'Medium', 0, ['olivia'], ['#social']],
    ['Webinar: Planning Q1 with AI', 'Todo', 'Low', 25, [ME, 'olivia'], ['#event']],
    ['Budget & channel plan', 'Done', 'Urgent', -4, ['olivia', 'arjun'], ['#planning']],
    ['Audience segments from CRM', 'Done', 'Medium', -9, ['arjun'], ['#data']],
  ]),
  ...rows('p-yellybox', ['churn-interviews.pdf', 'onboarding-map.fig'], [
    ['Search inspirations for onboarding', 'Todo', 'Medium', 4, ['sarah', 'leila'], ['#research', '#client'], { note: 'Note: they liked our Behance project “Mise”.' }],
    ['Redesign signup and login pages', 'In Progress', 'High', 7, ['leila'], ['#website', '#client']],
    ['Onboarding checklist component', 'Todo', 'Medium', 12, ['ryan'], ['#frontend']],
    ['Activation funnel analysis', 'In Review', 'Medium', 2, ['arjun', 'sarah'], ['#data']],
    ['Interview 8 churned customers', 'Done', 'High', -5, ['sarah'], ['#research']],
  ]),
  ...rows('p-atlas', ['atlas-requirements.pdf'], [
    ['OAuth connection to Atlas', 'In Progress', 'High', -3, ['michael'], ['#backend', '#blocked'], { note: 'Waiting on Atlas to whitelist our redirect URL.' }],
    ['Contact field mapping', 'Todo', 'Medium', 15, ['michael', 'arjun'], ['#data']],
    ['Integration requirements doc', 'Done', 'Medium', -40, [ME, 'michael'], ['#docs']],
  ]),
  ...rows('p-minicam', ['minicam-final-report.pdf', 'survey-results.csv'], [
    ['Survey design', 'Done', 'Medium', -96, ['arjun', 'sarah'], ['#research']],
    ['Recruit 40 participants', 'Done', 'High', -88, ['sarah'], ['#research']],
    ['Run 12 customer interviews', 'Done', 'High', -78, ['sarah', 'olivia'], ['#research']],
    ['Competitor pricing matrix', 'Done', 'Medium', -66, ['arjun'], ['#data']],
    ['Synthesis workshop', 'Done', 'Medium', -55, ['arjun', 'sarah', 'olivia'], ['#workshop']],
    ['Final research report', 'Done', 'Urgent', -44, ['arjun'], ['#report']],
  ]),
  ...rows('p-alexa', ['alexa-landing.fig', 'launch-metrics.pdf'], [
    ['Landing page wireframe', 'Done', 'High', -150, ['leila'], ['#UX']],
    ['Launch copywriting', 'Done', 'Medium', -140, ['nina'], ['#copy']],
    ['Visual design', 'Done', 'High', -130, ['leila'], ['#design']],
    ['Build in Webflow', 'Done', 'High', -120, ['ryan'], ['#website']],
    ['Waitlist A/B test', 'Done', 'Medium', -109, ['marcus', 'ryan'], ['#growth']],
    ['Performance report', 'Done', 'Low', -99, ['marcus'], ['#report']],
  ]),
]

export const projectsStore = createStore('projects', seedProjects)
export const tasksStore = createStore('tasks', seedTasks)
export const useProjects = projectsStore.use
export const useTasks = tasksStore.use

export const projectById = (id: string) => projectsStore.get().find((p) => p.id === id)

export function addProject(draft: Omit<Project, 'id'>) {
  const project: Project = { status: 'Active', ...draft, id: uid('p') }
  projectsStore.set((ps) => [...ps, project])
  notify({ kind: 'project', title: `Project “${project.name}” created`, body: `${project.memberIds.length} team members were added.`, link: `/projects?project=${project.id}` })
  return project
}

export function deleteProject(id: string) {
  projectsStore.set((ps) => ps.filter((p) => p.id !== id))
  tasksStore.set((ts) => ts.filter((t) => t.projectId !== id))
}

export type TaskInput = Pick<Task, 'projectId' | 'title' | 'status' | 'priority' | 'description' | 'memberIds' | 'attachments'> & { dueDate?: string }

export function addTask(input: TaskInput) {
  const today = toISO(new Date())
  const task: Task = {
    ...input,
    id: uid('t'),
    tags: [`#${input.priority}`],
    note: input.description,
    progress: BASE_PROGRESS[input.status],
    comments: 0,
    createdAt: today,
    completedAt: input.status === 'Done' ? today : undefined,
  }
  tasksStore.set((ts) => [task, ...ts])
  if (input.memberIds.includes(ME)) {
    notify({ kind: 'assigned', title: 'You were assigned a new task', body: `“${task.title}” in ${projectById(task.projectId)?.name ?? 'a project'}.`, link: `/projects?project=${task.projectId}` })
  }
  return task
}

/** Applies edits; keeps progress and completion date consistent with the status. */
export function updateTask(id: string, patch: Partial<Task>) {
  const today = toISO(new Date())
  tasksStore.set((ts) =>
    ts.map((t) => {
      if (t.id !== id) return t
      const next = { ...t, ...patch }
      if (patch.description !== undefined) next.note = patch.description
      if (patch.status && patch.status !== t.status) {
        if (patch.status === 'Done') Object.assign(next, { progress: 100, completedAt: today })
        else {
          next.completedAt = undefined
          if (t.status === 'Done' || next.progress < BASE_PROGRESS[patch.status]) next.progress = BASE_PROGRESS[patch.status]
        }
      }
      return next
    }),
  )
}

export function moveTask(id: string, status: Status) {
  const task = tasksStore.get().find((t) => t.id === id)
  updateTask(id, { status })
  if (task && status === 'Done') {
    notify({ kind: 'status', title: 'Task completed', body: `“${task.title}” was marked as done.`, link: `/projects?project=${task.projectId}` })
  }
}

export const deleteTask = (id: string) => tasksStore.set((ts) => ts.filter((t) => t.id !== id))

/** Readable name of a task's first assignee. */
export const ownerName = (t: Task) => personById(t.memberIds[0] ?? '')?.name ?? 'Unassigned'
