import { FacebookAuthentication } from '@/domain/features'
import { mock } from 'jest-mock-extended'

class FacebookLoginController {
  constructor (private readonly facebookAuthentication: FacebookAuthentication) {}
  async handle (params: any): Promise<HttpResponse> {
    await this.facebookAuthentication.perform({ token: params.token })
    return { statusCode: 400, data: new Error() }
  }
}
type HttpResponse = { statusCode: number, data: any }
// type HttpParams = { token: string }
describe('Name of the group', () => {
  it('should return 400 if token is empty', async () => {
    const facebookAuth = mock<FacebookAuthentication>()
    const sut = new FacebookLoginController(facebookAuth)
    const httpHandle = await sut.handle({ token: '' })

    expect(httpHandle).toEqual({ statusCode: 400, data: new Error() })
  })

  it('should return 400 if token is null', async () => {
    const facebookAuth = mock<FacebookAuthentication>()
    const sut = new FacebookLoginController(facebookAuth)
    const httpHandle = await sut.handle({ token: null })

    expect(httpHandle).toEqual({ statusCode: 400, data: new Error() })
  })

  it('should return 400 if token is null', async () => {
    const facebookAuth = mock<FacebookAuthentication>()
    const sut = new FacebookLoginController(facebookAuth)
    const httpHandle = await sut.handle({ token: undefined })

    expect(httpHandle).toEqual({ statusCode: 400, data: new Error() })
  })

  it('should call FacebookAuthentication with correct params', async () => {
    const facebookAuth = mock<FacebookAuthentication>()
    const sut = new FacebookLoginController(facebookAuth)
    await sut.handle({ token: 'any_token' })

    expect(facebookAuth.perform).toHaveBeenCalledWith({ token: 'any_token' })
    expect(facebookAuth.perform).toHaveBeenCalledTimes(1)
  })
})
