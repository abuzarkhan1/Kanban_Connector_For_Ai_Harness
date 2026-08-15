import { forwardRef } from 'react'
import { IconBase } from '../IconBase'
import type { IconProps } from '../types'

export const AgentIcon = forwardRef<SVGSVGElement, IconProps>(({ active, ...props }, ref) => (
  <IconBase ref={ref} {...props}>
    <rect x="3.5" y="6" width="17" height="14" rx="3" />
    <line x1="12" y1="6" x2="12" y2="2" />
    <circle cx="12" cy="2" r="1.5" fill={active ? 'currentColor' : 'none'} />
    <circle cx="8.5" cy="12.5" r="1.5" fill="currentColor" />
    <circle cx="15.5" cy="12.5" r="1.5" fill="currentColor" />
    <path d="M8.5 16.5h7" strokeWidth={1.5} />
  </IconBase>
))
AgentIcon.displayName = 'AgentIcon'
