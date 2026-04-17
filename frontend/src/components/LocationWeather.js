import React, { useState, useEffect } from 'react';
import { MapPin, Cloud, Droplets, Wind, Eye, Info, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

const LocationWeather = () => {
  const { t } = useTranslation();
  const [weather, setWeather] = useState(null);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
          fetchWeather(latitude, longitude);
        },
        (error) => {
          console.log('Location error:', error);
          setLoading(false);
          // Use default location (Delhi)
          fetchWeather(28.7041, 77.1025);
        }
      );
    } else {
      // Fallback to Delhi coordinates
      fetchWeather(28.7041, 77.1025);
    }
  }, []);

  const fetchWeather = async (lat, lon) => {
    try {
      // Using Open-Meteo free weather API (no API key required)
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,visibility&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`
      );
      const data = await response.json();
      
      const current = data.current;
      const daily = data.daily;

      setWeather({
        current: {
          temp: Math.round(current.temperature_2m),
          humidity: current.relative_humidity_2m,
          windSpeed: Math.round(current.wind_speed_10m),
          visibility: Math.round(current.visibility / 1000),
          condition: getWeatherCondition(current.weather_code),
          code: current.weather_code
        },
        daily: daily.time.slice(0, 5).map((date, idx) => ({
          date,
          maxTemp: daily.temperature_2m_max[idx],
          minTemp: daily.temperature_2m_min[idx],
          rain: daily.precipitation_sum[idx],
          condition: getWeatherCondition(daily.weather_code[idx])
        }))
      });
    } catch (error) {
      console.error('Weather fetch error:', error);
      toast.error(t('weather.unableToLoad'));
    } finally {
      setLoading(false);
    }
  };

  const getWeatherCondition = (code) => {
    // WMO Weather interpretation codes
    if (code === 0) return { text: 'Clear', icon: '☀️' };
    if (code === 1 || code === 2) return { text: 'Cloudy', icon: '⛅' };
    if (code === 3) return { text: 'Overcast', icon: '☁️' };
    if (code === 45 || code === 48) return { text: 'Foggy', icon: '🌫️' };
    if (code >= 51 && code <= 67) return { text: 'Drizzle', icon: '🌦️' };
    if (code >= 71 && code <= 85) return { text: 'Snow', icon: '❄️' };
    if (code === 86 || code === 87) return { text: 'Snow Showers', icon: '🌨️' };
    if (code >= 80 && code <= 82) return { text: 'Showers', icon: '🌧️' };
    if (code === 80 || code === 81 || code === 82) return { text: 'Rain', icon: '🌧️' };
    if (code >= 90 && code <= 99) return { text: 'Thunderstorm', icon: '⛈️' };
    return { text: 'Unknown', icon: '🌤️' };
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin inline-block text-2xl">⏳</div>
        <p className="text-gray-600 mt-2">{t('weather.loading')}</p>
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="p-6 text-center text-gray-600">
        {t('weather.unableToLoad')}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-green-100 rounded-lg">
          <MapPin size={24} className="text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">{t('weather.title')}</h2>
      </div>

      {/* Current Weather */}
      <motion.div
        className="p-6 bg-gradient-to-br from-blue-100 to-blue-50 border-2 border-blue-200 rounded-2xl shadow-sm"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-blue-700 font-semibold text-sm mb-1">{t('weather.currentWeather')}</p>
            <p className="text-5xl font-bold text-blue-900">{weather.current.temp}°C</p>
            <p className="text-2xl text-blue-700 mt-1">
              {weather.current.condition.icon} {weather.current.condition.text}
            </p>
          </div>
          <motion.div 
            className="text-6xl"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            {weather.current.condition.icon}
          </motion.div>
        </div>

        {/* Weather Details Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div className="p-3 bg-white rounded-xl shadow-sm" whileHover={{ y: -2 }}>
            <p className="text-xs text-gray-500 mb-1">{t('weather.humidity')}</p>
            <p className="text-xl font-bold text-gray-800">{weather.current.humidity}%</p>
            <Droplets size={16} className="text-blue-500 mt-1" />
          </motion.div>
          
          <motion.div className="p-3 bg-white rounded-xl shadow-sm" whileHover={{ y: -2 }}>
            <p className="text-xs text-gray-500 mb-1">{t('weather.windSpeed')}</p>
            <p className="text-xl font-bold text-gray-800">{weather.current.windSpeed} km/h</p>
            <Wind size={16} className="text-blue-500 mt-1" />
          </motion.div>
          
          <motion.div className="p-3 bg-white rounded-xl shadow-sm" whileHover={{ y: -2 }}>
            <p className="text-xs text-gray-500 mb-1">{t('weather.visibility')}</p>
            <p className="text-xl font-bold text-gray-800">{weather.current.visibility} km</p>
            <Eye size={16} className="text-blue-500 mt-1" />
          </motion.div>

          <motion.div className="p-3 bg-white rounded-xl shadow-sm" whileHover={{ y: -2 }}>
            <p className="text-xs text-gray-500 mb-1">{t('weather.pressure')}</p>
            <p className="text-xl font-bold text-gray-800">1013 hPa</p>
            <Cloud size={16} className="text-blue-500 mt-1" />
          </motion.div>
        </div>
      </motion.div>

      {/* 5-Day Forecast */}
      <div>
        <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
          <Calendar size={18} className="text-green-600" />
          {t('weather.forecast5Day')}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {weather.daily.map((day, idx) => (
            <motion.div
              key={idx}
              className="p-3 bg-white border-2 border-gray-100 rounded-xl text-center hover:border-green-200 transition-all shadow-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <p className="text-xs font-semibold text-gray-500 mb-2">
                {new Date(day.date).toLocaleDateString(navigator.language, { weekday: 'short' })}
              </p>
              <p className="text-3xl mb-2">{day.condition.icon}</p>
              <p className="text-sm font-bold text-gray-800">
                {Math.round(day.maxTemp)}° / {Math.round(day.minTemp)}°
              </p>
              {day.rain > 0 && (
                <p className="text-xs text-blue-600 mt-1 font-medium">🌧️ {Math.round(day.rain)}mm</p>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Farming Alert */}
      <motion.div
        className="p-4 bg-amber-50 border-2 border-amber-200 rounded-xl shadow-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center gap-2 mb-2">
          <Info size={18} className="text-amber-600" />
          <p className="font-bold text-amber-900">{t('weather.farmingAlert')}</p>
        </div>
        <ul className="text-sm text-amber-800 space-y-2">
          {weather.current.humidity > 70 && (
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-amber-400 rounded-full"></span>
              {t('weather.highHumidity')}
            </li>
          )}
          {weather.current.windSpeed > 30 && (
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-amber-400 rounded-full"></span>
              {t('weather.strongWinds')}
            </li>
          )}
          {weather.daily[0].rain > 10 && (
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-amber-400 rounded-full"></span>
              {t('weather.heavyRain')}
            </li>
          )}
          {weather.current.temp > 35 && (
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-amber-400 rounded-full"></span>
              {t('weather.hotWeather')}
            </li>
          )}
          <li className="flex items-center gap-2 opacity-60">
            <span className="w-1.5 h-1.5 bg-amber-400 rounded-full"></span>
            ✓ {t('insights.general')} - {t('insights.water')}
          </li>
        </ul>
      </motion.div>
    </div>
  );
};

export default LocationWeather;
