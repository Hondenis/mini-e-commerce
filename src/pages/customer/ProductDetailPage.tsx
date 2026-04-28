import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Minus, Plus, ShoppingBag, Star } from 'lucide-react'
import { productsService } from '@/services/productsService'
import type { Product } from '@/types'
import { Button } from '@/components/ui/Button'
import { ErrorState, Spinner } from '@/components/ui/States'
import { useCartStore } from '@/store/cart.store'
import { useToast } from '@/components/ui/Toast'
import { formatPrice } from '@/utils/format'

export function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState<Product | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [qty, setQty] = useState(1)
  const add = useCartStore((s) => s.add)
  const { notify } = useToast()

  useEffect(() => {
    let alive = true
    setLoading(true)
    setError(null)
    productsService
      .get(id ?? '')
      .then((p) => {
        if (!alive) return
        if (!p) {
          setError('Produto não encontrado.')
        } else {
          setProduct(p)
        }
      })
      .catch((e) => alive && setError(e instanceof Error ? e.message : 'Erro desconhecido.'))
      .finally(() => alive && setLoading(false))
    return () => {
      alive = false
    }
  }, [id])

  if (loading) {
    return (
      <div className="flex justify-center py-32">
        <Spinner size={28} />
      </div>
    )
  }
  if (error || !product) {
    return <ErrorState message={error ?? 'Produto não encontrado.'} />
  }

  return (
    <div className="space-y-10">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-xs tracking-[0.28em] uppercase text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
      >
        <ArrowLeft size={14} /> Voltar ao catálogo
      </Link>

      <div className="grid lg:grid-cols-12 gap-8 lg:gap-16">
        <div className="lg:col-span-7 relative bg-[var(--color-bg-muted)] aspect-square md:aspect-[4/5] hairline animate-[rise_.6s_cubic-bezier(.22,1,.36,1)]">
          <img
            src={product.image}
            alt={product.title}
            className="absolute inset-0 size-full object-contain p-12"
          />
        </div>
        <div className="lg:col-span-5 space-y-8 animate-[rise_.7s_cubic-bezier(.22,1,.36,1)]">
          <div>
            <p className="font-mono text-[10px] tracking-[0.4em] uppercase text-[var(--color-fg-muted)]">
              {product.category} · #{String(product.id).slice(0, 8)}
            </p>
            <h1 className="mt-3 font-display text-4xl md:text-5xl leading-[1.05]">
              {product.title}
            </h1>
            {product.rating && (
              <div className="mt-3 flex items-center gap-2 text-xs text-[var(--color-fg-muted)]">
                <Star size={12} className="fill-[var(--color-accent)] text-[var(--color-accent)]" />
                <span className="tabular-nums">{product.rating.rate.toFixed(1)}</span>
                <span>· {product.rating.count} avaliações</span>
              </div>
            )}
          </div>
          <p className="text-sm leading-relaxed text-[var(--color-fg-muted)]">
            {product.description}
          </p>

          <div className="border-t border-[var(--color-border)] pt-6 space-y-6">
            <div className="flex items-baseline justify-between">
              <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-[var(--color-fg-muted)]">
                Preço
              </span>
              <span className="font-display text-4xl tabular-nums">
                {formatPrice(product.price)}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="inline-flex items-center hairline">
                <button
                  type="button"
                  aria-label="Diminuir quantidade"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="size-11 inline-flex items-center justify-center hover:bg-[var(--color-bg-muted)] cursor-pointer"
                >
                  <Minus size={14} />
                </button>
                <span
                  aria-live="polite"
                  className="min-w-10 text-center font-mono text-sm tabular-nums"
                >
                  {qty}
                </span>
                <button
                  type="button"
                  aria-label="Aumentar quantidade"
                  onClick={() => setQty((q) => q + 1)}
                  className="size-11 inline-flex items-center justify-center hover:bg-[var(--color-bg-muted)] cursor-pointer"
                >
                  <Plus size={14} />
                </button>
              </div>
              <Button
                size="lg"
                fullWidth
                leftIcon={<ShoppingBag size={16} />}
                onClick={() => {
                  add(product, qty)
                  notify('Adicionado à carrinho', 'success')
                  navigate('/cart')
                }}
              >
                Adicionar ao carrinho
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
