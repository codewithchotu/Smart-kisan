import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Target, Bug, FlaskConical, Leaf, Sun, Droplets, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = ({ result, onSwitchTab }) => {
  const { t } = useTranslation();

  const getRiskColor = (risk) => {
    switch(risk) {
      case 'Low': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'High': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const weatherData = {
    labels: result.weatherInsights.weekly.map(day => day.day),
    datasets: [
      {
        label: 'Temperature (°C)',
        data: result.weatherInsights.weekly.map(day => day.temp),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        tension: 0.4
      },
      {
        label: 'Humidity (%)',
        data: result.weatherInsights.weekly.map(day => day.humidity),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        tension: 0.4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false
      }
    }
  };

  return (
    <div id="report-content" className="space-y-6 bg-white p-8 rounded-3xl">
      {/* Summary Card */}
      <div className="card bg-gradient-to-r from-green-50 to-green-100">
        <h3 className="text-lg font-semibold mb-3 flex items-center">
          <Target className="mr-2 text-green-600" size={20} />
          {t('dashboard.summary')}
        </h3>
        <p className="text-gray-700 mb-3">{result.summary}</p>
        <div className="flex items-center space-x-4 mt-3">
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getRiskColor(result.riskLevel)}`}>
            {t('dashboard.riskLevel')}: {result.riskLevel}
          </span>
          <span className="text-sm text-gray-600">
            {t('dashboard.yieldPrediction')}: {result.yieldPrediction} {t('dashboard.quintalsPerAcre')}
          </span>
        </div>
      </div>
      {/* Market Trends Quick Link */}
      <div 
        onClick={() => onSwitchTab('market')}
        className="card bg-gradient-to-r from-emerald-600 to-green-700 text-white cursor-pointer hover:scale-[1.02] transition-transform shadow-xl relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
          <TrendingUp size={100} />
        </div>
        <div className="relative z-10">
          <h3 className="text-xl font-black mb-2 flex items-center gap-2">
            <TrendingUp size={24} />
            Market Analytics & Trends
          </h3>
          <p className="text-emerald-50 text-sm font-medium mb-4">
            View live Hyderabad mandi prices and AI-driven profit strategies for your crops.
          </p>
          <div className="inline-flex items-center gap-2 bg-white text-emerald-700 px-4 py-2 rounded-xl font-black text-sm shadow-md">
            VIEW REAL-WORLD PRICES 📈
          </div>
        </div>
      </div>

      {/* Soil Health Score */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Leaf className="mr-2 text-green-600" size={20} />
          {t('dashboard.soilHealth')}
        </h3>
        <div className="mb-2 flex justify-between">
          <span className="text-gray-600">Score: {result.soilScore}/100</span>
          <span className="text-gray-600">
            {result.soilScore >= 70 ? t('dashboard.good') : result.soilScore >= 40 ? t('dashboard.moderate') : t('dashboard.needsImprovement')}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div 
            className="bg-green-600 h-4 rounded-full transition-all duration-500"
            style={{ width: `${result.soilScore}%` }}
          />
        </div>
      </div>

      {/* Strategy Comparison */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <TrendingUp className="mr-2 text-green-600" size={20} />
          {t('dashboard.strategies')}
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          {result.strategies.map((strategy, idx) => (
            <div 
              key={idx}
              className={`card ${
                result.bestStrategy.name === strategy.name 
                  ? 'border-2 border-green-500 bg-green-50' 
                  : ''
              }`}
            >
              {result.bestStrategy.name === strategy.name && (
                <div className="text-xs text-green-600 font-semibold mb-2">🏆 {t('dashboard.recommended')}</div>
              )}
              <h4 className="text-xl font-bold mb-3">{strategy.name}</h4>
              <div className="space-y-2 text-sm">
                <p className="flex justify-between">
                  <span className="text-gray-600">{t('dashboard.investment')}:</span>
                  <span className="font-semibold">₹{strategy.investment.toLocaleString()}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-600">{t('dashboard.yield')}:</span>
                  <span className="font-semibold">{strategy.yield} quintals</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-600">{t('dashboard.revenue')}:</span>
                  <span className="font-semibold">₹{strategy.revenue.toLocaleString()}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-600">{t('dashboard.profit')}:</span>
                  <span className="font-semibold text-green-600">₹{strategy.profit.toLocaleString()}</span>
                </p>
                <p className="text-xs text-gray-500 mt-2">{strategy.practices}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Pest & Pesticide Immersive Cloud */}
        <div className="space-y-6">
          <h3 className="text-3xl font-black text-gray-800 flex items-center gap-3">
            <Bug className="text-red-500" size={32} />
            {t('dashboard.pestManagement')}
          </h3>
          <div className="flex flex-wrap gap-5">
            {result.pestGuidance.pests.map((pest, idx) => (
              <motion.div 
                key={idx} 
                whileHover={{ scale: 1.05 }}
                className="px-8 py-5 bg-white border-2 border-red-50 rounded-[2.5rem] shadow-lg shadow-red-500/5 hover:shadow-red-500/10 transition-all flex items-center gap-4"
              >
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600 shadow-inner">
                  <Bug size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-red-300 tracking-[0.2em]">Live Threat</p>
                  <p className="font-black text-lg text-gray-800">{pest}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="bg-gradient-to-br from-white/80 to-red-50/30 backdrop-blur-2xl border-2 border-dashed border-red-100 p-8 rounded-[3rem] shadow-xl">
            <h4 className="font-black text-xs uppercase tracking-[0.3em] text-gray-400 mb-6 flex items-center gap-2">
              <ShieldCheck size={14} className="text-red-300" />
              Eco-Friendly Defense
            </h4>
            <div className="space-y-4">
              {result.pestGuidance.solutions.map((solution, idx) => (
                <div key={idx} className="flex items-center gap-4 bg-white p-5 rounded-2xl shadow-sm border border-gray-50 group hover:border-red-200 transition-colors">
                  <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                  <span className="font-bold text-gray-700">{solution}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Fertilizer Immersive Cloud */}
        <div className="space-y-6">
          <h3 className="text-3xl font-black text-gray-800 flex items-center gap-3">
            <FlaskConical className="text-indigo-500" size={32} />
            {t('dashboard.fertilizer')}
          </h3>
          <div className="grid grid-cols-1 gap-6 h-full">
            <div className="bg-gradient-to-br from-indigo-50 to-white p-8 rounded-[3rem] border-2 border-indigo-100 shadow-xl relative overflow-hidden group">
              <p className="text-xs font-black text-indigo-400 uppercase tracking-[0.3em] mb-6">Primary Nutrient Boosters</p>
              <div className="flex flex-wrap gap-3">
                {result.fertilizerRecommendation.primary.map((fert, idx) => (
                  <div key={idx} className="bg-white px-6 py-3 rounded-2xl font-black text-indigo-700 shadow-md border border-indigo-50 hover:bg-indigo-600 hover:text-white transition-all">
                    {fert}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-emerald-50 to-white p-8 rounded-[3rem] border-2 border-emerald-100 shadow-xl group">
              <p className="text-xs font-black text-emerald-400 uppercase tracking-[0.3em] mb-6">Sustainable Organic Options</p>
              <div className="flex flex-wrap gap-3">
                {result.fertilizerRecommendation.organic.map((org, idx) => (
                  <div key={idx} className="bg-white px-6 py-3 rounded-2xl font-black text-emerald-700 shadow-sm border border-emerald-50 hover:bg-emerald-600 hover:text-white transition-all">
                    {org}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-amber-50/50 p-8 rounded-[3rem] border-2 border-amber-100 shadow-inner relative group cursor-help">
              <p className="text-xs font-black text-amber-500 uppercase tracking-[0.3em] mb-4">AI Field Advisory</p>
              <p className="text-lg font-black text-amber-900 leading-tight italic z-10 relative">
                "Apply fertilizers during early morning hours for 22% better absorption."
              </p>
              <FlaskConical className="absolute -right-6 -bottom-6 text-amber-400 opacity-10 group-hover:scale-125 transition-transform duration-700" size={140} />
            </div>
          </div>
        </div>
      </div>

      {/* Crop Recommendation */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Leaf className="mr-2 text-green-600" size={20} />
          {t('dashboard.crop')}
        </h3>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-600 mb-2">
              <span className="font-semibold">{t('dashboard.bestOption')}</span> {result.cropRecommendation.best}
            </p>
            <p className="text-sm text-gray-600 mb-3">
              <span className="font-semibold">{t('dashboard.reason')}</span> {result.cropRecommendation.reason}
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">{t('dashboard.alternativeCrops')}</h4>
            <div className="flex flex-wrap gap-2">
              {result.cropRecommendation.alternatives.map((crop, idx) => (
                <span key={idx} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                  {crop}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;