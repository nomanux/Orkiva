export const toISO = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

export const fromISO = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

/** "August 12, 2025" */
export const formatLong = (iso: string) =>
  fromISO(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

/** "Nov 16" */
export const formatShort = (iso: string) => fromISO(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

/** "July 15 - August 20, 2025" (year shown once when both dates share it). */
export const formatRange = (start: string, end?: string) => {
  if (!end || end === start) return formatLong(start)
  const a = fromISO(start)
  const b = fromISO(end)
  const sameYear = a.getFullYear() === b.getFullYear()
  const first = a.toLocaleDateString('en-US', sameYear ? { month: 'long', day: 'numeric' } : { month: 'long', day: 'numeric', year: 'numeric' })
  return `${first} - ${formatLong(end)}`
}

const ordinal = (n: number) => {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return n + (s[(v - 20) % 10] || s[v] || s[0])
}

/** "Saturday, Jul 9th, 2023" */
export const formatToday = (d = new Date()) =>
  `${d.toLocaleDateString('en-US', { weekday: 'long' })}, ${d.toLocaleDateString('en-US', { month: 'short' })} ${ordinal(d.getDate())}, ${d.getFullYear()}`
