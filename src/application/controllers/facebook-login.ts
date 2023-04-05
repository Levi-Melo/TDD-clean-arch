import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthentication } from '@/domain/features'
import { AccessToken } from '@/domain/models'
import { RequiredFieldError, ServerError } from '@/application/errors'
import { HttpResponse, badRequest } from '@/application/helpers'
export class FacebookLoginController {
  constructor (private readonly facebookAuthentication: FacebookAuthentication) {}
  async handle (params: any): Promise<HttpResponse> {
    try {
      if (['', null, undefined].includes(params.token)) { return badRequest(new RequiredFieldError('token')) }

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
