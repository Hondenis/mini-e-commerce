import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from '@/components/layout/ProtectedRoute'
import { useAuthStore } from '@/store/auth.store'
import type { User } from '@/types'

function renderRoutes(initial = '/admin') {
  return render(
    <MemoryRouter initialEntries={[initial]}>
      <Routes>
        <Route path="/login" element={<div>Login Page</div>} />
        <Route path="/forbidden" element={<div>Forbidden Page</div>} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <div>Admin Area</div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </MemoryRouter>,
  )
}

const adminUser: User = {
  id: 1,
  username: 'mor_2314',
  email: 'a@a.com',
  password: 'x',
  phone: '0',
  name: { firstname: 'A', lastname: 'B' },
  address: {
    city: '',
    street: '',
    number: 0,
    zipcode: '',
    geolocation: { lat: '0', long: '0' },
  },
  role: 'admin',
}

beforeEach(() => {
  useAuthStore.setState({ user: null, token: null, status: 'idle', error: null })
})

describe('<ProtectedRoute>', () => {
  it('redirects to /login when unauthenticated', () => {
    renderRoutes('/admin')
    expect(screen.getByText('Login Page')).toBeInTheDocument()
  })

  it('redirects to /forbidden when role mismatches', () => {
    useAuthStore.setState({
      user: { ...adminUser, role: 'customer' },
      token: 't',
      status: 'authenticated',
      error: null,
    })
    renderRoutes('/admin')
    expect(screen.getByText('Forbidden Page')).toBeInTheDocument()
  })

  it('renders children when authorized', () => {
    useAuthStore.setState({ user: adminUser, token: 't', status: 'authenticated', error: null })
    renderRoutes('/admin')
    expect(screen.getByText('Admin Area')).toBeInTheDocument()
  })
})
