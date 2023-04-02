import { LoadUserAccountRepository, SaveFacebookAccountRepository } from '@/data/contracts/repos/user-account'
import { PgUser } from '../entities'
import { getRepository } from 'typeorm'

export class PgUserAccountRepository implements LoadUserAccountRepository, SaveFacebookAccountRepository {
  private readonly pgUserRepo = getRepository(PgUser)

  async load ({ email }: LoadUserAccountRepository.Params): Promise<LoadUserAccountRepository.Result> {
    const pgUser = await this.pgUserRepo.findOne({ where: { email } })
    if (pgUser != null) { return { id: pgUser.id.toString(), name: pgUser.name ?? undefined } }
  }

  async saveWithFacebook ({ email, facebookId, name, id }: SaveFacebookAccountRepository.Params): Promise<SaveFacebookAccountRepository.Result> {
    if (id !== undefined) {
      await this.pgUserRepo.update({
        id: Number(id)
      }, {
        facebookId,
        name
      })
      return { id }
    }
    const pgUser = await this.pgUserRepo.save({
      email,
      facebookId,
      name
    })
    return { id: String(pgUser.id) }
  }
}
