import { Router, Request, Response } from 'express'
import { isEmpty } from 'lodash'
import bcrypt from 'bcryptjs'
import { error, success } from '../../../core/helpers/response'
import { BAD_REQUEST, CREATED, OK } from '../../../core/constants/api'
import Product from '../../../core/db/models/Product'
import fetch from 'node-fetch'

const api = Router()

api.get('/:barcode', async (req: Request, res: Response) => {
  try {
    const { barcode } = req.params

    const product: Product | undefined = await Product.findOne(barcode)

    if (product) {
      res.status(CREATED.status).json(success(product))
    } else {
      const response = await fetch(
        `https://world.openfoodfacts.org/api/v0/product/${barcode}`
      )
      const data = await response.json();

      

      const newProduct = new Product()

      res.status(BAD_REQUEST.status).json({ 'err': 'Product does not exist' })
    }

  } catch (err) {
    res.status(BAD_REQUEST.status).json(error(BAD_REQUEST, err))
  }
})

function getProductInfoFromOpenFoodFact(data: object) {

}

function isGluten(data: object) {

}

export default api
