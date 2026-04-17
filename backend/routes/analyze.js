const express = require('express');
const router = express.Router();
const FarmAnalysis = require('../models/FarmAnalysis');
const farmingLogic = require('../utils/farmingLogic');

// POST /api/analyze
router.post('/analyze', async (req, res) => {
  try {
    const { soil, ph, rainfall, crop, season, water, lat, lng } = req.body;

    // Validate input
    if (!soil || !ph || !rainfall || !crop) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Calculate analysis results
    const soilScore = farmingLogic.calculateSoilScore(soil, ph);
    const yieldPrediction = farmingLogic.calculateYield(soil, crop, rainfall);
    const strategies = farmingLogic.generateStrategies(soil, crop, rainfall, ph);
    
    // Find best strategy (highest profit)
    const bestStrategy = strategies.reduce((best, current) => 
      current.profit > best.profit ? current : best
    );

    // Get additional recommendations
    const pestGuidance = farmingLogic.getPestGuidance(crop);
    const fertilizerRecommendation = farmingLogic.getFertilizerRecommendation(soil, ph);
    const cropRecommendation = farmingLogic.getCropRecommendation(soil, ph, rainfall);
    const weatherInsights = await farmingLogic.getWeatherInsights(lat, lng);

    // Determine risk level
    let riskLevel = 'Low';
    if (soilScore < 40 || ph < 5.5 || ph > 8.5) riskLevel = 'High';
    else if (soilScore < 70 || (ph < 6.0 || ph > 7.5)) riskLevel = 'Medium';

    // Generate summary
    const summary = `Based on your ${soil} soil with pH ${ph}, ${rainfall} rainfall, and ${crop} crop, the ${bestStrategy.name} strategy is recommended. Expected profit: ₹${bestStrategy.profit.toLocaleString()}/acre. Risk level: ${riskLevel}.`;

    const result = {
      soilScore,
      yieldPrediction,
      strategies,
      bestStrategy,
      pestGuidance,
      fertilizerRecommendation,
      cropRecommendation,
      weatherInsights,
      riskLevel,
      summary
    };

    // Save to database
    const analysis = new FarmAnalysis({
      soil,
      ph,
      rainfall,
      crop,
      season,
      water,
      result
    });

    await analysis.save();

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error in analysis:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;