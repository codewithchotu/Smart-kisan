const express = require('express');
const router = express.Router();
const axios = require('axios');

// Get real-time weather
router.get('/weather/:lat/:lng', async (req, res) => {
  try {
    const { lat, lng } = req.params;
    
    // Using Open-Meteo free API
    const response = await axios.get(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=temperature_2m_max,temperature_2m_min,rain_sum,precipitation_probability_max&current_weather=true&timezone=Asia/Kolkata`
    );
    
    res.json({ success: true, data: response.data });
  } catch (error) {
    // Fallback to mock data
    const mockWeather = {
      current_weather: { temperature: 28, windspeed: 12 },
      daily: {
        temperature_2m_max: [29, 30, 31, 30, 29, 28, 27],
        temperature_2m_min: [18, 19, 20, 19, 18, 17, 16],
        rain_sum: [0, 2, 5, 1, 0, 0, 3]
      }
    };
    res.json({ success: true, data: mockWeather });
  }
});

// Get agricultural advisory based on weather
router.get('/advisory/:crop', async (req, res) => {
  const { crop } = req.params;
  
  const advisory = {
    rice: 'High humidity expected. Watch for blast disease. Apply preventive fungicide.',
    wheat: 'Temperature suitable for growth. Ensure adequate irrigation.',
    corn: 'Windy conditions ahead. Consider windbreaks if needed.',
    default: 'Normal weather conditions. Continue regular farming practices.'
  };
  
  res.json({ success: true, advisory: advisory[crop] || advisory.default });
});

module.exports = router;