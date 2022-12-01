const supertest = require('supertest')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const app = require('../app')
const User = require('../models/user')
const api = supertest(app)

beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({username: "root", name: "root", passwordHash})
    const savedUser = await user.save()
})

test('creation fails with invalid username or password', async () => {
    const usersAtStart = await User.find({})
    const newUserWithInvalidUserName = {
        username: 'Fe',
        name: 'Person',
        password: 'password',
    }
    const newUserWithInvalidPassword = {
        username: 'Felix',
        name: 'Person',
        password: 'pa',
    }
    await api
        .post('/api/users')
        .send(newUserWithInvalidUserName)
        .expect(400)
        .expect('Content-Type', /application\/json/)

    await api
        .post('/api/users')
        .send(newUserWithInvalidPassword)
        .expect(400)
        .expect('Content-Type', /application\/json/)
    

    const usersAtEnd = await User.find({})
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
})

afterAll(() => {
    mongoose.connection.close()
  })

