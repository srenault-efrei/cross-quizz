import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, JoinColumn } from 'typeorm'
import Product from './Product'
import User from './User'

@Entity()
export default class UsersProducts extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ nullable: false })
  barcode!: string

  @Column({ nullable: false })
  userId!: string

  @Column({ nullable: false, default: false })
  isFavorite!: boolean

  @ManyToOne((type) => User)
  @JoinColumn({ name: 'userId', referencedColumnName: 'uuid' })
  user!: User

  @ManyToOne((type) => Product)
  @JoinColumn({ name: 'barcode', referencedColumnName: 'barcode' })
  Product!: Product

  public toJSON(): Partial<UsersProducts> {
    const json: Partial<UsersProducts> = Object.assign({}, this)
    /* const { password, ...jsonUser } = json*/
    return json
  }
}
