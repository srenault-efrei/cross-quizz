import {Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  TableInheritance,
  BeforeInsert,
  OneToMany,
  ManyToOne
} from 'typeorm'
import User from './User'


@Entity()
@TableInheritance({ column: { type: "varchar", name: "type" } })
export default class Bucket extends BaseEntity {

  @PrimaryGeneratedColumn()
  id!: number

  @ManyToOne(type => User , user => user.buckets )
  owner: User | undefined

  @Column({ nullable: false })
  name!: string

  @Column({ nullable: false })
  firstname!: string


  @CreateDateColumn()
  createdAt!: string

  @UpdateDateColumn()
  updatedAt!: string



  /**
   * Hooks
   */
  /*
  @BeforeInsert()
  public hashPassword(): void | never {
    if (!this.password) {
      throw new Error('Password is not defined')
    }

    this.password = bcrypt.hashSync(this.password, User.SALT_ROUND)
  }

*/

  /**
   * Methods
   */

  public toJSON(): Bucket {
    const json: Bucket = Object.assign({}, this)
    return json
  }
}
