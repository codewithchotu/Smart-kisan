import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, MapPin, DollarSign, Award } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const BestMarketFinder = () => {
  const { t } = useTranslation();
  const [selectedCrop, setSelectedCrop] = useState('rice');
  
  // Mock market data with prices and trends
  const marketData = {
    rice: [
      { market: 'Chandni Chowk, Delhi', price: 2400, change: '+2.5%', distance: '15 km', quality: '⭐⭐⭐⭐⭐' },
      { market: 'Azadpur Mandi, Delhi', price: 2350, change: '-1.2%', distance: '22 km', quality: '⭐⭐⭐⭐' },
      { market: 'Bhagirath Palace, Delhi', price: 2420, change: '+0.8%', distance: '8 km', quality: '⭐⭐⭐⭐⭐' },
      { market: 'APMC, Haryana', price: 2300, change: '-0.5%', distance: '45 km', quality: '⭐⭐⭐⭐' }
    ],
    wheat: [
      { market: 'Chandni Chowk, Delhi', price: 2100, change: '+1.5%', distance: '15 km', quality: '⭐⭐⭐⭐' },
      { market: 'Mandi, Punjab', price: 2080, change: '+0.3%', distance: '120 km', quality: '⭐⭐⭐⭐⭐' },
      { market: 'Haryana Mandi', price: 2050, change: '-0.8%', distance: '38 km', quality: '⭐⭐⭐⭐' }
    ],
    cotton: [
      { market: 'APMC Mumbai', price: 5800, change: '+3.2%', distance: '35 km', quality: '⭐⭐⭐⭐⭐' },
      { market: 'Gujarat Market', price: 5700, change: '+1.8%', distance: '220 km', quality: '⭐⭐⭐⭐' },
      { market: 'Deccan Mandi', price: 5650, change: '-0.5%', distance: '180 km', quality: '⭐⭐⭐⭐' }
    ],
    corn: [
      { market: 'Rajasthan Mandi', price: 1650, change: '+2.1%', distance: '60 km', quality: '⭐⭐⭐⭐' },
      { market: 'UP Market', price: 1620, change: '+0.5%', distance: '140 km', quality: '⭐⭐⭐⭐⭐' }
    ],
    sugarcane: [
      { market: 'Maharashtra Market', price: 3200, change: '+4.5%', distance: '50 km', quality: '⭐⭐⭐⭐⭐' },
      { market: 'UP Sugar Market', price: 3100, change: '+2.3%', distance: '110 km', quality: '⭐⭐⭐⭐' }
    ]
  };

  const currentMarkets = marketData[selectedCrop] || [];
  const bestPrice = Math.max(...currentMarkets.map(m => m.price));
  const worstPrice = Math.min(...currentMarkets.map(m => m.price));

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Award className="text-yellow-500" size={28} />
          {t('bestMarket.title')}
        </h2>
      </div>

      {/* Crop Selection */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
        {['rice', 'wheat', 'cotton', 'corn', 'sugarcane'].map(crop => (
          <motion.button
            key={crop}
            onClick={() => setSelectedCrop(crop)}
            className={`p-3 rounded-xl font-semibold transition-all ${
              selectedCrop === crop
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {t(`form.${crop}`)}
          </motion.button>
        ))}
      </div>

      {/* Price Range Info */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div
          className="p-4 bg-green-50 border-2 border-green-200 rounded-xl"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-sm text-gray-600 mb-1">{t('bestMarket.bestPrice')}</p>
          <p className="text-2xl font-bold text-green-600">₹{bestPrice}</p>
          <p className="text-xs text-green-500 mt-1">{t('bestMarket.highestRate')}</p>
        </motion.div>
        <motion.div
          className="p-4 bg-orange-50 border-2 border-orange-200 rounded-xl"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-sm text-gray-600 mb-1">{t('bestMarket.goodPrice')}</p>
          <p className="text-2xl font-bold text-orange-600">₹{worstPrice}</p>
          <p className="text-xs text-orange-500 mt-1">{t('bestMarket.lowestRegion')}</p>
        </motion.div>
      </div>

      {/* Markets List */}
      <div className="space-y-3">
        {currentMarkets.map((market, idx) => (
          <motion.div
            key={idx}
            className="p-4 bg-white border-2 border-gray-200 rounded-xl hover:shadow-lg transition-all hover:border-green-300"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ scale: 1.02, translateX: 5 }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="p-1 bgColor-green-100 rounded">
                    <MapPin size={18} className="text-green-600" />
                  </span>
                  <h3 className="font-bold text-gray-800">{market.market}</h3>
                </div>
                <p className="text-sm text-gray-500 ml-6">{market.distance} {t('bestMarket.away')}</p>
              </div>
              <motion.div
                className={`text-sm font-bold px-3 py-1 rounded-full ${
                  market.change.includes('+')
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {market.change}
              </motion.div>
            </div>

            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <DollarSign size={20} className="text-green-600" />
                <span className="text-2xl font-bold text-gray-800">₹{market.price}</span>
                <span className="text-sm text-gray-500">{t('market.perQuintal')}</span>
              </div>
              <span className="text-lg">{market.quality}</span>
            </div>

            {market.price === bestPrice && (
              <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-700 font-semibold">🏆 {t('bestMarket.bestPriceAward')}</p>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Tips Section */}
      <motion.div
        className="p-4 bg-blue-50 border-2 border-blue-200 rounded-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <p className="font-bold text-blue-900 mb-2">💡 {t('bestMarket.tips')}</p>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>✓ Visit markets early morning for better negotiation</li>
          <li>✓ Check quality ratings before selling</li>
          <li>✓ Monitor price trends throughout the week</li>
          <li>✓ Connect with other farmers for bulk selling</li>
        </ul>
      </motion.div>
    </div>
  );
};

export default BestMarketFinder;
