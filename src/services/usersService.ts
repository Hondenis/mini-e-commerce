import { usersApi } from '@/api/auth'
import type { ApiUser, User } from '@/types'
import { readJson, writeJson } from './storage'

const ADMIN_USERNAMES = new Set<string>(['mor_2314'])

const CREATED_KEY = 'users:created'
const UPDATED_KEY = 'users:updated'
const DELETED_KEY = 'users:deleted'

function readCreated(): ApiUser[] {
  return readJson<ApiUser[]>(CREATED_KEY, [])
}
function readUpdated(): Record<string, Partial<ApiUser>> {
  return readJson<Record<string, Partial<ApiUser>>>(UPDATED_KEY, {})
}
function readDeleted(): Array<ApiUser['id']> {
  return readJson<Array<ApiUser['id']>>(DELETED_KEY, [])
}

export function withRole(u: ApiUser): User {
  return {
    ...u,
    role: ADMIN_USERNAMES.has(u.username) ? 'admin' : 'customer',
  }
}

function applyOverlay(items: ApiUser[]): ApiUser[] {
  const updated = readUpdated()
  const deleted = new Set(readDeleted().map(String))
  const merged = items
    .filter((u) => !deleted.has(String(u.id)))
    .map((u) => ({ ...u, ...(updated[String(u.id)] ?? {}) }))
  return [...readCreated(), ...merged]
}

let cache: Promise<ApiUser[]> | null = null
function loadFromApi() {
  if (!cache) {
    cache = usersApi.list().catch((err) => {
      cache = null
      throw err
    })
  }
  return cache
}

export const usersService = {
  async list(): Promise<User[]> {
    const remote = await loadFromApi()
    return applyOverlay(remote).map(withRole)
  },

  async get(id: ApiUser['id']): Promise<User | undefined> {
    const all = await this.list()
    return all.find((u) => String(u.id) === String(id))
  },

  /** Match credentials to a known user (overlay first, then cached API). */
  async findByCredentials(username: string, password: string): Promise<User | undefined> {
    const all = await this.list()
    return all.find((u) => u.username === username && u.password === password)
  },

  async findByUsername(username: string): Promise<User | undefined> {
    const all = await this.list()
    return all.find((u) => u.username === username)
  },

  create(data: Omit<ApiUser, 'id'>): User {
    const created = readCreated()
    const numericId = Date.now()
    const user: ApiUser = { ...data, id: numericId }
    writeJson(CREATED_KEY, [user, ...created])
    return withRole(user)
  },

  update(id: ApiUser['id'], data: Partial<ApiUser>): void {
    const created = readCreated()
    const idx = created.findIndex((u) => String(u.id) === String(id))
    if (idx >= 0) {
      created[idx] = { ...created[idx], ...data, id: created[idx].id }
      writeJson(CREATED_KEY, created)
      return
    }
    const updated = readUpdated()
    updated[String(id)] = { ...updated[String(id)], ...data }
    writeJson(UPDATED_KEY, updated)
  },

  delete(id: ApiUser['id']): void {
    const created = readCreated()
    const filtered = created.filter((u) => String(u.id) !== String(id))
    if (filtered.length !== created.length) {
      writeJson(CREATED_KEY, filtered)
      return
    }
    const deleted = readDeleted()
    if (!deleted.some((d) => String(d) === String(id))) {
      writeJson(DELETED_KEY, [...deleted, id])
    }
  },

  _resetCache() {
    cache = null
  },
}
