import { Router, Request, Response } from 'express'
import { isEmpty } from 'lodash'
import bcrypt from 'bcryptjs'
import { error, success } from '../../../core/helpers/response'
import { BAD_REQUEST, CREATED, OK } from '../../../core/constants/api'
import User from '../../../core/db/models/User'

const api = Router()

api.get('/:uuid', async (req: Request, res: Response) => {
  try {
    const { uuid } = req.params

    const user: User | undefined = await User.findOne(uuid)
    res.status(CREATED.status).json(success(user))
  } catch (err) {
    res.status(BAD_REQUEST.status).json(error(BAD_REQUEST, err))
  }
})

api.put('/:uuid/', async (req: Request, res: Response) => {
  const fields: string[] = []
  try {
    const { uuid } = req.params

    const missings: string[] = fields.filter((field: string) => !req.body[field])
    if (!isEmpty(missings)) {
      const isPlural = missings.length > 1
      throw new Error(`Field${isPlural ? 's' : ''} [ ${missings.join(', ')} ] ${isPlural ? 'are' : 'is'} missing`)
    }

    const { firstname, lastname, email, phone, glutenLevel, password } = req.body
    const user: User | undefined = await User.findOne(uuid)

    if (user) {
      password ? (user.password = bcrypt.hashSync(password, User.SALT_ROUND)) : ''
      firstname ? (user.firstname = firstname) : user.firstname,
        email ? (user.email = email) : user.email,
        lastname ? (user.lastname = lastname) : user.lastname
      phone ? (user.phone = phone) : user.phone
      glutenLevel ? (user.glutenLevel = glutenLevel) : user.glutenLevel

      await user.save()
      res.status(OK.status).json(success(user))
    } else {
      res.status(BAD_REQUEST.status).json({ err: 'user inexistant' })
    }
  } catch (err) {
    res.status(BAD_REQUEST.status).json(error(BAD_REQUEST, err))
  }
})

api.delete('/:uuid', async (req: Request, res: Response) => {
  try {
    const { uuid } = req.params
    const user: User | undefined = await User.findOne(uuid)
    user?.remove()
    res.status(OK.status).json(success(user))
  } catch (err) {
    res.status(BAD_REQUEST.status).json(error(BAD_REQUEST, err))
  }
})
export default api
