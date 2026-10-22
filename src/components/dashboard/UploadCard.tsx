import { Link } from 'react-router'
import { Card } from '../ui/Card'
import { useTasks } from '../../data/projects'
import { fileSize } from '../../data/insights'
import fileIcon from '../../assets/dashboard/file-green.svg'

type UploadCardProps = { title: 'In Progress' | 'Completed' }

/** Latest file attached to an in-progress or completed task. */
export function UploadCard({ title }: UploadCardProps) {
  const done = title === 'Completed'
  const task = useTasks()
    .filter((t) => t.attachments.length > 0 && (done ? t.status === 'Done' : t.status === 'In Progress'))
    .sort((a, b) => (done ? (b.completedAt ?? '').localeCompare(a.completedAt ?? '') : b.createdAt.localeCompare(a.createdAt)))[0]
  const file = task?.attachments[task.attachments.length - 1]
  const pct = done ? 100 : (task?.progress ?? 0)

  return (
    <Card className="h-[127px] min-w-0 flex-1 px-4 pt-3">
      <h3 className="text-[14px] leading-[1.2] font-medium tracking-[-0.28px] text-ink">{title}</h3>
      {task && file ? (
        <Link to={`/projects?project=${task.projectId}`} className="block" title={task.title}>
          <div className="mt-[14px] ml-[9px] flex items-center gap-2">
            <img src={fileIcon} alt="" width={28} height={38} />
            <div className="flex min-w-0 flex-col gap-1 leading-[1.2] font-semibold">
              <p className="truncate text-[12px] tracking-[-0.2px]">{file}</p>
              <p className="text-[11px] font-medium text-grey-text">{fileSize(file)}</p>
            </div>
          </div>
          <div className="mt-[11px] flex items-center justify-between gap-2 leading-[1.2]">
            <span className="truncate text-[12px] tracking-[-0.2px] text-grey-text">{done ? 'Uploaded' : 'Uploading...'}</span>
            <span className="text-[12px] tracking-[-0.24px]">{pct}%</span>
          </div>
          <div
            role="progressbar"
            aria-valuenow={pct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${file} upload`}
            className="mt-[6px] h-[3px] overflow-hidden rounded-[4px] bg-background"
          >
            <div className="h-full rounded-[4px] bg-primary" style={{ width: `${pct}%` }} />
          </div>
        </Link>
      ) : (
        <p className="mt-6 text-[12px] text-grey-text">No files yet.</p>
      )}
    </Card>
  )
}
