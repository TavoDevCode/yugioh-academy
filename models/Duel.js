const mongoose = require('mongoose')
const { Schema, model } = mongoose

const duelSchema = new Schema({
  date: {
    type: Date,
    required: true,
    trim: true
  },
  duelist: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  opponent: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  format: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Format'
  },
  status: {
    type: String,
    default: 'UNAPPROVED'
  },
  deck_image_url: {
    type: String,
    required: true,
    trim: true
  },
  win_image_url: {
    type: String,
    required: true,
    trim: true
  },
  created_at: {
    type: Date,
    default: Date.now()
  }
})

module.exports = model('Duel', duelSchema)
