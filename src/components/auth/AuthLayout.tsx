import type { ReactNode } from 'react'
import logo from '../../assets/brand/orkiva-logo.svg'
import heroMonitor from '../../assets/auth/hero-monitor.png'

const AUTH_BRAND = 'Orkiva'

const NO_LIGATURES = { fontFeatureSettings: '"calt" 0, "liga" 0' }

type AuthLayoutProps = {
  title: string
  subtitle: ReactNode
  children: ReactNode
}

/** Fits the viewport height (no page scroll on laptop screens): the hero panel and its spacing shrink with `vh`. */
export function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-background p-4 lg:h-dvh lg:p-6">
      <div className="flex h-full w-full max-w-[1392px] items-center justify-between gap-6">
        <main className="flex w-full max-w-[641px] flex-col items-center gap-[clamp(20px,3.5vh,32px)] px-4 py-6 sm:px-[50px]">
          <div className="flex h-10 items-center gap-3">
            <img src={logo} alt="" width={40} height={40} />
            <span className="text-[22px] leading-8 font-medium whitespace-nowrap text-text-primary" style={NO_LIGATURES}>
              {AUTH_BRAND}
            </span>
          </div>

          <div className="flex flex-col items-center gap-2 text-center leading-[1.5]" style={NO_LIGATURES}>
            <h1 className="text-[26px] font-bold text-strong-950">{title}</h1>
            <p className="max-w-[540px] text-[15px] font-medium tracking-[-0.176px] text-soft-400">{subtitle}</p>
          </div>

          {children}
        </main>

        <HeroPanel />
      </div>
    </div>
  )
}

function HeroPanel() {
  return (
    <aside className="hidden h-full max-h-[976px] w-[min(665px,46vw)] shrink-0 flex-col items-center overflow-hidden rounded-[26px] bg-white px-10 pt-[clamp(32px,11vh,116px)] lg:flex">
      <div className="flex w-full max-w-[544px] flex-col items-center gap-[clamp(24px,5vh,64px)] text-center">
        <img src={logo} alt="" width={71} height={71} className="size-[clamp(48px,7vh,71px)]" />
        <div className="flex flex-col gap-3 text-black">
          <h2 className="text-[clamp(24px,3.2vh,32px)] leading-[1.3] font-semibold tracking-[-0.96px]">
            Your Ultimate Hub for Task Management and Team Productivity
          </h2>
          <p className="text-[16px] leading-[1.5] tracking-[-0.32px]">
            Dive in to set up your workspace, assign tasks, and explore tools designed to boost your team’s efficiency
            from day one
          </p>
        </div>
      </div>
      {/* The monitor keeps its crop and aspect ratio and scales down to whatever height is left. */}
      <div className="mt-6 flex min-h-0 w-full flex-1 items-end justify-center">
        <div className="relative aspect-[551/428.102] h-full max-h-[428.102px] max-w-full overflow-hidden">
          <img
            src={heroMonitor}
            alt="Orkiva dashboard shown on a desktop monitor"
            className="absolute top-[-27.94%] left-[-26.53%] h-[146.49%] w-[151.76%] max-w-none"
          />
        </div>
      </div>
    </aside>
  )
}
