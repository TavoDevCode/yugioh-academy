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
    default: ''
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
  is_active: {
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
