import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/utils/cn'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'link'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  fullWidth?: boolean
}

const variants: Record<Variant, string> = {
  primary:
    'bg-[var(--color-ink-800)] text-[var(--color-cream-50)] hover:bg-[var(--color-ink-600)] dark:bg-[var(--color-cream-100)] dark:text-[var(--color-ink-900)] dark:hover:bg-white',
  secondary:
    'bg-transparent text-[var(--color-fg)] border border-[var(--color-border-strong)] hover:bg-[var(--color-bg-muted)]',
  ghost:
    'bg-transparent text-[var(--color-fg)] hover:bg-[var(--color-bg-muted)]',
  danger:
    'bg-[var(--color-danger)] text-white hover:brightness-110',
  link:
    'bg-transparent text-[var(--color-fg)] underline underline-offset-4 decoration-[var(--color-fg-muted)] hover:decoration-[var(--color-accent)] px-0',
}

const sizes: Record<Size, string> = {
  sm: 'h-9 px-3 text-xs tracking-[0.18em] uppercase',
  md: 'h-11 px-5 text-[0.78rem] tracking-[0.22em] uppercase',
  lg: 'h-14 px-7 text-sm tracking-[0.28em] uppercase',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'md',
    className,
    loading,
    disabled,
    leftIcon,
    rightIcon,
    fullWidth,
    children,
    ...rest
  },
  ref,
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        'relative inline-flex items-center justify-center gap-2 font-sans font-medium',
        'transition-[transform,background-color,color,box-shadow] duration-200 ease-out',
        'active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100',
        'rounded-[2px] cursor-pointer',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className,
      )}
      {...rest}
    >
      {loading ? (
        <span
          aria-hidden
          className="size-3.5 rounded-full border-2 border-current border-r-transparent animate-spin"
        />
      ) : leftIcon ? (
        <span aria-hidden className="shrink-0">{leftIcon}</span>
      ) : null}
      <span>{children}</span>
      {rightIcon && !loading ? (
        <span aria-hidden className="shrink-0">{rightIcon}</span>
      ) : null}
    </button>
  )
})
