import dotenv from 'dotenv'
import { createConnection, Connection } from 'typeorm'
import User from './../db/models/User'
import UsersProducts from './models/UsersProducts'
import { addUsers } from '../fixtures/users'
import { addProducts } from '../fixtures/products'
import Product from './models/Product'
import { addUsersProducts } from '../fixtures/userProducts'

export default class Database {
  private static _instance: Database | null = null
  private _connection: Connection | null = null

  private constructor() {}

  public static getInstance(): Database {
    if (!Database._instance) {
      Database._instance = new Database()
    }

    return Database._instance
  }

  public addFixtures(): void {
    addUsers()
   
    setTimeout(async function () {
      addProducts()
    }, 2000);
    
    setTimeout(async function () {
      addUsersProducts()
    }, 3000);

  }

  public async authenticate(): Promise<Connection | never | null> {
    dotenv.config()

    const founded = (process.env.DATABASE_URL as string).match(/^(postgres):\/\/(.*):(.*)@(.*):(\d+)\/(.*)$/)
    if (!founded) {
      throw new Error('Please check your DATABASE_URL value')
    }

    const [, , username, password, host, port, database] = founded
  

    if(process.env.ENVIRONMENT === "DEV"){
      this._connection = await createConnection({
        type: 'postgres',
        host,
        port: parseInt(port),
        username,
        password,
        database,
        entities: [User, Product, UsersProducts],
        dropSchema: true,
        synchronize: true,
        logging: false,
      })
    }else{
      this._connection = await createConnection({
        type: 'postgres',
        host,
        port: parseInt(port),
        username,
        password,
        database,
        entities: [User, Product, UsersProducts],
        dropSchema: true,
        synchronize: true,
        logging: false,
        ssl:true,
        extra: {
          ssl: {
            rejectUnauthorized: false
          }
        }
      })
    }

   

    this.addFixtures()
    return this._connection 
  }
}
