import member1 from '../assets/projects/member-1.png'
import member2 from '../assets/projects/member-2.png'
import member3 from '../assets/projects/member-3.png'
import member4 from '../assets/projects/member-4.png'
import member5 from '../assets/projects/member-5.png'

export type Person = { id: string; name: string; avatar: string }

export const PEOPLE: Person[] = [
  { id: 'alex', name: 'Alex Johnson', avatar: member1 },
  { id: 'emily', name: 'Emily White', avatar: member2 },
  { id: 'jane', name: 'Jane Smith', avatar: member3 },
  { id: 'michael', name: 'Michael Brown', avatar: member4 },
  { id: 'sophia', name: 'Sophia Lee', avatar: member5 },
]

export const personById = (id: string) => PEOPLE.find((p) => p.id === id)
