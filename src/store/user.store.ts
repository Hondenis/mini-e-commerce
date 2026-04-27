import { create } from 'zustand'
import { usersService } from '@/services/usersService'
import type { User } from '@/types'


interface UsersState {
  items: User[]
  status: 'idle' | 'loading' | 'ready' | 'error'
  error: string | null
  load: (force?: boolean) => Promise<void>
  refresh: () => void
}

export const useUsersStore = create<UsersState>((set, get) => ({
  items: [],
  status: 'idle',
  error: null,
  async load(force = false) {
    if (!force && (get().status === 'loading' || get().status === 'ready')) return
    set({ status: 'loading', error: null })
    try {
      const items = await usersService.list()
      set({ items, status: 'ready' })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao carregar usuários.'
      set({ status: 'error', error: message })
    }
  },
  refresh() {
    usersService._resetCache()
    void get().load(true)
  },
}))
