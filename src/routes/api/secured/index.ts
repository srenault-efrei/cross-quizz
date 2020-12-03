import { Router } from 'express'
import users from './users'
import data from './data'


const api = Router()

api.use('/users', users)
api.use('/data', data)


export default api
