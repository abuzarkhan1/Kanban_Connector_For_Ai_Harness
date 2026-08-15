import { forwardRef } from 'react'
import { IconBase } from '../IconBase'
import type { IconProps } from '../types'

export const DashboardIcon = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <IconBase ref={ref} {...props}>
    <rect x="3" y="3" width="7.5" height="8" rx="1.5" />
    <rect x="13.5" y="3" width="7.5" height="12" rx="1.5" />
    <rect x="3" y="13.5" width="7.5" height="7.5" rx="1.5" />
    <rect x="13.5" y="17.5" width="7.5" height="3.5" rx="1.5" fill="currentColor" fillOpacity="0.2" />
    <path d="M5.5 7h2.5M16 7h2.5" strokeWidth={1.5} />
  </IconBase>
))
DashboardIcon.displayName = 'DashboardIcon'
