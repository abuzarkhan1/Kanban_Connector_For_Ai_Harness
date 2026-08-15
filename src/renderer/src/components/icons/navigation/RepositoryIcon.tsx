import { forwardRef } from 'react'
import { IconBase } from '../IconBase'
import type { IconProps } from '../types'

export const RepositoryIcon = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <IconBase ref={ref} {...props}>
    <line x1="6" y1="3" x2="6" y2="15" />
    <circle cx="18" cy="6" r="3" fill="currentColor" fillOpacity="0.2" />
    <circle cx="6" cy="18" r="3" fill="currentColor" fillOpacity="0.2" />
    <path d="M18 9a9 9 0 0 1-9 9" />
  </IconBase>
))
RepositoryIcon.displayName = 'RepositoryIcon'

export const WorktreeIcon = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <IconBase ref={ref} {...props}>
    <circle cx="5" cy="6" r="2.5" />
    <circle cx="5" cy="18" r="2.5" />
    <circle cx="19" cy="6" r="2.5" />
    <circle cx="19" cy="18" r="2.5" />
    <line x1="5" y1="8.5" x2="5" y2="15.5" />
    <line x1="19" y1="8.5" x2="19" y2="15.5" />
    <path d="M5 12h14" />
  </IconBase>
))
WorktreeIcon.displayName = 'WorktreeIcon'
