// src/components/CurrentWeather.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CurrentWeather({ city, unit }) {
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        if (city) {
          const apiKey = '089bda8bfa1263ac61930ef2ef39379c';

          const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}&appid=${apiKey}`
          );

          setWeatherData(response.data);
        }
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    fetchWeatherData();
  }, [city, unit]);

  return (
    <div className="current text-white">
      {weatherData && (
        <>
          <h2>{weatherData.name}, {weatherData.sys.country}</h2>
          <br/><br/>
          <p>Current Temperature: {weatherData.main.temp} {unit === 'metric' ? '°C' : '°F'}</p>
          <p>Min Temperature: {weatherData.main.temp_min} {unit === 'metric' ? '°C' : '°F'}</p>
          <p>Max Temperature: {weatherData.main.temp_max} {unit === 'metric' ? '°C' : '°F'}</p>
          <p>Humidity: {weatherData.main.humidity}%</p>
          <p>Wind Speed: {weatherData.wind.speed} {unit === 'metric' ? 'm/s' : 'mph'}</p>
          <p>Wind Direction: {weatherData.wind.deg}°</p>
          <p>Description: {weatherData.weather[0].description}</p>
          <img
            src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`}
            alt="Weather Icon"
            className="weather-icon"
          />
        </>
      )}
    </div>
  );
}

export default CurrentWeather;
