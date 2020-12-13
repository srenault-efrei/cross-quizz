import multer from 'multer'
import { UPLOAD_PATH } from '../constants/local_storage'
import fs from 'fs'


const storageEngine = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null,UPLOAD_PATH)
  },
  filename: function (req, file, cb) {
    cb(null,file.originalname)
  }
})
 

export const upload = multer({ storage: storageEngine })