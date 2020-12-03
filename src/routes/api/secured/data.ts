import { Router, Request, Response } from 'express'
import { isEmpty } from 'lodash'
import bcrypt from 'bcryptjs'
import { error, success } from '../../../core/helpers/response'
import { BAD_REQUEST, CREATED, OK } from '../../../core/constants/api'
import User from '@/core/db/models/User'
import dotenv from 'dotenv'
import * as fs from 'fs'

dotenv.config()
const myS3DATAPath = process.env.MYS3DATA_PATH

const api = Router()
  api.get('/:uuid', async (req: Request, res: Response) => {
    const { uuid } = req.params
    const userDirectory = `${myS3DATAPath}/${uuid}`
    try {
      const user : User | undefined = await User.findOne(uuid)
  
      if(user){
        !fs.existsSync(userDirectory) && fs.mkdirSync(userDirectory);

        res.status(CREATED.status).json({ 'directory-content': fs.readdirSync(userDirectory)})
      }
      else{
        res.status(BAD_REQUEST.status).json({ 'err': 'user inexistant' })
      }  
    } catch (err) {
      res.status(BAD_REQUEST.status).json(error(BAD_REQUEST, err))
    }
  })

export default api
