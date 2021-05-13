import jwt from "jsonwebtoken"


export const getUser = (token) => {
    if (!token) {
        throw new Error('You should provide a token!');
    }
    const user: any = jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
        if (err) throw new Error('invalid token!')
        return decoded;
    })

    return user
}