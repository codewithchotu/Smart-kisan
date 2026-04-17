import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, MapPin, Award } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const BestMarketFinder = ({ onSwitchTab }) => {
  const { t } = useTranslation();
  const [selectedCrop, setSelectedCrop] = useState('rice');
  const [markets, setMarkets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMarkets();
  }, [selectedCrop]);

  const fetchMarkets = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/best-markets/${selectedCrop}`);
      setMarkets(response.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const bestPrice = markets.length > 0 ? Math.max(...markets.map(m => m.price)) : 0;
  const bestPredicted = markets.length > 0 ? Math.max(...markets.map(m => m.predicted)) : 0;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Award className="text-yellow-500" size={28} />
          {t('bestMarket.title')} - Hyderabad Insights
        </h2>
      </div>

      {/* Crop Selection */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
        {['rice', 'wheat', 'cotton', 'corn', 'sugarcane'].map(crop => (
          <motion.button
            key={crop}
            onClick={() => setSelectedCrop(crop)}
            className={`p-2 rounded-xl font-semibold transition-all ${
              selectedCrop === crop
                ? 'bg-gradient-to-r from-emerald-600 to-green-500 text-white shadow-lg'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {t(`form.${crop}`)}
          </motion.button>
        ))}
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div className="p-4 bg-green-50 border-2 border-green-200 rounded-xl">
          <p className="text-sm text-gray-600">Highest Current Price</p>
          <p className="text-2xl font-bold text-green-700">₹{bestPrice}</p>
        </motion.div>
        
        <motion.div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
          <p className="text-sm text-gray-600">AI Predicted Price</p>
          <p className="text-2xl font-bold text-blue-700">₹{bestPredicted}</p>
          <span className="text-xs text-blue-600 font-medium">+Next Month Prediction</span>
        </motion.div>

        <motion.div className="p-4 bg-purple-50 border-2 border-purple-200 rounded-xl">
          <p className="text-sm text-gray-600">Trend Confidence</p>
          <p className="text-2xl font-bold text-purple-700">92%</p>
          <span className="text-xs text-purple-600">Based on historical data</span>
        </motion.div>
      </div>

      {/* Markets List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center p-12 text-gray-400">Loading Hyderabad market data...</div>
        ) : (
          markets.map((m, idx) => (
            <motion.div
              key={idx}
              className="p-5 bg-white border-2 border-gray-100 rounded-2xl shadow-sm hover:border-emerald-300 transition-all group"
              whileHover={{ y: -3 }}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-emerald-100 rounded-xl text-emerald-600">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{m.name}</h3>
                    <p className="text-gray-500 text-sm flex items-center gap-1">
                      {m.distance} away • <span className="text-yellow-500 font-medium">{m.rating}</span>
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-gray-900">₹{m.price}</p>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Per Quintal</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="text-blue-500" size={18} />
                  <span className="text-sm font-bold text-blue-700">AI Predicts: ₹{m.predicted}</span>
                  <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-bold">NEXT MONTH</span>
                </div>
                <button 
                  onClick={() => onSwitchTab('market')}
                  className="text-sm font-black text-emerald-600 hover:text-emerald-700 underline px-3 py-2 bg-emerald-50 rounded-lg transition-all hover:scale-110 cursor-pointer"
                >
                  VIEW MARKET TRENDS 📈
                </button>
              </div>
            </motion.div>
          ))
        )}
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
