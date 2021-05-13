const { ApolloServer, gql } = require('apollo-server')
const fs = require("fs")
const path = require("path")

const { Query } = require("./resolvers/Query")
const Mutation = require("./resolvers/Mutations")

import Database from "@/core/database/index"
import { mlog } from "@/core/libs/utils"
import { prelude } from "@/core/libs/utils"

prelude()

const db = Database.getInstance()
db.authenticate()
  .then(() => {
    mlog('🖖 Database successfully authenticated', 'success')
    const resolvers = {
      Query,
      Mutation
    }

    const server = new ApolloServer({
      typeDefs: fs.readFileSync(
        path.join(__dirname, 'schema.graphql'), 'utf8'
      ),
      resolvers,
      context: ({ req }) => {
        // get the authorization from the request headers 
        const token = req.headers.authorization || ''
        return {
          token
        }
      }
    })


    server.listen().then(({ url }: any) => {
      mlog(`🚀  Server ready at ${url}`)
    });

  }).catch((err) => {
    mlog(`Database error authenticated | error : ${err}`, 'error')
  })



