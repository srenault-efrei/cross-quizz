import { Router, Request, Response } from 'express'
import { isEmpty } from 'lodash'
import { error, success } from '../../core/helpers/response'
import { BAD_REQUEST, CREATED, OK } from '../../core/constants/api'
import jwt from 'jsonwebtoken'
import passport from 'passport'
import User from '@/core/db/models/User'
import { sendMail } from '@/core/libs/utils'


const api = Router()

api.post('/signup', async (req: Request, res: Response) => {
  const fields = ['firstname', 'lastname', 'nickname', 'email', 'password', 'passwordConfirmation']

  try {
    const missings = fields.filter((field: string) => !req.body[field])

    if (!isEmpty(missings)) {
      const isPlural = missings.length > 1
      throw new Error(`Field${isPlural ? 's' : ''} [ ${missings.join(', ')} ] ${isPlural ? 'are' : 'is'} missing`)
    }
    const {firstname, lastname, nickname, email, password, passwordConfirmation} = req.body
    if (password !== passwordConfirmation) {
      throw new Error("Password doesn't match")
    }

    const user = new User()

    user.firstname = firstname,
    user.lastname = lastname,
    user.nickname = nickname,
    user.email = email,
    user.password = password

    await user.save()
    const body =`<b>Hello ${user.nickname}</b><br/>Mot de passe : ${password}<br/>Identifiant : ${user.email}<br/>A bientot sur notre site 💩`      
    await sendMail(user,'Identifiants',body)
    const payload = { uuid: user.uuid, firstname }
    const token = jwt.sign(payload, process.env.JWT_ENCRYPTION as string)
    res.status(OK.status).json({user,token })
  } catch (err) {
    res.status(BAD_REQUEST.status).json(error(BAD_REQUEST, err))
  }
})




api.post('/signin', async (req: Request, res: Response,next) => {
  const fields = ['email', 'password']
  try{
    const missings = fields.filter((field: string) => !req.body[field])

    if (!isEmpty(missings)) {
      const isPlural = missings.length > 1
      throw new Error(`Field${isPlural ? 's' : ''} [ ${missings.join(', ')} ] ${isPlural ? 'are' : 'is'} missing`)
    }
    
    const authenticate = passport.authenticate('local', { session: false }, (errorMessage, user) => {
      if (errorMessage) {
        res.status(BAD_REQUEST.status).json(error(BAD_REQUEST, new Error(errorMessage)))
        return
      }
      const payload : UserPayload = { uuid: user.uuid, firstname: user.firstname }
      const token = jwt.sign(payload, process.env.JWT_ENCRYPTION as string)
      req.user  = payload
      res.status(OK.status).json({user:payload,token })
    })

    authenticate(req, res,next)
  }
  catch (err){
    res.status(BAD_REQUEST.status).json(error(BAD_REQUEST,err))
  }
})

export default api
