const mongoose = require('mongoose')
const { Schema, model } = mongoose

const formatSchema = new Schema({
  format: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  value: {
    type: Number,
    required: true
  },
  is_active: {
    type: Boolean,
    default: true
  },
  created_at: {
    type: Date,
    default: Date.now()
  }
})

module.exports = model('Format', formatSchema)
