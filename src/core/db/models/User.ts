import {Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  TableInheritance,
  BeforeInsert,
  OneToMany,
  AfterUpdate,
} from 'typeorm'

import bcrypt from 'bcryptjs'

interface JSONUser{
  id:string,
  email:string,
  firstname:string,
  lastname:string,
  createdAt:string,
  updatedAt:string
}


@Entity()
@TableInheritance({ column: { type: "varchar", name: "type" } })
export default class User extends BaseEntity {

  public static SALT_ROUND = 8

  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ nullable: false, unique: true })
  email!: string

  @Column({ nullable: false })
  password!: string

  @Column({ nullable: false })
  firstname!: string

  @Column({ nullable: false })
  lastname!: string

  @CreateDateColumn()
  createdAt!: string

  @UpdateDateColumn()
  updatedAt!: string



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

  public toJSON(): JSONUser {
    const json: User = Object.assign({}, this)
    const { password, ...jsonUser } = json
    return jsonUser
  }
}
