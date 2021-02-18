import User from '../db/models/User'
import bcrypt from 'bcryptjs'

export const users = [
  {
    uuid: '1f38ec56-7757-42d7-8f13-cca1df2f780c',
    firstname: 'Josias',
    lastname: 'Assasmoi',
    phone: '0663125132',
    glutenLevel: 'intolérant',
    email: 'glutenJosias@yopmail.com',
    password: '123456',
  },
  {
    uuid: '2f38ec56-7757-42d7-8f13-cca1df2f780c',
    firstname: 'Maxime',
    lastname: 'Galissaire',
    phone: '0665145132',
    glutenLevel: 'intolérant',
    email: 'glutenMaxime@yopmail.com',
    password: '123456',
  },
  {
    uuid: '3f38ec56-7757-42d7-8f13-cca1df2f780c',
    firstname: 'Steven',
    lastname: 'Renault',
    phone: '0663117132',
    glutenLevel: 'intolérant',
    email: 'glutenSteven@yopmail.com',
    password: '123456',
  },
  {
    uuid: '4f38ec56-7757-42d7-8f13-cca1df2f780c',
    firstname: 'Fabian',
    lastname: 'Facinou',
    phone: '0663115136',
    glutenLevel: 'intolérant',
    email: 'glutenFabian@yopmail.com',
    password: '123456',
  },
]

export async function addUsers(): Promise<never | void> {
  const tryUser = await User.find()
  if (tryUser && tryUser.length == users.length) {
    return
  }

  for (const user of users) {
    const u = new User()
    if (u.uuid !== user.uuid) {
      u.uuid = user.uuid
      u.firstname = user.firstname
      u.lastname = user.lastname
      u.password = bcrypt.hashSync(user.password, 8)
      u.phone = user.phone
      u.glutenLevel = user.glutenLevel
      u.email = user.email
    }
    await u.save()
  }
}
