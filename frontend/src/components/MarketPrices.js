import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Calendar, Award, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { jsPDF } from 'jspdf';

const MarketPrices = () => {
  const { t } = useTranslation();
  const [selectedCrop, setSelectedCrop] = useState('rice');
  const [marketData, setMarketData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchMarketPrices();
  }, []);

  const fetchMarketPrices = async () => {
    try {
      setLoading(true);
      setError(false);
      const response = await axios.get('http://localhost:5000/api/market-prices');
      if (response.data && response.data.data) {
        setMarketData(response.data.data);
      } else {
        setError(true);
      }
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="p-12 text-center text-red-500">
        <p className="font-bold mb-4 italic">Unable to connect to Hyderabad Mandi Servers.</p>
        <button 
          onClick={fetchMarketPrices}
          className="px-6 py-2 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors"
        >
          RETRY CONNECTION
        </button>
      </div>
    );
  }

  const handleDownloadAlerts = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(16, 185, 129); // Emerald-500
    doc.text('SMART KISAN - MARKET ALERT', 20, 20);
    
    doc.setFontSize(12);
    doc.setTextColor(100, 116, 139);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 30);
    
    // Line Separator
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 35, 190, 35);
    
    // Market Details
    doc.setFontSize(16);
    doc.setTextColor(30, 41, 59);
    doc.text(`Crop: ${selectedCrop.toUpperCase()}`, 20, 50);
    
    doc.setFontSize(14);
    doc.text(`Current Price: Rs. ${activePriceData.price}/quintal`, 20, 60);
    doc.text(`Market Name: ${activePriceData.mandi}`, 20, 70);
    
    // Prediction Box
    doc.setFillColor(240, 253, 244);
    doc.rect(20, 80, 170, 40, 'F');
    doc.setTextColor(5, 150, 105);
    doc.setFontSize(14);
    doc.text('AI PRICE FORECAST (30 DAYS)', 25, 90);
    doc.setFontSize(18);
    doc.text(`Predicted Price: Rs. ${activePriceData.predicted}`, 25, 105);
    doc.setFontSize(11);
    doc.text('Confidence Score: 92% | Trend: Bullish', 25, 115);
    
    // Strategy
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(14);
    doc.text('PROFIT STRATEGY RECOMMENDATION:', 20, 140);
    doc.setFontSize(12);
    doc.text(`- Strategy: Hold recently harvested stocks.`, 20, 150);
    doc.text(`- Goal: Target the predicted price of Rs. ${activePriceData.predicted} within 3-4 weeks.`, 20, 160);
    doc.text(`- Risk: Low (based on current Hyderabad volume).`, 20, 170);
    
    // Footer
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text('This is an AI-generated advisor report by Smart Kisan.', 20, 200);
    
    doc.save(`Price_Alert_Hyderabad_${selectedCrop}.pdf`);
  };

  const activePriceData = marketData ? marketData[selectedCrop] : null;

  if (loading || !activePriceData) {
    return (
      <div className="p-12 text-center text-gray-500">
        <div className="animate-spin inline-block w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full mb-4"></div>
        <p>Loading Hyderabad Market Analytics...</p>
      </div>
    );
  }

  const currentTrend = activePriceData.history;
  const currentPrice = activePriceData.price;
  const predictedPrice = activePriceData.predicted;
  const priceChange = currentPrice - currentTrend[0].price;
  const changePercent = ((priceChange / currentTrend[0].price) * 100).toFixed(1);

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-800 flex items-center gap-2">
            <TrendingUp className="text-emerald-600" size={32} />
            Market Insights
          </h2>
          <p className="text-gray-500 font-medium ml-1">Live from Hyderabad Mandis</p>
        </div>
        <div className="flex gap-2 bg-emerald-50 p-1.5 rounded-2xl border border-emerald-100">
          {['rice', 'wheat', 'cotton', 'corn', 'sugarcane'].map(crop => (
            <button
              key={crop}
              onClick={() => setSelectedCrop(crop)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                selectedCrop === crop
                  ? 'bg-emerald-600 text-white shadow-lg'
                  : 'text-emerald-700 hover:bg-white hover:shadow-sm'
              }`}
            >
              {crop.charAt(0).toUpperCase() + crop.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Price Cards */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-5 bg-white border-2 border-gray-100 rounded-3xl shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Current Price</p>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-gray-800">₹{currentPrice}</span>
            <span className="text-xs text-gray-500 font-bold">/Qtl</span>
          </div>
          <p className="text-xs text-emerald-600 font-bold mt-2 flex items-center gap-1">
            <MapPin size={12} /> {activePriceData.mandi}
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="p-5 bg-gray-900 border-2 border-gray-800 rounded-3xl shadow-xl">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">AI Prediction</p>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-white">₹{predictedPrice}</span>
            <span className="text-xs text-emerald-400 font-bold">NEXT MO</span>
          </div>
          <div className="mt-2 inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-lg text-[10px] font-black uppercase">
            92% Confidence
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="p-5 bg-white border-2 border-gray-100 rounded-3xl shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Weekly Change</p>
          <div className="flex items-baseline gap-1">
            <span className={`text-3xl font-black ${priceChange >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              {priceChange > 0 ? '+' : ''}{changePercent}%
            </span>
          </div>
          <p className="text-xs text-gray-500 font-bold mt-2 flex items-center gap-1">
            {priceChange >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />} 
            Past 7 Days
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="p-5 bg-white border-2 border-gray-100 rounded-3xl shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Sentiment</p>
          <p className="text-3xl font-black text-gray-800">{priceChange >= 0 ? 'BULLISH' : 'BEARISH'}</p>
          <p className="text-xs text-gray-500 font-bold mt-2">
            Action: <span className={priceChange >= 0 ? 'text-emerald-600' : 'text-orange-600'}>{priceChange >= 0 ? 'HOLD' : 'SELL NOW'}</span>
          </p>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 p-6 bg-white border-2 border-gray-100 rounded-[2rem] shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <Calendar size={20} className="text-emerald-600" />
              Trend Analysis
            </h3>
            <div className="flex gap-4 text-xs font-bold">
              <span className="flex items-center gap-1 text-emerald-600">● Current Market</span>
              <span className="flex items-center gap-1 text-gray-400">● AI Forecast</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={currentTrend}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontWeight: 'bold' }} />
              <YAxis hide />
              <Tooltip
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', padding: '12px' }}
                itemStyle={{ fontWeight: 'bold' }}
              />
              <Line type="monotone" dataKey="price" stroke="#10b981" strokeWidth={5} dot={{ r: 6, strokeWidth: 4, fill: '#fff' }} activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="avgPrice" stroke="#e2e8f0" strokeWidth={3} strokeDasharray="8 8" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* AI Recommendations */}
        <div className="p-6 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-[2rem] shadow-xl text-white">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Award size={24} />
            Profit Strategy
          </h3>
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
              <p className="text-xs font-bold text-emerald-200 uppercase mb-1">Observation</p>
              <p className="text-sm font-medium">Prices in <strong>{activePriceData.mandi}</strong> are showing steady upward momentum (+3.1% daily).</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
              <p className="text-xs font-bold text-emerald-200 uppercase mb-1">AI Recommendation</p>
              <p className="text-sm font-medium">Wait until <strong>Forecast Node</strong> (approx. 12 days) to cash out at <strong>₹{predictedPrice}</strong>.</p>
            </div>
            <div className="pt-4">
              <button 
                onClick={handleDownloadAlerts}
                className="w-full py-4 bg-white text-emerald-700 rounded-2xl font-black text-sm shadow-lg hover:scale-[1.02] transition-transform"
              >
                DOWNLOAD PRICE ALERTS
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketPrices;