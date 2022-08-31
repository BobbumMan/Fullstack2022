import React from 'react'

const Person = (props) => (
      <p>{props.name} {props.number}</p>
  )

const Persons = ({ persons, search }) => (
    <>
      {persons.filter(person => person.name.toLowerCase().includes(search.toLowerCase())).map(person => {
        return (
          <Person key={person.id} name={person.name} number={person.number} search={search}/>
        )
      })}
    </>
  )

  export default Persons

