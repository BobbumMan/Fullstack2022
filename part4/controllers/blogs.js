const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { name: 1, username: 1 })
  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id).populate('user', { name: 1, username: 1 })
  if (!blog) {
    response.status(404).end()
  }
  response.json(blog)
})

blogsRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body)
  blog.user = request.user._id
  if (!blog.title) {
    response.status(404).send({ error: 'no title provided' })
  }
  if (!blog.author) {
    response.status(404).send({ error: 'no author provided' })
  }
  if (!blog.url) {
    response.status(404).send({ error: 'no url provided' })
  }
  const result = await blog.save()
  response.status(201).json(result)
})

blogsRouter.put('/:id', async (request, response) => {

  const result = await Blog.findByIdAndUpdate(request.params.id, request.body, { new: true })

  if (Object.keys(request.body).length === 0) {
    response.status(404).end()
  } else if (!result) {
    response.status(404).end()
  } else {
    response.status(201).json(result)
  }
})

blogsRouter.delete('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(404).end()
  }
  if (blog.user.toString() !== request.user._id.toString()) {
    return response.status(401).send({ error: 'incorrect user' })
  }
  const result = await Blog.findByIdAndDelete(request.params.id)
  response.status(204).json(result)
})

module.exports = blogsRouter