const { ApolloServer } = require('apollo-server')
const typeDefs = require('./db/typeDefs')
const resolvers = require('./db/resolvers')
const connectDB = require('./config/db')
const jwt = require('jsonwebtoken')

// Connect to database
connectDB()

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const token = req.headers.authorization || null
    if (token) {
      try {
        const user = jwt.verify(
          token.replace('Bearer ', ''),
          process.env.SECRET_KEY
        )

        return { user }
      } catch (e) {
        console.log({
          code: 'TOKEN_ERROR',
          error: e
        })
      }
    }
  }
  // csrfPrevention: true
})

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`)
})
