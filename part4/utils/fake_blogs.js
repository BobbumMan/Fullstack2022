const faker = require('faker')
const Blog = require('../models/blog')
const User = require('../models/user')
const logger = require('./logger')
const mongoose = require('mongoose')
const MONGODB_URI = 'mongodb+srv://bobbumman:gPO9bgX8ohLKSK24@cluster0.wj4wi2t.mongodb.net/?retryWrites=true&w=majority'
mongoose.connect(MONGODB_URI)

const nameArray = []
for (let i=0; i<20; i++) {
  nameArray.push(faker.name.findName())
}

let usersArray

User.find({}).then((users) => {
  usersArray = users
})
  .then(() => {
    for (let i=0; i<100; i++) {
      const blog = new Blog({
        title: faker.lorem.sentence(4),
        author: nameArray[Math.floor(Math.random()*20)],
        url: faker.internet.url(),
        likes: Math.floor((Math.random()*100)),
        user: usersArray[Math.floor(Math.random()*usersArray.length)]._id
      })
      blog.save().then(async (savedblog) => {
        const savedUser = await User.findById(savedblog.user)
        savedUser.blogs.push(savedblog._id)
        savedUser.save()
      })
    }
  })
  .catch((error) => {
    logger.error('error connecting to DB', error)
  })