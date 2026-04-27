import { api } from './client'
import type { Product } from '@/types'

export const productsApi = {
  list: () => api.get<Product[]>('/products'),
  get: (id: number | string) => api.get<Product>(`/products/${id}`),
  categories: () => api.get<string[]>('/products/categories'),
}

