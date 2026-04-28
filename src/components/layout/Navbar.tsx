import { Link, NavLink, useNavigate } from 'react-router-dom'
import { CircleUser, LogOut, Menu, ShoppingBag, User2, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useAuthStore } from '@/store/auth.store'
import { useCartStore } from '@/store/cart.store'
import { ThemeToggle } from './ThemeToggle'
import { cn } from '@/utils/cn'

export function Navbar() {
  const { user, logout } = useAuthStore()
  const cartCount = useCartStore((s) => s.lines.reduce((acc, l) => acc + l.quantity, 0))
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    setOpen(false)
  }, [user?.id])

  const isAdmin = user?.role === 'admin'

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-[color-mix(in_oklab,var(--color-bg)_88%,transparent)] border-b border-[var(--color-border)]">
      <div className="container-page flex items-center justify-between h-16 md:h-20">
        <Link
          to="/"
          className="flex items-end gap-1 group"
          aria-label="HS-Store — página inicial"
        >
          <span className="font-display text-2xl md:text-3xl tracking-tight transition-colors group-hover:text-[var(--color-accent)]">
            HS-Store
          </span>
          <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[var(--color-fg-muted)] mb-1.5">
            ’26
          </span>
        </Link>

        <nav
          aria-label="Principal"
          className="hidden md:flex items-center gap-8 text-[0.72rem] tracking-[0.28em] uppercase font-medium"
        >
          <NavLinkItem to="/">Catálogo</NavLinkItem>
          {!isAdmin && <NavLinkItem to="/cart">Carrinho</NavLinkItem>}
          {isAdmin && (
            <>
              <NavLinkItem to="/admin">Painel</NavLinkItem>
              <NavLinkItem to="/admin/products">Produtos</NavLinkItem>
              <NavLinkItem to="/admin/users">Usuários</NavLinkItem>
            </>
          )}
        </nav>

        <div className="flex items-center gap-2 md:gap-3">
          <ThemeToggle />
          {!isAdmin && (
            <Link
              to="/cart"
              aria-label={`Carrinho (${cartCount} ${cartCount === 1 ? 'item' : 'itens'})`}
              className="relative inline-flex size-9 items-center justify-center rounded-full hairline hover:bg-[var(--color-bg-muted)] transition-colors"
            >
              <ShoppingBag size={16} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-[var(--color-accent)] text-[var(--color-accent-fg)] text-[9px] font-mono font-medium flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          )}
          {user ? (
            <div className="hidden md:flex items-center gap-2 pl-3 ml-1 border-l border-[var(--color-border)] text-xs">
              <User2 size={14} className="text-[var(--color-fg-muted)]" />
              <span className="font-mono">
                {user.username}
                <span className="text-[var(--color-fg-muted)]"> · {user.role}</span>
              </span>
              <button
                onClick={() => {
                  logout()
                  navigate('/', { replace: true })
                }}
                aria-label="Sair"
                className="ml-1 p-1.5 rounded-full hover:bg-[var(--color-bg-muted)] cursor-pointer"
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              aria-label="Entrar"
              title="Entrar"
              className="inline-flex size-9 items-center justify-center rounded-full hairline hover:bg-[var(--color-bg-muted)] transition-colors"
            >
              <CircleUser size={18} />
            </Link>
          )}
          <button
            className="md:hidden inline-flex size-9 items-center justify-center rounded-full hairline cursor-pointer"
            aria-label="Abrir menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {/* mobile menu */}
      <div
        className={cn(
          'md:hidden overflow-hidden border-t border-[var(--color-border)] transition-[max-height] duration-300 ease-out',
          open ? 'max-h-96' : 'max-h-0',
        )}
      >
        <nav
          aria-label="Mobile"
          className="container-page flex flex-col gap-4 py-5 text-sm tracking-[0.2em] uppercase"
        >
          <MobileLink to="/" onClick={() => setOpen(false)}>Catálogo</MobileLink>
          {!isAdmin && (
            <MobileLink to="/cart" onClick={() => setOpen(false)}>Carrinho</MobileLink>
          )}
          {isAdmin && (
            <>
              <MobileLink to="/admin" onClick={() => setOpen(false)}>Painel</MobileLink>
              <MobileLink to="/admin/products" onClick={() => setOpen(false)}>Produtos</MobileLink>
              <MobileLink to="/admin/users" onClick={() => setOpen(false)}>Usuários</MobileLink>
            </>
          )}
          <div className="pt-4 mt-2 border-t border-[var(--color-border)] flex items-center justify-between text-xs">
            {user ? (
              <>
                <span className="font-mono normal-case">
                  {user.username} · {user.role}
                </span>
                <button
                  onClick={() => {
                    logout()
                    setOpen(false)
                    navigate('/', { replace: true })
                  }}
                  className="underline underline-offset-4 cursor-pointer"
                >
                  Sair
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                aria-label="Entrar"
                className="inline-flex items-center gap-2 underline underline-offset-4"
              >
                <CircleUser size={16} />
                Entrar
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  )
}

function NavLinkItem({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <NavLink
      to={to}
      end={to === '/'}
      className={({ isActive }) =>
        cn(
          'relative py-1 transition-colors hover:text-[var(--color-accent)]',
          isActive
            ? 'text-[var(--color-fg)] after:content-[""] after:absolute after:left-0 after:right-0 after:-bottom-1 after:h-px after:bg-[var(--color-accent)]'
            : 'text-[var(--color-fg-muted)]',
        )
      }
    >
      {children}
    </NavLink>
  )
}

function MobileLink({
  to,
  children,
  onClick,
}: {
  to: string
  children: React.ReactNode
  onClick?: () => void
}) {
  return (
    <NavLink
      to={to}
      end={to === '/'}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          'py-1 transition-colors',
          isActive ? 'text-[var(--color-fg)]' : 'text-[var(--color-fg-muted)]',
        )
      }
    >
      {children}
    </NavLink>
  )
}
