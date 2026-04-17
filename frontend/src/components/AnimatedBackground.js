import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Cloud, Droplets, Leaf, Tractor } from 'lucide-react';

const AnimatedBackground = () => {
  // Sun animation
  const sunVariants = {
    animate: {
      y: [0, -20, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  };

  // Cloud animation
  const cloudVariants = {
    animate: (custom) => ({
      x: [0, 30, 0],
      transition: {
        duration: 6 + custom,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    })
  };

  // Farmer working animation
  const farmerVariants = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  };

  // Crop growing animation
  const cropVariants = {
    animate: {
      scaleY: [0.5, 1, 0.5],
      opacity: [0.6, 1, 0.6],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  };

  // Tractor moving animation
  const tractorVariants = {
    animate: {
      x: [-100, 300, -100],
      transition: {
        duration: 8,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  };

  // Water droplet animation
  const waterVariants = {
    animate: {
      y: [0, 30, 0],
      opacity: [0, 1, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  };

  return (
    <div className="absolute inset-0 overflow-hidden bg-gradient-to-b from-blue-100 via-green-50 to-yellow-50">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(34, 197, 94, 0.1) 10px, rgba(34, 197, 94, 0.1) 20px)`
        }} />
      </div>

      {/* Sun */}
      <motion.div
        className="absolute top-12 right-20 text-yellow-400"
        variants={sunVariants}
        animate="animate"
      >
        <Sun size={80} fill="currentColor" />
      </motion.div>

      {/* Clouds */}
      <motion.div
        className="absolute top-20 left-10 text-white opacity-70"
        variants={cloudVariants}
        animate="animate"
        custom={0}
      >
        <Cloud size={60} fill="currentColor" />
      </motion.div>

      <motion.div
        className="absolute top-40 right-32 text-white opacity-60"
        variants={cloudVariants}
        animate="animate"
        custom={1}
      >
        <Cloud size={50} fill="currentColor" />
      </motion.div>

      {/* Tractor (bottom left) */}
      <motion.div
        className="absolute bottom-32 left-0 text-red-500 text-6xl"
        variants={tractorVariants}
        animate="animate"
      >
        <Tractor size={60} />
      </motion.div>

      {/* Crops - Left side */}
      <motion.div
        className="absolute bottom-20 left-20 text-green-600"
        variants={cropVariants}
        animate="animate"
      >
        <div className="flex gap-4">
          <Leaf size={48} />
          <Leaf size={48} />
          <Leaf size={48} />
        </div>
      </motion.div>

      {/* Crops - Right side */}
      <motion.div
        className="absolute bottom-24 right-20 text-green-500"
        variants={cropVariants}
        animate="animate"
      >
        <div className="flex gap-3">
          <Leaf size={40} />
          <Leaf size={40} />
          <Leaf size={40} />
        </div>
      </motion.div>

      {/* Water droplets - Left */}
      <motion.div
        className="absolute left-32 top-1/2 text-blue-400"
        variants={waterVariants}
        animate="animate"
      >
        <Droplets size={32} />
      </motion.div>

      {/* Water droplets - Right */}
      <motion.div
        className="absolute right-40 top-1/3 text-blue-300"
        variants={waterVariants}
        animate="animate"
      >
        <Droplets size={28} />
      </motion.div>

      {/* Floating farmer icon - Top left */}
      <motion.div
        className="absolute top-1/4 left-16 text-amber-700 text-4xl"
        variants={farmerVariants}
        animate="animate"
      >
        👨‍🌾
      </motion.div>

      {/* Floating farmer icon - Bottom right */}
      <motion.div
        className="absolute bottom-1/4 right-24 text-amber-800 text-5xl"
        variants={farmerVariants}
        animate="animate"
      >
        👨‍🌾
      </motion.div>

      {/* Harvest basket - Right side */}
      <motion.div
        className="absolute bottom-32 right-12 text-orange-700 text-4xl"
        animate={{
          rotate: [-5, 5, -5],
          transition: {
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut'
          }
        }}
      >
        🧺
      </motion.div>

      {/* Grain/wheat - Left bottom */}
      <motion.div
        className="absolute bottom-16 left-12 text-yellow-700 text-4xl"
        animate={{
          rotate: [5, -5, 5],
          transition: {
            duration: 2.5,
            repeat: Infinity,
            ease: 'easeInOut'
          }
        }}
      >
        🌾
      </motion.div>

      {/* Plow tool - Right bottom */}
      <motion.div
        className="absolute bottom-20 right-40 text-gray-600 text-4xl"
        animate={{
          x: [-5, 5, -5],
          transition: {
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut'
          }
        }}
      >
        🌿
      </motion.div>

      {/* Animated dots - Particles */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-green-400 rounded-full opacity-60"
          animate={{
            y: [0, -100, 0],
            x: [0, Math.sin(i) * 50, 0],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 3 + i,
            repeat: Infinity,
            delay: i * 0.4
          }}
          style={{
            left: `${20 + i * 15}%`,
            top: '80%'
          }}
        />
      ))}
    </div>
  );
};

export default AnimatedBackground;
