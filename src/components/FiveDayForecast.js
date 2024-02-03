// src/components/FiveDayForecast.js
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSun,
  faMoon,
  faCloudSun,
  faCloudMoon,
  faCloud,
  faCloudRain,
  faCloudSunRain,
  faBolt,
  faSnowflake,
  faSmog,
} from '@fortawesome/free-solid-svg-icons';

const FiveDayForecast = ({ city, unit }) => {
  const [forecastData, setForecastData] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchFiveDayForecast = async () => {
      try {
        const apiKey = '089bda8bfa1263ac61930ef2ef39379c';
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${unit}&appid=${apiKey}`
        );
        
        const data = await response.json();
        console.log(data);

        // Extract unique days and their respective entries
        const uniqueDaysMap = new Map();
        data.list.forEach((entry) => {
          const date = new Date(entry.dt * 1000);
          const day = date.toLocaleDateString('en-US', { weekday: 'long' });

          if (!uniqueDaysMap.has(day)) {
            uniqueDaysMap.set(day, entry);
          }
        });

        // Convert Map values to an array of entries
        const uniqueDaysEntries = Array.from(uniqueDaysMap.values());

        setForecastData(uniqueDaysEntries);
      } catch (error) {
        console.error('Error fetching 5-day forecast:', error);
      }
    };

    if (city) {
      fetchFiveDayForecast();
    }
  }, [city, unit]);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const options = {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  };

  const getWeatherIcon = (iconCode) => {
    switch (iconCode) {
      case '01d':
        return <FontAwesomeIcon icon={faSun} />;
      case '01n':
        return <FontAwesomeIcon icon={faMoon} />;
      case '02d':
        return <FontAwesomeIcon icon={faCloudSun} />;
      case '02n':
        return <FontAwesomeIcon icon={faCloudMoon} />;
      case '03d':
      case '03n':
        return <FontAwesomeIcon icon={faCloud} />;
      case '04d':
      case '04n':
        return <FontAwesomeIcon icon={faCloud} />;
      case '09d':
      case '09n':
        return <FontAwesomeIcon icon={faCloudRain} />;
      case '10d':
        return <FontAwesomeIcon icon={faCloudSunRain} />;
      case '10n':
        return <FontAwesomeIcon icon={faCloudMoon} />;
      case '11d':
      case '11n':
        return <FontAwesomeIcon icon={faBolt} />;
      case '13d':
      case '13n':
        return <FontAwesomeIcon icon={faSnowflake} />;
      case '50d':
      case '50n':
        return <FontAwesomeIcon icon={faSmog} />;
      default:
        return null;
    }
  };

 const handlePrevClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 5 >= 0 ? prevIndex - 5 : forecastData.length - 5));
  };

  const handleNextClick = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex + 5;
      return newIndex < forecastData.length ? newIndex : forecastData.length - 5;
    });
  };

  return (
    <div className="card">
      <div className="card-body">
        <div className="row row-cols-1 row-cols-md-3 g-4">
          {forecastData &&
            forecastData.slice(currentIndex, currentIndex + 5).map((data, index) => (
              <div key={index} className="col">
                <div className="card h-100">
                  <div className="card-body">
                    <h5 className="card-title">{formatDate(data.dt)}</h5>
                    <p className="card-text">
                      {getWeatherIcon(data.weather[0].icon)} {data.main.temp.toFixed(1)}°{unit === 'metric' ? 'C' : 'F'}
                    </p>
                    <p className="card-text">{data.weather[0].description}</p>
                  </div>
                </div>
              </div>
            ))}
        </div>
        <div className="mt-3 text-center">
          <button className="btn btn-success mx-2" onClick={handlePrevClick}>
            Previous 5 Days
          </button>
          <button className="btn btn-success mx-2" onClick={handleNextClick}>
            Next 5 Days
          </button>
        </div>
      </div>
    </div>
  );
};

export default FiveDayForecast;
