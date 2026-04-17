import React from 'react';
import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const WhatsAppShare = ({ analysisResult, cropType }) => {
  const shareOnWhatsApp = () => {
    if (!analysisResult) {
      toast.error('No analysis to share');
      return;
    }

    const message = `
📊 *Smart Kisan Farm Analysis Report*

🌾 *Crop Type:* ${cropType}
🎯 *Soil Health Score:* ${analysisResult.soilScore}/100
📈 *Predicted Yield:* ${analysisResult.yieldPrediction} quintals/acre
⚠️ *Risk Level:* ${analysisResult.riskLevel}

🛡️ *Pest Management:*
${analysisResult.pestGuidance?.pests?.slice(0, 2).map(p => `• ${p}`).join('\n')}

🌱 *Fertilizer Recommendation:*
Primary: ${analysisResult.fertilizerRecommendation?.primary}

🌾 *Best Crop Options:*
${analysisResult.cropRecommendation?.bestOption}

📝 *Summary:*
${analysisResult.summary?.slice(0, 100)}...

Check your farm using Smart Kisan - AI-powered farming assistant!
    `.trim();

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    toast.success('WhatsApp share opened!');
  };

  return (
    <motion.button
      onClick={shareOnWhatsApp}
      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <MessageCircle size={20} />
      Share on WhatsApp
    </motion.button>
  );
};

export default WhatsAppShare;
