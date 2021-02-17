import Product from '../db/models/Product'

const products = [
  {
    barCode: 737628064502,
    product_name: 'Thai peanut',
    image: 'https://static.openfoodfacts.org/images/products/073/762/806/4502/front_en.6.100.jpg',
    mark: 'kitchen',
  },
  {
    barCode: 3017620422003,
    product_name: 'Nutella pate a tartiner aux noisettes et au cacao',
    image: 'https://static.openfoodfacts.org/images/products/301/762/042/2003/front_fr.248.400.jpg',
    mark: 'ferrero',
  },
  {
    barCode: 3229820794624,
    product_name: 'Galettes 4 céréales',
    image: 'https://static.openfoodfacts.org/images/products/322/982/079/4631/front_fr.65.400.jpg',
    mark: 'Bjorg',
  },
]

export async function addProducts(): Promise<never | void> {
  const tryProduct = await Product.find()
  if (tryProduct && tryProduct.length == products.length) {
    return
  }

  for (const product of products) {
    const p = new Product()
    if (p.barCode !== product.barCode) {
      p.barCode = product.barCode
      p.product_name = product.product_name
      p.image = product.image
      p.mark = product.mark
    }
    await p.save()
  }
}
