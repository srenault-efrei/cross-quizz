import { Router, Request, Response } from 'express'
import { isEmpty } from 'lodash'
import { error, success } from '../../../core/helpers/response'
import { BAD_REQUEST, CREATED, OK } from '../../../core/constants/api'
import User from '@/core/db/models/User'



const api = Router()
  api.get('/:uuid', async (req: Request, res: Response) => {
    const { uuid } = req.params
    try {
      const user : User | undefined = await User.findOne(uuid)
  
      if(user){
        res.status(CREATED.status).json(success(user))
      }
      else{
        throw new Error('User inexistant')
  
      }  
    } catch (err) {
      res.status(BAD_REQUEST.status).json(error(BAD_REQUEST, err))
    }
  })

export default api
