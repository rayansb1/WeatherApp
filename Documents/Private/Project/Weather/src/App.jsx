import React, { useState, useEffect } from 'react';
import clear from './assets/clear.png';
import cloud from './assets/cloud.png';
import rain from './assets/rain.png';
import './App.css';

const api = {
  key: process.env.REACT_APP_WEATHER_API_KEY,
  base: "https://api.openweathermap.org/data/2.5/",
};

function App() {
  const [search, setSearch] = useState("");
  const [citiesWeather, setCitiesWeather] = useState([]);
  const [userLocation, setUserLocation] = useState(null);

  // Get user location on initial render
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      });
    }
  }, []);

  // Fetch weather data based on user's geolocation
  useEffect(() => {
    if (userLocation) {
      fetch(`${api.base}weather?lat=${userLocation.latitude}&lon=${userLocation.longitude}&units=metric&APPID=${api.key}`)
        .then((res) => res.json())
        .then((result) => {
          if (result.cod === 200) {
            setCitiesWeather(prevState => [...prevState, result]);
          }
        })
        .catch((error) => {
          console.error('Error fetching weather data:', error);
        });
    }
  }, [userLocation]);

  // Fetch weather data for a searched city
  const searchPressed = () => {
    fetch(`${api.base}weather?q=${search}&units=metric&APPID=${api.key}`)
      .then((res) => res.json())
      .then((result) => {
        if (result.cod === 200) {
          setCitiesWeather(prevState => [...prevState, result]);
        } else {
          console.error('City not found');
        }
      })
      .catch((error) => {
        console.error('Error fetching weather data:', error);
      });
  };

  // Function to get the correct weather icon
  const getIcon = (description) => {
    if (description.includes('rain')) {
      return rain;
    } else if (description.includes('clouds')) {
      return cloud;
    } else {
      return clear;
    }
  }

  return (
    <div className="weather-app">
      {/* Search section */}
      <div className="search-container">
        <input
          type='search'
          placeholder='Search for a city name'
          className="search-bar"
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="search-button" onClick={searchPressed}>Search</button>
      </div>

      {/* Display weather cards for each city */}
      <div className="weather-cards-container">
        {citiesWeather.map((cityWeather, index) => (
          <div key={index} className="weather-card">
            <div className="weather-data">
              <div className="location">{cityWeather.name}, {cityWeather.sys.country}</div>
              <div className="temperature">{cityWeather.main.temp}°C</div>
              <div className="description">{cityWeather.weather[0].description}</div>
              <img
                src={getIcon(cityWeather.weather[0].description)}
                className="weather-icon"
                alt="Weather Icon"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;