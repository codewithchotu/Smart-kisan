const express = require('express');
const router = express.Router();
const FarmAnalysis = require('../models/FarmAnalysis');

// GET /api/history
router.get('/history', async (req, res) => {
  try {
    const history = await FarmAnalysis.find()
      .sort({ createdAt: -1 })
      .limit(10);
    
    res.json({
      success: true,
      data: history
    });
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;