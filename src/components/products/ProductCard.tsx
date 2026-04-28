import { Link } from 'react-router-dom'
import { ShoppingBag } from 'lucide-react'
import type { Product } from '@/types'
import { formatPrice } from '@/utils/format'
import { useCartStore } from '@/store/cart.store'
import { useToast } from '@/components/ui/Toast'

interface Props {
  product: Product
  index?: number
}

export function ProductCard({ product, index = 0 }: Props) {
  const add = useCartStore((s) => s.add)
  const { notify } = useToast()
  const delay = `${Math.min(index * 60, 480)}ms`

  return (
    <article
      className="group relative flex flex-col animate-[rise_.6s_cubic-bezier(.22,1,.36,1)_both]"
      style={{ animationDelay: delay }}
    >
      <Link
        to={`/products/${product.id}`}
        className="block relative aspect-[4/5] overflow-hidden bg-[var(--color-bg-muted)] hairline"
      >
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          className="absolute inset-0 size-full object-contain p-8 transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
        <span className="absolute top-3 left-3 font-mono text-[9px] tracking-[0.3em] uppercase text-[var(--color-fg-muted)] bg-[var(--color-bg-elev)]/80 px-2 py-1">
          {product.category}
        </span>
        <button
          type="button"
          aria-label={`Adicionar ${product.title} ao Carrinho`}
          onClick={(e) => {
            e.preventDefault()
            add(product, 1)
            notify('Adicionado ao Carrinho', 'success')
          }}
          className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 h-9 bg-[var(--color-ink-800)] text-[var(--color-cream-50)] dark:bg-[var(--color-cream-100)] dark:text-[var(--color-ink-900)] text-[10px] tracking-[0.28em] uppercase translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 focus-visible:translate-y-0 focus-visible:opacity-100 transition-all cursor-pointer"
        >
          <ShoppingBag size={12} />
          Carrinho
        </button>
      </Link>
      <div className="pt-4 flex justify-between items-start gap-4">
        <div className="min-w-0">
          <h3 className="font-display text-base leading-tight line-clamp-2 group-hover:text-[var(--color-accent)] transition-colors">
            {product.title}
          </h3>
          <p className="mt-1 font-mono text-[10px] tracking-[0.3em] uppercase text-[var(--color-fg-muted)]">
            #{String(product.id).slice(0, 8)}
          </p>
        </div>
        <span className="font-display text-lg shrink-0 tabular-nums">
          {formatPrice(product.price)}
        </span>
      </div>
    </article>
  )
}

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col">
      <div className="aspect-[4/5] skeleton" />
      <div className="pt-4 space-y-2">
        <div className="h-4 w-3/4 skeleton" />
        <div className="h-3 w-1/3 skeleton" />
      </div>
    </div>
  )
}
