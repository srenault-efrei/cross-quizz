import AWS from 'aws-sdk'
import { GetObjectTaggingRequest } from 'aws-sdk/clients/s3';
import dotenv from 'dotenv'
import { BAD_REQUEST, OK } from '../constants/api';
import { BUCKET_NAME } from '../constants/s3';
import { success } from '../helpers/response';
const fs = require('fs')
AWS.config.update({region: 'eu-west-3'});

interface Param {
  Bucket: string,
  Key: string,
  Body: Object,
  ACL:string
}



function getS3() {
  return new AWS.S3({
    accessKeyId: process.env.AWSID as string,
    secretAccessKey: process.env.AWSSECRET as string,
  });
}


export function uploadFile(file : Express.Multer.File , key: string ) : never | Promise<void> {

  const s3 = getS3(); 

  
 // Setting up S3 upload parameters
 const params: Param = {
  Bucket: 'mys3-mj',
  Key: key, // File name you want to save as in S3
  Body:file.buffer,
  ACL:'public-read'
};

return new Promise((resolve,reject) => {
  // Uploading files to the bucket
s3.upload(params, function(err: Object, data:Object) {
  if (err) {
      reject(err);
  }
 });
 resolve()

})
}



export async function createAwsFolder(path: string ) : never | Promise<void> {
  // get s3 Object 
  const s3 = getS3();
  //Specific params for headObject
  const HEAD_PARAMS:GetObjectTaggingRequest = {
    Bucket: BUCKET_NAME,
    Key: path, 
  }
  // specific Param for putObject
 const PARAMS: Param = {
  Bucket: BUCKET_NAME,
  Key: path, 
  Body: '',
  ACL:'public-read',
};


//On retourne une new promise au top de la fonction pour qu'elle soit gerée dans le try catch qui l'appel
return new Promise((resolve,reject) => {
  s3.headObject(HEAD_PARAMS, function (err, _) {  
    if (err && err.code === 'NotFound') {  
        s3.putObject(PARAMS, function(err: Object,_) {
          if (err) {
            reject(err)
          }
        // tout va bien 
        resolve()
        });
      }
    else {
      reject(new Error('Dossier deja existant'))
    }
  })
})



}


export async function renameAwsObject(oldName:string,newName:string)  : never | Promise<void>{
const s3 = getS3()

return new Promise((resolve,reject) => {
  // Copy the object to a new location
   s3.copyObject({
  Bucket: BUCKET_NAME, 
  CopySource: `${BUCKET_NAME}/${oldName}`, 
  Key: newName
 },(err,data) => {
   if( err){
     reject(err)
   }
 }).promise().then(() => {
      // Delete the old object
      s3.deleteObject({
        Bucket: BUCKET_NAME, 
        Key: oldName
      },(err,_)=> {
        if (err){
          reject(err)
        }
        resolve()
      }) 
 })
} )

}

export async function deleteAwsObject(path:string)  : never | Promise<void> {
  const s3 = getS3()
    return new Promise((resolve,reject)=>{
   // Delete the  object
    s3.deleteObject({
      Bucket: BUCKET_NAME, 
      Key: path
    }, (err,_)=>{
      if (err){
        reject(err)
      }
      resolve()
    })
  })
 
  }

  export async function copyAwsObject(path:string,newName:string)  : never | Promise<void> {
    const s3 = getS3()
      return new Promise((resolve,reject)=>{
     // copy the  object
     s3.copyObject({
      Bucket: BUCKET_NAME, 
      CopySource: `${BUCKET_NAME}/${path}`, 
      Key: newName
     },(err,data) => {
       if( err){
         reject(err)
       }
     })
   
    })
  }

export async function existsAwsObject(path:string) : Promise<number> {
  const s3 = getS3()  
  const HEAD_PARAMS:GetObjectTaggingRequest = {
    Bucket: BUCKET_NAME,
    Key: path, 
  }
  return new Promise((resolve,reject) => {
    s3.headObject(HEAD_PARAMS, function (err, _) {  
      if (err && err.code === 'NotFound') {  
        reject(BAD_REQUEST.status)
      }
      else {
        resolve(OK.status)
      }
    })
  })
  
 
   
}