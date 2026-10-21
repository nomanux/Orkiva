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

const generic = (name: string): Message[] => [
  { id: 'g1', from: 'me', text: 'Can you please provide for me your some more details' },
  { id: 'g2', from: 'them', text: `Sure — I’ll send everything over this afternoon. Thanks, ${name.split(' ')[0]} here!` },
]

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
  { id: 'devon', name: 'Devon Lane', role: 'Marketing Lead', avatar: { initials: 'DE', circle: circleYellow }, time: '8:13 AM', preview: 'You: Can you please provide for me your some more details', status: 'seen', pinned: true, online: false, messages: generic('Devon Lane') },
  { id: 'esther', name: 'Esther Howard', role: 'Front-End Developer', avatar: { initials: 'ES', circle: circleTeal }, time: '8:13 AM', preview: 'You: Can you please provide for me your some more details', status: 'seen', pinned: true, online: true, messages: generic('Esther Howard') },
  { id: 'cody', name: 'Cody Fisher', role: 'QA Engineer', avatar: { initials: 'CO', circle: circlePurple }, time: '8:13 AM', preview: 'You: Can you please provide for me your some more details', status: 'seen', pinned: true, online: false, messages: generic('Cody Fisher') },
  {
    id: 'kristin', name: 'Kristin & Watson', role: '2 members', avatar: { group: [kristin, watson] }, time: '8:13 AM',
    preview: 'Jane: Sure thing, I think we could go with it', unread: 2, pinned: false, online: true,
    messages: [
      { id: 'k1', from: 'me', text: 'Shall we go with the second layout for the onboarding flow?' },
      { id: 'k2', from: 'them', text: 'Sure thing, I think we could go with it' },
    ],
  },
  { id: 'robert', name: 'Robert Fox', role: 'Backend Developer', avatar: { photo: robert }, time: '8:13 AM', preview: 'You: Can you please provide for me your some more details', status: 'seen', pinned: false, online: false, messages: generic('Robert Fox') },
  { id: 'darrell', name: 'Darrell Steward', role: 'Project Manager', avatar: { photo: darrell }, time: '8:13 AM', preview: 'You: Can you please provide for me your some more details', status: 'seen', pinned: false, online: true, messages: generic('Darrell Steward') },
  { id: 'jane', name: 'Jane Cooper', role: 'UX Researcher', avatar: { photo: jane }, time: '8:13 AM', preview: 'You: Can you please provide for me your some more details', status: 'seen', pinned: false, online: false, messages: generic('Jane Cooper') },
  { id: 'courtney', name: 'Courtney Henry', role: 'Content Strategist', avatar: { photo: courtney }, time: '8:13 AM', preview: 'You: Can you please provide for me your some more details', status: 'seen', pinned: false, online: false, messages: generic('Courtney Henry') },
  { id: 'wade', name: 'Wade Warren', role: 'DevOps Engineer', avatar: { photo: wade }, time: '8:13 AM', preview: 'You: Can you please provide for me your some more details', status: 'seen', pinned: false, online: true, messages: generic('Wade Warren') },
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
