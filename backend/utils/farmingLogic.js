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

// Get weather insights (mock data)
const getWeatherInsights = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weather = [];
  
  for (let i = 0; i < 7; i++) {
    weather.push({
      day: days[i],
      temp: Math.floor(Math.random() * 10) + 25,
      condition: ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain'][Math.floor(Math.random() * 4)],
      humidity: Math.floor(Math.random() * 40) + 40
    });
  }
  
  return {
    weekly: weather,
    recommendation: 'Next 3 days favorable for sowing. Light rainfall expected on Friday.',
    advisory: 'Irrigation recommended every 3-4 days if no rainfall'
  };
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