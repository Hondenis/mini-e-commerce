import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useUsersStore } from '@/store/user.store'
import { usersService } from '@/services/usersService'
import { Button } from '@/components/ui/Button'
import { ErrorState, Spinner } from '@/components/ui/States'
import { Modal } from '@/components/ui/Modal'
import { useToast } from '@/components/ui/Toast'
import type { User } from '@/types'

export function AdminUsersPage() {
  const { items, status, error, load, refresh } = useUsersStore()
  const [toDelete, setToDelete] = useState<User | null>(null)
  const { notify } = useToast()

  useEffect(() => {
    void load()
  }, [load])

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] tracking-[0.4em] uppercase text-[var(--color-fg-muted)]">
            Diretório · Clientes
          </p>
          <h1 className="font-display text-4xl md:text-6xl mt-2">
            {items.length} {items.length === 1 ? 'pessoa' : 'pessoas'}
          </h1>
        </div>
        <Link to="/admin/users/new">
          <Button leftIcon={<Plus size={14} />}>Novo cliente</Button>
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
                <th className="p-4 font-medium">Pessoa</th>
                <th className="p-4 font-medium hidden md:table-cell">Email</th>
                <th className="p-4 font-medium">Perfil</th>
                <th className="p-4 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {items.map((u) => (
                <tr
                  key={String(u.id)}
                  className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-bg-muted)]/50 transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <span
                        aria-hidden
                        className="size-10 rounded-full bg-[var(--color-bg-muted)] flex items-center justify-center font-display text-base"
                      >
                        {u.name.firstname[0]?.toUpperCase()}
                      </span>
                      <div>
                        <p className="font-display text-base">
                          {u.name.firstname} {u.name.lastname}
                        </p>
                        <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-[var(--color-fg-muted)]">
                          {u.username}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 hidden md:table-cell text-[var(--color-fg-muted)]">
                    {u.email}
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-1 text-[10px] tracking-[0.28em] uppercase ${
                        u.role === 'admin'
                          ? 'bg-[var(--color-fg)] text-[var(--color-bg)]'
                          : 'hairline'
                      }`}
                    >
                      <span className="size-1.5 rounded-full bg-current" /> {u.role}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end gap-1">
                      <Link
                        to={`/admin/users/${u.id}`}
                        aria-label={`Editar ${u.username}`}
                        className="size-9 inline-flex items-center justify-center rounded-full hover:bg-[var(--color-bg-muted)]"
                      >
                        <Pencil size={14} />
                      </Link>
                      <button
                        type="button"
                        aria-label={`Excluir ${u.username}`}
                        onClick={() => setToDelete(u)}
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
          Remover
          <span className="text-[var(--color-fg)] font-medium"> {toDelete?.username} </span>
          do diretório?
        </p>
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="secondary" onClick={() => setToDelete(null)}>
            Cancelar
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              if (toDelete) {
                usersService.delete(toDelete.id)
                refresh()
                notify('Cliente removido.', 'success')
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
