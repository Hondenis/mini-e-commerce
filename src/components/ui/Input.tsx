import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/utils/cn'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  hint?: string
  error?: string
  leftIcon?: ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, error, leftIcon, id, className, ...rest },
  ref,
) {
  const autoId = useId()
  const inputId = id ?? autoId
  const describedBy = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined

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
      <div
        className={cn(
          'group flex items-center gap-2 border-b border-[var(--color-border-strong)]',
          'focus-within:border-[var(--color-accent)] transition-colors',
          error && 'border-[var(--color-danger)]',
        )}
      >
        {leftIcon && (
          <span aria-hidden className="text-[var(--color-fg-muted)]">
            {leftIcon}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={describedBy}
          className={cn(
            'w-full bg-transparent py-2 text-base outline-none',
            'placeholder:text-[var(--color-fg-muted)] placeholder:opacity-60',
            className,
          )}
          {...rest}
        />
      </div>
      {error ? (
        <p id={`${inputId}-error`} className="text-xs text-[var(--color-danger)]">
          {error}
        </p>
      ) : hint ? (
        <p id={`${inputId}-hint`} className="text-xs text-[var(--color-fg-muted)]">
          {hint}
        </p>
      ) : null}
    </div>
  )
})
