import AWS from 'aws-sdk'

export default function sendSms(phone: string, newPassword: string) {
  AWS.config.update({
    region: 'eu-west-3',
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
