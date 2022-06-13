const { ApolloServer } = require('apollo-server')
const typeDefs = require('./db/typeDefs')
const resolvers = require('./db/resolvers')
const connectDB = require('./config/db')
// Connect to database
connectDB()

const server = new ApolloServer({
  typeDefs,
  resolvers,
  csrfPrevention: true
})

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`)
})
