import { TokenGenerator } from '@/data/contracts/crypto'
import Jwt from 'jsonwebtoken'

export class JwtTokenGenerator {
  constructor (private readonly _secret: string) {}
  async generateToken ({ expirationInMs, key }: TokenGenerator.Params): Promise<TokenGenerator.Result> {
    const expirationInSeconds = expirationInMs / 1000
    return Jwt.sign({ key }, this._secret, { expiresIn: expirationInSeconds })
  }
}
