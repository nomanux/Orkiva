import type { ChatAvatar as Avatar } from '../../data/inbox'

/** Photo, two overlapping photos for a group, or initials on a coloured circle. */
export function ChatAvatar({ avatar, size = 44, online }: { avatar: Avatar; size?: number; online?: boolean }) {
  const dot = online && (
    <span className="absolute right-0 bottom-0 size-2.5 rounded-full border-[1.5px] border-white bg-[#12b76a]" aria-label="Online" />
  )

  if ('group' in avatar) {
    const small = Math.round(size * 0.73)
    return (
      <span className="relative block shrink-0" style={{ width: size, height: size }}>
        <img src={avatar.group[0]} alt="" width={small} height={small} className="absolute top-0 left-0 rounded-full" />
        <img src={avatar.group[1]} alt="" width={small} height={small} className="absolute right-0 bottom-0 rounded-full ring-2 ring-white" />
      </span>
    )
  }
  if ('initials' in avatar) {
    return (
      <span className="relative flex shrink-0 items-center justify-center" style={{ width: size, height: size }}>
        <img src={avatar.circle} alt="" width={size} height={size} className="absolute inset-0 size-full" />
        <span className="relative font-medium text-black" style={{ fontSize: Math.round(size * 0.33) }}>
          {avatar.initials}
        </span>
        {dot}
      </span>
    )
  }
  return (
    <span className="relative block shrink-0" style={{ width: size, height: size }}>
      <img src={avatar.photo} alt="" width={size} height={size} className="size-full rounded-full object-cover" />
      {dot}
    </span>
  )
}
