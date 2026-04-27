import { productsApi } from '@/api/products'
import type { Product } from '@/types'
import { readJson, writeJson } from '@/services/storage'

const CREATED_KEY = 'products:created'
const UPDATED_KEY = 'products:updated'
const DELETED_KEY = 'products:deleted'

type IdSet = Array<Product['id']>

function readCreated(): Product[] {
  return readJson<Product[]>(CREATED_KEY, [])
}
function readUpdated(): Record<string, Partial<Product>> {
  return readJson<Record<string, Partial<Product>>>(UPDATED_KEY, {})
}
function readDeleted(): IdSet {
  return readJson<IdSet>(DELETED_KEY, [])
}

function applyOverlay(items: Product[]): Product[] {
  const updated = readUpdated()
  const deleted = new Set(readDeleted().map(String))
  const merged = items
    .filter((p) => !deleted.has(String(p.id)))
    .map((p) => ({ ...p, ...(updated[String(p.id)] ?? {}) }))
  return [...readCreated(), ...merged]
}

let cache: Promise<Product[]> | null = null
function loadFromApi() {
  if (!cache) {
    cache = productsApi.list().catch((err) => {
      cache = null
      throw err
    })
  }
  return cache
}

export const productsService = {
  async list(): Promise<Product[]> {
    const remote = await loadFromApi()
    return applyOverlay(remote)
  },

  async get(id: Product['id']): Promise<Product | undefined> {
    const all = await this.list()
    return all.find((p) => String(p.id) === String(id))
  },

  async categories(): Promise<string[]> {
    return productsApi.categories()
  },

  create(data: Omit<Product, 'id'>): Product {
    const created = readCreated()
    const id = `local-${crypto.randomUUID()}`
    const product: Product = { ...data, id }
    writeJson(CREATED_KEY, [product, ...created])
    return product
  },

  update(id: Product['id'], data: Partial<Product>): void {
    const created = readCreated()
    const idx = created.findIndex((p) => String(p.id) === String(id))
    if (idx >= 0) {
      created[idx] = { ...created[idx], ...data, id: created[idx].id }
      writeJson(CREATED_KEY, created)
      return
    }
    const updated = readUpdated()
    updated[String(id)] = { ...updated[String(id)], ...data }
    writeJson(UPDATED_KEY, updated)
  },

  delete(id: Product['id']): void {
    const created = readCreated()
    const filtered = created.filter((p) => String(p.id) !== String(id))
    if (filtered.length !== created.length) {
      writeJson(CREATED_KEY, filtered)
      return
    }
    const deleted = readDeleted()
    if (!deleted.some((d) => String(d) === String(id))) {
      writeJson(DELETED_KEY, [...deleted, id])
    }
  },

  /** Used by tests */
  _resetCache() {
    cache = null
  },
}
