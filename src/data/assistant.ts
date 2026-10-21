/**
 * Placeholder assistant: there is no model connected yet, so replies are canned and
 * chosen by keyword. Swap `reply` for a real API call when a backend exists.
 */
export type Segment = { text: string; bold?: boolean }
export type AssistantReply = { points: { title: string; body: Segment[] }[] } | { text: string }

const RISKS: AssistantReply = {
  points: [
    {
      title: 'Misalignment with Market Needs:',
      body: [
        { text: 'The product might not meet the actual needs or desires of the ' },
        { text: 'target audience.', bold: true },
        { text: ' Extensive market research is critical, but even then, trends can ' },
        { text: 'change quickly.', bold: true },
      ],
    },
    {
      title: 'Timeline & Budget Overruns:',
      body: [
        { text: 'Scope creep and unclear requirements stretch delivery. Lock a ' },
        { text: 'minimum viable scope', bold: true },
        { text: ' and review burn-down weekly.' },
      ],
    },
    {
      title: 'Technical Debt:',
      body: [
        { text: 'Rushing to launch can leave fragile code that slows every future release. Budget time for ' },
        { text: 'hardening and tests.', bold: true },
      ],
    },
  ],
}

const CALENDAR: AssistantReply = {
  points: [
    { title: 'Monday — Deep work:', body: [{ text: 'Block 9–12 for ' }, { text: 'Primor Project', bold: true }, { text: ' (6 tasks due soon).' }] },
    { title: 'Tuesday — Sprint Planning:', body: [{ text: 'Keep the 9:30 meeting; move reviews to the afternoon.' }] },
    { title: 'Friday — Wrap-up:', body: [{ text: 'Use the Design Review at 2 PM to close ' }, { text: 'Marketing Campaign', bold: true }, { text: ' tasks.' }] },
  ],
}

const HIGHLIGHT: AssistantReply = {
  points: [
    { title: 'Decisions:', body: [{ text: 'Increase the "Continue" button padding by ' }, { text: '10px each side', bold: true }, { text: '.' }] },
    { title: 'Action items:', body: [{ text: 'Kathryn to update the checkout spec; dev to ship by ' }, { text: 'Friday', bold: true }, { text: '.' }] },
    { title: 'Open questions:', body: [{ text: 'Confirm card-icon spacing on mobile.' }] },
  ],
}

export function reply(prompt: string): AssistantReply {
  const p = prompt.toLowerCase()
  if (p.includes('risk') || p.includes('launch')) return RISKS
  if (p.includes('calendar') || p.includes('week') || p.includes('schedule')) return CALENDAR
  if (p.includes('meeting') || p.includes('highlight') || p.includes('summary')) return HIGHLIGHT
  if (p.includes('translate')) return { text: 'Paste the text you’d like translated and tell me the target language — I’ll keep your formatting.' }
  if (p.includes('image')) return { text: 'Upload an image and I’ll describe it, pull out text, or suggest design improvements.' }
  return {
    text: `Here’s how I’d approach “${prompt.trim()}”: break it into milestones, assign an owner to each, and track progress on the Projects board. Want me to draft the tasks?`,
  }
}

export const HISTORY = {
  today: [{ id: 'h1', title: 'Orkiva Assistant', date: 'Today. 05th August 2025', prompt: 'Imagine that I’m the manager of a product development team. List the main risks associated with launching a new product.' }],
  yesterday: [
    { id: 'h2', title: 'How to increase user retention?', sub: 'Focus on onboarding, personalisation', icon: 'pie' },
    { id: 'h3', title: 'How to reduce churn rate?', sub: 'Identify at-risk users through data', icon: 'card' },
    { id: 'h4', title: 'How to improve product adoption?', sub: 'Simplify onboarding, offer in-app tips', icon: 'pie' },
    { id: 'h5', title: 'How to increase repeat purchases?', sub: 'Use personalised offers', icon: 'pie' },
  ],
}
