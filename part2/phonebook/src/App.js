import { useState, useEffect } from 'react'
import Persons from './components/Persons'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Notification from './components/Notification'
import personService from './services/persons'
import './index.css'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [search, setSearch] = useState('')
  const [message, setMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    personService.getAll().then(response => setPersons(response))
  }, [])

  const tempMessage = (temp) => {
    setMessage(temp)
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  const tempErrorMessage = (temp) => {
    setErrorMessage(temp)
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  const addPerson = (newPerson) => {
    personService.addPerson(newPerson).then(returnedPerson => {
      setPersons(persons.concat(returnedPerson))
      setNewName('')
      setNewNumber('')
      tempMessage(`${returnedPerson.name} added to phonebook`)
    })
  }

  const handleAdd = (event) => {
    event.preventDefault()

    const personObject = {
      name: newName,
      number: newNumber
    }
    
    if (persons.find(p => p.name.toLowerCase() === newName.toLowerCase())) {
      const updatedPerson = persons.find(p => p.name.toLowerCase() === newName.toLowerCase())
      updatedPerson.number = newNumber
      if (window.confirm(`${newName} is already added to phonebook, update number?`)) {
        personService
          .editPerson(updatedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(p => p.id !== returnedPerson.id ? p : returnedPerson))
            tempMessage(`${returnedPerson.name} updated in phonebook`)
          })
          .catch(error => {
            tempErrorMessage(`${updatedPerson.name} already deleted from phonebook`)
          })
      }
    } else {
      addPerson(personObject)
    }
  }

  const deletePerson = (event) => {
    event.preventDefault()
    if (window.confirm(`Delete ${event.target.name}?`)) {
      personService.deletePerson(event.target.id).then(() => {
        setPersons(persons.filter(person => person.id !== event.target.id))
        tempMessage(`${event.target.name} removed from phonebook`)
      })
      .catch(error => {
        tempErrorMessage(`${event.target.name} already deleted from phonebook`)
      })
    }
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
      <Notification message={message} error={false}/>
      <Notification message={errorMessage} error={true}/>
      <h3>Search Number</h3>
      <Filter search={search} handleSearchChange={handleSearchChange}/>
      <h3>Add Number</h3>
        <PersonForm
          addNumber={handleAdd}
          newName={newName} handleNameChange={handleNameChange}
          newNumber={newNumber} handleNumberChange={handleNumberChange}
        />
      <h2>Numbers</h2>
      <Persons persons={persons} search={search} deleteNumber={deletePerson}/>
    </div>
  )
}

export default App
