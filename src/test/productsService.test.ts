import { describe, it, expect, beforeEach, vi } from 'vitest'
import { productsService } from '@/services/productsService'
import type { Product } from '@/types'

const seed: Product[] = [
  { id: 1, title: 'A', price: 10, description: 'd', category: 'c', image: '' },
  { id: 2, title: 'B', price: 20, description: 'd', category: 'c', image: '' },
]

vi.mock('@/api/products', () => ({
  productsApi: {
    list: vi.fn(async () => seed),
    get: vi.fn(),
    categories: vi.fn(async () => ['c']),
  },
}))

describe('productsService overlay', () => {
  beforeEach(() => {
    productsService._resetCache()
    localStorage.clear()
  })

  it('returns API items when no overlay', async () => {
    const list = await productsService.list()
    expect(list.map((p) => p.id)).toEqual([1, 2])
  })

  it('prepends locally created products', async () => {
    productsService.create({
      title: 'New',
      price: 5,
      description: 'desc',
      category: 'c',
      image: '',
    })
    const list = await productsService.list()
    expect(list).toHaveLength(3)
    expect(String(list[0].id)).toMatch(/^local-/)
    expect(list[0].title).toBe('New')
  })

  it('applies updates over remote items', async () => {
    productsService.update(1, { title: 'Updated' })
    const list = await productsService.list()
    const first = list.find((p) => p.id === 1)
    expect(first?.title).toBe('Updated')
  })

  it('hides deleted remote items', async () => {
    productsService.delete(2)
    const list = await productsService.list()
    expect(list.find((p) => p.id === 2)).toBeUndefined()
  })

  it('removes locally created on delete', async () => {
    const created = productsService.create({
      title: 'Tmp',
      price: 1,
      description: 'desc longa',
      category: 'c',
      image: '',
    })
    productsService.delete(created.id)
    const list = await productsService.list()
    expect(list.find((p) => p.id === created.id)).toBeUndefined()
  })
})
