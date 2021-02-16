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
  /api [GET]  (OK)
  ---------------------Authenticate --------------------
  
  /api/authenticate/signin [POST] (OK)
  /api/authenticate/signup [POST] (OK)
 
 -------------------- Users In Secured -----------------

  /api/users/:uuid [GET] (OK)
  /api/users/:uuid [PUT] (OK)
  /api/users/:uuid [DELETE] (OK)
  
---------------- Users action on Products in Secured ----------------

  /api/users/:uuid/products [POST] 
  /api/users/:uuid/products [GET] 

---------------- Products in Secured ----------------

  /api/products/:id [GET] 
  /api/products/:id [DELETE] 

----------------- ResetPassword no in Secured ------------

  /api/users/:email/resetPassword [PUT] (OK)
 
 */
export default api
