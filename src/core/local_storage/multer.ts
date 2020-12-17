import multer from 'multer'
import { UPLOAD_PATH } from '../constants/local_storage'
import fs from 'fs'
import { StorageGateway } from 'aws-sdk';


const prodStorage = multer.memoryStorage();

const localStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null,UPLOAD_PATH)
  },
  filename: function (req, file, cb) {
    cb(null,file.originalname)
  }
})
 

const storage = ('NPM_CONFIG_PRODUCTION' in process.env) ? prodStorage : localStorage
export const upload = multer({ storage })