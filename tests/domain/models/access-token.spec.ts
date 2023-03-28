import { AccessToken } from '@/domain/models'

describe('AccessToken', () => {
  it('should create with a value', () => {
    const sut = new AccessToken('any')
    expect(sut).toEqual({ value: 'any' })
  })

  it('should expire in 180000 ms (30 minutes)', () => {
    expect(AccessToken.expirationInMs).toBe(1800000)
  })
})
