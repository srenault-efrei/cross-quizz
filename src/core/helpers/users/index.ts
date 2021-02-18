import Product from '@/core/db/models/Product'
import _ from 'lodash'

export interface ProductInterface {
  barcode: string
  product_name: string
  image_url: string
  brand: string
  isGluten: number
}

function isGluten(data: any): number {
  let isGluten: number = 4 //(0: gluten-free, 1: traces, 2: with gluten, 4: unknow (default value))
  const glutenIngredientsList = ['ble', 'wheat', 'grano']
  const isFreeGlutenLabel: boolean = !!data.product.labels_tags.filter((label: string) => label.includes('gluten-free'))
    .length
  const isGlutenTracesTag: boolean = !!data.product.traces_tags.filter((label: string) => label.includes('gluten'))
    .length
  let isGlutenIngredientsText: boolean = false
  let ingredientsText =
    data.product.ingredients_text_fr || data.product.ingredients_text_en || data.product.ingredients_text

  ingredientsText = ingredientsText
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
  _.each(glutenIngredientsList, (glutenIngredient) => {
    if (ingredientsText.includes(glutenIngredient)) {
      isGlutenIngredientsText = true
      return false
    }
  })

  // GLUTEN LOGIC//

  if (isFreeGlutenLabel && !isGlutenTracesTag && !isGlutenIngredientsText) {
    isGluten = 0
  } else if (isGlutenTracesTag && !isGlutenIngredientsText) {
    isGluten = 1
  } else if (isGlutenIngredientsText) {
    isGluten = 2
  }

  return isGluten
}

export function getProductInfoFromOpenFoodFact(data: any): ProductInterface {
  const newProduct: ProductInterface = {
    barcode: data.code.toString(),
    product_name: data.product.product_name || data.product.generic_name || 'Nom du produit inconnu',
    image_url: data.product.image_url || null,
    brand: data.product.brands || 'Marque iconnu',
    isGluten: isGluten(data),
  }

  return newProduct
}

export function setNewProduct(productInterface: ProductInterface): Product {
  const product = new Product()

  product.barcode = productInterface.barcode
  product.product_name = productInterface.product_name
  product.image_url = productInterface.image_url
  product.brand = productInterface.brand
  product.isGluten = productInterface.isGluten

  return product
}
