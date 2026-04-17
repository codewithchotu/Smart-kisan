import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const MarketPrices = () => {
  const { t } = useTranslation();
  const [selectedCrop, setSelectedCrop] = useState('rice');

  // Mock price trend data
  const priceTrends = {
    rice: [
      { date: 'Mon', price: 2320, avgPrice: 2300 },
      { date: 'Tue', price: 2340, avgPrice: 2310 },
      { date: 'Wed', price: 2360, avgPrice: 2330 },
      { date: 'Thu', price: 2350, avgPrice: 2340 },
      { date: 'Fri', price: 2390, avgPrice: 2360 },
      { date: 'Sat', price: 2420, avgPrice: 2380 },
      { date: 'Sun', price: 2400, avgPrice: 2390 }
    ],
    wheat: [
      { date: 'Mon', price: 2050, avgPrice: 2040 },
      { date: 'Tue', price: 2070, avgPrice: 2055 },
      { date: 'Wed', price: 2090, avgPrice: 2070 },
      { date: 'Thu', price: 2080, avgPrice: 2075 },
      { date: 'Fri', price: 2100, avgPrice: 2085 },
      { date: 'Sat', price: 2120, avgPrice: 2100 },
      { date: 'Sun', price: 2100, avgPrice: 2100 }
    ],
    cotton: [
      { date: 'Mon', price: 5620, avgPrice: 5600 },
      { date: 'Tue', price: 5680, avgPrice: 5640 },
      { date: 'Wed', price: 5720, avgPrice: 5680 },
      { date: 'Thu', price: 5700, avgPrice: 5700 },
      { date: 'Fri', price: 5780, avgPrice: 5740 },
      { date: 'Sat', price: 5820, avgPrice: 5780 },
      { date: 'Sun', price: 5800, avgPrice: 5800 }
    ],
    corn: [
      { date: 'Mon', price: 1610, avgPrice: 1600 },
      { date: 'Tue', price: 1630, avgPrice: 1615 },
      { date: 'Wed', price: 1650, avgPrice: 1630 },
      { date: 'Thu', price: 1640, avgPrice: 1635 },
      { date: 'Fri', price: 1670, avgPrice: 1655 },
      { date: 'Sat', price: 1680, avgPrice: 1670 },
      { date: 'Sun', price: 1650, avgPrice: 1670 }
    ],
    sugarcane: [
      { date: 'Mon', price: 3080, avgPrice: 3070 },
      { date: 'Tue', price: 3120, avgPrice: 3095 },
      { date: 'Wed', price: 3160, avgPrice: 3125 },
      { date: 'Thu', price: 3140, avgPrice: 3140 },
      { date: 'Fri', price: 3200, avgPrice: 3170 },
      { date: 'Sat', price: 3240, avgPrice: 3200 },
      { date: 'Sun', price: 3200, avgPrice: 3200 }
    ]
  };

  const currentTrend = priceTrends[selectedCrop];
  const currentPrice = currentTrend[currentTrend.length - 1].price;
  const prevPrice = currentTrend[0].price;
  const priceChange = currentPrice - prevPrice;
  const changePercent = ((priceChange / prevPrice) * 100).toFixed(2);

  const crops = ['rice', 'wheat', 'cotton', 'corn', 'sugarcane'];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <TrendingUp className="text-green-600" size={28} />
          {t('market.title')}
        </h2>
      </div>

      {/* Crop Selection */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {crops.map(crop => (
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

      {/* Price Info Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          className="p-4 bg-gradient-to-br from-green-100 to-green-50 border-2 border-green-200 rounded-xl"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-xs text-gray-600 mb-1">{t('market.currentPrice')}</p>
          <p className="text-2xl font-bold text-green-700">₹{currentPrice}</p>
          <p className="text-xs text-green-600 mt-1">{t('market.perQuintal')}</p>
        </motion.div>

        <motion.div
          className={`p-4 bg-gradient-to-br ${priceChange >= 0 ? 'from-blue-100 to-blue-50' : 'from-red-100 to-red-50'} border-2 ${priceChange >= 0 ? 'border-blue-200' : 'border-red-200'} rounded-xl`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <p className="text-xs text-gray-600 mb-1">{t('market.weeklyChange')}</p>
          <p className={`text-2xl font-bold ${priceChange >= 0 ? 'text-blue-700' : 'text-red-700'}`}>
            {priceChange >= 0 ? '+' : ''}{changePercent}%
          </p>
          <p className="text-xs text-gray-600 mt-1">₹{priceChange >= 0 ? '+' : ''}{priceChange}</p>
        </motion.div>

        <motion.div
          className="p-4 bg-gradient-to-br from-purple-100 to-purple-50 border-2 border-purple-200 rounded-xl"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-xs text-gray-600 mb-1">{t('market.minPrice')}</p>
          <p className="text-2xl font-bold text-purple-700">₹{Math.min(...currentTrend.map(d => d.price))}</p>
          <p className="text-xs text-purple-600 mt-1">{t('market.thisWeek')}</p>
        </motion.div>

        <motion.div
          className="p-4 bg-gradient-to-br from-orange-100 to-orange-50 border-2 border-orange-200 rounded-xl"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-xs text-gray-600 mb-1">{t('market.maxPrice')}</p>
          <p className="text-2xl font-bold text-orange-700">₹{Math.max(...currentTrend.map(d => d.price))}</p>
          <p className="text-xs text-orange-600 mt-1">{t('market.thisWeek')}</p>
        </motion.div>
      </div>

      {/* Price Trend Chart */}
      <motion.div
        className="p-6 bg-white border-2 border-gray-200 rounded-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Calendar size={20} className="text-green-600" />
          {t('market.weeklyTrend')}
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={currentTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="date" stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '2px solid #10b981',
                borderRadius: '8px'
              }}
            />
            <Legend iconType="circle" />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ fill: '#10b981', r: 5 }}
              activeDot={{ r: 7 }}
              name={t('market.currentPrice')}
            />
            <Line
              type="monotone"
              dataKey="avgPrice"
              stroke="#d1d5db"
              strokeWidth={2}
              strokeDasharray="5 5"
              name="Average Price"
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Market Insights */}
      <motion.div
        className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <p className="font-bold text-green-900 mb-3">📊 {t('market.insights')}</p>
        <ul className="text-sm text-green-800 space-y-2">
          <li>
            {priceChange >= 0 ? '📈' : '📉'} {priceChange >= 0 ? t('market.priceIncreasing') : t('market.priceDecreasing')}
          </li>
          <li>
            💰 {t('market.bestTime')} {currentTrend[currentTrend.length - 1].date}
          </li>
          <li>
            ⏰ {t('market.volatility')} {(Math.max(...currentTrend.map(d => d.price)) - Math.min(...currentTrend.map(d => d.price))).toFixed(0)} points
          </li>
          <li>
            🎯 {t('market.recommendation')} {priceChange >= 0 ? t('market.hold') : t('market.sell')}
          </li>
        </ul>
      </motion.div>
    </div>
  );
};

export default MarketPrices;