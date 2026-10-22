import james from '../assets/dashboard/avatar-masud.png'
import daniel from '../assets/projects/member-1.png'
import ryan from '../assets/projects/member-2.png'
import marcus from '../assets/projects/member-3.png'
import michael from '../assets/projects/member-4.png'
import ethan from '../assets/projects/member-5.png'
import leila from '../assets/projects/team-3.png'
import amara from '../assets/dashboard/avatar-bessie.png'
import arjun from '../assets/dashboard/avatar-esther.png'
import olivia from '../assets/inbox/darrell.png'
import sarah from '../assets/inbox/jane.png'
import nina from '../assets/calendar/person-3.png'

export type Person = { id: string; name: string; role: string; email: string; avatar: string }

const person = (id: string, name: string, role: string, avatar: string): Person => ({
  id,
  name,
  role,
  avatar,
  email: `${name.split(' ')[0].toLowerCase()}@orkiva.io`,
})

/** The signed-in demo user. */
export const ME = 'james'

export const PEOPLE: Person[] = [
  person('james', 'James Anderson', 'Head of Product', james),
  person('marcus', 'Marcus Johnson', 'Project Manager', marcus),
  person('daniel', 'Daniel Kim', 'Engineering Lead', daniel),
  person('ryan', 'Ryan Chen', 'Front-End Developer', ryan),
  person('michael', 'Michael Brown', 'Back-End Developer', michael),
  person('ethan', 'Ethan Walker', 'Product Designer', ethan),
  person('leila', 'Leila Haddad', 'UI Designer', leila),
  person('sarah', 'Sarah Mitchell', 'UX Researcher', sarah),
  person('amara', 'Amara Okafor', 'QA Engineer', amara),
  person('olivia', 'Olivia Martinez', 'Marketing Lead', olivia),
  person('arjun', 'Arjun Patel', 'Data Analyst', arjun),
  person('nina', 'Nina Rossi', 'Content Strategist', nina),
]

export const personById = (id: string) => PEOPLE.find((p) => p.id === id)
