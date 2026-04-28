export function Footer() {
  return (
    <footer className="mt-24 border-t border-[var(--color-border)]">
      <div className="container-page py-10 grid gap-8 md:grid-cols-3 items-end">
        <div>
          <p className="font-display text-3xl leading-none">HS-Store</p>
          <p className="mt-2 text-xs text-[var(--color-fg-muted)] max-w-xs">
            Curadoria digital. Peças únicas. Edição limitada de primavera de 2026.
          </p>
        </div>
        <ul className="grid grid-cols-2 gap-2 text-xs tracking-[0.22em] uppercase text-[var(--color-fg-muted)]">
          <li>Curadoria</li>
          <li>Catálogo</li>
          <li>Atendimento</li>
          <li>Imprensa</li>
          <li>Política</li>
          <li>Privacidade</li>
        </ul>
        <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-[var(--color-fg-muted)] md:text-right">
          © {new Date().getFullYear()} · Construído como teste técnico — Fakestore API
        </p>
      </div>
    </footer>
  )
}
