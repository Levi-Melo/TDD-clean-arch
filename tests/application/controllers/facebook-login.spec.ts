import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthentication } from '@/domain/features'
import { AccessToken } from '@/domain/models'
import { MockProxy, mock } from 'jest-mock-extended'

class FacebookLoginController {
  constructor (private readonly facebookAuthentication: FacebookAuthentication) {}
  async handle (params: any): Promise<HttpResponse> {
    try {
      if (['', null, undefined].includes(params.token)) { return { statusCode: 400, data: new Error() } }

      const result = await this.facebookAuthentication.perform({ token: params.token })
      if (result instanceof AccessToken) {
        return {
          statusCode: 200,
          data: { accessToken: result.value }
        }
      }
      return {
        statusCode: 401,
        data: new AuthenticationError()
      }
    } catch (error: any) {
      return {
        statusCode: 500,
        data: new ServerError(error)
      }
    }
  }
}
class ServerError extends Error {
  constructor (error?: Error) {
    super('Server failed. Try again soon')
    this.name = 'ServerError'
    this.stack = error?.stack
  }
}
type HttpResponse = { statusCode: number, data: any }
// type HttpParams = { token: string }
describe('Name of the group', () => {
  let facebookAuth: MockProxy<FacebookAuthentication>
  let sut: FacebookLoginController

  beforeAll(() => {
    facebookAuth = mock()
    facebookAuth.perform.mockResolvedValue(new AccessToken('any_value'))
  })

  beforeEach(() => {
    sut = new FacebookLoginController(facebookAuth)
  })

  it('should return 400 if token is empty', async () => {
    const httpHandle = await sut.handle({ token: '' })

    expect(httpHandle).toEqual({ statusCode: 400, data: new Error() })
  })

  it('should return 400 if token is null', async () => {
    const httpHandle = await sut.handle({ token: null })

    expect(httpHandle).toEqual({ statusCode: 400, data: new Error() })
  })

  it('should return 400 if token is null', async () => {
    const httpHandle = await sut.handle({ token: undefined })

    expect(httpHandle).toEqual({ statusCode: 400, data: new Error() })
  })

  it('should call FacebookAuthentication with correct params', async () => {
    await sut.handle({ token: 'any_token' })

    expect(facebookAuth.perform).toHaveBeenCalledWith({ token: 'any_token' })
    expect(facebookAuth.perform).toHaveBeenCalledTimes(1)
  })

  it('should return 401 if authentication fails', async () => {
    facebookAuth.perform.mockResolvedValueOnce(new AuthenticationError())
    const httpHandle = await sut.handle({ token: 'any_token' })

    expect(httpHandle).toEqual({ statusCode: 401, data: new AuthenticationError() })
  })

  it('should return 200 if authentication suceeds', async () => {
    const httpHandle = await sut.handle({ token: 'any_token' })

    expect(httpHandle).toEqual({ statusCode: 200, data: { accessToken: 'any_value' } })
  })

  it('should return 500 if authentication throws', async () => {
    const err = new Error('infra_error')
    facebookAuth.perform.mockRejectedValueOnce(err)
    const httpHandle = await sut.handle({ token: 'any_token' })

    expect(httpHandle).toEqual({ statusCode: 500, data: new ServerError(err) })
  })
})
