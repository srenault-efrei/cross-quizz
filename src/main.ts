import 'reflect-metadata'
import fs from 'fs'
import os from 'os'

import { argv, prelude, mlog } from './core/libs/utils'
import Server from './Server'
import { UPLOAD_PATH } from './core/constants/local_storage'

const main = async (): Promise<void> => {
  try {
    // Every beautiful story have a begining...
    prelude()

    const port = argv[0] || (process.env.PORT as string)
    const host = argv[1] || (process.env.HOST as string)

    if ('NODE_PRODUCTION' in process.env == false) {
           if (!fs.existsSync(UPLOAD_PATH)) {
              fs.mkdirSync(UPLOAD_PATH)
           }
      
       }

    const server = new Server(host, parseInt(port, 10))
    await server.run()
  } catch (err) {
    mlog(err.message, 'error')
    process.exit(-1)
  }
}

// Let's Rock ! 😘😅
main()
