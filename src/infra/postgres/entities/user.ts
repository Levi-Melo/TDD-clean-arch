import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
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
