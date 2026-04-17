import React, { useState } from 'react';
import { BarChart3, TrendingUp, Lightbulb, Zap, Shield, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

const InsightsPanel = ({ formData }) => {
  const { t } = useTranslation();
  const [selectedInsight, setSelectedInsight] = useState('general');

  const generalInsights = [
    { title: 'Soil Health is Key', description: 'Maintaining healthy soil is the foundation of successful farming. Regular soil testing helps identify nutrient deficiencies early.', icon: '🌱', category: 'Soil' },
    { title: 'Water Management Efficiency', description: 'Proper irrigation scheduling based on rainfall patterns and crop requirements can reduce water usage by 30-40%.', icon: '💧', category: 'Water' },
    { title: 'Crop Rotation Benefits', description: 'Rotating crops annually helps break pest cycles, improves soil fertility, and reduces disease pressure naturally.', icon: '🔄', category: 'Crop' },
    { title: 'Organic Matter Importance', description: 'Adding compost or farm yard manure improves soil structure, water retention, and microbial activity.', icon: '♻️', category: 'Soil' },
    { title: 'Integrated Pest Management', description: 'Combining biological, chemical, and cultural methods minimizes pesticide use while maintaining crop health.', icon: '🐛', category: 'Pest' },
    { title: 'Weather-Based Farming', description: 'Monitor local weather patterns to time planting, irrigation, and pest management activities effectively.', icon: '⛅', category: 'Weather' },
    { title: 'Micronutrient Management', description: 'Beyond NPK, crops need micronutrients like Zinc, Iron, and Boron. Regular foliar sprays can prevent deficiencies.', icon: '⚗️', category: 'Fertilizer' },
    { title: 'Early Disease Detection', description: 'Regular field monitoring helps detect diseases at early stages when they are easier and cheaper to control.', icon: '🔍', category: 'Health' }
  ];

  const soilTips = [
    'Test your soil every 2-3 years for accurate nutrient recommendations',
    'Avoid continuous tilling as it damages soil structure',
    'Use cover crops during off-season to prevent erosion',
    'Apply mulch to conserve soil moisture and temperature',
    'Practice zero or minimal tillage for better soil health'
  ];

  const waterTips = [
    'Use drip irrigation instead of flood irrigation to save water',
    'Install soil moisture sensors for precise irrigation timing',
    'Collect and store rainwater for dry season use',
    'Irrigate early morning to reduce evaporation loss',
    'Ensure proper field leveling for uniform water distribution'
  ];

  const cropTips = [
    'Select crop varieties suited to your region\'s climate',
    'Follow recommended planting distances for better plant health',
    'Practice intercropping to maximize land utilization',
    'Keep detailed records of yield and inputs for analysis',
    'Use certified seeds from reputable sources'
  ];

  const getTipsByCategory = (category) => {
    switch(category) {
      case 'soil': return soilTips;
      case 'water': return waterTips;
      case 'crop': return cropTips;
      default: return [];
    }
  };

  const handleInsightClick = (insight) => {
    toast.success(`${t('alerts.success')} ${insight.title}`, { duration: 2000 });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-2xl border-2 border-purple-100">
        <h2 className="text-2xl font-bold text-purple-800 flex items-center mb-2">
          <Lightbulb className="mr-2" size={24} />
          {t('insights.title')}
        </h2>
        <p className="text-gray-600 text-sm">
          {t('insights.expertRec')}
        </p>
      </div>

      {/* Insight Categories */}
      <div className="card p-6 bg-white rounded-2xl border-2 border-gray-100 shadow-sm">
        <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-800">
          <BarChart3 className="mr-2 text-blue-600" size={20} />
          {t('insights.keyTopics')}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { id: 'general', label: t('insights.general') },
            { id: 'soil', label: t('insights.soil') },
            { id: 'water', label: t('insights.water') },
            { id: 'crop', label: t('insights.crop') },
            { id: 'pest', label: t('insights.pest') },
            { id: 'economics', label: t('insights.economics') }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedInsight(cat.id)}
              className={`px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
                selectedInsight === cat.id
                  ? 'bg-blue-600 text-white shadow-md scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* General Insights Grid */}
      {selectedInsight === 'general' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">{t('insights.smartFarming')}</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {generalInsights.map((insight, idx) => (
              <div
                key={idx}
                onClick={() => handleInsightClick(insight)}
                className="p-5 bg-white border-2 border-gray-100 rounded-2xl hover:border-purple-200 hover:shadow-lg transition-all cursor-pointer shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <span className="text-3xl p-2 bg-gray-50 rounded-xl">{insight.icon}</span>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 mb-1">{insight.title}</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">{insight.description}</p>
                    <span className="inline-block mt-3 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold uppercase tracking-wider">
                      {insight.category}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Topic-Specific Tips */}
      {selectedInsight !== 'general' && selectedInsight !== 'economics' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-800">
            <Zap className="mr-2 text-yellow-500" size={20} />
            {t('dashboard.good')} {t('nav.insights')}
          </h3>
          <div className="space-y-3">
            {getTipsByCategory(selectedInsight).map((tip, idx) => (
              <div key={idx} className="p-4 bg-white border-2 border-gray-100 rounded-xl flex items-start gap-3 shadow-sm">
                <div className="mt-1">
                  <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-sm">
                    ✓
                  </div>
                </div>
                <p className="text-gray-700 font-medium">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cost Saving Tips */}
      {selectedInsight === 'economics' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-800">
            <Shield className="mr-2 text-green-600" size={20} />
            {t('insights.economics')}
          </h3>
          <div className="space-y-3">
            {[
              'Buy fertilizers and seeds in bulk during off-season for better prices',
              'Use local materials and organic amendments instead of expensive chemical inputs',
              'Join farmer cooperatives for collective bargaining on inputs',
              'Implement water-saving technologies to reduce irrigation costs',
              'Use bio-fertilizers and bio-pesticides to reduce chemical input costs',
              'Practice staggered planting to spread harvesting and reduce labor costs',
              'Maintain farm equipment properly to reduce repair expenses'
            ].map((tip, idx) => (
              <div key={idx} className="p-4 bg-white border-2 border-gray-100 rounded-xl flex items-start gap-3 shadow-sm">
                <div className="mt-1">
                  <div className="w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-sm">
                    ₹
                  </div>
                </div>
                <p className="text-gray-700 font-medium">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Warning Section */}
      <div className="p-6 bg-amber-50 border-l-4 border-amber-400 rounded-r-2xl shadow-sm">
        <h3 className="text-lg font-semibold mb-3 flex items-center text-amber-800">
          <AlertTriangle className="mr-2" size={20} />
          {t('weather.farmingAlert')}
        </h3>
        <ul className="space-y-2 text-sm text-amber-700">
          <li>• Always follow local agricultural regulations and pesticide guidelines</li>
          <li>• Consult with local agricultural extension officers for region-specific advice</li>
          <li>• Keep records of all inputs and outputs for better decision making</li>
          <li>• Monitor crop health regularly to catch problems early</li>
          <li>• Adapt practices based on your specific soil, climate, and resources</li>
        </ul>
      </div>
    </div>
  );
};

export default InsightsPanel;
