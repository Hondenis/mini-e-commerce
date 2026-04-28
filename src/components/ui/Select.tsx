import { forwardRef, useId, type SelectHTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/utils/cn'

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  children: ReactNode
}

export const Select = forwardRef<HTMLSelectElement, Props>(function Select(
  { label, error, id, className, children, ...rest },
  ref,
) {
  const auto = useId()
  const inputId = id ?? auto
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-[0.68rem] tracking-[0.28em] uppercase text-[var(--color-fg-muted)] font-medium"
        >
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={inputId}
        aria-invalid={Boolean(error) || undefined}
        className={cn(
          'h-11 bg-transparent border-b border-[var(--color-border-strong)]',
          'px-1 text-sm outline-none transition-colors appearance-none cursor-pointer',
          'focus-visible:border-[var(--color-accent)]',
          error && 'border-[var(--color-danger)]',
          className,
        )}
        {...rest}
      >
        {children}
      </select>
      {error && <p className="text-xs text-[var(--color-danger)]">{error}</p>}
    </div>
  )
})
