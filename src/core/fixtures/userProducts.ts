import User from '../db/models/User'
import UsersProducts from '../db/models/UsersProducts'

const tabUsersProducts = [
  {
    id: 1,
    barCode: 737628064502,
    userId: '1f38ec56-7757-42d7-8f13-cca1df2f780c',
  },

  {
    id: 2,
    barCode: 737628064502,
    userId: '2f38ec56-7757-42d7-8f13-cca1df2f780c',
  },
  {
    id: 3,
    barCode: 3017620422003,
    userId: '1f38ec56-7757-42d7-8f13-cca1df2f780c',
  },
  {
    id: 4,
    barCode: 3229820794624,
    userId: '3f38ec56-7757-42d7-8f13-cca1df2f780c',
  },

  {
    id: 5,
    barCode: 3017620422003,
    userId: '4f38ec56-7757-42d7-8f13-cca1df2f780c',
  },
]

export async function addUsersProducts(): Promise<never | void> {
  const tryProductsUsers = await UsersProducts.find()
  if (tryProductsUsers && tryProductsUsers.length == tabUsersProducts.length) {
    return
  }

  for (const el of tabUsersProducts) {
    const up = new UsersProducts()
    if (up.id !== el.id) {
      up.barCode = el.barCode
      up.userId = el.userId
    }
    await up.save()
  }
}
