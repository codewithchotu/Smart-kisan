const axios = require('axios');

/**
 * Fetches real-time mandi prices from Government of India (OGD) Portal
 * Note: Requires an API key from data.gov.in
 */
const fetchRealMandiPrices = async (cropName, district = 'Hyderabad') => {
  try {
    const API_KEY = process.env.DATA_GOV_API_KEY;
    const RESOURCE_ID = '9ef273e5-7f2d-4551-86a0-621cae48395f'; // Daily Mandi Prices Resource
    
    // If no API key, return null to trigger fallback
    if (!API_KEY || API_KEY === 'YOUR_API_KEY') {
      return null;
    }

    const response = await axios.get(`https://api.data.gov.in/resource/${RESOURCE_ID}`, {
      params: {
        'api-key': API_KEY,
        'format': 'json',
        'filters[district]': district,
        'filters[commodity]': cropName,
        'limit': 10
      }
    });

    if (response.data && response.data.records) {
      return response.data.records.map(record => ({
        market: record.market,
        commodity: record.commodity,
        variety: record.variety,
        minPrice: record.min_price,
        maxPrice: record.max_price,
        modalPrice: record.modal_price,
        date: record.arrival_date
      }));
    }
    return null;
  } catch (error) {
    console.error('Error fetching from OGD API:', error.message);
    return null;
  }
};

module.exports = { fetchRealMandiPrices };
