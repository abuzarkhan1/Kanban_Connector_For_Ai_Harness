import { forwardRef } from 'react'
import { IconBase } from '../IconBase'
import type { IconProps } from '../types'

export const TimelineIcon = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <IconBase ref={ref} {...props}>
    <path d="M3 12h4l2.5-6 4 12 2.5-6h5" />
    <circle cx="3" cy="12" r="1.2" fill="currentColor" />
    <circle cx="21" cy="12" r="1.2" fill="currentColor" />
  </IconBase>
))
TimelineIcon.displayName = 'TimelineIcon'

export const McpPlugIcon = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <IconBase ref={ref} {...props}>
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83" />
    <rect x="7" y="7" width="10" height="10" rx="2" fill="currentColor" fillOpacity="0.15" />
    <line x1="10" y1="11" x2="10" y2="13" />
    <line x1="14" y1="11" x2="14" y2="13" />
  </IconBase>
))
McpPlugIcon.displayName = 'McpPlugIcon'

export const DiagnosticsIcon = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <IconBase ref={ref} {...props}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M8 12h2.5l1.5-3 2 6 1.5-3H16" strokeWidth={1.5} />
  </IconBase>
))
DiagnosticsIcon.displayName = 'DiagnosticsIcon'
