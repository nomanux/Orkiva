import { useEffect, useRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import closeIcon from '../../assets/overlays/close.svg'

type ModalProps = {
  open: boolean
  onClose: () => void
  labelledBy: string
  className?: string
  /** Classes for the `::backdrop`, e.g. a stronger blur. */
  backdropClassName?: string
  children: ReactNode
}

/** Native <dialog> wrapper: focus trapping, Escape and backdrop clicks close it. */
export function Modal({
  open,
  onClose,
  labelledBy,
  className = '',
  backdropClassName = 'backdrop:bg-black/20',
  children,
}: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      aria-labelledby={labelledBy}
      onCancel={(e) => {
        e.preventDefault()
        onClose()
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      className={`m-auto max-h-[calc(100vh-32px)] max-w-[calc(100vw-32px)] bg-white p-0 ${backdropClassName} ${className}`}
    >
      {open && children}
    </dialog>
  )
}

export function ModalHeader({ id, title, onClose, className = '' }: { id: string; title: string; onClose: () => void; className?: string }) {
  return (
    <header className={`flex shrink-0 items-center justify-between border-b border-gs-100 px-5 ${className}`}>
      <h2 id={id} className="text-[16px] leading-[1.4] font-semibold tracking-[-0.32px] text-ink">
        {title}
      </h2>
      <CloseButton onClick={onClose} />
    </header>
  )
}

export function CloseButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label="Close"
      onClick={onClick}
      className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full border border-gs-100 shadow-[0px_1px_2px_0px_rgba(13,13,18,0.06)] hover:bg-gs-25"
    >
      <img src={closeIcon} alt="" width={18} height={18} />
    </button>
  )
}

export function ModalFooter({ children }: { children: ReactNode }) {
  return <footer className="flex h-16 shrink-0 items-center justify-end gap-3 border-t border-gs-100 px-5">{children}</footer>
}

const BUTTON =
  'flex h-10 cursor-pointer items-center justify-center rounded-lg px-4 text-[14px] leading-[1.5] font-semibold drop-shadow-[0px_1px_1px_rgba(13,13,18,0.06)] disabled:cursor-not-allowed disabled:opacity-60'

export function SecondaryButton({ className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type="button" className={`${BUTTON} border border-gs-100 bg-white text-ink hover:bg-gs-25 ${className}`} {...props} />
}

export function PrimaryButton({ className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="submit"
      className={`${BUTTON} bg-primary bg-[linear-gradient(0deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.15)_100%)] text-black hover:brightness-95 ${className}`}
      {...props}
    />
  )
}
