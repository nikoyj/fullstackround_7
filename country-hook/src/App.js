import React, { useState, useEffect } from 'react'
import axios from 'axios'

const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  return {
    type,
    value,
    onChange
  }
}

const useCountry = (name) => {
  const [country, setCountry] = useState([])
  useEffect(() => {
    if (name) {
      axios
      .get(`https://restcountries.com/v3.1/name/${name}?fullText=true`)
      .then( response => {
        setCountry(response.data)
        console.log(response.data)
      })
    }
  }, [name])

  if ( name === '') {return null}
  if (!country) {return []}
  return (country)
}

const Country = ({ country }) => {
  if (!country) {
    return (
      null
    )
  }
  if (country.length === 0) {
    return (
      <div>
        not found...
      </div>
    )
  }
  const realCountry = country[0]

  return (
    <div>
      <h3>{realCountry.name.common} </h3>
      <div>capital {realCountry.capital} </div>
      <div>population {realCountry.population}</div> 
      <img src={realCountry.flags.png} height='100' alt={`flag of ${realCountry.name.common}`}/>  
    </div>
  )
}

const App = () => {
  const nameInput = useField('text')
  const [name, setName] = useState('')
  const country = useCountry(name)

  const fetch = (e) => {
    e.preventDefault()
    setName(nameInput.value)
  }

  return (
    <div>
      <form onSubmit={fetch}>
        <input {...nameInput} />
        <button>find</button>
      </form>

      <Country country={country} />
    </div>
  )
}

export default App