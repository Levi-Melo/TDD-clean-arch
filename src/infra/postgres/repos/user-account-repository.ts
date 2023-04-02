import { LoadUserAccountRepository, SaveFacebookAccountRepository } from '@/data/contracts/repos/user-account'
import { PgUser } from '../entities'
import { getRepository } from 'typeorm'

export class PgUserAccountRepository implements LoadUserAccountRepository, SaveFacebookAccountRepository {
  async load ({ email }: LoadUserAccountRepository.Params): Promise<LoadUserAccountRepository.Result> {
    const pgUserRepo = getRepository(PgUser)
    const pgUser = await pgUserRepo.findOne({ where: { email } })
    if (pgUser != null) { return { id: pgUser.id.toString(), name: pgUser.name ?? undefined } }
  }

  async saveWithFacebook ({ email, facebookId, name, id }: SaveFacebookAccountRepository.Params): Promise<SaveFacebookAccountRepository.Result> {
    const pgUserRepo = getRepository(PgUser)
    if (id !== undefined) {
      await pgUserRepo.update({
        id: Number(id)
      }, {
        facebookId,
        name
      })
      return { id }
    }
    const pgUser = await pgUserRepo.save({
      email,
      facebookId,
      name
    })
    return { id: String(pgUser.id) }
  }
}
