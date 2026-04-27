import { authApi } from '@/api/auth'
import { usersService } from '@/services/usersService'
import type { AuthSession } from '@/types'
import { ApiError } from '@/api/client'

/**
 * FakeStore's /auth/login does not properly validate passwords for all users,
 * so we double-check credentials against the user list before accepting the session.
 */
export async function login(username: string, password: string): Promise<AuthSession> {
  const trimmedUser = username.trim()
  if (!trimmedUser || !password) {
    throw new ApiError('Informe usuário e senha.', 400)
  }

  const matched = await usersService.findByCredentials(trimmedUser, password)
  if (!matched) {
    throw new ApiError('Credenciais inválidas.', 401)
  }

  const { token } = await authApi.login({ username: trimmedUser, password })
  if (!token) {
    throw new ApiError('Não foi possível autenticar.', 401)
  }

  return { token, user: matched }
}
