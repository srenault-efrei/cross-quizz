import { Router, Request, Response } from 'express'
import { isEmpty } from 'lodash'
import bcrypt from 'bcryptjs'
import { error, success } from '../../../core/helpers/response'
import { BAD_REQUEST, CREATED, OK } from '../../../core/constants/api'
import User from '@/core/db/models/User'
import nodemailer from 'nodemailer'
import nodemailerSendgrid from 'nodemailer-sendgrid'
import crypto from 'crypto'
import { sendMail } from '@/core/libs/utils'




const api = Router()
  api.get('/:uuid', async (req: Request, res: Response) => {
    const { uuid } = req.params
    try {
      const user : User | undefined = await User.findOne(uuid,{relations:['buckets']})
  
      if(user){
        res.status(CREATED.status).json(success(user))
      }
      else{
        res.status(BAD_REQUEST.status).json({ 'err': 'user inexistant' })
      }  
    } catch (err) {
      res.status(BAD_REQUEST.status).json(error(BAD_REQUEST, err))
    }
  })

  api.put('/:id/', async (req: Request, res: Response) => {

    const fields = ['firstname', 'lastname', 'email']
    try {
      const { id } = req.params
      
      const missings = fields.filter((field: string) => !req.body[field])
      if (!isEmpty(missings)) {
        const isPlural = missings.length > 1
        throw new Error(`Field${isPlural ? 's' : ''} [ ${missings.join(', ')} ] ${isPlural ? 'are' : 'is'} missing`)
      }
  
      const { firstname, lastname, email } = req.body
      const user : User | undefined = await User.findOne(id)
  
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

  api.delete('/:id', async (req: Request, res: Response) => {
    const { id } = req.params
    try {
      const user : User | undefined = await User.findOne(id)
  
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

  api.post('/reset-password/:email', async (req: Request, res: Response) => {
    const { email } = req.params
    try {
      const user : User | undefined = await User.findOne({email:email})
      if(user){
        //cree une chaine de caractere sur 4 bytes aleatoire que l'on cast en hexa pour la complexité
        const newPass= crypto.randomBytes(4).toString('HEX')
        const body =`<b>Hello ${user.nickname}</b><br/>Nouveau Mot de passe :${newPass}<br/>A bientot sur notre site 💩`        
        await sendMail(user,'Nouveau mot de passe',body)
        user.password = bcrypt.hashSync(newPass, User.SALT_ROUND)
        await user.save()
        res.status(OK.status).json({'message':'Un mail vous a été envoyé sur votre adresse mail'})
      }
      else{
      throw new Error('Utilisateur non trouvé').stack
      }  
    } catch (err) {
      res.status(BAD_REQUEST.status).json(error(BAD_REQUEST, err))
    }
  })


export default api
