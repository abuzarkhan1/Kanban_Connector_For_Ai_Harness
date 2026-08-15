import { forwardRef } from 'react'
import { IconBase } from '../IconBase'
import type { IconProps } from '../types'

export const KanbanIcon = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <IconBase ref={ref} {...props}>
    <rect x="3" y="3" width="5.5" height="18" rx="1.5" />
    <rect x="11" y="3" width="5.5" height="12" rx="1.5" fill="currentColor" fillOpacity="0.15" />
    <rect x="18.5" y="3" width="2.5" height="18" rx="1" />
    <line x1="4.5" y1="7" x2="7" y2="7" />
    <line x1="12.5" y1="7" x2="15" y2="7" />
  </IconBase>
))
KanbanIcon.displayName = 'KanbanIcon'
