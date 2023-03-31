import { LoadUserAccountRepository } from '@/data/contracts/repos'
import { IBackup, newDb } from 'pg-mem'
import { Entity, PrimaryGeneratedColumn, Column, getRepository, Repository } from 'typeorm'
class PgUserAccountRepository implements LoadUserAccountRepository {
  async load ({ email }: LoadUserAccountRepository.Params): Promise<LoadUserAccountRepository.Result> {
    const pgUserRepo = getRepository(PgUser)
    const pgUser = await pgUserRepo.findOne({ where: { email } })
    if (pgUser != null) { return { id: pgUser.id.toString(), name: pgUser.name ?? undefined } }
  }
}

@Entity('usuarios')
export class PgUser {
  @PrimaryGeneratedColumn()
    id!: number

  @Column({ nullable: true, name: 'nome' })
    name?: string

  @Column()
    email!: string

  @Column({ nullable: true, name: 'id_facebook' })
    facebookId?: string
}
describe('PgUserAccountRepository', () => {
  describe('load', () => {
    let connection: any
    let pgUserRepo: Repository<PgUser>
    let backup: IBackup
    let sut: PgUserAccountRepository
    beforeAll(async () => {
      const db = newDb()
      connection = await db.adapters.createTypeormConnection({
        type: 'postgres',
        entities: [PgUser]
      })
      await connection.synchronize()
      backup = db.backup()
      pgUserRepo = getRepository(PgUser)
    })
    afterAll(async () => {
      await connection.close()
    })

    beforeEach(() => {
      backup.restore()
      sut = new PgUserAccountRepository()
    })
    it('should return an account if email exists ', async () => {
      await pgUserRepo.save({ email: 'any_email' })

      const account = await sut.load({ email: 'any_email' })

      expect(account).toEqual({ id: '1' })
    })

    it('should return undefined if email not exists ', async () => {
      const account = await sut.load({ email: 'any_email' })

      expect(account).toBeUndefined()
    })
  })
})
