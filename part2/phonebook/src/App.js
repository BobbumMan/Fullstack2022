import { useState, useEffect } from 'react'
import Persons from './components/Persons'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    personService.getAll().then(response => setPersons(response))
  }, [])

  const addNumber = (event) => {
    event.preventDefault()
    const personObject = {
      id: persons.length+1,
      name: newName,
      number: newNumber
    }
    
    if (persons.find(person => person.name.toLowerCase() === newName.toLowerCase())) {
      const updatedPerson = persons.find(person => person.name.toLowerCase() === newName.toLowerCase())
      updatedPerson.number = newNumber
      if (window.confirm(`${newName} is already added to phonebook, update number?`)) {
        personService
          .editPerson(updatedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(p => p.id !== returnedPerson.id ? p : returnedPerson))
          })
      }
    } else {
      personService.addPerson(personObject).then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
      })
    }
  }

  const deleteNumber = (event) => {
    event.preventDefault()
    if (window.confirm(`Delete ${event.target.name}?`)) {
    personService.deletePerson(event.target.id).then(() => {
      console.log(persons.filter(person => person.id !== parseInt(event.target.id)))
      setPersons(persons.filter(person => person.id !== parseInt(event.target.id)))
    })}
  }

  const handleNameChange = (event) => {
    event.preventDefault()
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    event.preventDefault()
    setNewNumber(event.target.value)
  }
  
  const handleSearchChange = (event) => {
    event.preventDefault()
    setSearch(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <h3>Search Number</h3>
      <Filter search={search} handleSearchChange={handleSearchChange}/>
      <h3>Add Number</h3>
        <PersonForm
          addNumber={addNumber}
          newName={newName} handleNameChange={handleNameChange}
          newNumber={newNumber} handleNumberChange={handleNumberChange}
        />
      <h2>Numbers</h2>
      <Persons persons={persons} search={search} deleteNumber={deleteNumber}/>
    </div>
  )
}

export default App
