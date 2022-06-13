const mongoose = require('mongoose')
require('dotenv').config({ path: '.env' })

const connetDB = async () => {
  try {
    await mongoose.connect(process.env.DB_MONGO, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    console.log('☁️ Connected database!')
  } catch (e) {
    console.log('💔 Problems connecting to database!')
    console.log(e)
    process.exit(1)
  }
}

module.exports = connetDB
