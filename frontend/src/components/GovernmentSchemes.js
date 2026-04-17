import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Landmark, ExternalLink, ShieldCheck, Clock, Tag, Search } from 'lucide-react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const GovernmentSchemes = () => {
  const { t, i18n } = useTranslation();
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const currentLang = i18n.language || 'en';

  useEffect(() => {
    fetchSchemes();
  }, []);

  const fetchSchemes = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/schemes');
      setSchemes(response.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getLocalizedText = (field) => {
    if (typeof field === 'object' && field !== null) {
      return field[currentLang] || field['en'] || '';
    }
    return field || '';
  };

  const filteredSchemes = schemes.filter(s => {
    const title = getLocalizedText(s.title).toLowerCase();
    const description = getLocalizedText(s.description).toLowerCase();
    const search = searchTerm.toLowerCase();
    return title.includes(search) || description.includes(search);
  });

  if (loading) {
    return (
      <div className="p-12 text-center text-gray-500">
        <div className="animate-spin inline-block w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full mb-4"></div>
        <p>{t('weather.loading')}</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-800 flex items-center gap-2">
            <Landmark className="text-emerald-600" size={32} />
            {t('schemes.title')}
          </h2>
          <p className="text-gray-500 font-medium ml-1">{t('schemes.subtitle')}</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -transform -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder={t('schemes.search')} 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-3 bg-white border-2 border-gray-100 rounded-2xl focus:border-emerald-500 outline-none w-full md:w-64 transition-all shadow-sm font-medium"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSchemes.map((scheme, idx) => (
          <motion.div 
            key={scheme.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ y: -5 }}
            className="group bg-white border-2 border-gray-50 rounded-[2.5rem] p-6 shadow-sm hover:shadow-xl transition-all hover:border-emerald-100 relative overflow-hidden flex flex-col h-full"
          >
            {/* Status Badge */}
            <div className="flex justify-between items-start mb-4">
              <div className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black tracking-widest uppercase">
                {getLocalizedText(scheme.category)}
              </div>
              <div className="flex items-center gap-1 text-emerald-600">
                <ShieldCheck size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest">{getLocalizedText(scheme.status)}</span>
              </div>
            </div>

            <h3 className="text-xl font-black text-gray-800 mb-3 group-hover:text-emerald-600 transition-colors">
              {getLocalizedText(scheme.title)}
            </h3>
            
            <p className="text-sm text-gray-500 font-medium leading-relaxed mb-6 flex-grow">
              {getLocalizedText(scheme.description)}
            </p>

            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-2xl border border-gray-100">
                <Tag size={16} className="text-emerald-500" />
                <p className="text-xs font-bold text-gray-700">{getLocalizedText(scheme.benefits)}</p>
              </div>
              <div className="flex items-center gap-3">
                <Clock size={16} className="text-gray-400" />
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  {t('schemes.lastUpdate')}: {scheme.lastUpdate}
                </p>
              </div>
            </div>

            <a 
              href={scheme.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black text-xs flex items-center justify-center gap-2 group-hover:bg-emerald-600 transition-all shadow-lg mt-auto"
            >
              {t('schemes.apply')} <ExternalLink size={14} />
            </a>
          </motion.div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="bg-emerald-50 border-2 border-emerald-100 rounded-[2rem] p-8 text-center mt-12">
        <Landmark className="mx-auto text-emerald-300 mb-4" size={48} />
        <h4 className="text-lg font-black text-emerald-900 mb-2">{t('schemes.helpTitle')}</h4>
        <p className="text-sm text-emerald-700 font-medium max-w-md mx-auto mb-6">
          {t('schemes.helpDesc')}
        </p>
        <button className="px-8 py-3 bg-white text-emerald-600 rounded-xl font-black text-sm shadow-md hover:shadow-lg transition-all border border-emerald-100">
          {t('schemes.findCenter')} 📍
        </button>
      </div>
    </div>
  );
};

export default GovernmentSchemes;
