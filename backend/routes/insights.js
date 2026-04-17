const express = require('express');
const router = express.Router();
const FarmAnalysis = require('../models/FarmAnalysis');

// GET /api/insights
router.get('/insights', async (req, res) => {
  try {
    const { soil, crop } = req.query;
    
    if (!soil || !crop) {
      return res.status(400).json({ error: 'Soil and crop parameters are required' });
    }

    // Find similar records
    const similarRecords = await FarmAnalysis.find({
      soil: soil,
      crop: { $regex: new RegExp(crop, 'i') }
    });

    if (similarRecords.length === 0) {
      return res.json({
        success: true,
        message: `No historical data available for ${crop} in ${soil} soil. Start analyzing to build insights!`,
        data: null
      });
    }

    // Calculate average profit and best outcomes
    let totalProfit = 0;
    let bestProfit = 0;
    let bestStrategy = '';

    similarRecords.forEach(record => {
      const profit = record.result.bestStrategy?.profit || 0;
      totalProfit += profit;
      if (profit > bestProfit) {
        bestProfit = profit;
        bestStrategy = record.result.bestStrategy?.name || '';
      }
    });

    const avgProfit = totalProfit / similarRecords.length;

    let message = `Based on ${similarRecords.length} previous analysis${similarRecords.length > 1 ? 'es' : ''}, `;
    message += `${crop} in ${soil} soil has shown an average profit of ₹${avgProfit.toLocaleString()}/acre. `;
    
    if (bestProfit > avgProfit * 1.2) {
      message += `The ${bestStrategy} strategy yielded the best result with ₹${bestProfit.toLocaleString()}/acre profit. `;
    }
    
    message += `Consider following best practices from successful farmers in similar conditions.`;

    res.json({
      success: true,
      message,
      data: {
        totalAnalyses: similarRecords.length,
        averageProfit: avgProfit,
        bestProfit: bestProfit,
        bestStrategy
      }
    });
  } catch (error) {
    console.error('Error fetching insights:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;