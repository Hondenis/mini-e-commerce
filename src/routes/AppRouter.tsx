import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { ProtectedRoute } from '@/components/layout/ProtectedRoute'
import { LoginPage } from '@/pages/LoginPage'
import { ForbiddenPage, NotFoundPage } from '@/pages/Status'
import { ProductsPage } from '@/pages/customer/ProductsPage'
import { ProductDetailPage } from '@/pages/customer/ProductDetailPage'
import { CartPage } from '@/pages/customer/CartPage'
import { CheckoutSuccessPage } from '@/pages/customer/CheckoutSuccessPage'
import { DashboardPage } from '@/pages/admin/DashboardPage'
import { AdminProductsPage } from '@/pages/admin/AdminProductsPage'
import { AdminProductFormPage } from '@/pages/admin/AdminProductFormPage'
import { AdminUsersPage } from '@/pages/admin/AdminUsersPage'
import { AdminUserFormPage } from '@/pages/admin/AdminUserFormPage'

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<AppShell />}>
          {/* Públicas — visitantes acessam catálogo e carrinho livremente */}
          <Route index element={<ProductsPage />} />
          <Route path="products/:id" element={<ProductDetailPage />} />
          <Route path="cart" element={<CartPage />} />

          {/* Checkout exige cliente autenticado */}
          <Route
            path="checkout/success"
            element={
              <ProtectedRoute role="customer">
                <CheckoutSuccessPage />
              </ProtectedRoute>
            }
          />

          {/* Admin */}
          <Route
            path="admin"
            element={
              <ProtectedRoute role="admin">
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin/products"
            element={
              <ProtectedRoute role="admin">
                <AdminProductsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin/products/:id"
            element={
              <ProtectedRoute role="admin">
                <AdminProductFormPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin/users"
            element={
              <ProtectedRoute role="admin">
                <AdminUsersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin/users/:id"
            element={
              <ProtectedRoute role="admin">
                <AdminUserFormPage />
              </ProtectedRoute>
            }
          />

          <Route path="forbidden" element={<ForbiddenPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
