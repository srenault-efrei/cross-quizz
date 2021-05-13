import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BaseEntity,
    OneToOne,
    JoinColumn,
} from 'typeorm'
import Answer from './Answers'


@Entity()
export default class Question extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number

    @Column({ nullable: false })
    value!: string

    @OneToOne(() => Answer)
    @JoinColumn()
    goodAnswer!: Answer
}