import type {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes
} from 'react'
import { CloseIcon } from './icons'

/** Join class names, dropping falsy values. */
export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ')
}

/** Small geometric mark: three Kanban columns, the middle one filled. */
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden className={className}>
      <rect x="2.5" y="3.5" width="4" height="13" rx="1.2" stroke="currentColor" strokeWidth="1.6" />
      <rect x="8" y="3.5" width="4" height="13" rx="1.2" stroke="currentColor" strokeWidth="1.6" fill="currentColor" />
      <rect x="13.5" y="3.5" width="4" height="13" rx="1.2" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}

/* ---------------- Buttons ---------------- */

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'

const BUTTON_VARIANT: Record<ButtonVariant, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  ghost: 'btn-ghost',
  danger: 'btn-danger'
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: 'sm' | 'md'
}

export function Button({
  variant = 'secondary',
  size = 'md',
  className,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cx('btn', size === 'sm' ? 'btn-sm' : 'btn-md', BUTTON_VARIANT[variant], 'focus-ring', className)}
      {...rest}
    />
  )
}

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string
  children?: ReactNode
  size?: 'sm' | 'md'
}

/** Compact square icon-only button (e.g. dismiss, close, delete). */
export function IconButton({ label, children, size = 'md', className, type = 'button', ...rest }: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={cx(
        'inline-flex shrink-0 items-center justify-center rounded-md text-mute transition-colors duration-150',
        'hover:bg-surface-elevated hover:text-ink focus-ring',
        size === 'sm' ? 'size-6' : 'size-7',
        className
      )}
      {...rest}
    >
      {children ?? <CloseIcon size={size === 'sm' ? 'xs' : 'sm'} />}
    </button>
  )
}

/* ---------------- Form controls ---------------- */

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** md = 36px, sm = 32px */
  density?: 'sm' | 'md'
}

export function TextInput({ className, density = 'md', ...rest }: TextInputProps) {
  return <input className={cx('control', density === 'sm' ? 'h-8 px-2.5 text-[12px]' : 'h-9 px-3 text-[13px]', className)} {...rest} />
}

export function TextArea({ className, ...rest }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cx('control px-3 py-2 text-[13px] leading-relaxed', className)} {...rest} />
}

export function Select({ className, ...rest }: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={cx('control select-control h-9 px-3 text-[13px]', className)} {...rest} />
}

interface FieldProps {
  label: string
  hint?: string
  htmlFor?: string
  children: ReactNode
}

/** Label + control wrapper with the mono uppercase micro-label. */
export function Field({ label, hint, htmlFor, children }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between gap-2">
        <label htmlFor={htmlFor} className="label">
          {label}
        </label>
        {hint ? <span className="font-mono text-[10px] text-ash">{hint}</span> : null}
      </div>
      {children}
    </div>
  )
}

/* ---------------- Badge ---------------- */

interface BadgeProps {
  className?: string
  children: ReactNode
}

/** Tiny uppercase mono badge (priority, metadata). */
export function Badge({ className, children }: BadgeProps) {
  return (
    <span
      className={cx(
        'inline-flex items-center rounded-[5px] border px-1.5 py-[3px] font-mono text-[9px] font-medium uppercase tracking-[0.08em]',
        className
      )}
    >
      {children}
    </span>
  )
}
