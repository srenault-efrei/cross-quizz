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
export default class Propositions extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number

    @Column({ nullable: false })
    step!: number

    @OneToOne(() => Answer)
    @JoinColumn()
    proposition!: Answer
}