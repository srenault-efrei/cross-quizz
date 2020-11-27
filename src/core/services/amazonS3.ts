import AWS from 'aws-sdk'
import dotenv from 'dotenv'
const fs = require('fs')


interface Param {
  Bucket: string,
  Key: string,
  Body: Object,
  ACL:string
}

  export default function uploadFile(filename: string, key: string ) {

  dotenv.config()

  const s3 = new AWS.S3({
    accessKeyId: process.env.AWSID,
    secretAccessKey:  process.env.AWSSECRET,
});

const fileContent = fs.readFileSync(filename);

 // Setting up S3 upload parameters
 const params: Param = {
  Bucket: 'trocifyfile',
  Key: key, // File name you want to save as in S3
  Body: fileContent,
  ACL:'public-read'
};

// Uploading files to the bucket
s3.upload(params, function(err: Object, data:Object) {
  if (err) {
      throw err;
  }
 });

}

