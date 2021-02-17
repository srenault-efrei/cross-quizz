import { Router, Request, Response } from 'express'
import _, { isEmpty } from 'lodash'
import bcrypt from 'bcryptjs'
import { error, success } from '../../../core/helpers/response'
import { BAD_REQUEST, CREATED, OK } from '../../../core/constants/api'
import Product from '../../../core/db/models/Product'
import fetch from 'node-fetch'

const api = Router()

interface NewProduct {
  barcode: number,
  product_name: string,
  image_url: string,
  brand: string,
  isGluten: number
}

api.get('/:barcode', async (req: Request, res: Response) => {
  try {
    const { barcode } = req.params

    let product: Product | undefined = await Product.findOne(barcode)

    if (product) {
      res.status(CREATED.status).json(success(product))
    } else {
      const response = await fetch(
        `https://world.openfoodfacts.org/api/v0/product/${barcode}`
      )
      const data = await response.json()

      if (data.status) {
        const newProduct: NewProduct = getProductInfoFromOpenFoodFact(data)

        product = createNewProduct(newProduct)
        await product.save()

        if (product) {
          res.status(CREATED.status).json(success(product))
        } else {
          res.status(BAD_REQUEST.status).json({ 'err': 'Unable to create product in database' })
        }
      } else {
        res.status(BAD_REQUEST.status).json({ 'err': 'Product does not exist' })
      }
    }

  } catch (err) {
    res.status(BAD_REQUEST.status).json(error(BAD_REQUEST, err))
  }
})

function getProductInfoFromOpenFoodFact(data: any): NewProduct {
  const newProduct: NewProduct = {
    barcode: data.code,
    product_name: data.product.product_name || data.product.generic_name || 'Nom du produit inconnu',
    image_url: data.product.image_url || null,
    brand: data.product.brands || 'Marque iconnu',
    isGluten: isGluten(data)
  }

  return newProduct
}

function isGluten(data: any): number {
  let isGluten: number = 4 //(0: gluten-free, 1: traces, 2: with gluten, 4: unknow (default value))
  const glutenIngredientsList = ['ble', 'wheat', 'grano']
  const isFreeGlutenLabel: boolean = !!data.product.labels_tags.filter((label: string) => label.includes('gluten-free')).length
  const isGlutenTracesTag: boolean = !!data.product.traces_tags.filter((label: string) => label.includes('gluten')).length
  let isGlutenIngredientsText: boolean = false
  let ingredientsText = data.product.ingredients_text_fr || data.product.ingredients_text_en || data.product.ingredients_text

  ingredientsText = ingredientsText.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
  _.each(glutenIngredientsList, glutenIngredient => {
    if (ingredientsText.includes(glutenIngredient)) {
      isGlutenIngredientsText = true
      return false
    }
  })

  // GLUTEN LOGIC//

  if (isFreeGlutenLabel && (!isGlutenTracesTag && !isGlutenIngredientsText)) {
    isGluten = 0
  } else if (isGlutenTracesTag && !isGlutenIngredientsText) {
    isGluten = 1
  } else if (isGlutenIngredientsText) {
    isGluten = 2
  }

  return isGluten
}

function createNewProduct(newProduct: NewProduct): Product {
  const product = new Product()

  product.barcode = newProduct.barcode
  product.product_name = newProduct.product_name
  product.image_url = newProduct.image_url
  product.brand = newProduct.brand
  product.isGluten = newProduct.isGluten

  return product
}

export default api
