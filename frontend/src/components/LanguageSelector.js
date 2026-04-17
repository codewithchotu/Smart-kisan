import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const LanguageSelector = () => {
  const { i18n } = useTranslation();

  const languages = [
    { code: 'en', name: '🇬🇧 English' },
    { code: 'hi', name: '🇮🇳 हिंदी (Hindi)' },
    { code: 'pa', name: '🇮🇳 ਪੰਜਾਬੀ (Punjabi)' },
    { code: 'te', name: '🇮🇳 తెలుగు (Telugu)' }
  ];

  return (
    <div className="flex items-center gap-2">
      <Globe size={18} className="text-green-600" />
      <select
        value={i18n.language}
        onChange={(e) => i18n.changeLanguage(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-700 hover:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;
