import { useState } from 'react'
import { useSearchParams } from 'react-router'
import { BoardToolbar } from '../../components/projects/BoardToolbar'
import { KanbanColumn } from '../../components/projects/KanbanColumn'
import { ProjectFormModal } from '../../components/projects/ProjectFormModal'
import { ProjectStatCard } from '../../components/projects/ProjectStatCard'
import { TaskCard } from '../../components/projects/TaskCard'
import { TaskFormModal, type TaskDraft } from '../../components/projects/TaskFormModal'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { Toast } from '../../components/ui/Toast'
import { useToast } from '../../hooks/useToast'
import trashIcon from '../../assets/overlays/trash.svg'
import { ME } from '../../data/people'
import { percent, taskTotals } from '../../data/insights'
import {
  PRIORITIES,
  STATUS_LABEL,
  STATUSES,
  addProject,
  addTask,
  deleteProject,
  deleteTask,
  moveTask,
  updateTask,
  useProjects,
  useTasks,
  type Priority,
  type Status,
  type Task,
} from '../../data/projects'

type TaskEditor = { mode: 'create'; status?: Status } | { mode: 'edit'; task: Task }

const CHIP = 'cursor-pointer rounded-full border px-3 py-1 text-[14px] font-medium'
const chip = (on: boolean) => `${CHIP} ${on ? 'border-primary bg-primary/15 text-ink' : 'border-stock text-grey-text hover:bg-background'}`

export function ProjectsPage() {
  const projects = useProjects()
  const tasks = useTasks()
  const [params, setParams] = useSearchParams()
  const [collapsed, setCollapsed] = useState<Status[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'All'>('All')
  const [mineOnly, setMineOnly] = useState(false)
  const [query, setQuery] = useState('')

  const [taskEditor, setTaskEditor] = useState<TaskEditor | null>(null)
  const [deletingTask, setDeletingTask] = useState<Task | null>(null)
  const [creatingProject, setCreatingProject] = useState(false)
  const [deletingProject, setDeletingProject] = useState(false)
  const toast = useToast()

  // The open board lives in the URL (?project=id) so dashboard cards, search and notifications can link to it.
  const currentProject = projects.find((p) => p.id === params.get('project')) ?? projects.find((p) => p.status === 'Active') ?? projects[0]
  const currentId = currentProject?.id ?? ''
  const select = (id: string) => setParams({ project: id })

  const q = query.trim().toLowerCase()
  const projectTasks = tasks.filter((t) => t.projectId === currentId)
  const boardTasks = projectTasks.filter(
    (t) =>
      (priorityFilter === 'All' || t.priority === priorityFilter) &&
      (!mineOnly || t.memberIds.includes(ME)) &&
      (!q || t.title.toLowerCase().includes(q) || t.tags.some((tag) => tag.toLowerCase().includes(q))),
  )
  const filtersActive = priorityFilter !== 'All' || mineOnly || !!q

  const totals = taskTotals(tasks)
  const active = projects.filter((p) => p.status === 'Active').length
  const onHold = projects.filter((p) => p.status === 'On Hold').length
  const stats = [
    {
      label: 'Total Project',
      value: projects.length,
      hint: onHold ? `${active} active · ${onHold} on hold` : `${active} active`,
      meter: { label: 'Active', percent: percent(active, projects.length), detail: `${active} of ${projects.length} projects are active` },
    },
    {
      label: 'Total Task',
      value: totals.total,
      hint: `${totals.pending} open · ${totals.done} done`,
      meter: { label: 'Still open', percent: percent(totals.pending, totals.total), detail: `${totals.pending} of ${totals.total} tasks are not done yet` },
    },
    {
      label: 'Total Due Today',
      value: totals.dueToday,
      hint: `${totals.overdue} overdue`,
      meter: { label: 'Of open tasks', percent: percent(totals.dueToday, totals.pending), detail: `${totals.dueToday} of ${totals.pending} open tasks are due today` },
    },
    {
      label: 'Task Completed',
      value: totals.done,
      hint: `of ${totals.total} tasks`,
      meter: { label: 'Completion', percent: percent(totals.done, totals.total), detail: `${totals.done} of ${totals.total} tasks are done` },
    },
  ]

  const saveTask = (draft: TaskDraft) => {
    if (taskEditor?.mode === 'edit') {
      updateTask(taskEditor.task.id, draft)
      toast.show('Task updated')
    } else {
      addTask({ ...draft, projectId: currentId })
      toast.show('Task created')
    }
    setTaskEditor(null)
  }

  if (!currentProject) {
    return (
      <div className="mt-24 flex flex-col items-center gap-4 text-center">
        <p className="text-[18px] text-grey-text">No projects yet.</p>
        <button type="button" onClick={() => setCreatingProject(true)} className="h-10 cursor-pointer rounded-full bg-primary px-5 font-semibold">
          Create your first project
        </button>
        <ProjectFormModal
          open={creatingProject}
          onClose={() => setCreatingProject(false)}
          onSave={(draft) => {
            select(addProject(draft).id)
            setCreatingProject(false)
          }}
        />
      </div>
    )
  }

  return (
    <div className="mt-6 flex flex-col gap-[10px]">
      <div className="flex gap-[10px]">
        {stats.map((s) => (
          <ProjectStatCard key={s.label} {...s} />
        ))}
      </div>

      <BoardToolbar
        projects={projects}
        project={currentProject}
        tasks={projectTasks}
        onSelect={select}
        onCreateProject={() => setCreatingProject(true)}
        onDeleteProject={() => setDeletingProject(true)}
        onCreateTask={() => setTaskEditor({ mode: 'create' })}
        onToggleFilters={() => setShowFilters((s) => !s)}
        filtersActive={showFilters || filtersActive}
      />

      {showFilters && (
        <div role="group" aria-label="Filters" className="flex flex-wrap items-center gap-2 rounded-[15px] border border-stock bg-white px-4 py-3">
          <span className="mr-1 text-[14px] font-medium text-grey-text">Priority</span>
          {(['All', ...PRIORITIES] as const).map((p) => (
            <button key={p} type="button" aria-pressed={priorityFilter === p} onClick={() => setPriorityFilter(p)} className={chip(priorityFilter === p)}>
              {p}
            </button>
          ))}
          <span className="mx-2 h-6 w-px bg-stock" aria-hidden />
          <button type="button" aria-pressed={mineOnly} onClick={() => setMineOnly((m) => !m)} className={chip(mineOnly)}>
            Assigned to me
          </button>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tasks or #tags"
            aria-label="Search tasks"
            className="ml-auto h-9 w-60 rounded-lg border border-gs-100 px-3 text-[14px] outline-none focus:border-primary"
          />
          {filtersActive && (
            <button
              type="button"
              onClick={() => {
                setPriorityFilter('All')
                setMineOnly(false)
                setQuery('')
              }}
              className="cursor-pointer text-[13px] font-semibold text-primary-dark hover:underline"
            >
              Clear
            </button>
          )}
        </div>
      )}

      <div className="flex items-start gap-[10px]">
        {STATUSES.map((status) => {
          const columnTasks = boardTasks.filter((t) => t.status === status)
          return (
            <KanbanColumn
              key={status}
              title={STATUS_LABEL[status]}
              count={columnTasks.length}
              collapsed={collapsed.includes(status)}
              onToggle={() => setCollapsed((c) => (c.includes(status) ? c.filter((s) => s !== status) : [...c, status]))}
              onAdd={() => setTaskEditor({ mode: 'create', status })}
              onDropTask={(id) => {
                const task = tasks.find((t) => t.id === id)
                if (!task || task.status === status) return
                moveTask(id, status)
                toast.show(`Moved to ${STATUS_LABEL[status]}`)
              }}
            >
              {columnTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={() => setTaskEditor({ mode: 'edit', task })}
                  onDelete={() => setDeletingTask(task)}
                  onMove={(to) => {
                    moveTask(task.id, to)
                    toast.show(`Moved to ${STATUS_LABEL[to]}`)
                  }}
                />
              ))}
              {columnTasks.length === 0 && (
                <p className="rounded-[20px] border-2 border-dashed border-stock px-4 py-8 text-center text-[13px] text-grey-text">
                  {filtersActive ? 'No matching tasks' : 'No tasks yet'}
                </p>
              )}
            </KanbanColumn>
          )
        })}
      </div>

      <TaskFormModal
        key={taskEditor?.mode === 'edit' ? taskEditor.task.id : (taskEditor?.status ?? 'new')}
        open={!!taskEditor}
        editing={taskEditor?.mode === 'edit'}
        people={currentProject.memberIds}
        initial={taskEditor?.mode === 'edit' ? taskEditor.task : taskEditor?.status ? { status: taskEditor.status } : undefined}
        onClose={() => setTaskEditor(null)}
        onSave={saveTask}
      />
      <ProjectFormModal
        open={creatingProject}
        onClose={() => setCreatingProject(false)}
        onSave={(draft) => {
          const project = addProject(draft)
          select(project.id)
          setCreatingProject(false)
          toast.show(`Project “${project.name}” created`)
        }}
      />
      <ConfirmDialog
        open={!!deletingTask}
        onCancel={() => setDeletingTask(null)}
        onConfirm={() => {
          if (deletingTask) deleteTask(deletingTask.id)
          setDeletingTask(null)
          toast.show('Task deleted')
        }}
        icon={trashIcon}
        tone="danger"
        title="Delete Task?"
        message="Are you sure you want to delete this task? This action can’t be undone."
        confirmLabel="Delete"
      />
      <ConfirmDialog
        open={deletingProject}
        onCancel={() => setDeletingProject(false)}
        onConfirm={() => {
          deleteProject(currentId)
          setParams({})
          setDeletingProject(false)
          toast.show('Project deleted')
        }}
        icon={trashIcon}
        tone="danger"
        title="Delete Project?"
        message={`Are you sure you want to delete “${currentProject.name}” and its ${projectTasks.length} tasks? This action can’t be undone.`}
        confirmLabel="Delete"
      />
      <Toast message={toast.message} />
    </div>
  )
}
