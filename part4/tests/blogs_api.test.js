const mongoose = require('mongoose')
const Blog = require('../models/blog')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

describe('when initial blogs are added', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all 6 blogs are returned', async () => {
    const blogs = await api.get('/api/blogs')
    expect(blogs.body).toHaveLength(6)
  })

  test('blogs have an id property', async () => {
    const blogs = await api.get('/api/blogs')
    expect(blogs.body[0].id).toBeDefined()
  })
})

describe('viewing a specific blog', () => {
  test('succeeds with a valid id', async () => {
    const blogs = await helper.blogsInDb()
    const blogToView = blogs[0]
    const blog = await api.
      get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const processedBlog = JSON.parse(JSON.stringify(blogToView))
    expect(blog.body.title).toEqual(processedBlog.title)
    expect(blog.body.author).toEqual(processedBlog.author)
    expect(blog.body.url).toEqual(processedBlog.url)
    expect(blog.body.likes).toEqual(processedBlog.likes)
  })

  test('fails with status code 404 if blog does not exist', async () => {
    const id = await helper.nonExistingId()
    await api
      .get(`/api/blogs/${id}`)
      .expect(404)
  })

  test('fails with status code 400 if invalid id', async () => {
    const id = '5a3d5da59070081a82a3445'
    await api
      .get(`/api/blogs/${id}`)
      .expect(400)
  })
})

describe('addition of a new blog', () => {

  test('occurs correctly when provided valid blog', async () => {
    const blog = {
      title: 'Make the best blog post',
      author: 'Stephen Gregg',
      url: 'https://url.com',
      likes: 27
    }
    const token = await api
      .post('/api/login')
      .send({ username: 'root', password: 'secret' })

    await api
      .post('/api/blogs')
      .set({ Authorization: `bearer ${token.body.token}` })
      .send(blog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()

    const titles = blogsAtEnd.map(r => r.title)

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
    expect(titles).toContain('Make the best blog post')
  })

  test('defaults likes to 0 if not provided', async () => {
    const blog = {
      title: 'Make the best blog post',
      author: 'Stephen Gregg',
      url: 'https://url.com'
    }

    const token = await api
      .post('/api/login')
      .send({ username: 'root', password: 'secret' })

    const addedBlog = await api
      .post('/api/blogs')
      .set({ Authorization: `bearer ${token.body.token}` })
      .send(blog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    expect(addedBlog.body.likes).toBe(0)
  })

  test('will not occur without title', async () => {
    const newNote = {
      url: 'http://url.com',
      likes: 12
    }

    const token = await api
      .post('/api/login')
      .send({ username: 'root', password: 'secret' })

    await api
      .post('/api/blogs')
      .set({ Authorization: `bearer ${token.body.token}` })
      .send(newNote)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })

  test('will not occur without url', async () => {
    const newNote = {
      title: 'title',
      likes: 12
    }

    const token = await api
      .post('/api/login')
      .send({ username: 'root', password: 'secret' })

    await api
      .post('/api/blogs')
      .set({ Authorization: `bearer ${token.body.token}` })
      .send(newNote)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })
})

describe('updating a blog', () => {
  test('works correctly if given valid id and data', async() => {
    const blogs = await helper.blogsInDb()
    const blogToView = blogs[0]
    const update = { likes: 220 }
    const blog = await api
      .put(`/api/blogs/${blogToView.id}`)
      .send(update)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    expect(blog.body.likes).toEqual(220)
  })

  test('fails with status code 404 if blog does not exist', async () => {
    const id = await helper.nonExistingId()
    await api
      .put(`/api/blogs/${id}`)
      .send({ likes: 200 })
      .expect(404)
  })

  test('fails with status code 400 if invalid id', async () => {
    const id = '5a3d5da59070081a82a3445'
    await api
      .put(`/api/blogs/${id}`)
      .send({ likes: 200 })
      .expect(400)
  })

  test('fails if not provided data', async () => {
    const blogs = await helper.blogsInDb()
    const blogToView = blogs[0]
    const update = {}
    await api.
      put(`/api/blogs/${blogToView.id}`)
      .send(update)
      .expect(404)
  })
})

describe('deletion of a blog', () => {
  test('works correctly if given valid id', async () => {
    const blogs = await helper.blogsInDb()
    const blogToDelete = blogs[5]

    const token = await api
      .post('/api/login')
      .send({ username: 'root', password: 'secret' })

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set({ Authorization: `bearer ${token.body.token}` })
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(blogs.length-1)
  })

  test('fails with status code 404 if blog does not exist', async () => {
    const id = await helper.nonExistingId()

    const token = await api
      .post('/api/login')
      .send({ username: 'root', password: 'secret' })

    await api
      .delete(`/api/blogs/${id}`)
      .set({ Authorization: `bearer ${token.body.token}` })
      .expect(404)
  })

  test('fails with status code 400 if invalid id', async () => {
    const id = '5a3d5da59070081a82a3445'

    const token = await api
      .post('/api/login')
      .send({ username: 'root', password: 'secret' })

    await api
      .delete(`/api/blogs/${id}`)
      .set({ Authorization: `bearer ${token.body.token}` })
      .expect(400)
  })
})

afterAll(() => {
  mongoose.connection.close()
})