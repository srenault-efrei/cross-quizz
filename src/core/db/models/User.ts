import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm'

import bcrypt from 'bcryptjs'
import Product from './Product'

@Entity()
export default class User extends BaseEntity {
  public static SALT_ROUND = 8

  @PrimaryGeneratedColumn('uuid')
  uuid!: string

  @Column({ nullable: false, unique: true })
  email!: string

  @Column({ nullable: false })
  password!: string

  @Column({ nullable: false })
  firstname!: string

  @Column({ nullable: false })
  lastname!: string

  @Column({ nullable: false })
  phone!: string

  @Column({ nullable: true })
  glutenLevel!: string

  @CreateDateColumn()
  createdAt!: string

  @UpdateDateColumn()
  updatedAt!: string

  // @ManyToMany((type) => Product, { eager: true })
  // @JoinTable({
  //   name: 'products_users',
  //   joinColumns: [{ name: 'uuid_user', referencedColumnName: 'uuid' }, { name: 'isFavorite' }],
  //   inverseJoinColumns: [{ name: 'bar_code', referencedColumnName: 'barCode' }],
  // })
  // products!: Product[]

  /**
   * Hooks
   */
  @BeforeInsert()
  public hashPassword(): void | never {
    if (!this.password) {
      throw new Error('Password is not defined')
    }

    this.password = bcrypt.hashSync(this.password, User.SALT_ROUND)
  }

  /**
   * Methods
   */
  public checkPassword(uncryptedPassword: string): boolean {
    return bcrypt.compareSync(uncryptedPassword, this.password)
  }

  public toJSON(): Partial<User> {
    const json: Partial<User> = Object.assign({}, this)
    delete json.password
    /* const { password, ...jsonUser } = json*/
    return json
  }
}
