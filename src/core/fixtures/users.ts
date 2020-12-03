import User  from "../db/models/User"

const users = [

    {
        uuid: "2f38ec56-7757-42d7-8f13-cca1df2f780c",
        firstname: "Josias",
        lastname: "Assasmoi",
        nickname:'Josiiiii',
        email: "josias_mys3@yopmail.com",
        password: '123456',

    },
    {
        uuid: "4f38ec56-7757-42d7-8f13-cca1df2f780c",
        firstname: "Maxime",
        lastname: "Galissaire",
        nickname:'MaxiTurboChi',
        email: "maxime_mys3@yopmail.com",
        password: '123456',
    },

]

export async function addUsers(): Promise<never | void> {

    for (const user of users) {
        const u = new User()
        if (u.uuid !== user.uuid) {
            u.uuid = user.uuid
            u.firstname = user.firstname
            u.nickname= user.nickname
            u.lastname = user.lastname
            u.password = user.password
            u.email = user.email
        }
        await u.save()
    }
}