import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { HttpGetClient } from '../http'

type AppToken = {
  access_token: string
}

type DebugToken = {
  data: { user_id: string }
}

type UserInfo = {
  id: string
  email: string
  name: string
}
export class FacebookApi implements LoadFacebookUserApi {
  private readonly basUrl = 'https://graph.facebook.com'
  constructor (private readonly httpClient: HttpGetClient, private readonly clientId: string, private readonly clientSecret: string) {}
  async loadUser (params: LoadFacebookUserApi.Params): Promise<LoadFacebookUserApi.Result> {
    const userInfo = await this.getUserInfo(params.token)
    return {
      facebookId: userInfo.id,
      email: userInfo.email,
      name: userInfo.name
    }
  }

  private async getAppToken (): Promise<AppToken> {
    return this.httpClient.get({
      url: `${this.basUrl}/oauth/access_token`,
      params: {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'client_credentials'
      }
    })
  }

  private async getDebugToken (clientToken: string): Promise<DebugToken> {
    const appToken = await this.getAppToken()
    return this.httpClient.get({
      url: `${this.basUrl}/debug_token`,
      params: {
        access_token: appToken.access_token,
        input_token: clientToken
      }
    })
  }

  private async getUserInfo (clientToken: string): Promise<UserInfo> {
    const debugToken = await this.getDebugToken(clientToken)
    return this.httpClient.get({
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      url: `${this.basUrl}/${debugToken.data.user_id}`,
      params: {
        fields: ['id', 'name', 'email'].join(','),
        input_token: clientToken
      }
    })
  }
}
