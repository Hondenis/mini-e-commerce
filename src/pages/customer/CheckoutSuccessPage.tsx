import { Link } from 'react-router-dom'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function CheckoutSuccessPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center gap-6 animate-[rise_.6s_cubic-bezier(.22,1,.36,1)]">
      <span className="size-16 rounded-full border border-[var(--color-accent)] flex items-center justify-center text-[var(--color-accent)]">
        <Check size={28} />
      </span>
      <p className="font-mono text-[10px] tracking-[0.4em] uppercase text-[var(--color-fg-muted)]">
        Pedido confirmado
      </p>
      <h1 className="font-display text-5xl md:text-7xl leading-[1.05] max-w-2xl">
        Obrigado. Sua curadoria está
        <br />
        <em className="italic text-[var(--color-accent)]">a caminho</em>.
      </h1>
      <p className="text-sm text-[var(--color-fg-muted)] max-w-md">
        Em ambiente real você receberia um email com o número do pedido.
        Esta é uma confirmação simulada da demonstração técnica.
      </p>
      <Link to="/">
        <Button size="lg">Continuar explorando</Button>
      </Link>
    </div>
  )
}
