/**
 * Orkiva's assistant runs locally: it reads the workspace stores and answers with
 * rule-based summaries. There is no language model behind it — swap `reply` for an
 * API call when a backend exists.
 */
import { createStore, uid } from '../lib/store'
import { addDays, daysFromToday, formatShort, fromISO, relativeDue, toISO } from '../lib/dates'
import { isOpen, isOverdue, percent, projectProgress, upcomingTasks } from './insights'
import { formatTime, meetingsStore, nextMeeting, weekStart } from './meetingsStore'
import { ME, PEOPLE, personById } from './people'
import { addTask, projectsStore, tasksStore, type Task } from './projects'

export type Segment = { text: string; bold?: boolean }
export type AssistantReply = {
  text?: string
  points?: { title: string; body: Segment[] }[]
  link?: { label: string; to: string }
}

const b = (text: string): Segment => ({ text, bold: true })
const t = (text: string): Segment => ({ text })

const projectName = (id: string) => projectsStore.get().find((p) => p.id === id)?.name ?? 'Unknown project'
const names = (ids: string[]) => ids.map((id) => personById(id)?.name.split(' ')[0]).filter(Boolean).join(', ')
const taskLine = (task: Task): Segment[] => [
  t(`${projectName(task.projectId)} · `),
  b(task.dueDate ? relativeDue(task.dueDate) : 'no due date'),
  t(` · ${task.priority} · ${names(task.memberIds) || 'unassigned'}`),
]

function overdue(): AssistantReply {
  const late = tasksStore.get().filter(isOverdue)
  if (!late.length) return { text: 'Nothing is overdue right now — every open task is still within its due date. 🎉' }
  return {
    text: `${late.length} task${late.length > 1 ? 's are' : ' is'} overdue:`,
    points: late.map((task) => ({ title: task.title, body: taskLine(task) })),
    link: { label: 'Open the board', to: `/projects?project=${late[0].projectId}` },
  }
}

function today(): AssistantReply {
  const iso = toISO(new Date())
  const due = tasksStore.get().filter((task) => isOpen(task) && task.dueDate === iso)
  const meetings = meetingsStore.get().filter((m) => m.date === iso && m.status !== 'Cancelled').sort((a, z) => a.start.localeCompare(z.start))
  const points = [
    ...meetings.map((m) => ({ title: `${formatTime(m.start)} — ${m.title}`, body: [t(`Meeting until ${formatTime(m.end)} with ${names(m.attendeeIds)}.`)] })),
    ...due.map((task) => ({ title: `Due today: ${task.title}`, body: taskLine(task) })),
  ]
  if (!points.length) return { text: 'Your day is clear: no meetings and no tasks due today.' }
  return { text: `Here’s your day: ${meetings.length} meeting${meetings.length === 1 ? '' : 's'} and ${due.length} task${due.length === 1 ? '' : 's'} due.`, points }
}

function week(): AssistantReply {
  const monday = weekStart(new Date())
  const points = Array.from({ length: 5 }, (_, i) => {
    const day = addDays(monday, i)
    const iso = toISO(day)
    const meetings = meetingsStore.get().filter((m) => m.date === iso && m.status !== 'Cancelled')
    const due = tasksStore.get().filter((task) => isOpen(task) && task.dueDate === iso)
    const label = day.toLocaleDateString('en-US', { weekday: 'long' })
    const body: Segment[] = []
    if (meetings.length) body.push(t('Meetings: '), b(meetings.map((m) => `${m.title} (${formatTime(m.start, true)})`).join(', ')), t('. '))
    if (due.length) body.push(t('Due: '), b(due.map((task) => task.title).join(', ')), t('.'))
    if (!body.length) body.push(t('Free — a good day for deep work.'))
    return { title: `${label}:`, body }
  })
  const busiest = points.reduce((a, p, i) => (p.body.length > points[a].body.length ? i : a), 0)
  return {
    text: `Here’s your week. ${points[busiest].title.replace(':', '')} is the busiest day, so I’d move flexible work away from it.`,
    points,
    link: { label: 'Open the calendar', to: '/calendar' },
  }
}

function overview(): AssistantReply {
  const tasks = tasksStore.get()
  const open = tasks.filter(isOpen)
  const mine = open.filter((task) => task.memberIds.includes(ME))
  const top = upcomingTasks(tasks).slice(0, 4)
  return {
    text: `You have ${open.length} open tasks across ${new Set(open.map((x) => x.projectId)).size} projects — ${tasks.filter(isOverdue).length} overdue and ${mine.length} assigned to you. Most urgent:`,
    points: top.map((task) => ({ title: task.title, body: taskLine(task) })),
    link: { label: 'Go to Projects', to: '/projects' },
  }
}

function projectsStatus(): AssistantReply {
  const tasks = tasksStore.get()
  const active = projectsStore.get().filter((p) => p.status !== 'Completed')
  return {
    text: 'Progress on active projects (share of tasks done):',
    points: active
      .map((p) => ({ p, pct: projectProgress(p.id, tasks), late: tasks.filter((x) => x.projectId === p.id && isOverdue(x)).length }))
      .sort((a, z) => z.pct - a.pct)
      .map(({ p, pct, late }) => ({
        title: `${p.name}:`,
        body: [b(`${pct}% done`), t(p.endDate ? ` · ends ${formatShort(p.endDate)}` : ''), t(p.status === 'On Hold' ? ' · on hold' : ''), ...(late ? [t(' · '), b(`${late} overdue`)] : [])],
      })),
  }
}

function project(id: string): AssistantReply {
  const p = projectsStore.get().find((x) => x.id === id)!
  const tasks = tasksStore.get().filter((x) => x.projectId === id)
  const open = upcomingTasks(tasks)
  const counts = (['Todo', 'In Progress', 'In Review', 'Done'] as const).map((s) => `${tasks.filter((x) => x.status === s).length} ${s.toLowerCase()}`)
  return {
    text: `${p.name} is ${projectProgress(id, tasks)}% done (${counts.join(', ')}). ${p.status === 'On Hold' ? 'It’s currently on hold. ' : ''}Managed by ${personById(p.managerId ?? '')?.name ?? 'nobody yet'}.`,
    points: open.slice(0, 4).map((task) => ({ title: task.title, body: taskLine(task) })),
    link: { label: `Open ${p.name}`, to: `/projects?project=${id}` },
  }
}

function workload(): AssistantReply {
  const open = tasksStore.get().filter(isOpen)
  const load = PEOPLE.map((person) => ({ person, tasks: open.filter((x) => x.memberIds.includes(person.id)) }))
    .filter((x) => x.tasks.length)
    .sort((a, z) => z.tasks.length - a.tasks.length)
  const avg = open.length ? load.reduce((s, x) => s + x.tasks.length, 0) / load.length : 0
  return {
    text: `Open tasks per person (team average ${avg.toFixed(1)}). Anyone well above average is a candidate for rebalancing:`,
    points: load.slice(0, 6).map(({ person, tasks }) => ({
      title: `${person.name} (${person.role}):`,
      body: [b(`${tasks.length} open`), t(` · ${tasks.filter(isOverdue).length} overdue · ${tasks.filter((x) => x.priority === 'Urgent').length} urgent`)],
    })),
  }
}

function meetingHighlight(): AssistantReply {
  const m = nextMeeting(meetingsStore.get())
  if (!m) return { text: 'There are no upcoming meetings to prepare for.' }
  const related = m.projectId ? upcomingTasks(tasksStore.get().filter((x) => x.projectId === m.projectId)).slice(0, 3) : []
  return {
    text: `Next up: “${m.title}”, ${m.date === toISO(new Date()) ? 'today' : formatShort(m.date)} at ${formatTime(m.start)}.`,
    points: [
      { title: 'Agenda:', body: [t(m.description)] },
      { title: 'Attendees:', body: [b(names(m.attendeeIds))] },
      ...(related.length
        ? [{ title: `Open items in ${projectName(m.projectId!)}:`, body: [t(related.map((x) => `${x.title} (${x.dueDate ? relativeDue(x.dueDate) : 'no date'})`).join('; '))] }]
        : []),
    ],
    link: { label: 'See all meetings', to: '/meetings' },
  }
}

function risks(): AssistantReply {
  const tasks = tasksStore.get()
  const late = tasks.filter(isOverdue)
  const urgent = tasks.filter((x) => isOpen(x) && x.priority === 'Urgent')
  const held = projectsStore.get().filter((p) => p.status === 'On Hold')
  return {
    text: 'The main delivery risks I can see in your workspace:',
    points: [
      { title: 'Slipping deadlines:', body: [b(`${late.length} overdue task${late.length === 1 ? '' : 's'}`), t(late.length ? ` — ${late.map((x) => x.title).join(', ')}.` : '.')] },
      { title: 'Urgent work in flight:', body: [b(`${urgent.length} urgent`), t(' tasks still open. Make sure each has a single owner.')] },
      { title: 'Blocked projects:', body: held.length ? [b(held.map((p) => p.name).join(', ')), t(' on hold — agree an unblock date with the client.')] : [t('None on hold.')] },
      { title: 'Market fit:', body: [t('For new launches, validate with real users before scaling — '), b('trends change quickly.')] },
    ],
  }
}

function createTask(title: string): AssistantReply {
  const lower = title.toLowerCase()
  const project =
    projectsStore.get().find((p) => lower.includes(` in ${p.name.toLowerCase()}`)) ?? projectsStore.get().find((p) => p.status === 'Active')
  if (!project) return { text: 'Create a project first, then I can add tasks to it.' }
  const clean = title.replace(new RegExp(` in ${project.name}`, 'i'), '').trim().replace(/^["“]|["”]$/g, '')
  const task = addTask({ projectId: project.id, title: clean, status: 'Todo', priority: 'Medium', description: 'Created by Orkiva Assistant.', memberIds: [ME], attachments: [], dueDate: daysFromToday(3) })
  return {
    text: `Done — I added “${task.title}” to ${project.name}, assigned to you and due ${formatShort(task.dueDate!)}.`,
    link: { label: 'View it on the board', to: `/projects?project=${project.id}` },
  }
}

const HELP: AssistantReply = {
  text: 'I can answer questions about your workspace. Try:',
  points: [
    { title: '“What’s overdue?”', body: [t('Late tasks with owners.')] },
    { title: '“Plan my week”', body: [t('Meetings and due dates per day.')] },
    { title: '“Status of Primor”', body: [t('Progress and next tasks for any project.')] },
    { title: '“Team workload”', body: [t('Open tasks per person.')] },
    { title: '“Create task: Review pricing page”', body: [t('Adds it to a project for you.')] },
  ],
}

export function reply(prompt: string): AssistantReply {
  const p = prompt.toLowerCase()
  const create = prompt.match(/^(?:please\s+)?(?:create|add|new)\s+(?:a\s+)?task[:\s-]+(.+)/i)
  if (create) return createTask(create[1])
  const named = projectsStore.get().find((x) => p.includes(x.name.toLowerCase()) || p.includes(x.name.split(' ')[0].toLowerCase()))
  if (named && !/overdue|risk/.test(p)) return project(named.id)
  if (/overdue|late|behind/.test(p)) return overdue()
  if (/today|my day/.test(p)) return today()
  if (/week|calendar|plan|schedule|align/.test(p)) return week()
  if (/risk|launch/.test(p)) return risks()
  if (/meeting|highlight|agenda/.test(p)) return meetingHighlight()
  if (/team|workload|performance|who/.test(p)) return workload()
  if (/project|progress|efficien/.test(p)) return projectsStatus()
  if (/task|overview|todo|to-do|summary/.test(p)) return overview()
  if (p.includes('translate')) return { text: 'Paste the text you’d like translated and tell me the target language — I’ll keep your formatting.' }
  if (p.includes('image')) return { text: 'Upload an image and I’ll describe it, pull out text, or suggest design improvements.' }
  if (/file/.test(p)) {
    const files = tasksStore.get().flatMap((x) => x.attachments).slice(0, 6)
    return { text: `Your workspace has ${tasksStore.get().reduce((s, x) => s + x.attachments.length, 0)} attached files. Recent ones: ${files.join(', ')}.` }
  }
  if (/audio|voice|call/.test(p)) return { text: 'Voice chat isn’t connected in this demo yet — you can start a video call from the Inbox or Meetings pages.', link: { label: 'Open Inbox', to: '/inbox' } }
  return HELP
}

/* ---------- Conversation history ---------- */

export type ChatMessage = { id: string; from: 'user' | 'assistant'; text?: string; reply?: AssistantReply }
export type Conversation = { id: string; title: string; createdAt: number; icon?: 'pie' | 'card'; messages: ChatMessage[] }

const DAY = 86_400_000
const seeded = (id: string, prompt: string, ago: number, icon?: Conversation['icon']): Conversation => ({
  id,
  title: prompt,
  createdAt: Date.now() - ago,
  icon,
  messages: [
    { id: `${id}-u`, from: 'user', text: prompt },
    { id: `${id}-a`, from: 'assistant', reply: reply(prompt) },
  ],
})

const conversations = createStore<Conversation[]>('assistant-chats', () => [
  seeded('c1', 'Imagine I’m the manager of a product team. What are the main risks of launching right now?', 2 * 3_600_000),
  seeded('c2', 'Which projects are behind?', DAY + 3_600_000, 'pie'),
  seeded('c3', 'How is the team workload looking?', DAY + 2 * 3_600_000, 'card'),
  seeded('c4', 'Plan my week', DAY + 5 * 3_600_000, 'pie'),
  seeded('c5', 'Status of Primor Mobile App', DAY + 7 * 3_600_000, 'pie'),
])

export const useConversations = conversations.use

export function startConversation(prompt: string) {
  const c: Conversation = { id: uid('c'), title: prompt, createdAt: Date.now(), messages: [{ id: uid('u'), from: 'user', text: prompt }] }
  conversations.set((list) => [c, ...list])
  return c.id
}

export function appendMessage(id: string, message: Omit<ChatMessage, 'id'>) {
  conversations.set((list) => list.map((c) => (c.id === id ? { ...c, messages: [...c.messages, { ...message, id: uid('msg') }] } : c)))
}

export const deleteConversation = (id: string) => conversations.set((list) => list.filter((c) => c.id !== id))

/** "Today" / "Yesterday" / "Aug 4" bucket for the history sidebar. */
export function dayLabel(at: number) {
  const iso = toISO(new Date(at))
  if (iso === toISO(new Date())) return 'Today'
  if (iso === daysFromToday(-1)) return 'Yesterday'
  return fromISO(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

/* ---------- Quick actions on the start screen ---------- */

export type QuickActionData = { id: string; title: string; kind: 'calendar' | 'checklist'; faces?: boolean }

const quickActions = createStore<QuickActionData[]>('assistant-actions', () => [
  { id: 'q1', title: 'Align my calendar with this week’s tasks', kind: 'calendar' },
  { id: 'q2', title: 'Create meeting highlight', kind: 'checklist', faces: true },
])

export const useQuickActions = quickActions.use
export const addQuickAction = (title: string) => quickActions.set((list) => [...list, { id: uid('q'), title, kind: 'checklist' }])
export const removeQuickAction = (id: string) => quickActions.set((list) => list.filter((q) => q.id !== id))

export { percent }
