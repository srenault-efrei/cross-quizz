import UsersProducts from '../db/models/UsersProducts'

const tabUsersProducts = [
  {
    id: 1,
    barcode: '1234567890123',
    userId: '1f38ec56-7757-42d7-8f13-cca1df2f780c',
    isFavorite: true
  },

  {
    id: 2,
    barcode: '1234567890123',
    userId: '2f38ec56-7757-42d7-8f13-cca1df2f780c',
    isFavorite: false
  },
  {
    id: 3,
    barcode: '2345678901234',
    userId: '1f38ec56-7757-42d7-8f13-cca1df2f780c',
    isFavorite: true
  },
  {
    id: 4,
    barcode: '3456789012345',
    userId: '3f38ec56-7757-42d7-8f13-cca1df2f780c',
    isFavorite: true
  },

  {
    id: 5,
    barcode: '3456789012345',
    userId: '4f38ec56-7757-42d7-8f13-cca1df2f780c',
    isFavorite: false
  },
  {
    id: 6,
    barcode: '3456789012345',
    userId: '2f38ec56-7757-42d7-8f13-cca1df2f780c',
    isFavorite: false
  }
]

export async function addUsersProducts(): Promise<never | void> {
  const tryProductsUsers = await UsersProducts.find()
  if (tryProductsUsers && tryProductsUsers.length == tabUsersProducts.length) {
    return
  }

  for (const el of tabUsersProducts) {
    const up = new UsersProducts()
    if (up.id !== el.id) {
      up.id = el.id
      up.barcode = el.barcode
      up.userId = el.userId
      up.isFavorite = el.isFavorite
    }
    await up.save()
  }
}
