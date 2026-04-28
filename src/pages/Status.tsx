import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'

export function ForbiddenPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center gap-4">
      <p className="font-mono text-[10px] tracking-[0.4em] uppercase text-[var(--color-fg-muted)]">
        Erro · 403
      </p>
      <h1 className="font-display text-6xl md:text-8xl leading-none">
        Sem <em className="italic text-[var(--color-accent)]">passagem</em>.
      </h1>
      <p className="text-sm text-[var(--color-fg-muted)] max-w-md">
        Esta seção é restrita ao seu perfil. Volte ao catálogo ou faça login com outra conta.
      </p>
      <div className="flex gap-3 mt-2">
        <Link to="/">
          <Button variant="secondary">Catálogo</Button>
        </Link>
        <Link to="/login">
          <Button>Trocar conta</Button>
        </Link>
      </div>
    </div>
  )
}

export function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center gap-4">
      <p className="font-mono text-[10px] tracking-[0.4em] uppercase text-[var(--color-fg-muted)]">
        Erro · 404
      </p>
      <h1 className="font-display text-6xl md:text-8xl leading-none">Página perdida</h1>
      <p className="text-sm text-[var(--color-fg-muted)] max-w-md">
        O endereço que você procura não existe ou foi movido.
      </p>
      <Link to="/" className="mt-2">
        <Button>Voltar ao início</Button>
      </Link>
    </div>
  )
}
