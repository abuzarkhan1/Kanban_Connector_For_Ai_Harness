import { forwardRef } from 'react'
import { IconBase } from '../IconBase'
import type { IconProps } from '../types'

export type ChevronDirection = 'up' | 'down' | 'left' | 'right'

export interface ChevronProps extends Omit<IconProps, 'direction'> {
  direction?: ChevronDirection
}

const ROTATION_MAP: Record<ChevronDirection, string> = {
  up: '-rotate-90',
  down: 'rotate-90',
  left: 'rotate-180',
  right: 'rotate-0'
}

export const ChevronIcon = forwardRef<SVGSVGElement, ChevronProps>(
  ({ direction = 'right', className, ...props }, ref) => (
    <IconBase ref={ref} className={`${ROTATION_MAP[direction]} ${className || ''}`} {...props}>
      <polyline points="9 18 15 12 9 6" />
    </IconBase>
  )
)
ChevronIcon.displayName = 'ChevronIcon'

export const ChevronLeftIcon = forwardRef<SVGSVGElement, Omit<IconProps, 'direction'>>((props, ref) => (
  <ChevronIcon ref={ref} direction="left" {...props} />
))
ChevronLeftIcon.displayName = 'ChevronLeftIcon'

export const ChevronRightIcon = forwardRef<SVGSVGElement, Omit<IconProps, 'direction'>>((props, ref) => (
  <ChevronIcon ref={ref} direction="right" {...props} />
))
ChevronRightIcon.displayName = 'ChevronRightIcon'

export const ChevronDownIcon = forwardRef<SVGSVGElement, Omit<IconProps, 'direction'>>((props, ref) => (
  <ChevronIcon ref={ref} direction="down" {...props} />
))
ChevronDownIcon.displayName = 'ChevronDownIcon'

export const ChevronDoubleRightIcon = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <IconBase ref={ref} {...props}>
    <polyline points="7 17 12 12 7 7" />
    <polyline points="13 17 18 12 13 7" />
  </IconBase>
))
ChevronDoubleRightIcon.displayName = 'ChevronDoubleRightIcon'

export const TerminalIcon = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <IconBase ref={ref} {...props}>
    <polyline points="4 17 10 11 4 5" />
    <line x1="12" y1="19" x2="20" y2="19" />
  </IconBase>
))
TerminalIcon.displayName = 'TerminalIcon'

export const FolderIcon = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <IconBase ref={ref} {...props}>
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </IconBase>
))
FolderIcon.displayName = 'FolderIcon'
