import { Router, Request, Response, response } from 'express'
import { isEmpty } from 'lodash'
import bcrypt from 'bcryptjs'
import { error, success } from '../../../core/helpers/response'
import { BAD_REQUEST, CREATED, OK } from '../../../core/constants/api'
import User from '@/core/db/models/User'
import Bucket from '@/core/db/models/Bucket'
import crypto from 'crypto'
import {  sendMail } from '@/core/libs/utils'
import fs from 'fs'
import path from 'path'
import { getRepository } from 'typeorm'
import { createFolder, deleteObject, existsObject, renameObject } from '@/core/services/amazonS3'
import { MY_S3_DATA_PATH } from '@/core/constants/s3'

const api = Router()



// api.use('/:uuid', (req,_, next)=> {
//   const { uuid } = req.params
  
//   if (uuid != req.uuid){
//     throw new Error("Your are not authorized")
//   }
//   next()
// })

api.get('/:uuid', async (req: Request, res: Response) => {
  const { uuid } = req.params
  try {

    const user: User | undefined = await User.findOne(uuid, { relations: ['buckets'] })

    if (user) {


      res.status(CREATED.status).json(success(user))
    }
    else {
      res.status(BAD_REQUEST.status).json({ 'err': 'user inexistant' })
    }
  } catch (err) {
    res.status(BAD_REQUEST.status).json(error(BAD_REQUEST, err))
  }
})

api.put('/:uuid/', async (req: Request, res: Response) => {

  const fields = ['firstname', 'lastname', 'email']
  try {
    const { uuid } = req.params

    const missings = fields.filter((field: string) => !req.body[field])
    if (!isEmpty(missings)) {
      const isPlural = missings.length > 1
      throw new Error(`Field${isPlural ? 's' : ''} [ ${missings.join(', ')} ] ${isPlural ? 'are' : 'is'} missing`)
    }

    const { firstname, lastname, email } = req.body
    const user: User | undefined = await User.findOne(uuid)

    if (user) {
      if (req.body.password) {
        user.password = bcrypt.hashSync(req.body.password, User.SALT_ROUND)
      }

      user.firstname = firstname
      user.lastname = lastname
      user.email = email

      await user.save()
      res.status(OK.status).json(success(user))
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
    const user: User | undefined = await User.findOne(uuid)

    if (user) {
      await user.remove()
      res.status(OK.status).json(success(user))
    }
    else {
      res.status(BAD_REQUEST.status).json({ 'err': 'user inexistant' })
    }
  } catch (err) {
    res.status(BAD_REQUEST.status).json(error(BAD_REQUEST, err))
  }
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



// Buckets ////////////////////////


api.post('/:uuid/buckets', async (req: Request, res: Response) => {
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
      const newFolderPath = getObjectPath(uuid,name)
      
      // if (!fs.existsSync(userDirectory)) {
      //   fs.mkdirSync(userDirectory, { recursive: true })
      // }
      await createFolder(newFolderPath)
      let bucket = new Bucket()
      bucket.name = name
      bucket.owner = user
      await bucket.save()
      res.status(CREATED.status).json(success(bucket))
      
    }
    else {
      throw new Error('Utilisateur inexistant')
    }
    
  } catch (err) {
    
    res.status(BAD_REQUEST.status).json(error(BAD_REQUEST, err))
  }
})

api.get('/:uuid/buckets', async (req: Request, res: Response) => {
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

api.get('/:uuid/buckets/:bucket_id', async (req: Request, res: Response) => {
  try {
    const { uuid, bucket_id } = req.params
    
    const user : User | undefined = await User.findOne(uuid)

    if (user) {
      const bucket: Bucket | undefined  = await getRepository(Bucket)
      .createQueryBuilder("bucket")
      .leftJoinAndSelect("bucket.owner", "user")
      .where("bucket.owner.uuid = :uuid", { uuid })
      .andWhere("bucket.id = :bucket_id", { bucket_id })
      .getOne()

      if(bucket) {
        res.status(OK.status).json(success(bucket))
      }
      else {
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

api.put('/:uuid/buckets/:bucket_id', async (req: Request, res: Response) => {
  try {
    const fields = ['newBucketName']
    const { uuid, bucket_id } = req.params
    
    const missings = fields.filter((field: string) => !req.body[field])
    if (!isEmpty(missings)) {
      const isPlural = missings.length > 1
      throw new Error(`Field${isPlural ? 's' : ''} [ ${missings.join(', ')} ] ${isPlural ? 'are' : 'is'} missing`)
    }

    const { newBucketName } = req.body
    const user : User | undefined = await User.findOne(uuid)

    if (user) {
      const bucket: Bucket | undefined  = await getRepository(Bucket)
      .createQueryBuilder("bucket")
      .leftJoinAndSelect("bucket.owner", "user")
      .where("bucket.owner.uuid = :uuid", { uuid })
      .andWhere("bucket.id = :bucket_id", { bucket_id })
      .getOne()

      if(bucket) {
        const oldPath= getObjectPath(uuid,bucket.name)
        const newPath= getObjectPath(uuid,newBucketName)
        await renameObject(oldPath,newPath)
        bucket.name = newBucketName
        await bucket.save()
        res.status(OK.status).json(success(bucket))
      }
      else {
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



api.delete('/:uuid/buckets/bucket_id', async (req: Request, res: Response) => {
  try {
    const { uuid, bucket_id } = req.params
    const user : User | undefined = await User.findOne(uuid)

    if (user) {
      const bucket: Bucket | undefined  = await getRepository(Bucket)
      .createQueryBuilder("bucket")
      .leftJoinAndSelect("bucket.owner", "user")
      .where("bucket.owner.uuid = :uuid", { uuid })
      .andWhere("bucket.id = :bucket_id", { bucket_id })
      .getOne()

      if(bucket) {
        const path= getObjectPath(uuid,bucket.name)
        await deleteObject(path)
        await bucket.remove()
        await bucket.save()
        res.status(OK.status).json(success(bucket))
      }
      else {
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

api.head('/:uuid/buckets/:bucket_id', async (req: Request, res: Response) => {
  try {
    const { uuid, bucket_id } = req.params
    const user : User | undefined = await User.findOne(uuid)

    if (user) {
      const bucket: Bucket | undefined  = await getRepository(Bucket)
      .createQueryBuilder("bucket")
      .leftJoinAndSelect("bucket.owner", "user")
      .where("bucket.owner.uuid = :uuid", { uuid })
      .andWhere("bucket.id = :bucket_id", { bucket_id })
      .getOne()

      if(bucket) {
        const path= getObjectPath(uuid,bucket.name)
      const status : number =  await existsObject(path)
        res.status(status).send()
      }
    }
    res.status(BAD_REQUEST.status).send()
  } catch (err) {
    res.status(BAD_REQUEST.status).send()
  }
})


// Blob ////////////////////////

api.get('/:uuid/buckets/:bucket/blobs/:blob', async (req: Request, res: Response) => {
  const { uuid, bucket, blob } = req.params
  const userDirectory = `${MY_S3_DATA_PATH}/${uuid}/${bucket}/${blob}`
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

export function getObjectPath(uuid:string,name:string){
  return path.join(MY_S3_DATA_PATH, `${uuid}/${name}/`)
}


export default api
