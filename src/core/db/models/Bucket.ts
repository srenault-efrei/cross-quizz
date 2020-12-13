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
import Blob from './Blob'
import User from './User'


@Entity()
@TableInheritance({ column: { type: "varchar", name: "type" } })
export default class Bucket extends BaseEntity {

  @PrimaryGeneratedColumn()
  id!: number

  @ManyToOne(type => User , user => user.buckets )
  owner: Partial<User> | undefined

  @OneToMany(_ => Blob , blob => blob.bucket  )
  blobs! : Blob[]

  @Column({ nullable: false })
  name!: string

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

  public toJSON(): Partial<Bucket> {
    const json: Partial<Bucket> = Object.assign({}, this)
    delete json.owner?.password
    return json
  }
}
