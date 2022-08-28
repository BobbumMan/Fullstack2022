import { useState } from 'react'

const Header = ({ text }) => <h1>{text}</h1>

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>
    {text}
  </button>
)

const StatisticLine = ({ type, value }) => (
  <tr>
    <td>{type}</td>
    <td>{value}</td>
  </tr>
)

const Statistics = ({good, neutral, bad}) => {
  const all = good + bad + neutral
  const avg = (good - bad) / all
  const pct = good * 100 / all
  
  if (all === 0) {
    return (
      <p>No feedback given</p>
    )
  }
  return (
    <table>
      <tbody>
      <StatisticLine type="good" value={good}/>
      <StatisticLine type="neutral" value={neutral}/>
      <StatisticLine type="bad" value={bad}/>
      <StatisticLine type="all" value={all}/>
      <StatisticLine type="average" value={avg}/>
      <StatisticLine type="percentage" value={pct + "%"}/>
      </tbody>
    </table>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <Header text="Give Feedback" />
      <div>
        <Button text="good" handleClick={() => setGood(good+1)}/>
        <Button text="neutral" handleClick={() => setNeutral(neutral+1)}/>
        <Button text="bad" handleClick={() => setBad(bad+1)}/>
      </div>
      <Header text="Statistics" />
      <Statistics good={good} neutral={neutral} bad={bad}/>
    </div>
  )
}

export default App