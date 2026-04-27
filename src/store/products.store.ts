import { create } from 'zustand'
import { productsService } from '@/services/productsService'
import type { Product } from '@/types'

interface ProductsState {
  items: Product[]
  categories: string[]
  status: 'idle' | 'loading' | 'ready' | 'error'
  error: string | null
  load: (force?: boolean) => Promise<void>
  refresh: () => void
}

export const useProductsStore = create<ProductsState>((set, get) => ({
  items: [],
  categories: [],
  status: 'idle',
  error: null,
  async load(force = false) {
    if (!force && (get().status === 'loading' || get().status === 'ready')) return
    set({ status: 'loading', error: null })
    try {
      const [items, categories] = await Promise.all([
        productsService.list(),
        productsService.categories(),
      ])
      set({ items, categories, status: 'ready' })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao carregar produtos.'
      set({ status: 'error', error: message })
    }
  },
  refresh() {
    productsService._resetCache()
    void get().load(true)
  },
}))
