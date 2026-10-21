import avatarBrandie from '../assets/dashboard/avatar-brandie.png'
import avatarEsther from '../assets/dashboard/avatar-esther.png'
import avatarBessie from '../assets/dashboard/avatar-bessie.png'

export const user = { name: 'Masud A.', email: 'masud.holt@example.com' }

export const stats = { total: 234, pending: 234, ended: 234 }

/** Monthly project overview: `total` is the light background bar, `value` the filled bar. */
export const projectOverview = [
  { month: 'Jan', total: 650, value: 368 },
  { month: 'Feb', total: 332, value: 150 },
  { month: 'Mar', total: 650, value: 443, highlight: true },
  { month: 'Apr', total: 375, value: 232 },
  { month: 'May', total: 168, value: 114 },
]

export const taskStatistics = { totalProjects: 506, change: 4.3, total: 32, done: 28, inProgress: 18 }

export type TaskStatus = 'completed' | 'in-progress'

export const tasks: {
  name: string
  handle: string
  avatar: string
  project: string
  date: string
  status: TaskStatus
  progress: number
}[] = [
  { name: 'Brandie', handle: '@sophie turner', avatar: avatarBrandie, project: 'YellyBox Project', date: 'Apr 2', status: 'completed', progress: 7 },
  { name: 'Esther', handle: '@sophie turner', avatar: avatarEsther, project: 'Minicam Exploration', date: 'Apr 3', status: 'in-progress', progress: 6 },
  { name: 'Bessie', handle: '@sophie turner', avatar: avatarBessie, project: 'Alexa AI (landing page)', date: 'Apr 6', status: 'completed', progress: 6 },
]

export const dueProjects = [
  { name: 'Primor Project', due: 6 },
  { name: 'Sulivan Project', due: 3 },
  { name: 'Trustworth Project', due: 2 },
  { name: 'Marketing Campaign', due: 7 },
]

export const meeting = { title: 'Meeting with Arc Company', time: '02.00 pm - 04.00 pm' }
