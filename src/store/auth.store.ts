import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { AuthSession, User } from '@/types'
import { login as loginService } from '@/services/authService'

type Status = 'idle' | 'loading' | 'authenticated' | 'error'

interface AuthState {
  status: Status
  user: User | null
  token: string | null
  error: string | null
  login: (username: string, password: string) => Promise<AuthSession>
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      status: 'idle',
      user: null,
      token: null,
      error: null,
      async login(username, password) {
        set({ status: 'loading', error: null })
        try {
          const session = await loginService(username, password)
          set({
            status: 'authenticated',
            user: session.user,
            token: session.token,
            error: null,
          })
          return session
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Erro ao autenticar.'
          set({ status: 'error', error: message, user: null, token: null })
          throw err
        }
      },
      logout() {
        set({ status: 'idle', user: null, token: null, error: null })
      },
    }),
    {
      name: 'atelier:v1:auth',
      name: 'hs-store:v1:auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user, token: state.token, status: state.status }),
    },
  ),
)
