import { JwtTokenGenerator } from '@/infra/crypto'
import Jwt from 'jsonwebtoken'
jest.mock('jsonwebtoken')

describe('JwtTokenGenerator', () => {
  let sut: JwtTokenGenerator
  let fakeJwt: jest.Mocked<typeof Jwt>
  beforeAll(() => {
    fakeJwt = Jwt as jest.Mocked<typeof Jwt>
    fakeJwt.sign.mockImplementation(() => 'any_token')
  })

  beforeEach(() => {
    sut = new JwtTokenGenerator('any_secret')
  })
  it('Should call sign with correct params', async () => {
    await sut.generateToken({
      expirationInMs: 1000,
      key: 'any_key'
    })

    expect(fakeJwt.sign).toHaveBeenCalledWith({ key: 'any_key' }, 'any_secret', { expiresIn: 1 })
  })

  it('Should return a token', async () => {
    const token = await sut.generateToken({
      expirationInMs: 1000,
      key: 'any_key'
    })

    expect(token).toBe('any_token')
  })

  it('should rethrow if gets throws', async () => {
    fakeJwt.sign.mockImplementationOnce(() => { throw new Error('token_err') })
    const promise = sut.generateToken({
      expirationInMs: 1000,
      key: 'any_key'
    })

    await expect(promise).rejects.toThrow(new Error('token_err'))
  })
}
)
