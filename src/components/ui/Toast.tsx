export function Toast({ message }: { message: string }) {
  return (
    <div
      role="status"
      className={`fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-ink px-5 py-3 text-[14px] font-semibold text-white shadow-lg transition-opacity ${
        message ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
    >
      {message}
    </div>
  )
}
