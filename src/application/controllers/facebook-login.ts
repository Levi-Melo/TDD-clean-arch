import { FacebookAuthentication } from '@/domain/features'
import { AccessToken } from '@/domain/models'
import { RequiredFieldError } from '@/application/errors'
import { HttpResponse, badRequest, serverError, unauthorized, ok } from '@/application/helpers'

type HttpRequest = {
  token: string | undefined | null
}

type Model = Error | { accessToken: string }
export class FacebookLoginController {
  constructor (private readonly facebookAuthentication: FacebookAuthentication) {}
  async handle ({ token }: HttpRequest): Promise<HttpResponse<Model>> {
    try {
      if (token === '' || token === null || token === undefined) { return badRequest(new RequiredFieldError('token')) }

      const accessToken = await this.facebookAuthentication.perform({ token })
      if (accessToken instanceof AccessToken) {
        return ok({ accessToken: accessToken.value })
      }
      return unauthorized()
    } catch (error: any) {
      return serverError(error)
    }
  }
}
