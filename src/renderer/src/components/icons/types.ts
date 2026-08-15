import type { SVGProps } from 'react'

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number

export type IconAnimation =
  | 'none'
  | 'spin'
  | 'pulse'
  | 'pulse-slow'
  | 'ping'
  | 'bounce'
  | 'hover-scale'
  | 'hover-rotate'
  | 'hover-nudge'

export interface IconProps extends SVGProps<SVGSVGElement> {
  /** Size token or raw pixel dimension (default 'md' = 16px) */
  size?: IconSize
  /** Custom stroke width (defaults to 1.75 for crisp hairline rendering) */
  strokeWidth?: number
  /** Micro-animation variant */
  animate?: IconAnimation
  /** Accessible title for screen readers / hover tooltips */
  title?: string
  /** Active / highlighted state for interactive icons */
  active?: boolean
  className?: string
}

export const ICON_SIZES: Record<'xs' | 'sm' | 'md' | 'lg' | 'xl', number> = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 20,
  xl: 24
}
