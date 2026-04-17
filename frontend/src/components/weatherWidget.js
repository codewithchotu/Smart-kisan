import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, Wind, Droplets, Thermometer, AlertTriangle, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = 'http://localhost:5000/api';

const WeatherWidget = ({ location: propLocation }) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [advisory, setAdvisory] = useState('');
  const [areaName, setAreaName] = useState('');
  
  // Disaster Alerts State
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [disasterCondition, setDisasterCondition] = useState('heavy_rain');
  const [sendingAlert, setSendingAlert] = useState(false);

  useEffect(() => {
    if (!propLocation) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
            fetchWeather(coords);
            fetchAreaName(coords.lat, coords.lng);
          },
          () => {
            fetchWeather({ lat: 28.7041, lng: 77.1025 });
            setAreaName('New Delhi');
          }
        );
      } else {
        fetchWeather({ lat: 28.7041, lng: 77.1025 });
        setAreaName('New Delhi');
      }
    } else {
      fetchWeather(propLocation);
      fetchAreaName(propLocation.lat, propLocation.lng);
    }
  }, [propLocation]);

  const fetchAreaName = async (lat, lon) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
      const data = await response.json();
      const name = data.address.city || data.address.town || data.address.village || data.address.suburb || 'Your Area';
      setAreaName(name);
    } catch (err) {
      setAreaName('Your Area');
    }
  };

  const fetchWeather = async (coords) => {
    try {
      const response = await axios.get(`${API_URL}/weather/${coords.lat}/${coords.lng}`);
      setWeather(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Weather fetch error:', error);
      setLoading(false);
    }
  };

  const handleSendAlert = async (e) => {
    e.preventDefault();
    if (!phoneNumber) {
      toast.error('Please enter a valid phone number');
      return;
    }
    
    setSendingAlert(true);
    try {
      // Ensure phone number has country code. Using +91 as default for India if no '+' is present
      const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;
      
      const response = await axios.post(`${API_URL}/alerts/send-alert`, {
        phoneNumber: formattedPhone,
        condition: disasterCondition
      });
      
      if (response.data.success) {
        toast.success(response.data.message || `Alerts sent successfully to ${formattedPhone} via SMS & WhatsApp!`);
        setShowAlertModal(false);
      } else {
        toast.error(response.data.message || 'Failed to send alerts');
      }
    } catch (error) {
      console.error('Alert sending error:', error);
      let errorMsg = error.response?.data?.message || 'Error occurred while sending the alert';
      
      // Attempt to append specific breakdown errors if provided by the new API logic
      if (error.response?.data?.errors && error.response.data.errors.length > 0) {
        errorMsg += `\n${error.response.data.errors.join('\n')}`;
      }
      
      toast.error(errorMsg, { duration: 6000 });
    } finally {
      setSendingAlert(false);
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
        🌤️ {areaName || 'Live Weather'}
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

      {/* Disaster Alerts Button and Modal */}
      <div className="mt-4">
        <button
          onClick={() => setShowAlertModal(!showAlertModal)}
          className="w-full flex items-center justify-center space-x-2 py-2 px-4 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
        >
          <AlertTriangle size={16} />
          <span className="font-semibold text-sm">Disaster Alerts</span>
        </button>
      </div>

      {showAlertModal && (
        <div className="mt-4 p-4 bg-white rounded-xl shadow-lg border border-red-100 relative">
          <button 
            onClick={() => setShowAlertModal(false)}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
          
          <h4 className="text-red-500 font-bold flex items-center text-sm mb-3">
            <AlertTriangle size={16} className="mr-1" />
            Send Emergency Alert (SMS & WhatsApp)
          </h4>
          
          <form onSubmit={handleSendAlert} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Select Disaster Condition</label>
              <select 
                value={disasterCondition}
                onChange={(e) => setDisasterCondition(e.target.value)}
                className="w-full p-2 border rounded-lg text-sm bg-gray-50 text-gray-800"
              >
                <option value="heavy_rain">Heavy Rainfall</option>
                <option value="flood">Flood</option>
                <option value="drought">Drought</option>
                <option value="tsunami">Tsunami</option>
                <option value="extreme_heat">Extreme Heat</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Your Mobile Number</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Phone size={14} /></span>
                <input 
                  type="tel"
                  placeholder="e.g. 9876543210"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full pl-8 p-2 border rounded-lg text-sm bg-gray-50 text-gray-800 focus:ring-2 focus:ring-red-400"
                  required
                />
              </div>
              <p className="text-[10px] text-gray-500 mt-1">Include + and country code (e.g. +91) if outside India</p>
            </div>
            
            <button 
              type="submit"
              disabled={sendingAlert}
              className="w-full py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-semibold text-sm hover:from-red-600 hover:to-red-700 transition-all disabled:opacity-70 flex justify-center items-center"
            >
              {sendingAlert ? (
                <span className="animate-pulse">Sending Alerts...</span>
              ) : (
                'Send Emergency Broadcast'
              )}
            </button>
          </form>
        </div>
      )}
    </motion.div>
  );
};

export default WeatherWidget;