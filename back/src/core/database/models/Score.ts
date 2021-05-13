import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BaseEntity,
    CreateDateColumn,
    ManyToOne,
} from 'typeorm'
import User from './Users'


@Entity()
export default class Score extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number

    @ManyToOne(() => User, user => user.scores)
    user!: User

    @Column({ nullable: false })
    score!: number

    @CreateDateColumn()
    createdAt!: string
}