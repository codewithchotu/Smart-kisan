import React, { useState } from 'react';
import { Sprout, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import AnimatedBackground from './AnimatedBackground';

const Login = ({ onLoginSuccess }) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [fullName, setFullName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignup) {
        // Signup validation
        if (!fullName || !email || !password) {
          toast.error(t('auth.fillAllFields') || 'Please fill all fields');
          setLoading(false);
          return;
        }
        
        if (password.length < 6) {
          toast.error(t('auth.passwordMinLength') || 'Password must be at least 6 characters');
          setLoading(false);
          return;
        }

        // Mock signup - store in localStorage
        const users = JSON.parse(localStorage.getItem('smartKisanUsers') || '[]');
        if (users.some(u => u.email === email)) {
          toast.error(t('auth.emailExists') || 'Email already registered');
          setLoading(false);
          return;
        }

        users.push({ fullName, email, password });
        localStorage.setItem('smartKisanUsers', JSON.stringify(users));
        toast.success(t('auth.signupSuccess') || 'Account created successfully! Please login.');
        setIsSignup(false);
        setEmail('');
        setPassword('');
        setFullName('');
      } else {
        // Login validation
        if (!email || !password) {
          toast.error(t('auth.fillAllFields') || 'Please fill all fields');
          setLoading(false);
          return;
        }

        // Mock login - check localStorage
        const users = JSON.parse(localStorage.getItem('smartKisanUsers') || '[]');
        const user = users.find(u => u.email === email && u.password === password);

        if (!user) {
          toast.error(t('auth.invalidCredentials') || 'Invalid email or password');
          setLoading(false);
          return;
        }

        // Store logged-in user
        localStorage.setItem('currentUser', JSON.stringify(user));
        toast.success(t('auth.loginSuccess') || 'Login successful!');
        onLoginSuccess(user);
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast.error(t('auth.error') || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background with farmers working */}
      <AnimatedBackground />
      
      {/* Content overlay - centered on top of animated background */}
      <div className="w-full max-w-md relative z-10">
        {/* Logo Section */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="flex items-center justify-center gap-2 mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 120 }}
          >
            <Sprout size={48} className="text-green-600" />
            <h1 className="text-4xl font-bold text-green-700">{t('header.title')}</h1>
          </motion.div>
          <motion.p
            className="text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {t('header.subtitle')}
          </motion.p>
        </motion.div>

        {/* Login Card */}
        <motion.div
          className="bg-white bg-opacity-95 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-white border-opacity-50"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <motion.h2
            className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {isSignup ? (t('auth.createAccount') || 'Create Account') : (t('auth.loginTitle') || 'Login')}
          </motion.h2>
          <p className="text-center text-gray-500 mb-8 text-sm">{isSignup ? 'Join our farming community' : 'Access your farm dashboard'}</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name - Only for Signup */}
            {isSignup && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <label className="block text-gray-700 font-semibold mb-2">
                  {t('auth.fullName') || 'Full Name'}
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Farmer"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white hover:border-gray-300 transition-all shadow-sm"
                />
              </motion.div>
            )}

            {/* Email */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.55 }}
            >
              <label className="block text-gray-700 font-semibold mb-2">
                {t('auth.email') || 'Email'}
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-3.5 text-green-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white hover:border-gray-300 transition-all shadow-sm"
                />
              </div>
            </motion.div>

            {/* Password */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <label className="block text-gray-700 font-semibold mb-2">
                {t('auth.password') || 'Password'}
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-3.5 text-green-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white hover:border-gray-300 transition-all shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 disabled:from-gray-400 disabled:via-gray-400 disabled:to-gray-400 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105 disabled:scale-100 mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {loading ? '⏳ ' + (t('auth.loading') || 'Loading...') : (isSignup ? '✨ ' + (t('auth.signup') || 'Sign Up') : '🚀 ' + (t('auth.login') || 'Login'))}
            </motion.button>
          </form>

          {/* Toggle Login/Signup */}
          <motion.div
            className="mt-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <p className="text-gray-600">
              {isSignup ? (t('auth.hasAccount') || 'Already have an account?') : (t('auth.noAccount') || "Don't have an account?")}{' '}
              <button
                type="button"
                onClick={() => {
                  setIsSignup(!isSignup);
                  setEmail('');
                  setPassword('');
                  setFullName('');
                }}
                className="text-green-600 hover:text-green-700 font-semibold transition-colors"
              >
                {isSignup ? (t('auth.loginHere') || 'Login here') : (t('auth.signupHere') || 'Sign up here')}
              </button>
            </p>
          </motion.div>

          {/* Demo Credentials */}
          {!isSignup && (
            <motion.div
              className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl text-sm text-gray-700 shadow-md"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75 }}
            >
              <p className="font-bold mb-3 text-blue-900">💡 {t('auth.demo') || 'Demo Credentials'}:</p>
              <p className="mb-2">📧 Email: <code className="bg-blue-200 px-2 py-1 rounded font-mono text-xs">demo@example.com</code></p>
              <p>🔑 Password: <code className="bg-blue-200 px-2 py-1 rounded font-mono text-xs">123456</code></p>
            </motion.div>
          )}
        </motion.div>

        {/* Footer */}
        <motion.p
          className="text-center text-gray-500 text-xs mt-8 font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          🌾 {t('auth.footer') || '© 2024 Smart Kisan. All rights reserved.'}
        </motion.p>
      </div>
    </div>
  );
};

export default Login;
