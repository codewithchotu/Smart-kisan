import React from 'react';
import { motion } from 'framer-motion';
import { Users, Quote } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const FarmerHero = () => {
  const { t } = useTranslation();
  const successStories = [
    {
      name: "Ramesh Rao",
      location: "Medchal, Telangana",
      storyKey: "farmerStories.ramesh",
      image: "/happy_indian_farmer_wide_shot_1776453976080.png",
      link: "https://www.lokmat.com/agriculture/success-story/latest-news-farmer-success-story-the-magic-formula-of-intercropping-turmeric-and-chilli-changed-the-direction-of-jayarams-farming-a-a1003/"
    },
    {
      name: "Lakshmi Devi",
      location: "Rangareddy, Telangana",
      storyKey: "farmerStories.lakshmi",
      image: "/smart_farming_tablet_woman_1776453481638.png",
      link: "https://www.deccanchronicle.com/nation/current-affairs/240123/smart-kisan-app-helps-farmers-get-best-prices.html"
    }
  ];

  return (
    <div className="bg-white/50 backdrop-blur-md border-b border-green-100 overflow-hidden">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-6">
          <Users className="text-emerald-600" size={24} />
          <h2 className="text-xl font-black text-gray-800 uppercase tracking-tighter italic">
            {t('farmerStories.heading')}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {successStories.map((story, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, x: idx === 0 ? -50 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + (idx * 0.2) }}
              className="relative group h-64 rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white"
            >
              <img 
                src={story.image} 
                alt={story.name} 
                className="w-full h-full object-cover object-top transform group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
                <div className="absolute bottom-0 left-0 p-6 text-white w-full">
                  <div className="flex items-start gap-3">
                    <Quote className="text-emerald-400 mt-1 flex-shrink-0" size={20} />
                    <div>
                      <p className="text-sm font-medium italic leading-relaxed mb-3">
                        "{t(story.storyKey)}"
                      </p>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-black text-lg">{story.name}</p>
                          <p className="text-[10px] text-emerald-300 font-bold uppercase tracking-widest">
                            {story.location}
                          </p>
                        </div>
                        <div className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-bold">
                          {t('farmerStories.verified')}
                        </div>
                      </div>
                      <a 
                        href={story.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-block mt-2 px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold rounded-full transition-colors duration-200"
                      >
                        {t('farmerStories.readMore')} →
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FarmerHero;
