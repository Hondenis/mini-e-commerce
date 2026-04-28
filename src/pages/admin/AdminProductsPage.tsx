import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useProductsStore } from '@/store/products.store'
import { productsService } from '@/services/productsService'
import { Button } from '@/components/ui/Button'
import { ErrorState, Spinner } from '@/components/ui/States'
import { Modal } from '@/components/ui/Modal'
import { useToast } from '@/components/ui/Toast'
import { formatPrice } from '@/utils/format'
import type { Product } from '@/types'

export function AdminProductsPage() {
  const { items, status, error, load, refresh } = useProductsStore()
  const [toDelete, setToDelete] = useState<Product | null>(null)
  const { notify } = useToast()

  useEffect(() => {
    void load()
  }, [load])

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] tracking-[0.4em] uppercase text-[var(--color-fg-muted)]">
            Acervo · Produtos
          </p>
          <h1 className="font-display text-4xl md:text-6xl mt-2">
            {items.length} {items.length === 1 ? 'peça' : 'peças'}
          </h1>
        </div>
        <Link to="/admin/products/new">
          <Button leftIcon={<Plus size={14} />}>Nova peça</Button>
        </Link>
      </header>

      {status === 'error' ? (
        <ErrorState message={error ?? 'Erro desconhecido.'} onRetry={refresh} />
      ) : status !== 'ready' ? (
        <div className="flex justify-center py-20">
          <Spinner size={24} />
        </div>
      ) : (
        <div className="overflow-x-auto hairline">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] tracking-[0.3em] uppercase text-[var(--color-fg-muted)] border-b border-[var(--color-border)]">
                <th className="p-4 font-medium">Peça</th>
                <th className="p-4 font-medium hidden md:table-cell">Categoria</th>
                <th className="p-4 font-medium text-right">Preço</th>
                <th className="p-4 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr
                  key={String(p.id)}
                  className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-bg-muted)]/50 transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="size-12 shrink-0 bg-[var(--color-bg-muted)] hairline flex items-center justify-center">
                        <img
                          src={p.image}
                          alt={p.title}
                          className="size-full object-contain p-1.5"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-display text-base truncate max-w-xs">
                          {p.title}
                        </p>
                        <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-[var(--color-fg-muted)]">
                          #{String(p.id).slice(0, 10)}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 hidden md:table-cell text-[var(--color-fg-muted)]">
                    {p.category}
                  </td>
                  <td className="p-4 text-right font-mono tabular-nums">
                    {formatPrice(p.price)}
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end gap-1">
                      <Link
                        to={`/admin/products/${encodeURIComponent(String(p.id))}`}
                        aria-label={`Editar ${p.title}`}
                        className="size-9 inline-flex items-center justify-center rounded-full hover:bg-[var(--color-bg-muted)]"
                      >
                        <Pencil size={14} />
                      </Link>
                      <button
                        type="button"
                        aria-label={`Excluir ${p.title}`}
                        onClick={() => setToDelete(p)}
                        className="size-9 inline-flex items-center justify-center rounded-full hover:bg-[var(--color-danger)]/10 hover:text-[var(--color-danger)] cursor-pointer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        title="Confirmar exclusão"
        size="sm"
      >
        <p className="text-sm text-[var(--color-fg-muted)]">
          Excluir definitivamente
          <span className="text-[var(--color-fg)] font-medium"> “{toDelete?.title}” </span>
          do acervo?
        </p>
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="secondary" onClick={() => setToDelete(null)}>
            Cancelar
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              if (toDelete) {
                productsService.delete(toDelete.id)
                refresh()
                notify('Peça excluída.', 'success')
              }
              setToDelete(null)
            }}
          >
            Excluir
          </Button>
        </div>
      </Modal>
    </div>
  )
}
