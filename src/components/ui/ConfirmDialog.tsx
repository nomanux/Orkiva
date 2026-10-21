import { useId } from 'react'
import { Modal } from './Modal'

type ConfirmDialogProps = {
  open: boolean
  onCancel: () => void
  onConfirm: () => void
  icon: string
  /** `brand` rings the icon in the primary green (logout); `danger` in error pink (delete). */
  tone: 'brand' | 'danger'
  title: string
  message: string
  confirmLabel: string
  backdropClassName?: string
}

const RING = {
  brand: { outer: 'border-primary from-primary/48', inner: 'border-primary' },
  danger: { outer: 'border-error-50 from-error-50/48', inner: 'border-error-25' },
}

export function ConfirmDialog({
  open,
  onCancel,
  onConfirm,
  icon,
  tone,
  title,
  message,
  confirmLabel,
  backdropClassName,
}: ConfirmDialogProps) {
  const titleId = useId()
  const ring = RING[tone]

  return (
    <Modal open={open} onClose={onCancel} labelledBy={titleId} className="w-[450px] rounded-2xl" backdropClassName={backdropClassName}>
      <div className="flex flex-col items-center gap-8 p-8">
        <div className="flex w-full flex-col items-center gap-4">
          <div className={`rounded-[96px] border bg-gradient-to-b via-transparent to-transparent p-4 ${ring.outer}`}>
            <div
              className={`flex items-center justify-center rounded-[96px] border bg-white p-[14px] shadow-[0px_2px_4px_0px_rgba(223,28,65,0.04)] ${ring.inner}`}
            >
              <img src={icon} alt="" width={24} height={24} />
            </div>
          </div>
          <div className="flex w-full flex-col items-center gap-2 text-center">
            <h2 id={titleId} className="text-[24px] leading-[1.3] font-semibold tracking-[-0.48px] text-ink">
              {title}
            </h2>
            <p className="max-w-[321px] text-[16px] leading-[1.5] text-grey-text">{message}</p>
          </div>
        </div>
        <div className="flex w-full gap-4">
          <button
            type="button"
            onClick={onCancel}
            autoFocus
            className="h-14 flex-1 cursor-pointer rounded-full border border-gs-100 bg-white px-4 text-[16px] leading-[1.5] font-semibold text-ink hover:bg-gs-25"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="h-14 flex-1 cursor-pointer rounded-full bg-error px-4 text-[16px] leading-[1.5] font-semibold text-white drop-shadow-[0px_1px_1px_rgba(13,13,18,0.06)] hover:brightness-95"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  )
}
