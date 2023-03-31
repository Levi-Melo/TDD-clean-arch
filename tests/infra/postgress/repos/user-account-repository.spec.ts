import { LoadUserAccountRepository } from '@/data/contracts/repos'
import { newDb } from 'pg-mem'
import { Entity, PrimaryGeneratedColumn, Column, getRepository } from 'typeorm'
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
    it('should return an account if email exists ', async () => {
      const db = newDb()
      const connection = await db.adapters.createTypeormConnection({
        type: 'postgres',
        entities: [PgUser]
      })
      // create schema
      await connection.synchronize()

      const PgUserRepo = getRepository(PgUser)
      await PgUserRepo.save({ email: 'existing_email' })

      const sut = new PgUserAccountRepository()
      const account = await sut.load({ email: 'existing_email' })

      expect(account).toEqual({ id: '1' })
    })
  })
})
