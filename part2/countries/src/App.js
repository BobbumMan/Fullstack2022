import axios from 'axios'
import { useState, useEffect } from 'react'

const Weather = ({weather, capital}) => {
  if (weather.current) {
    return (
      <>
      <h3>Weather in {capital}</h3>
      <p>Temperature is {weather.current.temp_c} degrees celcius</p>
      <p>Weather is {weather.current.condition.text}</p>
      <img src={weather.current.condition.icon} alt="weather"></img>
      <p>Wind is blowing {weather.current.wind_mph} mph out of the {weather.current.wind_dir}</p>
      </>
    )
  }
}

const Country = ({ country, api_key }) => {

  const [weather, setWeather] = useState({})

  useEffect(() => {
    axios
      .get(` http://api.weatherapi.com/v1/current.json?key=${api_key}&q=${country.capital[0]}&aqi=no`)
      .then((response) => {
        setWeather(response.data)
      })
  }, [])

  return (
    <>
      <h2>{country.name.common}</h2>
      <p>capital {country.capital[0]}</p>
      <p>area {country.area}</p>
      <h3>Languages</h3>
      <ul>
        {Object.entries(country.languages).map((entry, index) => <li key={index}>{entry[1]}</li>)}
      </ul>
      <img src={country.flags.png} alt="flag"></img>
      <Weather weather={weather} capital={country.capital[0]}/>
    </>
  )}

const Matches = ({matches, handleClick, api_key}) => {
  if (matches.length > 10) {
    return (<p>Too many entries to display</p>)
  } else if (matches.length === 0) {
    return (<p>No countries with that name</p>)
  } else if (matches.length === 1) {
    return <Country country={matches[0]} api_key={api_key} />
  } else {
    return matches.map((match, index) => {
    return (
      <div key={index}>
      {match.name.common}
      <button value={match.name.common} onClick={handleClick}>show</button>
      </div>
    )})
  }
}

function App() {

  const [countries, setCountries] = useState([])
  const [search, setSearch] = useState('')
  const api_key = process.env.REACT_APP_API_KEY

  useEffect(() => {
    axios
      .get('https://restcountries.com/v3.1/all')
      .then((response) => {
        setCountries(response.data)
      })
  }, [])

  const handleSearch = (event) => {
    event.preventDefault()
    setSearch(event.target.value)
  }

  const handleClick = (event) => {
    event.preventDefault()
    setSearch(event.target.value)
  }

  return (
    <div>
      find countries <input value={search} onChange={handleSearch}/>
      <Matches matches={countries.filter(country => country.name.common.toLowerCase().includes(search.toLowerCase()))} handleClick={handleClick} api_key={api_key}/>
    </div>
  )
}

export default App;