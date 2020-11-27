import User  from "../db/models/User"

const users = [

    {
        id: "2f38ec56-7757-42d7-8f13-cca1df2f780c",
        firstname: "Josias",
        lastname: "Assasmoi",
        email: "josias_trocify@yopmail.com",
        password: '123456',

    },
    {
        id: "4f38ec56-7757-42d7-8f13-cca1df2f780c",
        firstname: "Maxime",
        lastname: "Galissaire",
        email: "maxime_trocify@yopmail.com",
        password: '123456',
    },

]

export async function addUsers(): Promise<never | void> {

    for (const user of users) {
        const u = new User()
        if (u.id !== user.id) {
            u.id = user.id
            u.firstname = user.firstname
            u.lastname = user.lastname
            u.password = user.password
            u.email = user.email
        }
        await u.save()
    }
}