import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { mock } from 'jest-mock-extended'

class FacebookApi {
  private readonly basUrl = 'https://graph.facebook.com'
  constructor (private readonly httpClient: HttpGetClient, private readonly clientId: string, private readonly clientSecret: string) {}
  async loadUser (params: LoadFacebookUserApi.Params): Promise<void> {
    await this.httpClient.get({
      url: `${this.basUrl}/oauth/access_token`,
      params: {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'client_credentials'
      }
    })
  }
}

interface HttpGetClient {
  get: (params: HttpGetClient.Params) => Promise<void>
}
namespace HttpGetClient{
  export type Params = {
    url: string
    params: object
  }
}
describe('FacebookApi', () => {
  it('should get app token', async () => {
    const clientId = 'any_client_id'
    const clientSecret = 'any_client_secret'
    const httpClient = mock<HttpGetClient>()

    const sut = new FacebookApi(httpClient, clientId,
      clientSecret)
    await sut.loadUser({ token: 'any_client_Token' })

    expect(httpClient.get).toHaveBeenCalledWith({
      url: 'https://graph.facebook.com/oauth/access_token',
      params: {
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'client_credentials'
      }
    })
  })
})
