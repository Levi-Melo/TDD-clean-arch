import { LoadUserAccountRepository } from '@/data/contracts/repos/user-account'
import { PgUser } from '../entities'
import { getRepository } from 'typeorm'

export class PgUserAccountRepository implements LoadUserAccountRepository {
  async load ({ email }: LoadUserAccountRepository.Params): Promise<LoadUserAccountRepository.Result> {
    const pgUserRepo = getRepository(PgUser)
    const pgUser = await pgUserRepo.findOne({ where: { email } })
    if (pgUser != null) { return { id: pgUser.id.toString(), name: pgUser.name ?? undefined } }
  }
}
