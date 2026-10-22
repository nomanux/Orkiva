import { createStore } from '../lib/store'
import kathryn from '../assets/inbox/kathryn.png'
import kathrynHeader from '../assets/inbox/kathryn-header.png'
import kristin from '../assets/inbox/kristin.png'
import watson from '../assets/inbox/watson.png'
import robert from '../assets/inbox/robert.png'
import darrell from '../assets/inbox/darrell.png'
import jane from '../assets/inbox/jane.png'
import courtney from '../assets/inbox/courtney.png'
import wade from '../assets/inbox/wade.png'
import albert from '../assets/inbox/albert.png'
import circleYellow from '../assets/inbox/circle-yellow.svg'
import circleTeal from '../assets/inbox/circle-teal.svg'
import circlePurple from '../assets/inbox/circle-purple.svg'

/** A photo, a pair of photos (group chat), or initials on a coloured circle. */
export type ChatAvatar = { photo: string } | { group: [string, string] } | { initials: string; circle: string }

export type Message =
  | { id: string; from: 'them' | 'me'; text: string; reactions?: string[] }
  | { id: string; from: 'them'; kind: 'missed-call'; time: string }

export type Chat = {
  id: string
  name: string
  role: string
  avatar: ChatAvatar
  headerPhoto?: string
  time: string
  preview: string
  /** `call-ended` shows the red call icon; `seen` the read receipt. */
  status?: 'call-ended' | 'seen'
  unread?: number
  pinned: boolean
  online: boolean
  messages: Message[]
}

/** Builds a short thread: strings starting with "> " are mine, the rest are theirs. */
const thread = (prefix: string, lines: string[]): Message[] =>
  lines.map((line, i) =>
    line.startsWith('> ')
      ? { id: `${prefix}${i}`, from: 'me', text: line.slice(2) }
      : { id: `${prefix}${i}`, from: 'them', text: line },
  )

export const CHATS: Chat[] = [
  {
    id: 'kathryn', name: 'Kathryn Murphy', role: 'Senior Product Designer', avatar: { photo: kathryn }, headerPhoto: kathrynHeader,
    time: '8:13 AM', preview: 'Call Ended', status: 'call-ended', unread: 2, pinned: true, online: true,
    messages: [
      { id: 'm1', from: 'them', text: "Hey, I noticed there's an issue with the button placement on the new feature. It seems a bit off, and I'm not sure if it's intentional." },
      { id: 'm2', from: 'me', text: "Hi Chance! Thanks for bringing it up. Let me take a look. Could you specify which page and section you're referring to?" },
      { id: 'm3', from: 'them', text: 'Sure, it\'s on the checkout page under the "Payment Options" section. The "Continue" button seems a bit cramped between the credit card icons. It might affect the user experience.' },
      { id: 'm4', from: 'me', text: "Got it. Thanks for the heads-up. I'll review the design and see if we can improve the spacing. Do you have any suggestions on how much padding we should add?" },
      { id: 'm5', from: 'them', text: 'I think a bit more breathing room around the button would be good—maybe increase the horizontal padding by about 10 pixels on each side.', reactions: ['👌', '😍'] },
      { id: 'm6', from: 'them', kind: 'missed-call', time: '07:32 AM' },
    ],
  },
  {
    id: 'devon', name: 'Devon Lane', role: 'Marketing Lead', avatar: { initials: 'DE', circle: circleYellow }, time: '8:02 AM',
    preview: 'You: Sure, I’ll drop the sheet in the campaign folder this afternoon.', status: 'seen', pinned: true, online: false,
    messages: thread('d', [
      'Morning! Are the Q4 ad creatives still on track for Thursday?',
      '> Yes — Olivia and Nina are finishing the last two sizes today.',
      'Perfect. Can you share the budget split once it’s final?',
      '> Sure, I’ll drop the sheet in the campaign folder this afternoon.',
    ]),
  },
  {
    id: 'esther', name: 'Esther Howard', role: 'Front-End Developer', avatar: { initials: 'ES', circle: circleTeal }, time: 'Yesterday',
    preview: 'You: Nice. Let’s demo it in Friday’s design review.', status: 'seen', pinned: true, online: true,
    messages: thread('e', [
      'The cart drawer is merged 🎉 Animations feel much smoother now.',
      '> Great work! Did you test it on Safari iOS?',
      'Yep, iOS 17 and 18. One tiny flicker on iPad, fixing it now.',
      '> Nice. Let’s demo it in Friday’s design review.',
    ]),
  },
  {
    id: 'cody', name: 'Cody Fisher', role: 'QA Engineer', avatar: { initials: 'CO', circle: circlePurple }, time: 'Yesterday',
    preview: 'Done. Moved it to In Review with a screen recording attached.', status: 'seen', unread: 1, pinned: true, online: false,
    messages: thread('c', [
      'Found it — the OTP timeout bug only happens when the app is backgrounded for 30s+.',
      '> That explains why we couldn’t repro on the simulator. Can you add steps to the ticket?',
      'Done. Moved it to In Review with a screen recording attached.',
    ]),
  },
  {
    id: 'kristin', name: 'Kristin & Watson', role: '2 members', avatar: { group: [kristin, watson] }, time: '8:13 AM',
    preview: 'Jane: Sure thing, I think we could go with it', unread: 2, pinned: false, online: true,
    messages: [
      { id: 'k1', from: 'me', text: 'Shall we go with the second layout for the onboarding flow?' },
      { id: 'k2', from: 'them', text: 'Sure thing, I think we could go with it' },
    ],
  },
  {
    id: 'robert', name: 'Robert Fox', role: 'Backend Developer', avatar: { photo: robert }, time: 'Mon',
    preview: 'You: Sounds right. Ping me when it’s on staging.', status: 'seen', pinned: false, online: false,
    messages: thread('r', [
      'The booking API is returning 200s now, but slots across timezones are still off by an hour.',
      '> Is that daylight-saving related?',
      'Looks like it. I’ll store everything in UTC and convert on the client.',
      '> Sounds right. Ping me when it’s on staging.',
    ]),
  },
  {
    id: 'darrell', name: 'Darrell Steward', role: 'Project Manager', avatar: { photo: darrell }, time: 'Mon',
    preview: 'Thanks! I’ll let Marcus know too.', status: 'seen', pinned: false, online: true,
    messages: thread('d', [
      'Can we move the Primor sprint review to 3 PM? The client has a clash.',
      '> 3 PM works for me. I’ll update the calendar invite.',
      'Thanks! I’ll let Marcus know too.',
    ]),
  },
  {
    id: 'jane', name: 'Jane Cooper', role: 'UX Researcher', avatar: { photo: jane }, time: 'Sun',
    preview: 'I’m writing up the synthesis now, should be ready tomorrow.', unread: 1, pinned: false, online: false,
    messages: thread('j', [
      '> How did the churned-customer interviews go?',
      'Really insightful — 6 of 8 dropped off at the address step during onboarding.',
      'I’m writing up the synthesis now, should be ready tomorrow.',
    ]),
  },
  {
    id: 'courtney', name: 'Courtney Henry', role: 'Content Strategist', avatar: { photo: courtney }, time: 'Fri',
    preview: 'You: Thanks! I’ll leave comments by end of day.', status: 'seen', pinned: false, online: false,
    messages: thread('c', [
      'First draft of the Trustworth brand voice guide is in the shared drive.',
      '> Thanks! I’ll leave comments by end of day.',
    ]),
  },
  {
    id: 'wade', name: 'Wade Warren', role: 'DevOps Engineer', avatar: { photo: wade }, time: 'Thu',
    preview: 'Yes, read-only. No data loss expected.', status: 'seen', pinned: false, online: true,
    messages: thread('w', [
      'Heads up: maintenance window Saturday 02:00–03:00 UTC for the database upgrade.',
      '> Noted. Will the app be read-only during that time?',
      'Yes, read-only. No data loss expected.',
    ]),
  },
]

export type CallParticipant = { id: string; name: string; role: string; avatar: ChatAvatar }

export const CALL_PARTICIPANTS: CallParticipant[] = [
  { id: 'albert', name: 'Albert Flores', role: 'Scrum Master', avatar: { photo: albert } },
  { id: 'kathryn', name: 'Kathryn Murphy', role: 'Senior Product Designer', avatar: { photo: kathryn } },
]

/** People who can be added to a call. */
export const INVITABLE: CallParticipant[] = [
  { id: 'esther', name: 'Esther Howard', role: 'Front-End Developer', avatar: { initials: 'ES', circle: circleTeal } },
  { id: 'madelyn', name: 'Madelyn Stanton', role: 'Graphic Designer', avatar: { photo: robert } },
  { id: 'rayna', name: 'Rayna Mango', role: 'Scrum Master', avatar: { photo: darrell } },
  { id: 'craig', name: 'Craig Baptista', role: 'Senior Back-End Developer', avatar: { photo: jane } },
  { id: 'paityn', name: 'Paityn Lubin', role: 'Web Designer', avatar: { photo: courtney } },
]

/**
 * Only what the user changes is saved (messages, pins, unread counts, blocks); photos and names
 * come from `CHATS`, so bundled image URLs never end up in storage.
 */
type ChatChanges = Partial<Pick<Chat, 'messages' | 'preview' | 'time' | 'status' | 'unread' | 'pinned'>>
const inbox = createStore<{ changes: Record<string, ChatChanges>; blocked: string[] }>('inbox', () => ({ changes: {}, blocked: [] }))

export function useChats(): Chat[] {
  const { changes, blocked } = inbox.use()
  return CHATS.filter((c) => !blocked.includes(c.id)).map((c) => ({ ...c, ...changes[c.id] }))
}

export function updateChat(id: string, patch: (chat: Chat) => ChatChanges) {
  inbox.set((s) => {
    const chat = { ...CHATS.find((c) => c.id === id)!, ...s.changes[id] }
    return { ...s, changes: { ...s.changes, [id]: { ...s.changes[id], ...patch(chat) } } }
  })
}

export const blockChat = (id: string) => inbox.set((s) => ({ ...s, blocked: [...s.blocked, id] }))
