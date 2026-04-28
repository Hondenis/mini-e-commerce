import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Spinner } from '@/components/ui/States'
import { usersService } from '@/services/usersService'
import { useUsersStore } from '@/store/user.store'
import { useToast } from '@/components/ui/Toast'
import { userSchema } from '@/utils/validation'
import type { ApiUser } from '@/types'

interface FormState {
  username: string
  email: string
  password: string
  firstname: string
  lastname: string
  phone: string
  city: string
  street: string
  number: string
  zipcode: string
}

const empty: FormState = {
  username: '',
  email: '',
  password: '',
  firstname: '',
  lastname: '',
  phone: '',
  city: '',
  street: '',
  number: '',
  zipcode: '',
}

export function AdminUserFormPage() {
  const { id } = useParams()
  const isEdit = id && id !== 'new'
  const navigate = useNavigate()
  const refresh = useUsersStore((s) => s.refresh)
  const { notify } = useToast()
  const [form, setForm] = useState<FormState>(empty)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [loading, setLoading] = useState(Boolean(isEdit))

  useEffect(() => {
    if (!isEdit) return
    let alive = true
    usersService.get(Number(id)).then((u) => {
      if (!alive) return
      if (u) {
        setForm({
          username: u.username,
          email: u.email,
          password: u.password,
          firstname: u.name.firstname,
          lastname: u.name.lastname,
          phone: u.phone,
          city: u.address.city,
          street: u.address.street,
          number: String(u.address.number),
          zipcode: u.address.zipcode,
        })
      }
      setLoading(false)
    })
    return () => {
      alive = false
    }
  }, [id, isEdit])

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const parsed = userSchema.safeParse(form)
    if (!parsed.success) {
      const fe: typeof errors = {}
      for (const issue of parsed.error.issues) fe[issue.path[0] as keyof FormState] = issue.message
      setErrors(fe)
      return
    }
    setErrors({})
    const data = parsed.data
    const apiShape: Omit<ApiUser, 'id'> = {
      username: data.username,
      email: data.email,
      password: data.password,
      phone: data.phone,
      name: { firstname: data.firstname, lastname: data.lastname },
      address: {
        city: data.city,
        street: data.street,
        number: data.number,
        zipcode: data.zipcode,
        geolocation: { lat: '0', long: '0' },
      },
    }
    if (isEdit) {
      usersService.update(Number(id), apiShape)
      notify('Cliente atualizado.', 'success')
    } else {
      usersService.create(apiShape)
      notify('Cliente criado.', 'success')
    }
    refresh()
    navigate('/admin/users')
  }

  if (loading) {
    return (
      <div className="flex justify-center py-32">
        <Spinner size={24} />
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <Link
        to="/admin/users"
        className="inline-flex items-center gap-2 text-xs tracking-[0.28em] uppercase text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
      >
        <ArrowLeft size={14} /> Voltar
      </Link>
      <header>
        <p className="font-mono text-[10px] tracking-[0.4em] uppercase text-[var(--color-fg-muted)]">
          {isEdit ? 'Editar cliente' : 'Novo cliente'}
        </p>
        <h1 className="font-display text-4xl md:text-5xl mt-2">
          {isEdit ? 'Atualizar cadastro' : 'Adicionar ao diretório'}
        </h1>
      </header>

      <form onSubmit={handleSubmit} className="space-y-8" noValidate>
        <fieldset className="space-y-6">
          <legend className="font-mono text-[10px] tracking-[0.4em] uppercase text-[var(--color-fg-muted)] mb-4">
            Identificação
          </legend>
          <div className="grid md:grid-cols-2 gap-6">
            <Input
              label="Usuário"
              value={form.username}
              onChange={(e) => update('username', e.target.value)}
              error={errors.username}
              autoComplete="username"
            />
            <Input
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) => update('email', e.target.value)}
              error={errors.email}
              autoComplete="email"
            />
          </div>
          <Input
            label="Senha"
            type="password"
            value={form.password}
            onChange={(e) => update('password', e.target.value)}
            error={errors.password}
            autoComplete="new-password"
          />
          <div className="grid md:grid-cols-2 gap-6">
            <Input
              label="Nome"
              value={form.firstname}
              onChange={(e) => update('firstname', e.target.value)}
              error={errors.firstname}
            />
            <Input
              label="Sobrenome"
              value={form.lastname}
              onChange={(e) => update('lastname', e.target.value)}
              error={errors.lastname}
            />
          </div>
          <Input
            label="Telefone"
            value={form.phone}
            onChange={(e) => update('phone', e.target.value)}
            error={errors.phone}
          />
        </fieldset>

        <fieldset className="space-y-6">
          <legend className="font-mono text-[10px] tracking-[0.4em] uppercase text-[var(--color-fg-muted)] mb-4">
            Endereço
          </legend>
          <div className="grid md:grid-cols-2 gap-6">
            <Input
              label="Cidade"
              value={form.city}
              onChange={(e) => update('city', e.target.value)}
              error={errors.city}
            />
            <Input
              label="CEP"
              value={form.zipcode}
              onChange={(e) => update('zipcode', e.target.value)}
              error={errors.zipcode}
            />
          </div>
          <div className="grid md:grid-cols-[1fr_120px] gap-6">
            <Input
              label="Rua"
              value={form.street}
              onChange={(e) => update('street', e.target.value)}
              error={errors.street}
            />
            <Input
              label="Número"
              type="number"
              min="0"
              value={form.number}
              onChange={(e) => update('number', e.target.value)}
              error={errors.number}
            />
          </div>
        </fieldset>

        <div className="flex justify-end gap-3 pt-4 border-t border-[var(--color-border)]">
          <Button variant="secondary" type="button" onClick={() => navigate('/admin/users')}>
            Cancelar
          </Button>
          <Button type="submit">{isEdit ? 'Salvar' : 'Criar cliente'}</Button>
        </div>
      </form>
    </div>
  )
}
