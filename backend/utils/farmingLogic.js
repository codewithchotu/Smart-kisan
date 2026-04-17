// Calculate soil health score (0-100)
const calculateSoilScore = (soil, ph) => {
  let score = 0;
  
  // Soil type contribution (max 50 points)
  const soilScores = {
    'loamy': 50,
    'clay': 35,
    'sandy': 25
  };
  score += soilScores[soil] || 30;
  
  // pH contribution (max 50 points)
  if (ph >= 6.0 && ph <= 7.5) score += 50;
  else if (ph >= 5.5 && ph < 6.0) score += 35;
  else if (ph > 7.5 && ph <= 8.0) score += 35;
  else if (ph >= 5.0 && ph < 5.5) score += 20;
  else if (ph > 8.0 && ph <= 8.5) score += 20;
  else score += 10;
  
  return Math.min(100, Math.max(0, score));
};

// Calculate yield prediction (quintals/acre)
const calculateYield = (soil, crop, rainfall) => {
  const baseYield = {
    'rice': 25,
    'wheat': 20,
    'corn': 30,
    'cotton': 15,
    'sugarcane': 40
  };
  
  let yield_ = baseYield[crop.toLowerCase()] || 20;
  
  // Soil modifier
  const soilModifiers = {
    'loamy': 1.3,
    'clay': 1.1,
    'sandy': 0.8
  };
  yield_ *= soilModifiers[soil] || 1;
  
  // Rainfall modifier
  const rainModifiers = {
    'high': 1.2,
    'medium': 1.0,
    'low': 0.7
  };
  yield_ *= rainModifiers[rainfall] || 1;
  
  return Math.round(yield_);
};

// Generate three investment strategies
const generateStrategies = (soil, crop, rainfall, ph) => {
  const baseYield = calculateYield(soil, crop, rainfall);
  const marketPrice = getMarketPrice(crop);
  
  const strategies = [
    {
      name: 'Low Investment',
      investment: 15000,
      yield: Math.round(baseYield * 0.7),
      practices: 'Basic seeds, minimal fertilizers, traditional irrigation'
    },
    {
      name: 'Balanced',
      investment: 35000,
      yield: Math.round(baseYield * 1.0),
      practices: 'HYV seeds, balanced fertilizers, drip irrigation'
    },
    {
      name: 'High Investment',
      investment: 60000,
      yield: Math.round(baseYield * 1.4),
      practices: 'Premium seeds, precision farming, automated irrigation'
    }
  ];
  
  // Calculate profit for each strategy
  strategies.forEach(strategy => {
    const revenue = strategy.yield * marketPrice;
    strategy.profit = revenue - strategy.investment;
    strategy.revenue = revenue;
  });
  
  return strategies;
};

// Get market price per quintal
const getMarketPrice = (crop) => {
  const prices = {
    'rice': 2200,
    'wheat': 2400,
    'corn': 2000,
    'cotton': 5500,
    'sugarcane': 3500
  };
  return prices[crop.toLowerCase()] || 2100;
};

// Get pest guidance based on crop
const getPestGuidance = (crop) => {
  const pestDatabase = {
    'rice': {
      pests: ['Stem Borer', 'Leaf Folder', 'Brown Plant Hopper'],
      solutions: [
        'Use resistant varieties',
        'Apply Neem-based pesticides',
        'Install light traps'
      ]
    },
    'wheat': {
      pests: ['Aphids', 'Termites', 'Wheat Weevil'],
      solutions: [
        'Seed treatment with Imidacloprid',
        'Spray Dimethoate if infestation severe',
        'Maintain field hygiene'
      ]
    },
    'corn': {
      pests: ['Corn Borer', 'Armyworm', 'Aphids'],
      solutions: [
        'Release Trichogramma eggs',
        'Apply Carbaryl granules',
        'Crop rotation'
      ]
    },
    'default': {
      pests: ['Aphids', 'Whiteflies', 'Caterpillars'],
      solutions: [
        'Regular monitoring',
        'Use organic pesticides like Neem oil',
        'Encourage natural predators'
      ]
    }
  };
  
  return pestDatabase[crop.toLowerCase()] || pestDatabase.default;
};

// Get fertilizer recommendation
const getFertilizerRecommendation = (soil, ph) => {
  let recommendation = {
    primary: [],
    secondary: [],
    organic: ['Compost', 'Farm Yard Manure']
  };
  
  // Base fertilizers
  if (soil === 'sandy') {
    recommendation.primary.push('Urea (Nitrogen) - 120 kg/ha');
    recommendation.primary.push('DAP (Phosphorus) - 60 kg/ha');
  } else if (soil === 'clay') {
    recommendation.primary.push('Urea (Nitrogen) - 100 kg/ha');
    recommendation.primary.push('MOP (Potassium) - 50 kg/ha');
  } else {
    recommendation.primary.push('Urea (Nitrogen) - 110 kg/ha');
    recommendation.primary.push('DAP (Phosphorus) - 55 kg/ha');
    recommendation.primary.push('MOP (Potassium) - 40 kg/ha');
  }
  
  // pH adjustment
  if (ph < 5.5) {
    recommendation.secondary.push('Lime - 500 kg/ha (to reduce acidity)');
  } else if (ph > 8.0) {
    recommendation.secondary.push('Gypsum - 400 kg/ha (to reduce alkalinity)');
  } else if (ph < 6.5) {
    recommendation.secondary.push('Dolomite - 300 kg/ha');
  }
  
  recommendation.organic.push('Green manure cover crops');
  
  return recommendation;
};

// Get crop recommendation
const getCropRecommendation = (soil, ph, rainfall) => {
  const recommendations = {
    best: '',
    alternatives: [],
    reason: ''
  };
  
  if (soil === 'loamy') {
    recommendations.best = 'Rice/Wheat rotation';
    recommendations.alternatives = ['Maize', 'Sugarcane', 'Cotton'];
    recommendations.reason = 'Loamy soil with good drainage and fertility';
  } else if (soil === 'clay') {
    recommendations.best = 'Rice';
    recommendations.alternatives = ['Sugarcane', 'Wheat'];
    recommendations.reason = 'Clay soil retains water well for paddy cultivation';
  } else {
    recommendations.best = 'Groundnut/Millets';
    recommendations.alternatives = ['Watermelon', 'Pulses'];
    recommendations.reason = 'Sandy soil requires drought-resistant crops';
  }
  
  if (ph < 5.5) {
    recommendations.best = 'Tea/Coffee (if applicable)';
    recommendations.reason += ', acidic soil tolerant crops';
  } else if (ph > 8.0) {
    recommendations.best = 'Barley/Sunflower';
    recommendations.reason += ', alkaline soil tolerant crops';
  }
  
  if (rainfall === 'low') {
    recommendations.alternatives.push('Millets', 'Sorghum');
  }
  
  return recommendations;
};

// Get real-time weather insights from Open-Meteo API
const getWeatherInsights = async (lat = 28.7, lng = 77.1) => {
  try {
    const axios = require('axios');
    const response = await axios.get(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=temperature_2m_max,temperature_2m_min,relative_humidity_2m_max,weather_code&current_weather=true&timezone=auto`
    );

    const { daily, current_weather } = response.data;
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    const weeklyWeather = daily.time.map((time, index) => {
      const date = new Date(time);
      return {
        day: days[date.getDay()],
        temp: Math.round(daily.temperature_2m_max[index]),
        humidity: Math.round(daily.relative_humidity_2m_max[index]),
        condition: getWeatherDescription(daily.weather_code[index])
      };
    });

    // Resolve area name from coordinates
    let areaName = 'Selected Area';
    try {
      const geoRes = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`, {
        headers: { 'User-Agent': 'SmartKisan/1.0' }
      });
      areaName = geoRes.data.address.city || geoRes.data.address.town || geoRes.data.address.village || geoRes.data.address.suburb || areaName;
    } catch (e) { console.log('Geo resolution failed'); }

    return {
      areaName,
      weekly: weeklyWeather,
      recommendation: generateWeatherRecommendation(current_weather.temperature, daily.relative_humidity_2m_max[0]),
      advisory: generateWeatherAdvisory(daily.weather_code[0])
    };
  } catch (error) {
    console.error('Weather API Error:', error);
    // Fallback to stylized mock data if API fails
    return {
      weekly: Array(7).fill(0).map((_, i) => ({
        day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
        temp: 25 + i,
        humidity: 60,
        condition: 'Clear'
      })),
      recommendation: 'Unable to fetch real-time weather. Showing seasonal averages.',
      advisory: 'Please check your internet connection for real-time updates.'
    };
  }
};

// Helper to describe weather code
const getWeatherDescription = (code) => {
  if (code === 0) return 'Clear';
  if (code < 4) return 'Partly Cloudy';
  if (code < 50) return 'Foggy';
  if (code < 70) return 'Rainy';
  return 'Cloudy';
};

// Helper for recommendations
const generateWeatherRecommendation = (temp, humidity) => {
  if (temp > 35) return 'High temperature detected. Ensure adequate irrigation and avoid fertilization during peak heat.';
  if (humidity > 80) return 'High humidity: favorable for fungal growth. Monitor crops closely for signs of disease.';
  return 'Current weather is stable. Ideal for standard farm maintenance and observation.';
};

// Helper for advisory
const generateWeatherAdvisory = (code) => {
  if (code >= 51) return 'Rain expected. Delay pesticide applications to avoid wash-off.';
  if (code === 0) return 'Abundant sunlight expected. Good day for harvesting or drying crops.';
  return 'Normal conditions. Continue with scheduled agricultural activities.';
};

module.exports = {
  calculateSoilScore,
  calculateYield,
  generateStrategies,
  getPestGuidance,
  getFertilizerRecommendation,
  getCropRecommendation,
  getWeatherInsights
};