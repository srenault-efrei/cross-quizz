import AWS from 'aws-sdk'

export default function sendSms(phone: string, newPassword: string) {
  AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.REGION,
  })

  // Create publish parameters
  var params = {
    Message: 'Votre nouveau mot de passe est : ' + newPassword /* required */,
    PhoneNumber: phone,
    MessageAttributes: {
      'AWS.SNS.SMS.SenderID': {
        DataType: 'String',
        StringValue: 'GlutenApp',
      },
    },
  }

  // Create promise and SNS service object
  var publishTextPromise = new AWS.SNS().publish(params).promise()

  // Handle promise's fulfilled/rejected states
  publishTextPromise
    .then(function (data: any) {
      console.log('MessageID is ' + data.MessageId)
    })
    .catch(function (err: any) {
      throw new Error(err.stack)
    })
}
