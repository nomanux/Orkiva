import { Link } from 'react-router'
import arrowButton from '../../assets/projects/arrow-button.svg'

/** What the bar measures: a short label, its share, and a full sentence for the tooltip. */
export type StatMeter = { label: string; percent: number; detail: string }

type ProjectStatCardProps = { label: string; value: number; hint: string; meter: StatMeter; /** Makes the arrow a link. */ to?: string }

export function ProjectStatCard({ label, value, hint, meter, to }: ProjectStatCardProps) {
  return (
    <article className="relative flex h-[143px] min-w-0 flex-1 flex-col overflow-hidden rounded-[15px] bg-white p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-[16px] leading-[1.5] tracking-[-0.48px] text-grey-text">{label}</h2>
        {to ? (
          <Link to={to} aria-label={`Open ${label}`} className="rounded-full hover:brightness-95">
            <img src={arrowButton} alt="" width={38} height={38} />
          </Link>
        ) : (
          <img src={arrowButton} alt="" width={38} height={38} aria-hidden />
        )}
      </div>
      <div className="mt-auto flex items-end justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[42px] leading-[1.1] font-bold tracking-[-2.52px]">{value}</p>
          <p className="truncate text-[13px] leading-[1.2] text-grey-text">{hint}</p>
        </div>
        <div className="w-[46%] max-w-[170px] shrink-0 pb-px" title={meter.detail}>
          <div className="flex items-baseline justify-between gap-2 text-[13px] leading-[1.2]">
            <span className="truncate text-grey-text">{meter.label}</span>
            <span className="font-semibold text-ink">{meter.percent}%</span>
          </div>
          <div
            role="meter"
            aria-label={meter.detail}
            aria-valuenow={meter.percent}
            aria-valuemin={0}
            aria-valuemax={100}
            className="mt-1.5 h-[6px] overflow-hidden rounded-full bg-stock"
          >
            <div className="h-full rounded-full bg-primary" style={{ width: `${meter.percent}%` }} />
          </div>
        </div>
      </div>
    </article>
  )
}
