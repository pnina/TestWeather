import React, { useEffect, useState } from 'react';
import './App.css';
import SearchBar from './comps/searchBar';
import CardWeather from './comps/cardWeather';
import CardLoading from './comps/cardLoading';

const api = {
  url: "https://localhost:5001/api/"
}


function App() {
  const initialState = {
    name: "",
    country: "",
    temp: 0,
    minTemp: 0,
    maxTemp: 0,
    feelsLike: 0,
    humidity: 0,
    precipitation: 0,
    description: "",
    sunrise: "",
    sunset: "",
    windSpeed: 0,
    pressure: 0,
    forecast: [],
    direction: "",
  }

  const [query, setQuery] = useState('');
  const [coordinates, setCoordinates] = useState({ lat: 0, lon: 0 })
  const [day, setDay] = useState(false)
  const [error, setError] = useState(false);
  const [weather, setWeather] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [localTime, setLocalTime] = useState("")
  const [system, setSystem] = useState("metric")
  const [unit, setUnit] = useState("°C")
  const [unit2, setUnit2] = useState("km/h")
  const [countFavorites, setCountFavorites] = useState(0);

  useEffect(() => {
    getData()
  }, [])

  const getLocationData = async () => {
    console.log('location access enabled')
    try {
      await navigator.geolocation.getCurrentPosition(async (position) => {
        console.log(position)
        console.log("Latitude is :", position.coords.latitude)
        console.log("Longitude is :", position.coords.longitude)

        const latitude = (position.coords.latitude).toFixed(1)
        const longitude = (position.coords.longitude).toFixed(1)

        setCoordinates({
          lat: Number(latitude),
          lon: Number(longitude)
        })
        let res = await fetch(`${api.url}WeatherForecast/213225`)
        let result = await res.json()
        console.log(result);
        setWeather({
          description: result.headline.text
        })
        setQuery('')
        setLoading(false)
      })
    }
    catch (error) {
      console.log(error)
      setError(true)
      setLoading(false)
    }
  }


  const getData = async () => {
    setLoading(true)
    getCountFavorites();
    if ("geolocation" in navigator) {
      getLocationData()
    }
    else {
      console.log('Location access disabled')
      try {
        let res = await fetch(`${api.url}WeatherForecast/213225`);
        let result = await res.json()
        console.log(result)

        setWeather({
          description: result.headline.text
        })

        setQuery('')
        setLoading(false)       
      }
      catch (error) {
        console.log(error)
        setError(true)
        setLoading(false)
      }
    }
  }

  const search = async () => {
    console.log('search')
    console.log(query)

    if (query !== "") {
      setLoading(true)

      try {
        let res = await fetch(`${api.url}WeatherForecast/${query}`);
        let result = await res.json()
        if (!result.ok) {
          console.log('Could not get data from API.')
          setError(true)
          setQuery('')
          setLoading(false)
        }
        else {
          if (error) {
            setError(false)
          }
          let short = query
          setQuery('')
          setLoading(false)

          setWeather({
            description: result.headline.text
          })

          console.log(result)
        }
      }
      catch (error) {
        console.log('Could not get data from API.')
        console.log(error)
        setLoading(false)
      }
    }
    else {
      console.log("Could not accept input")
    }

  }

  const add2Favorites = async () => {
    const postData = {
      ip: "12-3456-78",
      cityKey: query.toString(),
    };

    const response = await fetch(
      `${api.url}FavoriteCity/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(postData),
    }).then(result => {
      console.log(result);
      if (result.ok) {
        getCountFavorites();
      }
    });
  }

  const getCountFavorites = async () => {
    try {
      let res = await fetch(`${api.url}FavoriteCity`);
      let result = await res.json()
      if (result.cod === "404") {
        console.log('Could not get data from API.')
        setError(true)
        setCountFavorites(0)
        setLoading(false)
      }
      else {
        if (error) {
          setError(false)
        }
        setCountFavorites(result.length)
        setLoading(false)
        console.log(result)
      }
    }
    catch (error) {
      console.log('Could not get data from API.')
      console.log(error)
      setLoading(false)
    }
  }

  return (
    <div className="App">
      <header>Favorites: {countFavorites}</header>
      <SearchBar {...{
        props: {
          search: search,
          query: query,
          setQuery: setQuery,
          error: error,
          add2Favorites: add2Favorites
        }
      }} />
      {loading ? <CardLoading /> : <CardWeather {...{
        weather: {
          description: weather.description
        }
      }} />}
    </div>
  );
}

export default App;
