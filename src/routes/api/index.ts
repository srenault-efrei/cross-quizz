import { Router, Request, Response } from 'express'
import auth from './authenticate'
import secured from './secured'
import passport from 'passport'
import cors from 'cors'
import User from '@/core/db/models/User'
import crypto from 'crypto'
import {  sendMail } from '@/core/libs/utils'
import bcrypt from 'bcryptjs'
import { BAD_REQUEST, CREATED, OK } from '../../core/constants/api'
import { error } from '../../core/helpers/response'

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

api.post('/reset-password/:email', async (req: Request, res: Response) => {
  const { email } = req.params
  try {
    const user: User | undefined = await User.findOne({ email: email })
    if (user) {
      //cree une chaine de caractere sur 4 bytes aleatoire que l'on cast en hexa pour la complexité
      const newPass = crypto.randomBytes(4).toString('HEX')
      const body = `<b>Hello ${user.nickname}</b><br/>Nouveau Mot de passe :${newPass}<br/>A bientot sur notre site 💩`
      await sendMail(user, 'Nouveau mot de passe', body)
      user.password = bcrypt.hashSync(newPass, User.SALT_ROUND)
      await user.save()
      res.status(OK.status).json({ 'message': 'Un mail vous a été envoyé sur votre adresse mail' })
    }
    else {
      throw new Error('Utilisateur non trouvé').stack
    }
  } catch (err) {
    res.status(BAD_REQUEST.status).json(error(BAD_REQUEST, err))
  }
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
