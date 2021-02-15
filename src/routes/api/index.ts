import { Router, Request, Response } from 'express'
import auth from './authenticate'
import secured from './secured'
import passport from 'passport'
import cors from 'cors'

const api = Router()
api.use(cors())

api.get('/', (req: Request, res: Response) => {
  res.json({
    hello: 'From mys3-Mj',
    meta: {
      status: 'running',
      version: '1.0.0',
    },
  })
})

api.use('/authenticate', auth)
api.use('/', passport.authenticate('jwt', { session: false }), secured)

/**
 *
 * /api
 * /api/authenticate/signin
 * /api/authenticate/signup
 * /api/users/[:id] GET | POST | PUT | DELETE
 * /api/users/:userId/posts/[:id] GET | POST | PUT | DELETE
 *
 */
export default api
