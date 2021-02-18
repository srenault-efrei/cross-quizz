import { Router } from 'express'
import users from './users'
import product from './product'

const api = Router()

api.use('/users', users)
api.use('/product', product)

export default api
