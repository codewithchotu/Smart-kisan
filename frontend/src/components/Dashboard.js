import React from 'react';
import { TrendingUp, Target, Bug, FlaskConical, Leaf, Sun, Droplets } from 'lucide-react';
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

const Dashboard = ({ result }) => {
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
    <div className="space-y-6">
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

      {/* Weather Insights */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Sun className="mr-2 text-yellow-600" size={20} />
          {t('dashboard.weather')}
        </h3>
        <Line options={chartOptions} data={weatherData} />
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">📋 {result.weatherInsights.recommendation}</p>
          <p className="text-xs text-blue-600 mt-1">💡 {result.weatherInsights.advisory}</p>
        </div>
      </div>

      {/* Pest & Pesticide Guidance */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Bug className="mr-2 text-red-600" size={20} />
          {t('dashboard.pestManagement')}
        </h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">{t('dashboard.commonPests')}</h4>
            <div className="flex flex-wrap gap-2 mb-4">
              {result.pestGuidance.pests.map((pest, idx) => (
                <span key={idx} className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                  {pest}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">{t('dashboard.managementSolutions')}</h4>
            <ul className="space-y-2">
              {result.pestGuidance.solutions.map((solution, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="mr-2 text-green-600 font-bold">✓</span>
                  <span className="text-gray-700">{solution}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Fertilizer Recommendation */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <FlaskConical className="mr-2 text-blue-600" size={20} />
          {t('dashboard.fertilizer')}
        </h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">{t('dashboard.primaryFertilizers')}</h4>
            <ul className="space-y-1">
              {result.fertilizerRecommendation.primary.map((fert, idx) => (
                <li key={idx} className="text-sm text-gray-600">• {fert}</li>
              ))}
            </ul>
          </div>
          {result.fertilizerRecommendation.secondary.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">{t('dashboard.secondaryAmendments')}</h4>
              <ul className="space-y-1">
                {result.fertilizerRecommendation.secondary.map((amend, idx) => (
                  <li key={idx} className="text-sm text-gray-600">• {amend}</li>
                ))}
              </ul>
            </div>
          )}
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">{t('dashboard.organicOptions')}</h4>
            <ul className="space-y-1">
              {result.fertilizerRecommendation.organic.map((org, idx) => (
                <li key={idx} className="text-sm text-gray-600">• {org}</li>
              ))}
            </ul>
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