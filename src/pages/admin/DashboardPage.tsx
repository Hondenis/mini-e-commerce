import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Package2, Users2 } from 'lucide-react'
import { useProductsStore } from '@/store/products.store'
import { useUsersStore } from '@/store/user.store'

export function DashboardPage() {
  const products = useProductsStore()
  const users = useUsersStore()

  useEffect(() => {
    void products.load()
    void users.load()
  }, [products, users])

  return (
    <div className="space-y-12">
      <header className="flex flex-col gap-3">
        <p className="font-mono text-[10px] tracking-[0.4em] uppercase text-[var(--color-fg-muted)]">
          Painel · Administração
        </p>
        <h1 className="font-display text-5xl md:text-7xl leading-[1.05]">
          Inventário do <em className="italic text-[var(--color-accent)]">gabinete</em>.
        </h1>
        <p className="text-sm text-[var(--color-fg-muted)] max-w-xl">
          Gerencie peças e clientes da boutique. Mudanças são persistidas em localStorage
          (a Fakestore API é somente leitura).
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-4">
        <StatCard
          to="/admin/products"
          label="Produtos no acervo"
          value={products.items.length}
          icon={<Package2 size={20} />}
          loading={products.status !== 'ready'}
        />
        <StatCard
          to="/admin/users"
          label="Clientes cadastrados"
          value={users.items.length}
          icon={<Users2 size={20} />}
          loading={users.status !== 'ready'}
        />
      </div>
    </div>
  )
}

function StatCard({
  to,
  label,
  value,
  icon,
  loading,
}: {
  to: string
  label: string
  value: number
  icon: React.ReactNode
  loading: boolean
}) {
  return (
    <Link
      to={to}
      className="group relative p-8 hairline overflow-hidden hover:border-[var(--color-fg)] transition-colors"
    >
      <div className="absolute -right-8 -bottom-8 size-44 rounded-full border border-[var(--color-border)] group-hover:border-[var(--color-accent)] transition-colors" />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="font-mono text-[10px] tracking-[0.32em] uppercase text-[var(--color-fg-muted)]">
            {label}
          </p>
          <p className="mt-3 font-display text-7xl tabular-nums">
            {loading ? '—' : value}
          </p>
        </div>
        <span className="text-[var(--color-fg-muted)] group-hover:text-[var(--color-accent)] transition-colors">
          {icon}
        </span>
      </div>
      <div className="relative mt-6 inline-flex items-center gap-1 text-[0.7rem] tracking-[0.28em] uppercase">
        Gerenciar <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
      </div>
    </Link>
  )
}
