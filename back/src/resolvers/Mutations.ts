import Score from "@/core/database/models/Score"
import User from "@/core/database/models/Users"
import jwt from "jsonwebtoken"
import { getRepository } from "typeorm"
import { getUser } from "../utils"



const signUp = async (_: unknown, args: { name: string; email: string; password: string }) => {

    let user = new User()
    user.name = args.name,
        user.email = args.email,
        user.password = args.password,
        await user.save()
    const payload = { uuid: user.uuid, name: user.name };
    const token = jwt.sign(payload, process.env.JWT_SECRET as string)
    return {
        token,
        user
    }
}

const addScore = async (_: unknown, args: { score: number }, context) => {

    let userData = await getUser(context.token)
    const s: Score = new Score()
    if (userData) {
        const user = await User.findOne({ where: { uuid: userData.uuid } })
        if (user) {
            s.user = user
            s.score = args.score
        } else {
            throw new Error('User not found !')
        }
        await s.save()
    }
    return s
}

const signIn = async (_: unknown, args: { email: string; password: string }) => {
    const user = await User.findOne({ where: { email: args.email } })
    if (!user) {
        throw new Error('No such user found');
    }

    if (!user.checkPassword(args.password)) {
        throw new Error('password invalid');
    } else {
        const payload = { uuid: user.uuid, name: user.name };
        const token = jwt.sign(payload, process.env.JWT_SECRET as string)
        return {
            token,
            user
        };
    }
}

const getScoresByUser = async (_: unknown, __: void, context) => {
    let userData = await getUser(context.token)
    let scores: object = []
    if (userData.uuid) {
        const { uuid } = userData
        scores = await getRepository(Score)
            .createQueryBuilder('score')
            .leftJoinAndSelect('score.user', "user")
            .where("user.uuid = :uuid", { uuid })
            .getMany()
    }
    return scores
}

module.exports = {
    signUp,
    addScore,
    signIn,
    getScoresByUser
}