import React, { forwardRef } from 'react'
import { ICON_SIZES, type IconProps } from './types'

const ANIMATION_CLASSES: Record<string, string> = {
  none: '',
  spin: 'animate-spin motion-reduce:animate-none',
  pulse: 'animate-pulse motion-reduce:animate-none',
  'pulse-slow': 'animate-[pulse_3s_cubic-bezier(0.4,0,0.6,1)_infinite] motion-reduce:animate-none',
  ping: 'animate-ping motion-reduce:animate-none',
  bounce: 'animate-bounce motion-reduce:animate-none',
  'hover-scale': 'transition-transform duration-150 ease-out group-hover:scale-110 hover:scale-110 active:scale-95',
  'hover-rotate': 'transition-transform duration-200 ease-out group-hover:rotate-45 hover:rotate-45',
  'hover-nudge': 'transition-transform duration-150 ease-out group-hover:translate-x-0.5 hover:translate-x-0.5'
}

export const IconBase = forwardRef<SVGSVGElement, IconProps & { children: React.ReactNode }>(
  (
    {
      size = 'md',
      strokeWidth = 1.75,
      animate = 'none',
      title,
      active = false,
      className,
      children,
      viewBox = '0 0 24 24',
      ...rest
    },
    ref
  ) => {
    const dimension = typeof size === 'number' ? size : ICON_SIZES[size] || 16
    const hasAriaLabel = Boolean(rest['aria-label'] || rest['aria-labelledby'])
    const isAriaHidden = rest['aria-hidden'] ?? (title || hasAriaLabel ? undefined : true)

    return (
      <svg
        ref={ref}
        width={dimension}
        height={dimension}
        viewBox={viewBox}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        role={title || hasAriaLabel ? 'img' : undefined}
        aria-hidden={isAriaHidden}
        className={`inline-block shrink-0 align-middle transition-colors duration-150 ${
          ANIMATION_CLASSES[animate] || ''
        } ${active ? 'text-ink drop-shadow-[0_0_8px_rgba(255,255,255,0.25)]' : ''} ${className || ''}`}
        {...rest}
      >
        {title && <title>{title}</title>}
        {children}
      </svg>
    )
  }
)

IconBase.displayName = 'IconBase'
