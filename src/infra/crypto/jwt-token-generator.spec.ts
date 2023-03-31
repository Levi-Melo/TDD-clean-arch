import { TokenGenerator } from '@/data/contracts/crypto'
import Jwt from 'jsonwebtoken'
jest.mock('jsonwebtoken')
class JwtTokenGenerator {
  constructor (private readonly _secret: string) {}
  async generateToken ({ expirationInMs, key }: TokenGenerator.Params): Promise<TokenGenerator.Result> {
    const expirationInSeconds = expirationInMs / 1000
    return Jwt.sign({ key }, this._secret, { expiresIn: expirationInSeconds })
  }
}

describe('JwtTokenGenerator', () => {
  let sut: JwtTokenGenerator
  let fakeJwt: jest.Mocked<typeof Jwt>
  beforeAll(() => {
    fakeJwt = Jwt as jest.Mocked<typeof Jwt>
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
}
)
