const mongoose = require('mongoose')
const { Schema, model } = mongoose

const instructorSchema = new Schema({
  instructor: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  is_admin: {
    type: Boolean,
    default: false
  },
  is_active: {
    type: Boolean,
    default: true
  },
  houses: {
    type: Array,
    default: ['UNNASIGNED']
  },
  created_at: {
    type: Date,
    default: Date.now()
  }
})

module.exports = model('Instructor', instructorSchema)
