import { describe, it, expect } from 'vitest'
import { withRole } from '@/services/usersService'
import type { ApiUser } from '@/types'

const base: Omit<ApiUser, 'id' | 'username'> = {
  email: 'a@a.com',
  password: 'x',
  name: { firstname: 'A', lastname: 'B' },
  phone: '0',
  address: {
    city: '',
    street: '',
    number: 0,
    zipcode: '',
    geolocation: { lat: '0', long: '0' },
  },
}

describe('role mapping', () => {
  it('maps mor_2314 as admin', () => {
    const u = withRole({ ...base, id: 1, username: 'mor_2314' })
    expect(u.role).toBe('admin')
  })
  it('maps any other username as customer', () => {
    const u = withRole({ ...base, id: 2, username: 'kevinryan' })
    expect(u.role).toBe('customer')
  })
})
