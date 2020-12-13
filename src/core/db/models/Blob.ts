import {Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  TableInheritance,
  OneToMany,
  ManyToOne
} from 'typeorm'
import Bucket from './Bucket'
import User from './User'


@Entity()
@TableInheritance({ column: { type: "varchar", name: "type" } })
export default class Blob extends BaseEntity {

  @PrimaryGeneratedColumn()
  id!: number

  @ManyToOne(_ => Bucket , bucket => bucket.blobs )
  bucket: Bucket | undefined

  @Column({ nullable: false })
  name!: string

  
  @Column({ nullable: false })
  path!: string

  
  @Column({ nullable: false })
  size!: number

  @CreateDateColumn()
  createdAt!: string

  @UpdateDateColumn()
  updatedAt!: string


  /**
   * Methods
   */

  public toJSON(): Blob {
    const json: Blob = Object.assign({}, this)
    return json
  }
}
