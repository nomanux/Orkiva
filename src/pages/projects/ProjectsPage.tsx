import { useState } from 'react'
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
import {
  PRIORITIES,
  PROJECT_STATS,
  SEED_PROJECTS,
  SEED_TASKS,
  STATUS_LABEL,
  STATUSES,
  type Priority,
  type Project,
  type Status,
  type Task,
} from '../../data/projects'

type TaskEditor = { mode: 'create'; status?: Status } | { mode: 'edit'; task: Task }

let nextId = 1
const newId = (prefix: string) => `${prefix}-${Date.now()}-${nextId++}`

export function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(SEED_PROJECTS)
  const [tasks, setTasks] = useState<Task[]>(SEED_TASKS)
  const [currentId, setCurrentId] = useState(SEED_PROJECTS[0].id)
  const [collapsed, setCollapsed] = useState<Status[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'All'>('All')

  const [taskEditor, setTaskEditor] = useState<TaskEditor | null>(null)
  const [deletingTask, setDeletingTask] = useState<Task | null>(null)
  const [creatingProject, setCreatingProject] = useState(false)
  const [deletingProject, setDeletingProject] = useState(false)
  const toast = useToast()

  const boardTasks = tasks.filter((t) => t.projectId === currentId && (priorityFilter === 'All' || t.priority === priorityFilter))
  const currentProject = projects.find((p) => p.id === currentId)

  const saveTask = (draft: TaskDraft) => {
    if (taskEditor?.mode === 'edit') {
      setTasks((ts) => ts.map((t) => (t.id === taskEditor.task.id ? { ...t, ...draft, note: draft.description } : t)))
      toast.show('Task updated')
    } else {
      const task: Task = {
        ...draft,
        id: newId('task'),
        projectId: currentId,
        tags: [`#${draft.priority}`],
        note: draft.description,
        progress: draft.status === 'Done' ? 100 : 0,
        comments: 0,
      }
      setTasks((ts) => [task, ...ts])
      toast.show('Task created')
    }
    setTaskEditor(null)
  }

  const deleteTask = () => {
    if (!deletingTask) return
    setTasks((ts) => ts.filter((t) => t.id !== deletingTask.id))
    setDeletingTask(null)
    toast.show('Task deleted')
  }

  const deleteProject = () => {
    const remaining = projects.filter((p) => p.id !== currentId)
    setProjects(remaining)
    setTasks((ts) => ts.filter((t) => t.projectId !== currentId))
    setCurrentId(remaining[0].id)
    setDeletingProject(false)
    toast.show('Project deleted')
  }

  return (
    <div className="mt-6 flex flex-col gap-[10px]">
      <div className="flex gap-[10px]">
        {PROJECT_STATS.map((s) => (
          <ProjectStatCard key={s.label} {...s} />
        ))}
      </div>

      <BoardToolbar
        projects={projects}
        currentId={currentId}
        onSelect={setCurrentId}
        onCreateProject={() => setCreatingProject(true)}
        onDeleteProject={() => setDeletingProject(true)}
        onCreateTask={() => setTaskEditor({ mode: 'create' })}
        onToggleFilters={() => setShowFilters((s) => !s)}
        filtersActive={showFilters || priorityFilter !== 'All'}
      />

      {showFilters && (
        <div role="group" aria-label="Filter by priority" className="flex items-center gap-2 rounded-[15px] border border-stock bg-white px-4 py-3">
          <span className="mr-2 text-[14px] font-medium text-grey-text">Priority</span>
          {(['All', ...PRIORITIES] as const).map((p) => (
            <button
              key={p}
              type="button"
              aria-pressed={priorityFilter === p}
              onClick={() => setPriorityFilter(p)}
              className={`cursor-pointer rounded-full border px-3 py-1 text-[14px] font-medium ${
                priorityFilter === p ? 'border-primary bg-primary/15 text-ink' : 'border-stock text-grey-text hover:bg-background'
              }`}
            >
              {p}
            </button>
          ))}
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
            >
              {columnTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={() => setTaskEditor({ mode: 'edit', task })}
                  onDelete={() => setDeletingTask(task)}
                />
              ))}
            </KanbanColumn>
          )
        })}
      </div>

      <TaskFormModal
        key={taskEditor?.mode === 'edit' ? taskEditor.task.id : (taskEditor?.status ?? 'new')}
        open={!!taskEditor}
        editing={taskEditor?.mode === 'edit'}
        initial={taskEditor?.mode === 'edit' ? taskEditor.task : taskEditor?.status ? { status: taskEditor.status } : undefined}
        onClose={() => setTaskEditor(null)}
        onSave={saveTask}
      />
      <ProjectFormModal
        open={creatingProject}
        onClose={() => setCreatingProject(false)}
        onSave={(draft) => {
          const project = { ...draft, id: newId('project') }
          setProjects((ps) => [...ps, project])
          setCurrentId(project.id)
          setCreatingProject(false)
          toast.show(`Project “${project.name}” created`)
        }}
      />
      <ConfirmDialog
        open={!!deletingTask}
        onCancel={() => setDeletingTask(null)}
        onConfirm={deleteTask}
        icon={trashIcon}
        tone="danger"
        title="Delete Task?"
        message="Are you sure you want to delete this task? This action can’t be undone."
        confirmLabel="Delete"
      />
      <ConfirmDialog
        open={deletingProject}
        onCancel={() => setDeletingProject(false)}
        onConfirm={deleteProject}
        icon={trashIcon}
        tone="danger"
        title="Delete Project?"
        message={`Are you sure you want to delete “${currentProject?.name}”? This action can’t be undone.`}
        confirmLabel="Delete"
      />
      <Toast message={toast.message} />
    </div>
  )
}
