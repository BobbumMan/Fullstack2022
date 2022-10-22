const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const helper = require('./test_helper')
const User = require('../models/user')
const app = require('../app')
const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('secret', 10)
  const user = new User({
    _id:'63433b033366d10983fe5138',
    username: 'root',
    passwordHash,
    blogs: [
      '5a422bc61b54a676234d17fc',
      '5a422ba71b54a676234d17fb',
      '5a422b891b54a676234d17fa',
      '5a422b3a1b54a676234d17f9',
      '5a422aa71b54a676234d17f8',
      '5a422a851b54a676234d17f7'
    ]
  })

  await user.save()
})

describe('when there is one user in DB', () => {
  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'bobbumman',
      name: 'stephen gregg',
      password: 'passwerd'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length+1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })
})

describe('user creation', () => {
  test('fails when username < 3 characters', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'to',
      name: 'stephen gregg',
      password: 'passwerd'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('fails when password < 3 characters', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'bobbumman',
      name: 'stephen gregg',
      password: 'pa'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('fails if username not unique', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'stephen gregg',
      password: 'password'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
})

afterAll(() => {
  mongoose.connection.close()
})



