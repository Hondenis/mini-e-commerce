import { useEffect } from 'react'
import { ThemeProvider } from '@/context/ThemeContext'
import { ToastProvider } from '@/components/ui/Toast'
import { AppRouter } from '@/routes/AppRouter'
import { useAuthStore } from '@/store/auth.store'
import { useCartStore } from '@/store/cart.store'

function CartOwnerSync() {
  const userId = useAuthStore((s) => (s.user ? String(s.user.id) : null))
  const setOwner = useCartStore((s) => s.setOwner)
  useEffect(() => {
    setOwner(userId)
  }, [userId, setOwner])
  return null
}

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <CartOwnerSync />
        <AppRouter />
      </ToastProvider>
    </ThemeProvider>
  )
}

export default App
