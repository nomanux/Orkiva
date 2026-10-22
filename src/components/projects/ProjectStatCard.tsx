import arrowButton from '../../assets/projects/arrow-button.svg'
import badgeDot from '../../assets/projects/badge-dot.svg'

const COLUMNS = 21
const HIGHLIGHT = 3 // black columns marking "now"

type ProjectStatCardProps = { label: string; value: number; percent: number; hint: string }

/** Dot-matrix chart: green columns for `percent`, three black, the rest grey; the badge sits over the middle black column. */
export function ProjectStatCard({ label, value, percent, hint }: ProjectStatCardProps) {
  const filled = Math.round((percent / 100) * (COLUMNS - HIGHLIGHT))
  const badgeColumn = filled + 1

  return (
    <article className="relative h-[143px] flex-1 overflow-hidden rounded-[15px] bg-white p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-[16px] leading-[1.5] tracking-[-0.48px] text-grey-text">{label}</h2>
        <img src={arrowButton} alt="" width={38} height={38} aria-hidden />
      </div>
      <p className="mt-[16px] text-[42px] leading-[1.2] font-bold tracking-[-2.52px]">{value}</p>
      <p className="text-[12px] leading-[1.2] text-grey-text">{hint}</p>

      <div className="absolute top-[93px] right-4 flex items-end gap-[2px]" aria-hidden>
        {Array.from({ length: COLUMNS }, (_, c) => {
          const tall = c >= filled && c < filled + HIGHLIGHT
          const color = c < filled ? 'bg-primary' : tall ? 'bg-black' : 'bg-stock'
          return (
            <div key={c} className="flex flex-col gap-[2px]">
              {Array.from({ length: tall ? 9 : 7 }, (_, r) => (
                <span key={r} className={`block size-[2px] ${color}`} />
              ))}
            </div>
          )
        })}
        <div className="absolute -top-[22px] flex w-[30px] flex-col items-center gap-[2px]" style={{ left: badgeColumn * 4 + 1 - 15 }}>
          <span className="flex h-[15px] w-full items-center justify-center rounded-[10px] bg-primary text-[10px] leading-none font-semibold text-black">
            {percent}%
          </span>
          <img src={badgeDot} alt="" width={4} height={4} className="-my-px" />
        </div>
      </div>
    </article>
  )
}
