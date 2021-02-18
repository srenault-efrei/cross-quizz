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


  /api/users/:uuid/products/:barcode [GET] (Ajout dans products si il n'existe pas et ajout dans users_products si userId specifié et return le produit) (OK)
  /api/users/:uuid/users_products [GET] (recupre tous les produits de l'user) (OK)
  /api/users/:uuid/users_products/:barcode [PUT] (Modifie la variable isFavorite) (OK)
  /api/users/:uuid/users_products/:barcode [DELETE] (Supprime un produit de la liste du user)(OK)
  

----------------- ResetPassword no in Secured ------------

  /api/resetPassword [PUT] (OK)
 
  ----------------- Other ------------

  - Envoie de mail avec Mailjet lors de l'inscription (OK)
  - Envoie sms avec AWS SNS los du resetPassword (A finir)
 */
export default api
