// src/App.js
import React, { useState, useEffect, useCallback } from 'react';
import CurrentWeather from '../components/CurrentWeather';
import FiveDayForecast from '../components/FiveDayForecast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faMoonCloud} from '@fortawesome/free-solid-svg-icons';

import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';

function App() {
  const [city, setCity] = useState('');
  const [unit, setUnit] = useState('metric');
  const [currentLocationData, setCurrentLocationData] = useState(null);
  const [weatherData, setWeatherData] = useState(null);

  const fetchWeatherDataByCity = useCallback(async (city) => {
    try {
      const apiKey = '089bda8bfa1263ac61930ef2ef39379c';
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}&appid=${apiKey}`
      );
      const data = await response.json();
      setWeatherData(data);
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  }, [unit]);

  const getCurrentLocationWeather = useCallback(async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const apiKey = '089bda8bfa1263ac61930ef2ef39379c';
            const response = await fetch(
              `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=${unit}&appid=${apiKey}`
            );
            const data = await response.json();
            setCurrentLocationData(data);
          } catch (error) {
            console.error('Error fetching current location weather data:', error);
          }
        },
        (error) => {
          console.error('Error getting current location:', error);
        }
      );
    }
  }, [unit]);

  useEffect(() => {
    getCurrentLocationWeather();
  }, [getCurrentLocationWeather, unit]);

  useEffect(() => {
    if (city && city !== currentLocationData?.name) {
      fetchWeatherDataByCity(city);
    }
  }, [city, unit, currentLocationData, fetchWeatherDataByCity]);

  return (
    <div className="container">
      <div className="row mt-4">
        <div className="col-lg-6">
          <div className="top-bar">
          <img src='https://wtop.com/wp-content/themes/wtop-new/assets/img/icons/weather-icons-api/34.png'></img>           
            <div className='head'>
            <p className="text-left">Weather Dashboard</p>
            </div>
            <div className="input-container">
              <input
                type="text"
                placeholder="Enter city name"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="form-control"
              />&nbsp;&nbsp;
              <button
                className="btn btn-warning"
                onClick={() => setUnit((prevUnit) => (prevUnit === 'metric' ? 'imperial' : 'metric'))}
              >{unit === 'metric' ? '°F' : '°C'}
              </button>
            </div>
          </div>
          {(currentLocationData || (weatherData && city === currentLocationData?.name)) && (
            <div className="mt-5 text-center">
            
              <CurrentWeather city={city || currentLocationData?.name} unit={unit} />
            </div>
          )}
        </div>
        <div className="col-lg-6 mt-5">
          {(currentLocationData || (weatherData && city === currentLocationData?.name)) && (
            <div className="mt-5">
              <h2 className="text-center text-warning ">5 Day Forecast</h2>
              <FiveDayForecast city={city || currentLocationData?.name} unit={unit} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
