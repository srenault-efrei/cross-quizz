import 'reflect-metadata'
import fs from 'fs'

import { argv, prelude, mlog, myS3DATAPath } from './core/libs/utils'
import Server from './Server'

const main = async (): Promise<void> => {
  try {
    // Every beautiful story have a begining...
    prelude()


    const port = argv[0] || (process.env.PORT as string)
    const host = argv[1] || (process.env.HOST as string)
    !fs.existsSync(myS3DATAPath) && fs.mkdirSync(myS3DATAPath)
    console.log(` CHEMIN ==> ${myS3DATAPath}`);
    
    const server = new Server(host, parseInt(port, 10))
    await server.run()
  } catch (err) {
    mlog(err.message, 'error')
    process.exit(-1)
  }
}

// Let's Rock ! 😘😅
main()
