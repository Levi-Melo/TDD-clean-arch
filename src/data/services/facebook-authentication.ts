import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthentication } from '@/domain/features'
import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { SaveFacebookAccountRepository, LoadUserAccountRepository } from '@/data/contracts/apis/repos'

export class FacebookAuthenticationService {
  constructor (
    private readonly FacebookApi: LoadFacebookUserApi,
    private readonly userAccountRepository: LoadUserAccountRepository & SaveFacebookAccountRepository
  ) { }

  async perform (params: FacebookAuthentication.Params): Promise<AuthenticationError> {
    const fbData = await this.FacebookApi.loadUser(params)
    if (fbData !== undefined) {
      const accountData = await this.userAccountRepository.load({ email: fbData?.email })
      await this.userAccountRepository.saveWithFacebook({
        id: accountData?.id,
        name: accountData?.name ?? fbData.name,
        facebookId: fbData.facebookId,
        email: fbData.email
      })
    }
    return new AuthenticationError()
  }
}
