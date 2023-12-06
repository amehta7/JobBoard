import { ApolloServer } from '@apollo/server'
import { expressMiddleware as apolloMiddleware } from '@apollo/server/express4'
import cors from 'cors'
import express from 'express'
import { authMiddleware, handleLogin } from './auth.js'
import http from 'http'
import { readFile } from 'node:fs/promises'
import { resolvers } from './resolvers.js'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import { getUser } from './db/users.js'

const PORT = 9000

const app = express()
app.use(cors(), express.json(), authMiddleware)

app.post('/login', handleLogin)

const httpServer = http.createServer(app)

const getContext = async ({ req }) => {
  //console.log(req)
  if (req.auth) {
    const user = await getUser(req.auth.sub)
    return { user }
  }

  return {}
}

const typeDefs = await readFile('./schema.graphql', 'utf8')

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
})
await apolloServer.start()

app.use('/graphql', apolloMiddleware(apolloServer, { context: getContext }))

app.listen({ port: PORT }, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`GraphQL endpoint: http://localhost:${PORT}/graphql`)
})
