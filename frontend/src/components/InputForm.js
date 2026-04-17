import React, { useState } from 'react';
import { Leaf, Droplets, FlaskConical, CloudRain, Calendar, Waves } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const InputForm = ({ onSubmit, loading, initialData }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState(initialData || {
    soil: 'loamy',
    ph: 6.5,
    rainfall: 'medium',
    crop: 'rice',
    season: 'kharif',
    water: 'sufficient'
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
          <Leaf className="text-white" size={24} />
        </div>
        {t('form.title')}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-gray-700 font-semibold text-sm uppercase tracking-wide mb-3">
            <Leaf size={16} className="inline mr-2 text-green-600" />
            {t('form.soilType')}
          </label>
          <select
            name="soil"
            value={formData.soil}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white hover:border-gray-300 transition-all shadow-sm"
          >
            <option value="sandy">{t('form.sandy')}</option>
            <option value="clay">{t('form.clay')}</option>
            <option value="loamy">{t('form.loamy')}</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 font-semibold text-sm uppercase tracking-wide mb-3">
            <FlaskConical size={16} className="inline mr-2 text-blue-600" />
            {t('form.phValue')}
          </label>
          <input
            type="number"
            name="ph"
            value={formData.ph}
            onChange={handleChange}
            step="0.1"
            min="0"
            max="14"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white hover:border-gray-300 transition-all shadow-sm"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold text-sm uppercase tracking-wide mb-3">
            <Calendar size={16} className="inline mr-2 text-purple-600" />
            {t('form.season')}
          </label>
          <select
            name="season"
            value={formData.season}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white hover:border-gray-300 transition-all shadow-sm"
          >
            <option value="kharif">{t('form.kharif')}</option>
            <option value="rabi">{t('form.rabi')}</option>
            <option value="zaid">{t('form.zaid')}</option>
            <option value="summer">{t('form.summer')}</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 font-semibold text-sm uppercase tracking-wide mb-3">
            <Waves size={16} className="inline mr-2 text-cyan-500" />
            {t('form.waterAvailability')}
          </label>
          <select
            name="water"
            value={formData.water}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent bg-white hover:border-gray-300 transition-all shadow-sm"
          >
            <option value="abundant">{t('form.abundant')}</option>
            <option value="sufficient">{t('form.sufficient')}</option>
            <option value="limited">{t('form.limited')}</option>
            <option value="critical">{t('form.critical')}</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 font-semibold text-sm uppercase tracking-wide mb-3">
            <CloudRain size={16} className="inline mr-2 text-blue-400" />
            {t('form.rainfall')}
          </label>
          <select
            name="rainfall"
            value={formData.rainfall}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white hover:border-gray-300 transition-all shadow-sm"
          >
            <option value="low">{t('form.rainfallLow')}</option>
            <option value="medium">{t('form.rainfallMedium')}</option>
            <option value="high">{t('form.rainfallHigh')}</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 font-semibold text-sm uppercase tracking-wide mb-3">
            <Droplets size={16} className="inline mr-2 text-green-600" />
            {t('form.cropType')}
          </label>
          <select
            name="crop"
            value={formData.crop}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white hover:border-gray-300 transition-all shadow-sm"
          >
            <option value="rice">{t('form.rice')}</option>
            <option value="wheat">{t('form.wheat')}</option>
            <option value="corn">{t('form.corn')}</option>
            <option value="cotton">{t('form.cotton')}</option>
            <option value="sugarcane">{t('form.sugarcane')}</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 disabled:from-gray-400 disabled:via-gray-400 disabled:to-gray-400 text-white font-bold py-4 px-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          {loading ? '⏳ ' + t('form.analyzing') : '🚀 ' + t('form.analyzeFarm')}
        </button>
      </form>
    </div>
  );
};

export default InputForm;