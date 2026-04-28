import { useEffect, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth.store'
import { useCartStore } from '@/store/cart.store'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ThemeToggle } from '@/components/layout/ThemeToggle'
import { loginSchema } from '@/utils/validation'
import { Lock, Mail, ArrowRight } from 'lucide-react'

export function LoginPage() {
  const { login, status, user } = useAuthStore()
  const setOwner = useCartStore((s) => s.setOwner)
  const navigate = useNavigate()
  const location = useLocation()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ username?: string; password?: string; form?: string }>({})

  useEffect(() => {
    if (user) {
      setOwner(String(user.id))
    }
  }, [user, setOwner])

  if (user) {
    const target = (location.state as { from?: string } | null)?.from
    return <Navigate to={target ?? (user.role === 'admin' ? '/admin' : '/')} replace />
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrors({})
    const parsed = loginSchema.safeParse({ username, password })
    if (!parsed.success) {
      const fieldErrors: typeof errors = {}
      for (const issue of parsed.error.issues) {
        const k = issue.path[0] as 'username' | 'password'
        fieldErrors[k] = issue.message
      }
      setErrors(fieldErrors)
      return
    }
    try {
      const session = await login(parsed.data.username, parsed.data.password)
      setOwner(String(session.user.id))
      navigate(session.user.role === 'admin' ? '/admin' : '/', { replace: true })
    } catch (err) {
      setErrors({ form: err instanceof Error ? err.message : 'Erro ao autenticar.' })
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left editorial panel */}
      <aside
        aria-hidden="true"
        className="hidden lg:flex relative flex-1 bg-(--color-ink-800) text-text-(--color-cream-50) overflow-hidden"
      >
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_30%_20%,rgba(200,140,60,0.5),transparent_55%)]" />
        <div className="absolute -bottom-20 -right-20 size-[28rem] rounded-full border border-[var(--color-cream-50)]/15" />
        <div className="absolute top-32 right-16 size-44 rounded-full border border-[var(--color-cream-50)]/10" />
        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 w-full">
          <div className="flex items-end gap-2">
            <p className="font-display text-4xl">HS — Store</p>
            <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-[var(--color-cream-300)] mb-1.5">
              ’26
            </p>
          </div>
          <div className="space-y-6 max-w-md">
            <p className="text-[10px] tracking-[0.4em] uppercase text-[var(--color-cream-300)]">
              Edição · Vol. 04
            </p>
            <h1 className="font-display text-5xl xl:text-6xl leading-[1.05]">
              Bem vindos há{' '}
              <em className="font-light italic text-[var(--color-amber-500)]">HS-Store</em>.
            </h1>
            <p className="text-sm text-[var(--color-cream-300)] leading-relaxed">
              Cada peça é selecionada à mão. Entre com sua conta para acessar o catálogo
              e o carrinho pessoal.
            </p>
          </div>
          <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-[var(--color-cream-300)]/70">
            FakeStore API · Demo técnica
          </div>
        </div>
      </aside>

      {/* Form */}
      <section className="flex-1 flex flex-col justify-between p-6 md:p-12 lg:p-16">
        <div className="flex justify-end">
          <ThemeToggle />
        </div>

        <div className="mx-auto w-full max-w-sm animate-[rise_.6s_cubic-bezier(.22,1,.36,1)]">
          <p className="font-mono text-[10px] tracking-[0.4em] uppercase text-[var(--color-fg-muted)] mb-3">
            Acesso · Identidade
          </p>
          <h2 className="font-display text-4xl md:text-5xl leading-[1.05] mb-2">
            Entre.
          </h2>
          <p className="text-sm text-[var(--color-fg-muted)] mb-10">
            Use suas credenciais. Cliente vai ao catálogo, admin ao painel.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <Input
              label="Usuário"
              placeholder="Digite seu usuário"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              error={errors.username}
              leftIcon={<Mail size={16} />}
            />
            <Input
              label="Senha"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              leftIcon={<Lock size={16} />}
            />

            {errors.form && (
              <p
                role="alert"
                className="text-sm text-[var(--color-danger)] border-l-2 border-[var(--color-danger)] pl-3"
              >
                {errors.form}
              </p>
            )}

            <Button
              type="submit"
              size="lg"
              fullWidth
              loading={status === 'loading'}
              rightIcon={<ArrowRight size={16} />}
            >
              Entrar
            </Button>
          </form>
        </div>

        <p className="mt-10 text-center font-mono text-[10px] tracking-[0.3em] uppercase text-[var(--color-fg-muted)]">
          HS-Store · {new Date().getFullYear()}
        </p>
      </section>
    </div>
  )
}
