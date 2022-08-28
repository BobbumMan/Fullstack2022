import { useState } from 'react'

const Button = ({ handleClick, text}) => (
    <button onClick={handleClick}>{text}</button>
)

const Heading = ({ text }) => <h1>{text}</h1>

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.'
  ]

  const max = anecdotes.length
  const getRandomInt = () => Math.floor(Math.random() * max)

  const [selected, setSelected] = useState(0)
  const [points, setPoints] = useState(Array(max).fill(0))

  const handleRandom = () => {
    setSelected(getRandomInt)
  }

  const handleVote = () => {
    const copy = [...points]
    copy[selected] = copy[selected] + 1
    setPoints(copy)
  }

  const mostVotes = Math.max(...points)
  const bestQuote = points.indexOf(mostVotes)

  return (
    <div>
      <Heading text="Anecdote of the Day"/>
      <p>{anecdotes[selected]}</p>
      <p>has {points[selected]} votes</p>
      <div>
        <Button handleClick={handleVote} text="vote"/>
        <Button handleClick={handleRandom} text="next anecdote"/>
      </div>
      <Heading text="Anecdote with the most votes"/>
      <p>{anecdotes[bestQuote]}</p>
      <p>has {points[bestQuote]} votes</p>
    </div>
  )
}

export default App