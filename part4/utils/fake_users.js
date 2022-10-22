const faker = require('faker')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const logger = require('./logger')
const mongoose = require('mongoose')
const fs = require('fs')
const MONGODB_URI = 'mongodb+srv://bobbumman:gPO9bgX8ohLKSK24@cluster0.wj4wi2t.mongodb.net/?retryWrites=true&w=majority'

const numUsers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
const users = []
const saltRounds = 10

console.log(numUsers)

mongoose.connect(MONGODB_URI)
  .then(() => {
    User.deleteMany({})
  })
  .then(() => {
    logger.info('connected to DB')
    numUsers.forEach(async () => {

      const user = {
        name: faker.name.findName(),
        username: faker.internet.userName(),
        password: faker.internet.password()
      }
      users.push(user)
      const Newuser = new User({
        name: user.name,
        username: user.username,
        passwordHash: await bcrypt.hash(user.password, saltRounds)
      })

      Newuser.save(() => {
        console.log(users)
      })
    })
  })
  .then(() => {
    const usersString = JSON.stringify(users)
    fs.writeFileSync('./users.json', usersString)
  })
  .catch((error) => {
    logger.error('error connecting to DB', error)
  })