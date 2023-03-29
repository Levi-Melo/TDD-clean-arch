import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { HttpGetClient } from '../http'

export class FacebookApi {
  private readonly basUrl = 'https://graph.facebook.com'
  constructor (private readonly httpClient: HttpGetClient, private readonly clientId: string, private readonly clientSecret: string) {}
  async loadUser (params: LoadFacebookUserApi.Params): Promise<void> {
    const appToken = await this.httpClient.get({
      url: `${this.basUrl}/oauth/access_token`,
      params: {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'client_credentials'
      }
    })
    const debugToken = await this.httpClient.get({
      url: `${this.basUrl}/debug_token`,
      params: {
        access_token: appToken.access_token,
        input_token: params.token
      }
    })

    await this.httpClient.get({
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      url: `${this.basUrl}/${debugToken.data.user_id}`,
      params: {
        fields: ['id', 'name', 'email'].join(','),
        input_token: params.token
      }
    })
  }
}
