const sendEmail = (body: string, email: string, subject: string) => {
  const mailjet = require('node-mailjet').connect(process.env.MJ_APIKEY_PUBLIC, process.env.MJ_APIKEY_PRIVATE)
  const request = mailjet.post('send', { version: 'v3.1' }).request({
    Messages: [
      {
        From: {
          Email: 'steven.renault@efrei.net',
          Name: 'Gluten App',
        },
        To: [
          {
            Email: email,
            Name: subject,
          },
        ],
        Subject: subject,
        HTMLPart: body,
        CustomID: 'AppGettingStartedTest',
      },
    ],
  })
  // request
  //   .then((result: any) => {
  //     // console.log(result.body)
  //   })
  //   .catch((err: any) => {
  //     // console.log(err.statusCode)
  //   })
}

export default sendEmail
