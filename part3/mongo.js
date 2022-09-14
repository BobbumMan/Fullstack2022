const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()

const password = process.env.password
console.log(process.argv[2])

const url = `mongodb+srv://bobbumman:${password}@cluster0.wj4wi2t.mongodb.net/?retryWrites=true&w=majority`

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {

  mongoose
    .connect(url)
    .then(() => {
      console.log('connected')
      Person.find({}).then(result => {
        console.log('phonebook:')
        result.forEach(p => {
          console.log(p.name, p.number)
        })
        return mongoose.connection.close()
      })
    })
    .catch(err => console.log(err))

} else if (process.argv.length === 5) {
  mongoose
    .connect(url)
    .then(() => {
      console.log('connected')

      const person = new Person({
        name: process.argv[3],
        number: process.argv[4],
      })

      return person.save()

    })
    .then(() => {
      console.log('person saved!')
      return mongoose.connection.close()
    })
    .catch((err) => console.log(err))
}