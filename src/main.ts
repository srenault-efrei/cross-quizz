import 'reflect-metadata'
import { prelude, mlog } from './core/libs/utils'
import Server from './server'
import dotenv from 'dotenv'

const main = async (): Promise<void> => {
  try {
    // Every beautiful story have a begining...
    prelude()

    dotenv.config()

    const host: string = process.env.HOST as string
    const port = process.env.PORT as string
    const server = new Server(host, parseInt(port, 10))
    await server.run()
  } catch (err) {
    mlog(err.message, 'error')
    process.exit(-1)
  }
}

// Let's Rock ! 😘😅
main()
