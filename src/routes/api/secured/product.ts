import { Router, Request, Response } from 'express'
import _, { isEmpty } from 'lodash'
import bcrypt from 'bcryptjs'
import { error, success } from '../../../core/helpers/response'
import { BAD_REQUEST, CREATED, OK } from '../../../core/constants/api'
import Product from '../../../core/db/models/Product'
import User from '../../../core/db/models/User'
import UsersProducts from '../../../core/db/models/UsersProducts'
import fetch from 'node-fetch'
import { getRepository } from 'typeorm'

const api = Router()

interface ProductInterface {
  barcode: string,
  product_name: string,
  image_url: string,
  brand: string,
  isGluten: number
}

api.get('/:barcode', async (req: Request, res: Response) => {
  try {
    const { barcode } = req.params
    const { uuid } = req.body

    const product: Product | undefined = await Product.findOne(barcode)

    if (product) { // If product exist
      if (uuid) { // If user specified on body
        try {
          const user: User | undefined = await User.findOne(uuid)

          if (user) {
            const userProduct: UsersProducts | undefined = await getRepository(UsersProducts)
              .createQueryBuilder("usersProducts")
              .where("usersProducts.userId = :uuid", { uuid })
              .andWhere("usersProducts.barcode = :barcode", { barcode })
              .getOne()

            if (userProduct) { // If userProduct exist
              res.status(CREATED.status).json(success(product))
            } else { // If userProduct does not exist (create it)
              const newUserProduct = new UsersProducts()

              newUserProduct.barcode = barcode
              newUserProduct.userId = uuid

              await newUserProduct.save()
              res.status(CREATED.status).json(success(product))
            }
          } else {
            res.status(BAD_REQUEST.status).json({ 'err': 'Specified user does not exist' })
          }
        } catch (err) {
          res.status(BAD_REQUEST.status).json(error(BAD_REQUEST, err))
        }
      } else { //If no user specified on body
        res.status(CREATED.status).json(success(product))
      }
    } else { // If product does not exist (create it)
      const response = await fetch(
        `https://world.openfoodfacts.org/api/v0/product/${barcode}`
      )
      const data = await response.json()

      if (data.status) { // If product exist on OpenFoodFact (adding on DB)
        const productInterface: ProductInterface = getProductInfoFromOpenFoodFact(data)

        const newProduct = setNewProduct(productInterface)
        await newProduct.save()

        if (uuid) { // If user specified on body
          try {
            const user: User | undefined = await User.findOne(uuid)

            if (user) {
              const usersProduct: UsersProducts | undefined = await getRepository(UsersProducts)
                .createQueryBuilder("usersProducts")
                .where("usersProducts.userId = :uuid", { uuid })
                .andWhere("usersProducts.barcode = :barcode", { barcode })
                .getOne()

              if (usersProduct) { // If userProduct exist
                res.status(CREATED.status).json(success(product))
              } else { // If userProduct does not exist (create it)
                const newUsersProducts = new UsersProducts()

                newUsersProducts.barcode = barcode
                newUsersProducts.userId = uuid

                await newUsersProducts.save()
                res.status(CREATED.status).json(success(product))
              }
            } else {
              res.status(BAD_REQUEST.status).json({ 'err': 'Specified user does not exist' })
            }
          } catch (err) {
            res.status(BAD_REQUEST.status).json(error(BAD_REQUEST, err))
          }
        } else { // If no user specified on body
          res.status(CREATED.status).json(success(product))
        }
      } else { // If product does not exist on OpenFoodFact
        res.status(BAD_REQUEST.status).json({ 'err': 'Product does not exist' })
      }
    }

  } catch (err) {
    res.status(BAD_REQUEST.status).json(error(BAD_REQUEST, err))
  }
})

function getProductInfoFromOpenFoodFact(data: any): ProductInterface {
  const newProduct: ProductInterface = {
    barcode: data.code.toString(),
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

function setNewProduct(productInterface: ProductInterface): Product {
  const product = new Product()

  product.barcode = productInterface.barcode
  product.product_name = productInterface.product_name
  product.image_url = productInterface.image_url
  product.brand = productInterface.brand
  product.isGluten = productInterface.isGluten

  return product
}


export default api
