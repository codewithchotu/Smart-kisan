const express = require('express');
const router = express.Router();
const axios = require('axios');

// Get market prices for crops
router.get('/market-prices', async (req, res) => {
  try {
    // Mock market prices - In production, use real API
    const prices = {
      rice: { price: 2200, trend: '+2.5%', mandi: 'Azadpur Mandi' },
      wheat: { price: 2400, trend: '+1.8%', mandi: 'Ghazipur Mandi' },
      corn: { price: 2000, trend: '-0.5%', mandi: 'Najafgarh Mandi' },
      cotton: { price: 5500, trend: '+3.2%', mandi: 'Narela Mandi' },
      sugarcane: { price: 3500, trend: '+1.2%', mandi: 'Okhla Mandi' }
    };
    
    res.json({ success: true, data: prices });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch market prices' });
  }
});

// Get best selling locations
router.get('/best-markets/:crop', async (req, res) => {
  const { crop } = req.params;
  // Mock data - In production, use real API
  const markets = [
    { name: 'Azadpur Mandi, Delhi', price: 2350, distance: '50 km' },
    { name: 'Ghazipur Mandi, Delhi', price: 2280, distance: '65 km' },
    { name: 'Narela Mandi, Delhi', price: 2250, distance: '45 km' }
  ];
  
  res.json({ success: true, data: markets });
});

module.exports = router;