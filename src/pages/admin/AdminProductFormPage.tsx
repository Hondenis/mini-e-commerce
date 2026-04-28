import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Spinner } from '@/components/ui/States'
import { productsService } from '@/services/productsService'
import { useProductsStore } from '@/store/products.store'
import { useToast } from '@/components/ui/Toast'
import { productSchema } from '@/utils/validation'
import type { Product } from '@/types'

interface FormState {
  title: string
  price: string
  description: string
  category: string
  image: string
}

const empty: FormState = {
  title: '',
  price: '',
  description: '',
  category: '',
  image: '',
}

export function AdminProductFormPage() {
  const { id } = useParams()
  const isEdit = id && id !== 'new'
  const navigate = useNavigate()
  const refresh = useProductsStore((s) => s.refresh)
  const { notify } = useToast()
  const [form, setForm] = useState<FormState>(empty)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [loading, setLoading] = useState(Boolean(isEdit))

  useEffect(() => {
    if (!isEdit) return
    let alive = true
    productsService.get(id!).then((p) => {
      if (!alive) return
      if (p) {
        setForm({
          title: p.title,
          price: String(p.price),
          description: p.description,
          category: p.category,
          image: p.image,
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
    const parsed = productSchema.safeParse(form)
    if (!parsed.success) {
      const fe: typeof errors = {}
      for (const issue of parsed.error.issues) fe[issue.path[0] as keyof FormState] = issue.message
      setErrors(fe)
      return
    }
    setErrors({})
    if (isEdit) {
      productsService.update(id!, parsed.data as Partial<Product>)
      notify('Peça atualizada.', 'success')
    } else {
      productsService.create({ ...parsed.data, rating: { rate: 0, count: 0 } })
      notify('Peça criada.', 'success')
    }
    refresh()
    navigate('/admin/products')
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
        to="/admin/products"
        className="inline-flex items-center gap-2 text-xs tracking-[0.28em] uppercase text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
      >
        <ArrowLeft size={14} /> Voltar
      </Link>
      <header>
        <p className="font-mono text-[10px] tracking-[0.4em] uppercase text-[var(--color-fg-muted)]">
          {isEdit ? 'Editar peça' : 'Nova peça'}
        </p>
        <h1 className="font-display text-4xl md:text-5xl mt-2">
          {isEdit ? 'Refinar detalhes' : 'Adicionar ao acervo'}
        </h1>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        <Input
          label="Título"
          value={form.title}
          onChange={(e) => update('title', e.target.value)}
          error={errors.title}
        />
        <div className="grid md:grid-cols-2 gap-6">
          <Input
            label="Preço (USD)"
            type="number"
            step="0.01"
            min="0"
            value={form.price}
            onChange={(e) => update('price', e.target.value)}
            error={errors.price}
          />
          <Input
            label="Categoria"
            value={form.category}
            onChange={(e) => update('category', e.target.value)}
            error={errors.category}
          />
        </div>
        <Input
          label="URL da imagem"
          type="url"
          value={form.image}
          onChange={(e) => update('image', e.target.value)}
          error={errors.image}
        />
        <Textarea
          label="Descrição"
          value={form.description}
          onChange={(e) => update('description', e.target.value)}
          error={errors.description}
          rows={5}
        />

        <div className="flex justify-end gap-3 pt-4 border-t border-[var(--color-border)]">
          <Button variant="secondary" type="button" onClick={() => navigate('/admin/products')}>
            Cancelar
          </Button>
          <Button type="submit">{isEdit ? 'Salvar alterações' : 'Criar peça'}</Button>
        </div>
      </form>
    </div>
  )
}
