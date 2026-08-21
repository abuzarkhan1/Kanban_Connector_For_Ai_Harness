import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'

type CommonProps = {
  children: ReactNode
  className?: string
  withArrow?: boolean
}

type AsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined }

type AsLink = CommonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }

export function PrimaryButton({
  children,
  className,
  withArrow = true,
  href,
  ...props
}: AsButton | AsLink) {
  const classes = cn('btn-primary group', className)
  const content = (
    <>
      {children}
      {withArrow ? (
        <ArrowRight
          className="size-4 shrink-0 transition-transform duration-200 ease group-hover:translate-x-1"
          strokeWidth={1.75}
        />
      ) : null}
    </>
  )

  if (href) {
    return (
      <a href={href} className={classes} {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {content}
      </a>
    )
  }

  return (
    <button type="button" className={classes} {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {content}
    </button>
  )
}

export function DarkButton({
  children,
  className,
  href,
  ...props
}: AsButton | AsLink) {
  const classes = cn('btn-dark', className)

  if (href) {
    return (
      <a href={href} className={classes} {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </a>
    )
  }

  return (
    <button type="button" className={classes} {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  )
}

export function PromoChip({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn('promo-chip', className)}>{children}</span>
}
