import {
  Entity,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  ValueTransformer,
} from 'typeorm'

export const bigint: ValueTransformer = {
  to: (entityValue: bigint) => entityValue,
  from: (databaseValue: string): bigint => BigInt(databaseValue),
}

@Entity()
export default class Product extends BaseEntity {
  @PrimaryColumn('bigint', { transformer: [bigint] })
  barcode!: number

  @Column({ nullable: false })
  product_name!: string

  @Column({ nullable: false })
  image_url!: string

  @Column({ nullable: false })
  brand!: string

  @Column({ nullable: false, default: 3 })
  isGluten!: number

  @CreateDateColumn()
  createdAt!: string

  @UpdateDateColumn()
  updatedAt!: string

  public toJSON(): Partial<Product> {
    const json: Partial<Product> = Object.assign({}, this)
    /* const { password, ...jsonUser } = json*/
    return json
  }
}
