const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

morgan.token('person', (req) => {
  if (req.method === 'POST') {
    return JSON.stringify(req.body)
  }
  return null
})

const app = express()
app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(morgan(':method :url :response-time :person'))

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message })
  }
  if (error.code === 11000) {
    return response.status(400).send({ error: 'entry already exists' })
  }
  next(error)
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.get('/api/persons', (request, response, next) => {
  Person
    .find({}).then(p => {
      response.json(p)
    })
    .catch(error => next(error))
})

app.get('/info', (request, response) => {
  const date = new Date()
  Person.find({}).then(p => {
    response.send(`
      <p>Phonebook has info for ${p.length} people</p>
      <p>${date}</p>
      `)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id).then(p => {
    if (p) {
      response.json(p)
    } else {
      response.status(404).send({ error: 'no person with that id' })
    }
  })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {

  const person = new Person({
    name: request.body.name,
    number: request.body.number,
  })

  person.save().then(p => {
    response.json(p)
  }).catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {

  const person = {
    name: request.body.name,
    number: request.body.number
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.port || 8080
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})