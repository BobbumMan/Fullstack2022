import React from 'react'

const Person = ({ person, deleteNumber }) => (
    <div>
      {person.name} {person.number}<button id={person.id} name={person.name} onClick={deleteNumber}>delete</button>
    </div>
  )

const Persons = ({ persons, search, deleteNumber }) => {
  if (persons.length > 0) { 
    return (
      <>
      {persons.filter(person => person.name.toLowerCase().includes(search.toLowerCase())).map(person => {
        return (
          <Person key={person.id} person={person} deleteNumber={deleteNumber}/>
        )
      })}
    </>
    )
  } else {
    return (
      <></>
    )
  }
}

  export default Persons

