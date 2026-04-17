import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, Wind, Droplets, Thermometer } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const WeatherWidget = ({ location }) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [advisory, setAdvisory] = useState('');

  useEffect(() => {
    fetchWeather();
  }, [location]);

  const fetchWeather = async () => {
    if (!location || !location.lat || !location.lng) {
      // Fallback to Delhi if no location provided
      const config = { lat: 28.7041, lng: 77.1025 };
      try {
        const response = await axios.get(`${API_URL}/weather/${config.lat}/${config.lng}`);
        setWeather(response.data.data);
      } catch (err) { console.error(err); }
      setLoading(false);
      return;
    }
    try {
      const response = await axios.get(`${API_URL}/weather/${location.lat}/${location.lng}`);
      setWeather(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Weather fetch error:', error);
      setLoading(false);
    }
  };

  const getWeatherIcon = (temp) => {
    if (temp > 30) return <Sun className="text-yellow-500" size={32} />;
    if (temp > 20) return <Cloud className="text-blue-400" size={32} />;
    return <CloudRain className="text-blue-500" size={32} />;
  };

  if (loading) {
    return (
      <div className="card bg-gradient-to-r from-blue-500 to-blue-600 text-white animate-pulse">
        <div className="h-32"></div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="card bg-gradient-to-r from-blue-500 to-blue-600 text-white"
    >
      <h3 className="text-lg font-semibold mb-3 flex items-center">
        🌤️ Live Weather
      </h3>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          {getWeatherIcon(weather?.current_weather?.temperature || 28)}
          <div className="text-3xl font-bold mt-2">
            {weather?.current_weather?.temperature || 28}°C
          </div>
          <div className="text-sm opacity-90">Current</div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center"><Wind size={14} className="mr-1" /> Wind</span>
            <span>{weather?.current_weather?.windspeed || 12} km/h</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center"><Droplets size={14} className="mr-1" /> Rain</span>
            <span>{weather?.daily?.rain_sum?.[0] || 0} mm</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center"><Thermometer size={14} className="mr-1" /> Max/Min</span>
            <span>{weather?.daily?.temperature_2m_max?.[0] || 30}° / {weather?.daily?.temperature_2m_min?.[0] || 20}°</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-1 text-center text-xs">
        {weather?.daily?.temperature_2m_max?.slice(0, 5).map((temp, idx) => (
          <div key={idx}>
            <div className="opacity-75">{['M','T','W','T','F'][idx]}</div>
            <div className="font-bold">{temp}°</div>
          </div>
        ))}
      </div>

      {advisory && (
        <div className="mt-3 p-2 bg-blue-400 rounded-lg text-xs">
          💡 {advisory}
        </div>
      )}
    </motion.div>
  );
};

export default WeatherWidget;