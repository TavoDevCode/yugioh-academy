const { gql } = require('apollo-server')

const typeDefs = gql`
  #Enums
  enum House {
    UNNASIGNED
    RA
    OBELISkO
    SLIFER
  }

  enum DuelStatus {
    UNAPPROVED
    APPROVED
    PROHIBITED
  }

  #Types
  type User {
    id: ID
    name: String
    last_name: String
    duelist_name: String
    discord_username: String
    user: String
    #password: String
    is_active: Boolean
    house: House
    created_at: String
  }

  type Token {
    token: String
  }

  type Format {
    id: ID
    format: String
    value: Int
    is_active: Boolean
    created_at: String
  }

  type Duel {
    id: ID
    date: String
    duelist: User
    opponent: User
    format: Format
    status: DuelStatus
    is_winner: Boolean
    deck_image_url: String
    win_image_url: String
    created_at: String
  }

  type CreatedDuel {
    id: ID
    date: String
    duelist: ID
    opponent: ID
    format: ID
    status: DuelStatus
    is_winner: Boolean
    deck_image_url: String
    win_image_url: String
    created_at: String
  }

  type Instructor {
    id: ID
    instructor: User
    is_admin: Boolean
    is_active: Boolean
    houses: [House]
    created_at: String
  }

  type CreatedInstructor {
    id: ID
    instructor: ID
    is_admin: Boolean
    is_active: Boolean
    houses: [House]
    created_at: String
  }

  #Inputs
  input UserInput {
    name: String!
    last_name: String!
    duelist_name: String!
    discord_username: String
    user: String!
    password: String!
  }

  input AuthenticateUser {
    user: String!
    password: String!
  }

  input FormatInput {
    format: String
    value: Int
  }

  input DuelInput {
    date: String!
    duelist: ID!
    opponent: ID!
    format: ID!
    is_winner: Boolean!
    deck_image_url: String!
    win_image_url: String!
  }

  input InstructorInput {
    instructor: ID!
  }

  #Querys
  type Query {
    #User
    getUsers: [User]
    getUser: User
    getUserById(id: ID!): User

    #Format
    getFormats: [Format]
    getFormatById(id: ID!): Format

    #Duel
    getDuels: [Duel]
    getDuelById(id: ID!): Duel

    #Instructor
    getInstructors: [Instructor]
    getInstructor: Instructor
    getInstructorById(id: ID!): Instructor
  }

  #Mutations
  type Mutation {
    #Auth
    authenticateUser(input: AuthenticateUser): Token
    authenticateInstructor(input: AuthenticateUser): Token

    #User
    addUser(input: UserInput): User
    updateUser(input: UserInput): User
    deleteUser(id: ID!): User
    disableUser(id: ID!, is_active: Boolean!): User
    assignHouseUser(id: ID!, house: House): User

    #Format
    addFormat(input: FormatInput): Format
    updateFormat(id: ID!, input: FormatInput): Format
    deleteFormat(id: ID!): Format
    disableFormat(id: ID!, is_active: Boolean!): Format

    #Duel
    addDuel(input: DuelInput): CreatedDuel
    validateDuel(id: ID!, status: DuelStatus!): CreatedDuel

    #Instructor
    addInstructor(input: InstructorInput): CreatedInstructor
    assignHousesInstructor(id: ID!, houses: [House]!): CreatedInstructor
    giveAdminInstructor(id: ID!, is_admin: Boolean!): CreatedInstructor
    deleteInstructor(id: ID!): CreatedInstructor
    disableInstructor(id: ID!, is_active: Boolean!): CreatedInstructor
  }
`

module.exports = typeDefs
