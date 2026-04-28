import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react'
import { cn } from '@/utils/cn'

type ToastVariant = 'success' | 'error' | 'info'

interface Toast {
  id: string
  message: string
  variant: ToastVariant
}

interface ToastContextValue {
  notify: (message: string, variant?: ToastVariant) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const remove = useCallback(
    (id: string) => setToasts((curr) => curr.filter((t) => t.id !== id)),
    [],
  )

  const notify = useCallback(
    (message: string, variant: ToastVariant = 'info') => {
      const id = crypto.randomUUID()
      setToasts((curr) => [...curr, { id, message, variant }])
      setTimeout(() => remove(id), 4000)
    },
    [remove],
  )

  const value = useMemo(() => ({ notify }), [notify])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="pointer-events-none fixed top-4 right-4 z-[60] flex flex-col gap-2 max-w-sm w-[calc(100%-2rem)]"
      >
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onClose={() => remove(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  const Icon =
    toast.variant === 'success'
      ? CheckCircle2
      : toast.variant === 'error'
        ? AlertTriangle
        : Info

  useEffect(() => {
    /* enter animation handled by class */
  }, [])

  return (
    <div
      role={toast.variant === 'error' ? 'alert' : 'status'}
      className={cn(
        'pointer-events-auto flex items-start gap-3 p-4 border bg-[var(--color-bg-elev)] shadow-[var(--shadow-lift)]',
        'animate-[rise_.4s_cubic-bezier(.22,1,.36,1)]',
        toast.variant === 'success' && 'border-emerald-700/40',
        toast.variant === 'error' && 'border-[var(--color-danger)]',
        toast.variant === 'info' && 'border-[var(--color-border-strong)]',
      )}
    >
      <Icon
        size={18}
        className={cn(
          'mt-0.5 shrink-0',
          toast.variant === 'success' && 'text-emerald-600',
          toast.variant === 'error' && 'text-[var(--color-danger)]',
          toast.variant === 'info' && 'text-[var(--color-fg)]',
        )}
      />
      <p className="text-sm flex-1">{toast.message}</p>
      <button
        aria-label="Fechar"
        onClick={onClose}
        className="text-[var(--color-fg-muted)] hover:text-[var(--color-fg)] transition-colors cursor-pointer"
      >
        <X size={16} />
      </button>
    </div>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast deve ser usado dentro de <ToastProvider>')
  return ctx
}
