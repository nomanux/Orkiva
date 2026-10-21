import { Card } from '../ui/Card'
import fileIcon from '../../assets/dashboard/file-green.svg'

type UploadCardProps = {
  title: string
  fileName: string
  fileSize: string
  /** Percentage shown in the label. */
  percent: number
  /** Width of the filled bar, 0–1. In the design it differs from `percent` for the in-progress card. */
  fill: number
}

export function UploadCard({ title, fileName, fileSize, percent, fill }: UploadCardProps) {
  return (
    <Card className="h-[127px] min-w-0 flex-1 px-4 pt-3">
      <h3 className="text-[14px] leading-[1.2] font-medium tracking-[-0.28px] text-ink">{title}</h3>
      <div className="mt-[14px] ml-[9px] flex items-center gap-2">
        <img src={fileIcon} alt="" width={28} height={38} />
        <div className="flex flex-col gap-1 leading-[1.2] font-semibold">
          <p className="text-[12px] tracking-[-0.2px]">{fileName}</p>
          <p className="text-[11px] font-medium text-grey-text">{fileSize}</p>
        </div>
      </div>
      <div className="mt-[11px] flex items-center justify-between leading-[1.2]">
        <span className="text-[12px] tracking-[-0.2px] text-grey-text">Uploading...</span>
        <span className="text-[12px] tracking-[-0.24px]">{percent}%</span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        className="mt-[6px] h-[3px] overflow-hidden rounded-[4px] bg-background"
      >
        <div className="h-full rounded-[4px] bg-primary" style={{ width: `${fill * 100}%` }} />
      </div>
    </Card>
  )
}
