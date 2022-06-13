const { UserInputError } = require('apollo-server')

const User = require('../models/User')
const Format = require('../models/Format')
const Duel = require('../models/Duel')
const Instructor = require('../models/Instructor')

const moment = require('moment')
const bcryptjs = require('bcryptjs')

require('dotenv').config({ path: '.env' })

const resolvers = {
  Query: {
    // User
    getUsers: async () => {
      try {
        return await User.find({})
      } catch (e) {
        console.log({
          code: 'GET_USERS_ERROR',
          error: e
        })
      }
    },

    // Format
    getFormats: async () => {
      try {
        return await Format.find({})
      } catch (e) {
        console.log({
          code: 'GET_FORMATS_ERROR',
          error: e
        })
      }
    },

    // Duel
    getDuels: async () => {
      try {
        return await Duel.find({}).populate([
          { path: 'duelist', model: 'User' },
          { path: 'opponent', model: 'User' },
          { path: 'format', model: 'Format' }
        ])
      } catch (e) {
        console.log({
          code: 'GET_DUELS_ERROR',
          error: e
        })
      }
    },

    // Instructor
    getInstructors: async () => {
      try {
        return Instructor.find({})
      } catch (e) {
        console.log({
          code: 'GET_INSTRUCTORS_ERROR',
          error: e
        })
      }
    }
  },
  Mutation: {
    // User
    addUser: async (_, { input }) => {
      try {
        const { user, password } = input

        // validation user
        const userExist = await User.findOne({ user })
        if (userExist)
          throw new UserInputError('The user already exists!', {
            argumentName: 'user'
          })

        // hash password
        const salt = bcryptjs.genSaltSync(10)
        input.password = await bcryptjs.hashSync(password, salt)

        // save user
        const newUser = new User(input)
        return await newUser.save()
      } catch (e) {
        console.log({
          code: 'USER_ADD_ERROR',
          error: e
        })
      }
    },

    // Format
    addFormat: async (_, { input }) => {
      try {
        const { format } = input

        const formatExist = await Format.findOne({ format })
        if (formatExist)
          throw new UserInputError('The format already exists!', {
            argumentName: 'format'
          })

        const newFormat = new Format(input)
        return await newFormat.save()
      } catch (e) {
        console.log({
          code: 'FORMAT_ADD_ERROR',
          error: e
        })
      }
    },

    // Duel
    addDuel: async (_, { input }) => {
      try {
        const { date, duelist, opponent, format } = input

        if (moment(date).format('YYYYMMDD') < moment().format('YYYYMMDD'))
          throw new UserInputError('The date is less than today!', {
            argumentName: 'date'
          })

        const formatDuelRepeated = await Duel.findOne({
          date,
          duelist,
          opponent,
          format
        })

        if (formatDuelRepeated)
          throw new UserInputError('The duel with the repeated format', {
            argumentName: 'format'
          })

        const newDuel = new Duel(input)
        return await newDuel.save()
      } catch (e) {
        console.log(e)
      }
    },

    // Instructor
    addInstructor: async (_, { input }) => {
      try {
        const { instructor } = input

        // validation user
        const instructorExist = await Instructor.findOne({ instructor })
        if (instructorExist)
          throw new UserInputError('The instructor already exists!', {
            argumentName: 'instructor'
          })

        // save user
        const newInstructor = new Instructor(input)
        return await newInstructor.save()
      } catch (e) {
        console.log({
          code: 'INSTRUCTOR_ADD_ERROR',
          error: e
        })
      }
    }
  }
}

module.exports = resolvers

// console.log({
//   date: moment(date).format('YYYYMMDD'),
//   today: moment().format('YYYYMMDD'),
//   validation:
//     moment(date).format('YYYYMMDD') < moment().format('YYYYMMDD')
// })
