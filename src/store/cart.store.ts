import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { CartLine, Product } from '@/types'

interface CartState {
  ownerId: string | null
  lines: CartLine[]
  setOwner: (ownerId: string | null) => void
  add: (product: Product, qty?: number) => void
  remove: (productId: Product['id']) => void
  setQuantity: (productId: Product['id'], qty: number) => void
  clear: () => void
  count: () => number
  subtotal: (catalog: Product[]) => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      ownerId: null,
      lines: [],
      setOwner(ownerId) {
        const current = get().ownerId
        if (current === ownerId) return
        // Visitante (null) -> usuário autenticado: preserva o carrinho montado
        // como guest para que ele continue de onde parou após o login.
        if (current === null && ownerId !== null) {
          set({ ownerId })
          return
        }
        // Logout, ou troca entre usuários distintos: zera o carrinho.
        set({ ownerId, lines: [] })
      },
      add(product, qty = 1) {
        const lines = [...get().lines]
        const idx = lines.findIndex((l) => String(l.productId) === String(product.id))
        if (idx >= 0) {
          lines[idx] = { ...lines[idx], quantity: lines[idx].quantity + qty }
        } else {
          lines.push({ productId: product.id, quantity: qty })
        }
        set({ lines })
      },
      remove(productId) {
        set({ lines: get().lines.filter((l) => String(l.productId) !== String(productId)) })
      },
      setQuantity(productId, qty) {
        if (qty <= 0) {
          get().remove(productId)
          return
        }
        set({
          lines: get().lines.map((l) =>
            String(l.productId) === String(productId) ? { ...l, quantity: qty } : l,
          ),
        })
      },
      clear() {
        set({ lines: [] })
      },
      count() {
        return get().lines.reduce((s, l) => s + l.quantity, 0)
      },
      subtotal(catalog) {
        const map = new Map(catalog.map((p) => [String(p.id), p.price]))
        return get().lines.reduce((sum, l) => {
          const price = map.get(String(l.productId)) ?? 0
          return sum + price * l.quantity
        }, 0)
      },
    }),
    {
      name: 'atelier:v1:cart',
      name: 'hs-store:v1:cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ ownerId: s.ownerId, lines: s.lines }),
    },
  ),
)
