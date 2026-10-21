import type { HTMLAttributes, ReactNode } from 'react'

export function Card({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`relative overflow-hidden rounded-[15px] bg-white ${className}`} {...props} />
}

export function CardTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-[16px] leading-[1.2] font-semibold tracking-[-0.32px] whitespace-nowrap text-ink">
      {children}
    </h2>
  )
}
