const { UserInputError } = require('apollo-server')

const User = require('../models/User')
const Format = require('../models/Format')
const Duel = require('../models/Duel')
const Instructor = require('../models/Instructor')

const moment = require('moment')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')

require('dotenv').config({ path: '.env' })

const createToken = (data, key, expiresIn) => {
  const { id, instructor } = data

  return jwt.sign(
    instructor ? { id: instructor.id, instructor_id: id } : { id },
    key,
    {
      expiresIn
    }
  )
}

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
    getUser: async (_, _data, ctx) => {
      try {
        const {
          user: { id }
        } = ctx

        return await User.findById(id)
      } catch (e) {
        console.log({
          code: 'GET_USER_ERROR',
          error: e
        })
      }
    },
    getUserById: async (_, { id }) => {
      try {
        const userExist = await User.findById(id)
        if (!userExist)
          throw new UserInputError('The user not exists!', {
            argumentName: 'id'
          })

        return userExist
      } catch (e) {
        console.log({
          code: 'GET_USER_BY_ID_ERROR',
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
    getFormatById: async (_, { id }) => {
      try {
        const formatExist = await Format.findById(id)
        if (!formatExist)
          throw new UserInputError('The format no exists!', {
            argumentName: 'format'
          })

        return formatExist
      } catch (e) {
        console.log({
          code: 'GET_FORMAT_BY_ID_ERROR',
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
    getDuelById: async (_, { id }) => {
      try {
        const duelExists = await Duel.findById(id).populate([
          { path: 'duelist', model: 'User' },
          { path: 'opponent', model: 'User' },
          { path: 'format', model: 'Format' }
        ])
        if (!duelExists)
          throw new UserInputError('The duel no exists!', {
            argumentName: 'id'
          })

        return duelExists
      } catch (e) {
        console.log({
          code: 'GET_DUEL_BY_ID_ERROR',
          error: e
        })
      }
    },

    // Instructor
    getInstructors: async () => {
      try {
        return Instructor.find({}).populate({
          path: 'instructor',
          model: 'User'
        })
      } catch (e) {
        console.log({
          code: 'GET_INSTRUCTORS_ERROR',
          error: e
        })
      }
    },
    getInstructor: async (_, _data, ctx) => {
      try {
        const {
          user: { instructor_id }
        } = ctx
        if (!instructor_id)
          throw new UserInputError('Not credentials', {
            argumentName: 'instructor_id'
          })

        const instructorExist = await Instructor.findById(
          instructor_id
        ).populate({
          path: 'instructor',
          model: 'User'
        })
        if (!instructorExist)
          throw new UserInputError('The instructor not exist!', {
            argumentName: 'instructor'
          })

        return instructorExist
      } catch (e) {
        console.log({
          code: 'GET_INSTRUCTORS_ERROR',
          error: e
        })
      }
    },
    getInstructorById: async (_, { id }) => {
      try {
        const instructorExist = await Instructor.findById(id).populate({
          path: 'instructor',
          model: 'User'
        })
        if (!instructorExist)
          throw new UserInputError('The instructor not exist!', {
            argumentName: 'id'
          })

        return instructorExist
      } catch (e) {
        console.log({
          code: 'GET_INSTRUCTOR_BY_ID_ERROR',
          error: e
        })
      }
    }
  },
  Mutation: {
    // Auth
    authenticateUser: async (_, { input }) => {
      try {
        const { user, password } = input

        // validation user
        const userExist = await User.findOne({ user })
        if (!userExist)
          throw new UserInputError('The user not exists!', {
            argumentName: 'user'
          })

        // validation password user
        const passwordCorrect = await bcryptjs.compareSync(
          password,
          userExist.password
        )
        if (!passwordCorrect)
          throw new UserInputError('The password is not correct!', {
            argumentName: 'password'
          })

        return {
          token: createToken(userExist, process.env.SECRET_KEY, '24h')
        }
      } catch (e) {
        console.log({
          code: 'AUTH_USER_ERROR',
          error: e
        })
      }
    },
    authenticateInstructor: async (_, { input }) => {
      try {
        const { user, password } = input

        // validation user
        const userExist = await User.findOne({ user })
        if (!userExist)
          throw new UserInputError('The user not exists!', {
            argumentName: 'user'
          })

        // validation password user
        const passwordCorrect = await bcryptjs.compareSync(
          password,
          userExist.password
        )
        if (!passwordCorrect)
          throw new UserInputError('The password is not correct!', {
            argumentName: 'password'
          })

        const { id } = userExist

        const isInstructor = await Instructor.findOne({
          instructor: id
        }).populate({
          path: 'instructor',
          model: 'User'
        })
        if (!isInstructor)
          throw new UserInputError('The user is not a instructor!', {
            argumentName: 'user'
          })

        return {
          token: createToken(isInstructor, process.env.SECRET_KEY, '24h')
        }
      } catch (e) {
        console.log({
          code: 'AUTH_USER_ERROR',
          error: e
        })
      }
    },

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
    updateUser: async (_, { input }, ctx) => {
      try {
        const {
          user: { id }
        } = ctx

        const { password } = input

        // hash password
        const salt = bcryptjs.genSaltSync(10)
        input.password = await bcryptjs.hashSync(password, salt)

        return await User.findByIdAndUpdate(id, input, { new: true })
      } catch (e) {
        console.log({
          code: 'USER_UPDATE_ERROR',
          error: e
        })
      }
    },
    deleteUser: async (_, { id }) => {
      try {
        const userExist = await User.findById(id)
        if (!userExist)
          throw new UserInputError('The user not exists!', {
            argumentName: 'id'
          })

        return User.findByIdAndDelete(id)
      } catch (e) {
        console.log({
          code: 'USER_DELETE_ERROR',
          error: e
        })
      }
    },
    disableUser: async (_, { id, is_active }) => {
      try {
        const userExist = await User.findById(id)
        if (!userExist)
          throw new UserInputError('The user not exists!', {
            argumentName: 'id'
          })

        return await User.findByIdAndUpdate(id, { is_active }, { new: true })
      } catch (e) {
        console.log({
          code: 'USER_UPDATE_ERROR',
          error: e
        })
      }
    },
    assignHouseUser: async (_, { id, house }) => {
      try {
        const userExist = await User.findById(id)
        if (!userExist)
          throw new UserInputError('The user not exists!', {
            argumentName: 'id'
          })

        return await User.findByIdAndUpdate(id, { house }, { new: true })
      } catch (e) {
        console.log({
          code: 'USER_ASSIGN_HOUSE_ERROR',
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
    updateFormat: async (_, { id, input }) => {
      try {
        const formatExist = await Format.findById(id)
        if (!formatExist)
          throw new UserInputError('The format no exists!', {
            argumentName: 'format'
          })

        return await Format.findByIdAndUpdate(id, input, { new: true })
      } catch (e) {
        console.log({
          code: 'FORMAT_UPDATE_ERROR',
          error: e
        })
      }
    },
    deleteFormat: async (_, { id }) => {
      try {
        const formatExist = await Format.findById(id)
        if (!formatExist)
          throw new UserInputError('The format no exists!', {
            argumentName: 'id'
          })

        return await Format.findByIdAndDelete(id)
      } catch (e) {
        console.log({
          code: 'FORMAT_DELETE_ERROR',
          error: e
        })
      }
    },
    disableFormat: async (_, { id, is_active }) => {
      try {
        const formatExist = await Format.findById(id)
        if (!formatExist)
          throw new UserInputError('The format no exists!', {
            argumentName: 'id'
          })

        return await Format.findByIdAndUpdate(id, { is_active }, { new: true })
      } catch (e) {
        console.log({
          code: 'FORMAT_DISABLE_ERROR',
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
          throw new UserInputError('The duel with the repeated format!', {
            argumentName: 'format'
          })

        const newDuel = new Duel(input)
        return await newDuel.save()
      } catch (e) {
        console.log({
          code: 'DUEL_ADD_ERROR',
          error: e
        })
      }
    },
    validateDuel: async (_, { id, status }) => {
      try {
        const duelExists = await Duel.findById(id)
        if (!duelExists)
          throw new UserInputError('The duel no exists!', {
            argumentName: 'id'
          })

        return await Duel.findByIdAndUpdate(id, { status }, { new: true })
      } catch (e) {
        console.log({
          code: 'DUEL_VALIDATE_ERROR',
          error: e
        })
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
    },
    assignHousesInstructor: async (_, { id, houses }) => {
      try {
        const instructorExist = await Instructor.findById(id)
        if (!instructorExist)
          throw new UserInputError('The instructor not exists!', {
            argumentName: 'instructor'
          })

        return await Instructor.findByIdAndUpdate(id, { houses }, { new: true })
      } catch (e) {
        console.log({
          code: 'INSTRUCTOR_ASSIGN_HOUSE_ERROR',
          error: e
        })
      }
    },
    giveAdminInstructor: async (_, { id, is_admin }) => {
      try {
        const instructorExist = await Instructor.findById(id)
        if (!instructorExist)
          throw new UserInputError('The instructor not exists!', {
            argumentName: 'id'
          })

        return await Instructor.findByIdAndUpdate(
          id,
          { is_admin },
          { new: true }
        )
      } catch (e) {
        console.log({
          code: 'INSTRUCTOR_GIVE_ADMIN_ERROR',
          error: e
        })
      }
    },
    deleteInstructor: async (_, { id }) => {
      try {
        const instructorExist = await Instructor.findById(id)
        if (!instructorExist)
          throw new UserInputError('The instructor not exists!', {
            argumentName: 'id'
          })

        return await Instructor.findByIdAndDelete(id)
      } catch (e) {
        console.log({
          code: 'INSTRUCTOR_DELETE_ERROR',
          error: e
        })
      }
    },
    disableInstructor: async (_, { id, is_active }) => {
      try {
        const instructorExist = await Instructor.findById(id)
        if (!instructorExist)
          throw new UserInputError('The instructor not exists!', {
            argumentName: 'id'
          })

        return await Instructor.findByIdAndUpdate(
          id,
          { is_active },
          { new: true }
        )
      } catch (e) {
        console.log({
          code: 'INSTRUCTOR_DISABLE_ERROR',
          error: e
        })
      }
    }
  }
}

module.exports = resolvers
