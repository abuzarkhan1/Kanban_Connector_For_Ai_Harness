import { forwardRef } from 'react'
import { IconBase } from '../IconBase'
import type { IconProps } from '../types'

export const SearchIcon = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <IconBase ref={ref} {...props}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20.5 20.5-4.5-4.5" />
  </IconBase>
))
SearchIcon.displayName = 'SearchIcon'

export const FilterIcon = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <IconBase ref={ref} {...props}>
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </IconBase>
))
FilterIcon.displayName = 'FilterIcon'

export const RefreshIcon = forwardRef<SVGSVGElement, IconProps>(({ animate = 'hover-rotate', ...props }, ref) => (
  <IconBase ref={ref} animate={animate} {...props}>
    <path d="M21.5 2v6h-6M21.34 15.57a9 9 0 1 1-.57-8.38l.67-.79" />
  </IconBase>
))
RefreshIcon.displayName = 'RefreshIcon'

export const EditIcon = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <IconBase ref={ref} {...props}>
    <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
  </IconBase>
))
EditIcon.displayName = 'EditIcon'

export const CloseIcon = forwardRef<SVGSVGElement, IconProps>(({ animate = 'hover-scale', ...props }, ref) => (
  <IconBase ref={ref} animate={animate} {...props}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </IconBase>
))
CloseIcon.displayName = 'CloseIcon'

export const SortIcon = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <IconBase ref={ref} {...props}>
    <path d="m7 15 5 5 5-5M7 9l5-5 5 5" />
  </IconBase>
))
SortIcon.displayName = 'SortIcon'

export const CopyIcon = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <IconBase ref={ref} {...props}>
    <rect x="9" y="9" width="13" height="13" rx="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </IconBase>
))
CopyIcon.displayName = 'CopyIcon'

export const ArrowRightIcon = forwardRef<SVGSVGElement, IconProps>(({ animate = 'hover-nudge', ...props }, ref) => (
  <IconBase ref={ref} animate={animate} {...props}>
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </IconBase>
))
ArrowRightIcon.displayName = 'ArrowRightIcon'
