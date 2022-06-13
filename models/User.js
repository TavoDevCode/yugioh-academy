const mongoose = require('mongoose')
const { Schema, model } = mongoose

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  last_name: {
    type: String,
    required: true,
    trim: true
  },
  duelist_name: {
    type: String,
    required: true,
    trim: true
  },
  discord_username: {
    type: String,
    required: false,
    trim: true
  },
  user: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  house: {
    type: String,
    default: 'UNNASIGNED'
  },
  created_at: {
    type: Date,
    default: Date.now()
  }
})

module.exports = model('User', userSchema)
