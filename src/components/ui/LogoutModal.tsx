import logoutIcon from '../../assets/settings/logout.svg'
import { ConfirmDialog } from './ConfirmDialog'

type LogoutModalProps = {
  open: boolean
  onCancel: () => void
  onConfirm: () => void
}

export function LogoutModal({ open, onCancel, onConfirm }: LogoutModalProps) {
  return (
    <ConfirmDialog
      open={open}
      onCancel={onCancel}
      onConfirm={onConfirm}
      icon={logoutIcon}
      tone="brand"
      title="Logout"
      message="Are you sure you want to log out of Orkiva?"
      confirmLabel="Yes, Logout"
      backdropClassName="backdrop:bg-black/22 backdrop:backdrop-blur-[8px]"
    />
  )
}
