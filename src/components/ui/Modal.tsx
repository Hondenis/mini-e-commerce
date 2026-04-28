import { useEffect, useRef, type ReactNode } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/utils/cn'

interface Props {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  size?: 'sm' | 'md' | 'lg'
  /** From which side to slide-in. Default: center fade. */
  side?: 'center' | 'right'
}

export function Modal({ open, onClose, title, children, size = 'md', side = 'center' }: Props) {
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const previousActive = document.activeElement as HTMLElement | null
    dialogRef.current?.focus()
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      previousActive?.focus()
    }
  }, [open, onClose])

  if (!open) return null

  const sizes = { sm: 'max-w-md', md: 'max-w-xl', lg: 'max-w-3xl' }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-50 flex"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="absolute inset-0 bg-[var(--color-ink-900)]/40 backdrop-blur-sm animate-[fade-in_.25s_ease-out]" />
      <div
        ref={dialogRef}
        tabIndex={-1}
        className={cn(
          'relative bg-[var(--color-bg-elev)] border border-[var(--color-border)] shadow-[var(--shadow-lift)]',
          'outline-none',
          side === 'right'
            ? 'ml-auto h-full w-full max-w-md flex flex-col animate-[rise_.45s_cubic-bezier(.22,1,.36,1)]'
            : cn(
                'mx-auto my-auto w-[calc(100%-2rem)]',
                sizes[size],
                'animate-[rise_.45s_cubic-bezier(.22,1,.36,1)]',
              ),
        )}
      >
        <div className="flex items-center justify-between p-5 border-b border-[var(--color-border)]">
          {title ? (
            <h2 className="text-xl">{title}</h2>
          ) : (
            <span aria-hidden />
          )}
          <button
            type="button"
            aria-label="Fechar"
            onClick={onClose}
            className="text-[var(--color-fg-muted)] hover:text-[var(--color-fg)] transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>
        <div className={cn('p-5', side === 'right' && 'flex-1 overflow-y-auto')}>{children}</div>
      </div>
    </div>
  )
}
