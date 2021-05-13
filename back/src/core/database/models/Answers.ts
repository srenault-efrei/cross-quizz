import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BaseEntity,
} from 'typeorm'


@Entity()
export default class Answer extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number

    @Column({ nullable: false })
    value!: string
}