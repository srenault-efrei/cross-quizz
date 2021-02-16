import Product from '../db/models/Product'
import User from '../db/models/User'
import { users } from '../fixtures/users'
const products = [
  {
    id: 1,
    product_name: 'Thai peanut',
    image: 'https://static.openfoodfacts.org/images/products/073/762/806/4502/front_en.6.100.jpg',
    mark: 'kitchen',
    users: [users[0].uuid, users[1].uuid, users[2].uuid],
  },
  {
    id: 2,
    product_name: 'Nutella pate a tartiner aux noisettes et au cacao',
    image: 'https://static.openfoodfacts.org/images/products/301/762/042/2003/front_fr.248.400.jpg',
    mark: 'ferrero',
    users: [users[2].uuid, users[1].uuid, users[3].uuid],
  },
  {
    id: 3,
    product_name: 'Galettes 4 céréales',
    image: 'https://static.openfoodfacts.org/images/products/322/982/079/4631/front_fr.65.400.jpg',
    mark: 'Bjorg',
    users: [users[0].uuid, users[2].uuid, users[3].uuid],
  },
]

export async function addProducts(): Promise<never | void> {
  const tryProduct = await Product.find()
  if (tryProduct && tryProduct.length == products.length) {
    return
  }

  for (const product of products) {
    const productUsers: User[] = []
    const p = new Product()
    if (p.id !== product.id) {
      p.id = product.id
      p.product_name = product.product_name
      p.image = product.image
      p.mark = product.mark
      for (const user of product.users) {
        let u: User | undefined = await User.findOne(user)
        u && productUsers.push(u)
        p.users = productUsers
      }
    }
    await p.save()
  }
}