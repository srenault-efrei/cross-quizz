import { Router, Request, Response } from 'express'
import auth from './authenticate'
import secured from './secured'
import passport from 'passport'
import cors from 'cors'

const api = Router()
api.use(cors())

api.get('/', (req: Request, res: Response) => {
  res.json({
    hello: 'hello world',
    meta: {
      status: 'running',
      version: '1.0.0',
    },
  })
})

api.use('/authenticate', auth)
api.use('/', passport.authenticate('jwt', { session: false }), secured)

/**
    ---------------------Home --------------------
  /api [GET]  
  ---------------------Authenticate --------------------
  
  /api/authenticate/signin [POST] 
  /api/authenticate/signup [POST] 
 
 -------------------- Users In Secured -----------------

  /api/users/ [GET] 
  /api/users/:uuid [PUT] 
  /api/users/:uuid [DELETE] 
  
---------------- Products in Secured ----------------

  /api/users/products [POST] 
  /api/users/products [GET] 
  /api/users/products/:id [DELETE] 
  
----------------- ResetPassword no in Secured ------------

  /api/users/resetPassword [PUT] 
 
 */
export default api
