import { useCallback, useEffect, useState } from 'react'

/** A short-lived status message; returns the current text and a `show` function. */
export function useToast(duration = 2500) {
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!message) return
    const id = setTimeout(() => setMessage(''), duration)
    return () => clearTimeout(id)
  }, [message, duration])

  const show = useCallback((text: string) => setMessage(text), [])
  return { message, show }
}
