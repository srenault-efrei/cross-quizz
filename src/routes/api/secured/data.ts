import { Router, Request, Response } from 'express'
import { isEmpty } from 'lodash'
import bcrypt from 'bcryptjs'
import { error, success } from '../../../core/helpers/response'
import { BAD_REQUEST, CREATED, OK } from '../../../core/constants/api'
import User from '@/core/db/models/User'
import dotenv from 'dotenv'
import * as fs from 'fs'
import path from 'path'

dotenv.config()
const myS3DATAPath = path.join(process.cwd(), 'mys3DATA/')

const api = Router()
  api.get('/:uuid', async (req: Request, res: Response) => {
    const { uuid } = req.params
    const userDirectory = path.join(myS3DATAPath, uuid)
    try {
      const user : User | undefined = await User.findOne(uuid)
  
      if(user){
        !fs.existsSync(userDirectory) && fs.mkdirSync(userDirectory)

        res.status(CREATED.status).json({ 'Buckets': fs.readdirSync(userDirectory)})
      }
      else{
        res.status(BAD_REQUEST.status).json({ 'err': 'user inexistant' })
      }  
    } catch (err) {
      res.status(BAD_REQUEST.status).json(error(BAD_REQUEST, err))
    }
  })

  api.get('/:uuid/:bucket', async (req: Request, res: Response) => {
    const { uuid, bucket } = req.params
    const userDirectory = `${myS3DATAPath}/${uuid}/${bucket}`
    try {
      const user : User | undefined = await User.findOne(uuid)
  
      if(user){
        if(fs.existsSync(userDirectory)) {
          res.status(CREATED.status).json({ 'blobs': fs.readdirSync(userDirectory)})
        } else {
          res.status(BAD_REQUEST.status).json({ 'err': `No such file or directory : ${uuid}/${bucket}` })
        }
      }
      else{
        res.status(BAD_REQUEST.status).json({ 'err': 'user inexistant' })
      }  
    } catch (err) {
      res.status(BAD_REQUEST.status).json(error(BAD_REQUEST, err))
    }
  })

  api.get('/:uuid/:bucket/:blob', async (req: Request, res: Response) => {
    const { uuid, bucket, blob } = req.params
    const userDirectory = `${myS3DATAPath}/${uuid}/${bucket}/${blob}`
    try {
      const user : User | undefined = await User.findOne(uuid)
  
      if(user){
        if(fs.existsSync(userDirectory)) {
          res.status(CREATED.status).json({ 'blob-exist': fs.existsSync(userDirectory)})
        } else {
          res.status(BAD_REQUEST.status).json({ 'err': `No such file or directory : ${uuid}/${bucket}/${blob}` })
        }
      }
      else{
        res.status(BAD_REQUEST.status).json({ 'err': 'user inexistant' })
      }  
    } catch (err) {
      res.status(BAD_REQUEST.status).json(error(BAD_REQUEST, err))
    }
  })

export default api
