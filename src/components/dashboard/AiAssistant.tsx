import { useState, type ReactNode } from 'react'
import { Card } from '../ui/Card'
import logoSmall from '../../assets/brand/orkiva-logo.svg'
import dropdownSmall from '../../assets/dashboard/dropdown-small.svg'
import aiOrb from '../../assets/dashboard/ai-orb.png'
import aiOrbMask from '../../assets/dashboard/ai-orb-mask.png'
import chatInputBg from '../../assets/dashboard/chat-input-bg.svg'
import sparkle from '../../assets/dashboard/sparkle.svg'
import paperclip from '../../assets/dashboard/paperclip.svg'
import lightbulbBolt from '../../assets/dashboard/lightbulb-bolt.svg'
import magicStick from '../../assets/dashboard/magic-stick.svg'
import chart2 from '../../assets/dashboard/chart-2.svg'
import microphone from '../../assets/dashboard/microphone.svg'
import taskOverview from '../../assets/dashboard/task-overview.svg'
import projectEfficiency from '../../assets/dashboard/project-efficiency.svg'
import teamPerformance from '../../assets/dashboard/team-performance.png'
import { user } from '../../data/dashboard'

const TOOLS = [
  { label: 'Reasoning', icon: lightbulbBolt, w: 8, h: 8 },
  { label: 'Create Image', icon: magicStick, w: 8, h: 7 },
  { label: 'Deep Research', icon: chart2, w: 8, h: 8 },
]

const SUGGESTIONS = [
  {
    title: 'Task Overview',
    body: 'Monitor, manage, and optimize all project tasks in real time.',
    icon: <img src={taskOverview} alt="" width={16} height={16} />,
  },
  {
    title: 'Project Efficiency',
    body: 'Analyze performance to improve workflow speed and overall...',
    icon: (
      <span className="flex size-4 items-center justify-center">
        <img src={projectEfficiency} alt="" width={13.1542} height={14.6665} />
      </span>
    ),
  },
  {
    title: 'Team Performance',
    body: 'Track, measure, and enhance team productivity, collaboration...',
    icon: <img src={teamPerformance} alt="" width={16} height={16} className="object-cover" />,
  },
]

function ToolChip({ children, label }: { children: ReactNode; label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      className="flex h-[26px] cursor-pointer items-center gap-1 rounded-[6px] bg-white px-1.5 drop-shadow-[0px_0px_2px_rgba(0,0,0,0.06)] hover:bg-stock"
    >
      {children}
    </button>
  )
}

export function AiAssistant() {
  const [prompt, setPrompt] = useState('')
  const firstName = user.name

  return (
    <Card className="flex h-[368px] w-full flex-col p-4">
      <button
        type="button"
        className="flex h-8 w-fit cursor-pointer items-center gap-1 rounded-[6px] bg-background pr-1.5 pl-2"
      >
        <img src={logoSmall} alt="" width={16} height={16} />
        <span className="ml-0.5 text-[12px] leading-[1.2] font-medium tracking-[-0.24px]">AI Orkiva</span>
        <img src={dropdownSmall} alt="" width={16} height={16} />
      </button>

      {/* Iridescent orb, tinted with the brand green via a masked color-blend layer */}
      <div className="relative isolate mx-auto -mt-2 size-12 shrink-0">
        <img src={aiOrb} alt="" width={48} height={48} className="absolute inset-0 size-full object-cover" />
        <div
          className="absolute inset-0 bg-primary mix-blend-color"
          style={{
            maskImage: `url(${aiOrbMask})`,
            maskSize: '48px 48px',
            maskRepeat: 'no-repeat',
            WebkitMaskImage: `url(${aiOrbMask})`,
            WebkitMaskSize: '48px 48px',
            WebkitMaskRepeat: 'no-repeat',
          }}
        />
      </div>

      <p className="mt-1.5 text-center text-[14px] leading-[1.4] font-medium">
        Good Morning, {firstName}
        <br />
        How can I <span className="font-normal text-primary-dark">assist you today?</span>
      </p>

      <form
        className="relative mt-3 h-[102px] w-full shrink-0"
        onSubmit={(e) => {
          e.preventDefault()
          setPrompt('')
        }}
      >
        <img src={chatInputBg} alt="" width={364} height={102} className="absolute inset-0 size-full" />
        <img src={sparkle} alt="" width={16} height={16} className="absolute top-3 left-3 -scale-x-100" />
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              e.currentTarget.form?.requestSubmit()
            }
          }}
          rows={2}
          placeholder="Ask me anything about..."
          aria-label="Ask the AI assistant"
          className="absolute top-[11px] right-3 left-9 h-[44px] resize-none bg-transparent text-[13px] leading-[1.35] outline-none placeholder:text-black/50"
        />
        <div className="absolute bottom-2.5 left-2.5 flex gap-1">
          <ToolChip label="Attach file">
            <img src={paperclip} alt="" width={12} height={12} />
          </ToolChip>
          {TOOLS.map((tool) => (
            <ToolChip key={tool.label} label={tool.label}>
              <img src={tool.icon} alt="" width={tool.w * 1.5} height={tool.h * 1.5} />
              <span className="text-[10px] leading-[1.2] font-medium whitespace-nowrap">{tool.label}</span>
            </ToolChip>
          ))}
        </div>
        <button
          type="button"
          aria-label="Voice input"
          className="absolute right-2.5 bottom-2.5 flex size-[26px] cursor-pointer items-center justify-center rounded-[6px] bg-primary hover:brightness-95"
        >
          <img src={microphone} alt="" width={13} height={13} />
        </button>
      </form>

      <div className="mt-2.5 flex gap-2.5">
        {SUGGESTIONS.map((s) => (
          <button
            key={s.title}
            type="button"
            onClick={() => setPrompt(s.title)}
            className="flex h-[86px] min-w-0 flex-1 cursor-pointer flex-col items-center rounded-lg bg-background px-2 pt-2.5 hover:bg-stock"
          >
            {s.icon}
            <span className="mt-1 text-[11px] leading-[1.2] font-semibold whitespace-nowrap">{s.title}</span>
            <span className="mt-1 line-clamp-2 text-center text-[10px] leading-[1.35] text-black/60">{s.body}</span>
          </button>
        ))}
      </div>
    </Card>
  )
}
