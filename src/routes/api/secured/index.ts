import { Router } from 'express'
import users from './users'
import products from './products'

const api = Router()

api.use('/users', users)
api.use('/products', products)

export default api
