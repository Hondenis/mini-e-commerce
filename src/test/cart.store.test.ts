import { describe, it, expect, beforeEach } from 'vitest'
import { useCartStore } from '@/store/cart.store'
import type { Product } from '@/types'

const A: Product = { id: 1, title: 'A', price: 10, description: '', category: '', image: '' }
const B: Product = { id: 2, title: 'B', price: 25, description: '', category: '', image: '' }

beforeEach(() => {
  useCartStore.setState({ ownerId: 'u1', lines: [] })
})

describe('cart store', () => {
  it('adds new line', () => {
    useCartStore.getState().add(A, 2)
    expect(useCartStore.getState().lines).toEqual([{ productId: 1, quantity: 2 }])
  })

  it('increments quantity when re-adding', () => {
    useCartStore.getState().add(A, 1)
    useCartStore.getState().add(A, 3)
    expect(useCartStore.getState().lines[0].quantity).toBe(4)
  })

  it('updates quantity and removes on zero', () => {
    useCartStore.getState().add(A, 1)
    useCartStore.getState().setQuantity(A.id, 5)
    expect(useCartStore.getState().lines[0].quantity).toBe(5)
    useCartStore.getState().setQuantity(A.id, 0)
    expect(useCartStore.getState().lines).toHaveLength(0)
  })

  it('computes count and subtotal from catalog', () => {
    const s = useCartStore.getState()
    s.add(A, 2)
    s.add(B, 1)
    expect(useCartStore.getState().count()).toBe(3)
    expect(useCartStore.getState().subtotal([A, B])).toBe(45)
  })

  it('clears cart on owner change', () => {
    useCartStore.getState().add(A, 1)
    useCartStore.getState().setOwner('u2')
    expect(useCartStore.getState().lines).toHaveLength(0)
    expect(useCartStore.getState().ownerId).toBe('u2')
  })
})
