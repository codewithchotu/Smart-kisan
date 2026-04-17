import React from 'react';
import { Trophy, Star, Award, Flame, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const Gamification = ({ user }) => {
  const { t } = useTranslation();
  
  const badges = [
    { name: 'First Analysis', icon: '🌱', earned: user?.points > 0 },
    { name: 'Green Farmer', icon: '🌿', earned: user?.points > 50 },
    { name: 'Expert', icon: '🏆', earned: user?.points > 100 },
    { name: 'Sustainability Hero', icon: '♻️', earned: user?.points > 200 }
  ];

  const nextMilestone = 50 - (user?.points % 50);
  const level = Math.floor((user?.points || 0) / 50) + 1;

  return (
    <motion.div 
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="card bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-2xl border-2 border-yellow-100 shadow-sm"
    >
      <h3 className="text-lg font-semibold mb-4 flex items-center text-yellow-800">
        <Trophy className="mr-2 text-yellow-600" size={24} />
        {t('gamification.title')}
      </h3>
      
      <div className="mb-6">
        <div className="flex justify-between text-sm font-bold mb-2 text-yellow-900">
          <span>{t('gamification.level')} {level}</span>
          <span>{user?.points || 0} {t('gamification.points')}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${((user?.points || 0) % 50) * 2}%` }}
            className="bg-gradient-to-r from-yellow-400 to-orange-500 h-full rounded-full shadow-lg"
          />
        </div>
        <p className="text-xs text-orange-700 mt-2 font-medium">
          {nextMilestone} {t('gamification.nextLevel')}
        </p>
      </div>
      
      <div className="grid grid-cols-4 gap-3">
        {badges.map((badge, idx) => (
          <motion.div
            key={idx}
            className={`text-center p-2 rounded-xl border-2 transition-all ${
              badge.earned 
                ? 'bg-white border-yellow-200 shadow-md scale-105' 
                : 'bg-gray-50 border-transparent opacity-40 grayscale'
            }`}
            whileHover={badge.earned ? { scale: 1.1, rotate: [0, -5, 5, 0] } : {}}
          >
            <div className="text-3xl mb-1">{badge.icon}</div>
            <div className={`text-[10px] font-bold leading-tight ${badge.earned ? 'text-yellow-800' : 'text-gray-400'}`}>
              {badge.name}
            </div>
          </motion.div>
        ))}
      </div>
      
      {user?.points > 0 && (
        <motion.div 
          className="mt-5 p-3 bg-white border border-green-100 rounded-xl text-center shadow-sm"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Flame size={18} className="inline mr-2 text-orange-500" />
          <span className="text-sm font-semibold text-green-800">
            {t('gamification.streak', { days: Math.floor(user.points / 10) || 1 })}
          </span>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Gamification;