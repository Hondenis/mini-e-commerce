import type { ReactNode } from 'react'

interface Props {
  title: string
  description?: string
  icon?: ReactNode
  action?: ReactNode
}

export function EmptyState({ title, description, icon, action }: Props) {
  return (
    <div className="flex flex-col items-center justify-center text-center gap-3 py-16">
      {icon && <div className="text-[var(--color-fg-muted)]">{icon}</div>}
      <h3 className="text-2xl">{title}</h3>
      {description && (
        <p className="text-sm text-[var(--color-fg-muted)] max-w-sm">{description}</p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}

interface ErrorProps {
  title?: string
  message: string
  onRetry?: () => void
}

export function ErrorState({ title = 'Algo deu errado', message, onRetry }: ErrorProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center text-center gap-3 py-16"
    >
      <h3 className="text-2xl text-[var(--color-danger)]">{title}</h3>
      <p className="text-sm text-[var(--color-fg-muted)] max-w-sm">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 text-xs tracking-[0.28em] uppercase underline underline-offset-4 cursor-pointer hover:text-[var(--color-accent)]"
        >
          Tentar novamente
        </button>
      )}
    </div>
  )
}

export function Spinner({ size = 18 }: { size?: number }) {
  return (
    <span
      aria-label="Carregando"
      role="status"
      className="inline-block rounded-full border-2 border-current border-r-transparent animate-spin"
      style={{ width: size, height: size }}
    />
  )
}
