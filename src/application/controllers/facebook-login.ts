import { FacebookAuthentication } from '@/domain/features'
import { AccessToken } from '@/domain/models'
import { RequiredFieldError } from '@/application/errors'
import { HttpResponse, badRequest, serverError, unauthorized, ok } from '@/application/helpers'
export class FacebookLoginController {
  constructor (private readonly facebookAuthentication: FacebookAuthentication) {}
  async handle (params: any): Promise<HttpResponse> {
    try {
      if (['', null, undefined].includes(params.token)) { return badRequest(new RequiredFieldError('token')) }

      const accessToken = await this.facebookAuthentication.perform({ token: params.token })
      if (accessToken instanceof AccessToken) {
        return ok({ accessToken: accessToken.value })
      }
      return unauthorized()
    } catch (error: any) {
      return serverError(error)
    }
  }
}
