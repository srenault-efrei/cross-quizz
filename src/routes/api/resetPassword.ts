import { Router, Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import { error, success } from '../../core/helpers/response'
import { BAD_REQUEST, CREATED, OK } from '../../core/constants/api'
import User from '../../core/db/models/User'
import generator from 'generate-password'
import sendSms from '@/core/services/sendSms'

const api = Router()

api.put('/', async (req: Request, res: Response) => {
  try {
    const { phone } = req.body

    const password = generator.generate({
      length: 10,
      numbers: true,
    })
    let phoneWithIndicator = '+33' + phone.slice(1, phone.length)
    console.log(phoneWithIndicator)
    const user = await User.findOne({ phone })
    if (user && password) {
      const passwordHash = bcrypt.hashSync(password, User.SALT_ROUND)
      if (!bcrypt.compareSync(password, user.password)) {
        user.password = passwordHash
        await user.save()
        sendSms(phoneWithIndicator, password)
        res.status(OK.status).json(success(user))
        console.log('Nouveau mot de passe : ', password)
      } else {
        res.status(BAD_REQUEST.status).json({
          err: 'mot de passe courant identique au nouveau mot de passe',
        })
      }
    } else {
      res.status(BAD_REQUEST.status).json({ err: 'user inexistant' })
    }
  } catch (err) {
    res.status(BAD_REQUEST.status).json(error(BAD_REQUEST, err))
  }
})

export default api
