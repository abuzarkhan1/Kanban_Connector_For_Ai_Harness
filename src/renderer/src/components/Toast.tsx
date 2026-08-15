import { useToastStore, Toast } from '../stores/useToastStore'
import { IconButton } from './ui'
import { CloseIcon, CheckIcon, AlertIcon, InfoIcon } from './icons'

const TYPE_STYLES: Record<Toast['type'], string> = {
  success: 'border-status-success-border bg-status-success-bg text-status-success',
  error: 'border-status-danger-border bg-status-danger-bg text-status-danger',
  warning: 'border-status-warning-border bg-status-warning-bg text-status-warning',
  info: 'border-hairline bg-surface-elevated text-ink'
}

const TYPE_ICONS = {
  success: <CheckIcon size="xs" />,
  error: <AlertIcon size="xs" />,
  warning: <AlertIcon size="xs" />,
  info: <InfoIcon size="xs" />
}

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts)
  const removeToast = useToastStore((s) => s.removeToast)

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex max-w-sm items-start gap-3 rounded-lg border px-3.5 py-3 shadow-[0_8px_24px_rgba(0,0,0,0.5)] animate-in slide-in-from-right-8 duration-300 ${TYPE_STYLES[toast.type]}`}
          role="alert"
        >
          <div className="mt-0.5 grid size-5 shrink-0 place-items-center">
            {TYPE_ICONS[toast.type]}
          </div>
          <p className="min-w-0 flex-1 text-[12px] leading-snug text-current">{toast.message}</p>
          <IconButton label="Dismiss notification" onClick={() => removeToast(toast.id)}>
            <CloseIcon size="xs" />
          </IconButton>
        </div>
      ))}
    </div>
  )
}
