import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ApiError } from '@/api/client'

beforeEach(() => {
  vi.unstubAllGlobals()
})

describe('api client', () => {
  it('parses JSON on success', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () =>
        new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      ),
    )
    const { api } = await import('@/api/client')
    const data = await api.get<{ ok: boolean }>('/x')
    expect(data.ok).toBe(true)
  })

  it('throws ApiError on non-2xx', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response('boom', { status: 500 })),
    )
    const { api } = await import('@/api/client')
    await expect(api.get('/x')).rejects.toBeInstanceOf(ApiError)
  })

  it('maps network failures to ApiError', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        throw new TypeError('Failed to fetch')
      }),
    )
    const { api } = await import('@/api/client')
    await expect(api.get('/x')).rejects.toBeInstanceOf(ApiError)
  })
})
