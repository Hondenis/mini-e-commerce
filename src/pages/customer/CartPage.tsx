import { useEffect, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, LogIn, Minus, Plus, Trash2 } from 'lucide-react'
import { useCartStore } from '@/store/cart.store'
import { useProductsStore } from '@/store/products.store'
import { useAuthStore } from '@/store/auth.store'
import { Button } from '@/components/ui/Button'
import { EmptyState, ErrorState, Spinner } from '@/components/ui/States'
import { formatPrice } from '@/utils/format'
import { useToast } from '@/components/ui/Toast'
import type { Product } from '@/types'

export function CartPage() {
  const { lines, setQuantity, remove, clear } = useCartStore()
  const { items, status, load, error, refresh } = useProductsStore()
  const user = useAuthStore((s) => s.user)
  const navigate = useNavigate()
  const { notify } = useToast()

  useEffect(() => {
    void load()
  }, [load])

  const detailed = useMemo(() => {
    const map = new Map(items.map((p) => [String(p.id), p]))
    return lines
      .map((l) => {
        const product = map.get(String(l.productId))
        return product ? { line: l, product } : null
      })
      .filter(Boolean) as { line: typeof lines[number]; product: Product }[]
  }, [items, lines])

  const subtotal = detailed.reduce((s, { line, product }) => s + product.price * line.quantity, 0)
  const shipping = subtotal === 0 ? 0 : subtotal > 100 ? 0 : 9.9
  const total = subtotal + shipping

  if (status === 'loading' || status === 'idle') {
    return (
      <div className="flex justify-center py-32">
        <Spinner size={28} />
      </div>
    )
  }
  if (status === 'error') {
    return <ErrorState message={error ?? 'Erro ao carregar produtos.'} onRetry={refresh} />
  }
  if (detailed.length === 0) {
    return (
      <EmptyState
        title="Seu carrinho está vazio"
        description="Volte ao catálogo e selecione algumas peças que falem com você."
        action={
          <Link to="/">
            <Button>Explorar catálogo</Button>
          </Link>
        }
      />
    )
  }

  function handleCheckout() {
    if (!user) {
      notify('Entre na sua conta para finalizar a compra.', 'info')
      navigate('/login', { state: { from: '/cart' } })
      return
    }
    if (user.role !== 'customer') {
      notify('Apenas clientes podem finalizar compras.', 'error')
      return
    }
    clear()
    notify('Pedido confirmado.', 'success')
    navigate('/checkout/success')
  }

  return (
    <div className="space-y-10">
      <header className="flex items-end justify-between border-b border-[var(--color-border)] pb-6">
        <div>
          <p className="font-mono text-[10px] tracking-[0.4em] uppercase text-[var(--color-fg-muted)]">
            Seu carrinho
          </p>
          <h1 className="font-display text-5xl md:text-6xl mt-2">
            {detailed.length} {detailed.length === 1 ? 'peça' : 'peças'}
          </h1>
        </div>
        <button
          onClick={() => clear()}
          className="text-xs tracking-[0.28em] uppercase text-[var(--color-fg-muted)] hover:text-[var(--color-danger)] underline underline-offset-4 cursor-pointer"
        >
          Esvaziar
        </button>
      </header>

      <div className="grid lg:grid-cols-12 gap-10">
        <ul className="lg:col-span-8 divide-y divide-[var(--color-border)]">
          {detailed.map(({ line, product }, i) => (
            <li
              key={String(product.id)}
              className="grid grid-cols-[88px_1fr] md:grid-cols-[120px_1fr_auto] gap-5 py-6 animate-[rise_.5s_cubic-bezier(.22,1,.36,1)_both]"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <Link
                to={`/products/${product.id}`}
                className="bg-[var(--color-bg-muted)] hairline aspect-square flex items-center justify-center"
              >
                <img
                  src={product.image}
                  alt={product.title}
                  className="size-full object-contain p-3"
                />
              </Link>
              <div className="min-w-0 flex flex-col justify-between">
                <div>
                  <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-[var(--color-fg-muted)]">
                    {product.category}
                  </p>
                  <Link
                    to={`/products/${product.id}`}
                    className="font-display text-lg leading-snug hover:text-[var(--color-accent)] transition-colors line-clamp-2"
                  >
                    {product.title}
                  </Link>
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <div className="inline-flex items-center hairline">
                    <button
                      type="button"
                      aria-label="Diminuir"
                      onClick={() => setQuantity(product.id, line.quantity - 1)}
                      className="size-9 inline-flex items-center justify-center hover:bg-[var(--color-bg-muted)] cursor-pointer"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="min-w-8 text-center font-mono text-xs">
                      {line.quantity}
                    </span>
                    <button
                      type="button"
                      aria-label="Aumentar"
                      onClick={() => setQuantity(product.id, line.quantity + 1)}
                      className="size-9 inline-flex items-center justify-center hover:bg-[var(--color-bg-muted)] cursor-pointer"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(product.id)}
                    aria-label={`Remover ${product.title}`}
                    className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.28em] uppercase text-[var(--color-fg-muted)] hover:text-[var(--color-danger)] cursor-pointer"
                  >
                    <Trash2 size={12} />
                    Remover
                  </button>
                </div>
              </div>
              <div className="md:text-right">
                <span className="font-display text-lg tabular-nums">
                  {formatPrice(product.price * line.quantity)}
                </span>
                <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-[var(--color-fg-muted)] mt-1">
                  {formatPrice(product.price)} · un
                </p>
              </div>
            </li>
          ))}
        </ul>

        <aside className="lg:col-span-4 lg:sticky lg:top-28 self-start space-y-6 p-6 hairline">
          <h2 className="font-display text-2xl">Resumo</h2>
          <dl className="space-y-3 text-sm">
            <Row label="Subtotal" value={formatPrice(subtotal)} />
            <Row
              label="Frete"
              value={shipping === 0 ? 'Grátis' : formatPrice(shipping)}
              hint={subtotal > 100 ? undefined : 'Frete grátis acima de USD 100'}
            />
            <div className="border-t border-[var(--color-border)] pt-3">
              <Row label="Total" value={formatPrice(total)} emphasized />
            </div>
          </dl>
          <Button
            size="lg"
            fullWidth
            onClick={handleCheckout}
            rightIcon={user ? <ArrowRight size={16} /> : <LogIn size={16} />}
          >
            {user ? 'Finalizar compra' : 'Entrar para finalizar'}
          </Button>
          {!user && (
            <p className="text-xs text-[var(--color-fg-muted)] leading-relaxed">
              Você pode montar o carrinho como visitante, mas é preciso{' '}
              <Link
                to="/login"
                state={{ from: '/cart' }}
                className="underline underline-offset-4 text-[var(--color-fg)]"
              >
                entrar
              </Link>{' '}
              para concluir a compra.
            </p>
          )}
          <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-[var(--color-fg-muted)]">
            Pagamento simulado · Demo técnica
          </p>
        </aside>
      </div>
    </div>
  )
}

function Row({
  label,
  value,
  hint,
  emphasized,
}: {
  label: string
  value: string
  hint?: string
  emphasized?: boolean
}) {
  return (
    <div className="flex justify-between items-baseline gap-3">
      <dt
        className={
          emphasized
            ? 'font-display text-lg'
            : 'text-[10px] tracking-[0.3em] uppercase text-[var(--color-fg-muted)]'
        }
      >
        {label}
        {hint && (
          <span className="block font-sans tracking-normal text-[11px] normal-case mt-1 text-[var(--color-fg-muted)]/80">
            {hint}
          </span>
        )}
      </dt>
      <dd className={emphasized ? 'font-display text-3xl tabular-nums' : 'tabular-nums'}>
        {value}
      </dd>
    </div>
  )
}
