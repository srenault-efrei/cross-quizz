import { Router, Request, Response } from 'express'
import { isEmpty } from 'lodash'
import { error, success } from '../../core/helpers/response'
import { BAD_REQUEST, CREATED, OK } from '../../core/constants/api'
import jwt from 'jsonwebtoken'
import passport from 'passport'
import User from '@/core/db/models/User'
import sendEmail from '../../core/services/sendEmail'

const api = Router()

api.post('/signup', async (req: Request, res: Response) => {
  const fields = ['firstname', 'lastname', 'email', 'password', 'passwordConfirmation', 'phone']

  try {
    const missings = fields.filter((field: string) => !req.body[field])

    if (!isEmpty(missings)) {
      const isPlural = missings.length > 1
      throw new Error(`Field${isPlural ? 's' : ''} [ ${missings.join(', ')} ] ${isPlural ? 'are' : 'is'} missing`)
    }
    const { firstname, lastname, email, password, passwordConfirmation, phone, glutenLevel } = req.body
    if (password !== passwordConfirmation) {
      throw new Error("Password doesn't match")
    }

    const user = new User()

    ;(user.firstname = firstname),
      (user.lastname = lastname),
      (user.email = email),
      (user.password = password),
      (user.phone = phone),
      (user.glutenLevel = glutenLevel)

    await user.save()
    const payload = { uuid: user.uuid, firstname }
    const token = jwt.sign(payload, process.env.JWT_ENCRYPTION as string)
    const body = `Bonjour <strong>${firstname}</strong>,<p> votre inscription sur Gluten App est terminée.</p>`
    const subject = `Inscription Gluten App`
    sendEmail(body, email, subject)
    res.status(CREATED.status).json(success(user, { token }))
  } catch (err) {
    res.status(BAD_REQUEST.status).json(error(BAD_REQUEST, err))
  }
})

api.post('/signin', async (req: Request, res: Response, next) => {
  const fields = ['email', 'password']
  try {
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
      const payload: UserPayload = { uuid: user.uuid, firstname: user.firstname }
      const token = jwt.sign(payload, process.env.JWT_ENCRYPTION as string)
      req.user = payload
      res.status(OK.status).json(success(user, { token }))
    })

    authenticate(req, res, next)
  } catch (err) {
    res.status(BAD_REQUEST.status).json(error(BAD_REQUEST, err))
  }
})

export default api
