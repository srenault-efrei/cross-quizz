import { Router, Request, Response } from 'express'
import { isEmpty } from 'lodash'
import { error, success } from '../../../core/helpers/response'
import { BAD_REQUEST, CREATED, OK } from '../../../core/constants/api'
import User from '@/core/db/models/User'
import fs from 'fs'
import path from 'path'
import Bucket from '@/core/db/models/Bucket'

const myS3DATAPath = path.join(process.cwd(), 'mys3DATA/')

const api = Router()

api.post('/:uuid', async (req: Request, res: Response) => {
  try {
    const { uuid } = req.params
    const fields = ['name']
    const missings = fields.filter((field: string) => !req.body[field])

    if (!isEmpty(missings)) {
      const isPlural = missings.length > 1
      throw new Error(`Field${isPlural ? 's' : ''} [ ${missings.join(', ')} ] ${isPlural ? 'are' : 'is'} missing`)
    }

    const { name } = req.body
    const user: User | undefined = await User.findOne(uuid)

    if (user) {
      const userDirectory = path.join(myS3DATAPath, `${uuid}/${name}`)

      !fs.existsSync(userDirectory) && fs.mkdirSync(userDirectory)
      
      let bucket = new Bucket()

      bucket.name = name
      bucket.owner = user

      await bucket.save()

      res.status(CREATED.status).json(success(bucket))
    }
    else {
      res.status(BAD_REQUEST.status).json({ 'err': 'user inexistant' })
    }
    
  } catch (err) {
    res.status(BAD_REQUEST.status).json(error(BAD_REQUEST, err))
  }
})

api.get('/:uuid', async (req: Request, res: Response) => {
  try {
    const { uuid } = req.params
    const user: User | undefined = await User.findOne(uuid, { relations: ['buckets'] })

    if (user) {
      const buckets = user.buckets

      res.status(CREATED.status).json(success(buckets))
    }
    else {
      res.status(BAD_REQUEST.status).json({ 'err': 'user inexistant' })
    }
  } catch (err) {
    res.status(BAD_REQUEST.status).json(error(BAD_REQUEST, err))
  }
})

api.put('/:uuid/:bucketName', async (req: Request, res: Response) => {
  try {
    const fields = ['newBucketName']
    const { uuid, bucketName } = req.params
    
    const missings = fields.filter((field: string) => !req.body[field])
    if (!isEmpty(missings)) {
      const isPlural = missings.length > 1
      throw new Error(`Field${isPlural ? 's' : ''} [ ${missings.join(', ')} ] ${isPlural ? 'are' : 'is'} missing`)
    }

    const { newBucketName } = req.body
    const user : User | undefined = await User.findOne(uuid)

    if (user) {
      const bucket: Bucket | undefined = await Bucket.findOne({ name: bucketName })

      if(bucket) {
        bucket.name = newBucketName

        await bucket.save()
  
        res.status(OK.status).json(success(bucket))
      } else {
        res.status(BAD_REQUEST.status).json({ 'err': 'bucket inexistant' })
      }
    }
    else {
      res.status(BAD_REQUEST.status).json({ 'err': 'user inexistant' })
    }
  } catch (err) {
    res.status(BAD_REQUEST.status).json(error(BAD_REQUEST, err))
  }
})

api.delete('/:uuid', async (req: Request, res: Response) => {
  const { uuid } = req.params
  try {
    const user : User | undefined = await User.findOne(uuid)

    if(user){
      await user.remove()
      res.status(OK.status).json(success(user))
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
    const user: User | undefined = await User.findOne(uuid)

    if (user) {
      if (fs.existsSync(userDirectory)) {
        res.status(CREATED.status).json({ 'blobs': fs.readdirSync(userDirectory) })
      } else {
        res.status(BAD_REQUEST.status).json({ 'err': `No such file or directory : ${uuid}/${bucket}` })
      }
    }
    else {
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
    const user: User | undefined = await User.findOne(uuid)

    if (user) {
      if (fs.existsSync(userDirectory)) {
        res.status(CREATED.status).json({ 'blob-exist': fs.existsSync(userDirectory) })
      } else {
        res.status(BAD_REQUEST.status).json({ 'err': `No such file or directory : ${uuid}/${bucket}/${blob}` })
      }
    }
    else {
      res.status(BAD_REQUEST.status).json({ 'err': 'user inexistant' })
    }
  } catch (err) {
    res.status(BAD_REQUEST.status).json(error(BAD_REQUEST, err))
  }
})

export default api
