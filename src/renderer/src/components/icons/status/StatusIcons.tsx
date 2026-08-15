import React, { forwardRef } from 'react'
import { IconBase } from '../IconBase'
import type { IconProps } from '../types'

export const CheckIcon = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <IconBase ref={ref} {...props}>
    <polyline points="20 6 9 17 4 12" />
  </IconBase>
))
CheckIcon.displayName = 'CheckIcon'

export const CheckCircleIcon = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <IconBase ref={ref} {...props}>
    <circle cx="12" cy="12" r="9" fill="currentColor" fillOpacity="0.15" />
    <polyline points="16 9 10.5 15 8 12.5" />
  </IconBase>
))
CheckCircleIcon.displayName = 'CheckCircleIcon'

export const AlertIcon = forwardRef<SVGSVGElement, IconProps>(({ animate = 'pulse-slow', ...props }, ref) => (
  <IconBase ref={ref} animate={animate} {...props}>
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <circle cx="12" cy="17" r="0.75" fill="currentColor" />
  </IconBase>
))
AlertIcon.displayName = 'AlertIcon'

export const SpinnerIcon = forwardRef<SVGSVGElement, IconProps>(({ animate = 'spin', ...props }, ref) => (
  <IconBase ref={ref} animate={animate} {...props}>
    <circle cx="12" cy="12" r="9" strokeOpacity="0.2" />
    <path d="M12 3a9 9 0 0 1 9 9" />
  </IconBase>
))
SpinnerIcon.displayName = 'SpinnerIcon'

export const ClipboardIcon = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <IconBase ref={ref} {...props}>
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <rect x="8" y="2" width="8" height="4" rx="1" />
    <path d="M9 12h6M9 16h4" strokeWidth={1.5} />
  </IconBase>
))
ClipboardIcon.displayName = 'ClipboardIcon'

export const ZapIcon = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <IconBase ref={ref} {...props}>
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="currentColor" fillOpacity="0.2" />
  </IconBase>
))
ZapIcon.displayName = 'ZapIcon'

export const StatusTodoIcon: React.FC<IconProps> = (props) => (
  <IconBase size="sm" strokeWidth={2} {...props}>
    <circle cx="12" cy="12" r="7.5" />
  </IconBase>
)

export const StatusInProgressIcon: React.FC<IconProps> = (props) => (
  <IconBase size="sm" strokeWidth={2} {...props}>
    <circle cx="12" cy="12" r="7.5" fill="currentColor" />
  </IconBase>
)

export const StatusReviewIcon: React.FC<IconProps> = (props) => (
  <IconBase size="sm" strokeWidth={2} {...props}>
    <polygon points="12 3.5 20.5 12 12 20.5 3.5 12 12 3.5" />
  </IconBase>
)

export const StatusDoneIcon: React.FC<IconProps> = (props) => (
  <IconBase size="sm" strokeWidth={2.2} {...props}>
    <circle cx="12" cy="12" r="8" fill="currentColor" fillOpacity="0.2" />
    <polyline points="16 9 11 14 8 11" />
  </IconBase>
)

export const StatusBlockedIcon: React.FC<IconProps> = (props) => (
  <IconBase size="sm" strokeWidth={2} {...props}>
    <circle cx="12" cy="12" r="7.5" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </IconBase>
)

export const LiveObserverBlip: React.FC<{
  status?: 'active' | 'idle' | 'warning' | 'error'
  label?: string
  className?: string
}> = ({ status = 'active', label, className }) => {
  const colorMap = {
    active: 'bg-status-success text-status-success',
    idle: 'bg-stone text-stone',
    warning: 'bg-status-warning text-status-warning',
    error: 'bg-status-danger text-status-danger'
  }
  const colorClass = colorMap[status]

  return (
    <span className={`relative inline-flex items-center gap-1.5 ${className || ''}`}>
      <span className="relative flex size-2">
        {status === 'active' && (
          <span
            className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 motion-reduce:hidden ${colorClass}`}
          />
        )}
        <span className={`relative inline-flex size-2 rounded-full ${colorClass}`} />
      </span>
      {label && <span className="font-mono text-[10px] text-ash">{label}</span>}
    </span>
  )
}

export const InfoIcon = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <IconBase ref={ref} {...props}>
    <circle cx="12" cy="12" r="9" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </IconBase>
))
InfoIcon.displayName = 'InfoIcon'
