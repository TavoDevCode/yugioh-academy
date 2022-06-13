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
    password: String
    isActive: Boolean
    house: House
    created_at: String
  }

  type Format {
    id: ID
    format: String
    value: Int
    isActive: Boolean
    created_at: String
  }

  type Duel {
    id: ID
    date: String
    duelist: User
    opponent: User
    format: Format
    status: DuelStatus
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
    deck_image_url: String
    win_image_url: String
    created_at: String
  }

  type Instructor {
    id: ID
    instructor: User
    isActive: Boolean
    houses: [House]
    created_at: String
  }

  type CreatedInstructor {
    id: ID
    instructor: ID
    isActive: Boolean
    houses: [House]
    created_at: String
  }

  #Inputs
  input UserInput {
    name: String!
    last_name: String!
    duelist_name: String!
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

    #Format
    getFormats: [Format]

    #Duel
    getDuels: [Duel]

    #Instructor
    getInstructors: [Instructor]
  }

  #Mutations
  type Mutation {
    #User
    addUser(input: UserInput): User

    #Format
    addFormat(input: FormatInput): Format

    #Duel
    addDuel(input: DuelInput): CreatedDuel

    #Instructor
    addInstructor(input: InstructorInput): CreatedInstructor
  }
`

module.exports = typeDefs
