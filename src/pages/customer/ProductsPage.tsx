import { useEffect, useMemo, useState } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'
import { useProductsStore } from '@/store/products.store'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { ProductCard, ProductCardSkeleton } from '@/components/products/ProductCard'
import { EmptyState, ErrorState } from '@/components/ui/States'
import { cn } from '@/utils/cn'

export function ProductsPage() {
  const { items, categories, status, error, load, refresh } = useProductsStore()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<string | null>(null)
  const debounced = useDebouncedValue(search, 250)

  useEffect(() => {
    void load()
  }, [load])

  const filtered = useMemo(() => {
    return items.filter((p) => {
      if (category && p.category !== category) return false
      if (debounced) {
        const q = debounced.toLowerCase()
        return (
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [items, category, debounced])

  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="grid md:grid-cols-12 gap-6 items-end pt-2">
        <div className="md:col-span-7 space-y-3">
          <p className="font-mono text-[10px] tracking-[0.4em] uppercase text-[var(--color-fg-muted)]">
            Edição · Primavera ’26
          </p>
          <h1 className="font-display text-5xl md:text-7xl xl:text-8xl leading-[0.95]">
            Objetos para
            <br />
            <em className="italic text-[var(--color-accent)]">acompanhar</em> o
            <br /> ritmo do dia.
          </h1>
        </div>
        <p className="md:col-span-4 md:col-start-9 text-sm text-[var(--color-fg-muted)] leading-relaxed max-w-sm">
          A melhor variedade de produtos do mercado você só encontra aqui. Explore nosso catálogo e descubra peças únicas para complementar seu estilo. Compre com segurança e rapidez, e receba tudo no conforto da sua casa.
        </p>
      </section>

      {/* Filters */}
      <section className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[var(--color-border)] pb-4">
          <label className="flex items-center gap-3 flex-1 max-w-md border-b border-transparent rounded-[2px] focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[var(--color-accent)]">
            <Search size={16} className="text-[var(--color-fg-muted)]" aria-hidden="true" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar peças, categorias…"
              className="w-full bg-transparent py-2 text-sm outline-none placeholder:text-[var(--color-fg-muted)]"
              aria-label="Buscar produtos"
            />
          </label>
          <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-[var(--color-fg-muted)] flex items-center gap-2">
            <SlidersHorizontal size={12} />
            {filtered.length} {filtered.length === 1 ? 'peça' : 'peças'}
          </p>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
          <CategoryChip active={category === null} onClick={() => setCategory(null)}>
            Tudo
          </CategoryChip>
          {categories.map((c) => (
            <CategoryChip key={c} active={category === c} onClick={() => setCategory(c)}>
              {c}
            </CategoryChip>
          ))}
        </div>
      </section>

      {/* Grid */}
      <section>
        {status === 'error' ? (
          <ErrorState message={error ?? 'Erro desconhecido.'} onRetry={refresh} />
        ) : status !== 'ready' ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            title="Nenhuma peça encontrada"
            description="Tente outra busca ou limpe o filtro."
          />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
            {filtered.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

function CategoryChip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  const label = typeof children === 'string' ? children : undefined
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={label ? `Filtrar por ${label}` : undefined}
      className={cn(
        'shrink-0 px-4 h-9 text-[0.7rem] tracking-[0.28em] uppercase transition-colors cursor-pointer',
        active
          ? 'bg-[var(--color-fg)] text-[var(--color-bg)]'
          : 'border border-[var(--color-border)] hover:border-[var(--color-fg)]',
      )}
    >
      {children}
    </button>
  )
}
