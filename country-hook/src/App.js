import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Country = ({ country }) => {
  return (
    <div>
      <h3>{country.name} </h3>
      <div>capital {country.capital} </div>
      <div>population {country.population}</div> 
      <img src={country.flag} height='100' alt={`flag of ${country.name}`}/>  
    </div>
  )
}

const App = () => {
  const [country, setCountry] = useState(null)
  useEffect(() => {
    axios.get(`https://restcountries.com/v2/name/peru`).then(response =>
      // console.log(response.data[0])
      setCountry(response.data[0])
    )
  }, [])
  // console.log(country)

  return (
    <>
    {country ? 
    <div>
      <Country country={country} />
    </div> : null 
    }
    </>
  )
}

export default App
