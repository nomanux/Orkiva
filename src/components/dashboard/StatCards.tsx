import type { ReactNode } from 'react'
import { Card } from '../ui/Card'
import arrowButton from '../../assets/dashboard/arrow-up-right-button.svg'
import totalTaskGraph from '../../assets/dashboard/total-task-graph.svg'
import endedTaskGraph from '../../assets/dashboard/ended-task-graph.svg'

function StatCard({ title, count, graph }: { title: string; count: number; graph: ReactNode }) {
  return (
    <Card className="h-[143px] min-w-0 flex-1 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-[16px] leading-[1.5] tracking-[-0.48px] text-grey-text">{title}</h2>
        <button type="button" aria-label={`Open ${title}`} className="cursor-pointer rounded-full">
          <img src={arrowButton} alt="" width={38} height={38} />
        </button>
      </div>
      <div className="mt-[23px] flex items-center justify-between">
        <p className="text-[42px] leading-[1.2] font-bold tracking-[-2.52px]">{count}</p>
        {graph}
      </div>
    </Card>
  )
}

export function TotalTaskCard({ count }: { count: number }) {
  return <StatCard title="Total Task" count={count} graph={<img src={totalTaskGraph} alt="" width={172} height={20} className="-mr-px" />} />
}

/** Column heights of the pending-task pixel chart, grouped in pairs; the 5th pair is highlighted. */
const PENDING_COLUMNS = [
  [1, 1],
  [1, 2],
  [2, 1],
  [3, 1],
  [3, 4],
  [3, 1],
  [2, 1],
  [1, 1],
  [1, 1],
]
const HIGHLIGHT_PAIR = 4

function PendingGraph() {
  return (
    <div className="flex h-[30px] items-end gap-[5px]" aria-hidden>
      {PENDING_COLUMNS.map((pair, i) => (
        <div key={i} className="flex items-end gap-[2px]">
          {pair.map((height, j) => (
            <div key={j} className="flex flex-col gap-[2px]">
              {Array.from({ length: height }, (_, k) => (
                <span
                  key={k}
                  className={`block size-[6px] rounded-[1px] ${i === HIGHLIGHT_PAIR ? 'bg-primary' : 'bg-primary/40'}`}
                />
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

export function PendingTaskCard({ count }: { count: number }) {
  return <StatCard title="Pending Task" count={count} graph={<PendingGraph />} />
}

export function EndedTaskCard({ count }: { count: number }) {
  return (
    <StatCard
      title="Ended Task"
      count={count}
      graph={
        <div className="flex h-5 gap-[2px]" aria-hidden>
          <span className="w-3 rounded-[2px] bg-primary" />
          <span className="w-[6px] rounded-[2px] bg-black" />
          <span className="w-4 rounded-[2px] bg-background" />
          <img src={endedTaskGraph} alt="" width={130} height={20} className="-mr-px" />
        </div>
      }
    />
  )
}
