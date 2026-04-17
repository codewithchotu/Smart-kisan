const mongoose = require('mongoose');

const farmAnalysisSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
    default: null
  },
  soil: {
    type: String,
    enum: ['sandy', 'clay', 'loamy'],
    required: true
  },
  ph: {
    type: Number,
    required: true,
    min: 0,
    max: 14
  },
  rainfall: {
    type: String,
    enum: ['low', 'medium', 'high'],
    required: true
  },
  crop: {
    type: String,
    required: true
  },
  season: {
    type: String,
    enum: ['kharif', 'rabi', 'zaid', 'summer'],
    default: 'kharif'
  },
  water: {
    type: String,
    enum: ['abundant', 'sufficient', 'limited', 'critical'],
    default: 'sufficient'
  },
  result: {
    soilScore: Number,
    yieldPrediction: Number,
    strategies: Array,
    bestStrategy: Object,
    pestGuidance: Object,
    fertilizerRecommendation: Object,
    cropRecommendation: Object,
    weatherInsights: Object,
    riskLevel: String,
    summary: String
  },
  weatherData: Object,
  marketData: Object,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('FarmAnalysis', farmAnalysisSchema);