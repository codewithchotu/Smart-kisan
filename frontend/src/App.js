import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { Sprout, LogOut } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Login from './components/Login';
import InputForm from './components/InputForm';
import Dashboard from './components/Dashboard';
import HistoryPanel from './components/HistoryPanel';
import InsightsPanel from './components/InsightsPanel';
import Gamification from './components/Gamification';
import MarketPrices from './components/MarketPrices';
import ShareReport from './components/hareReport';
import WeatherWidget from './components/weatherWidget';
import LocationWeather from './components/LocationWeather';
import BestMarketFinder from './components/BestMarketFinder';
import WhatsAppShare from './components/WhatsAppShare';
import AuthModal from './components/Authmodal';
import LanguageSelector from './components/LanguageSelector';

const API_URL = 'http://localhost:5000/api';

function App() {
  const { t } = useTranslation();
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentUser, setCurrentUser] = useState(null);

  // Check if user is already logged in on mount
  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
  }, []);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    setAnalysisResult(null);
    setActiveTab('dashboard');
    toast.success(t('auth.logoutSuccess') || 'Logged out successfully');
  };

  const handleAnalyze = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/analyze`, data);
      setAnalysisResult(response.data.data);
      toast.success(t('alerts.analysisSuccess'));
      setActiveTab('dashboard');
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error(t('alerts.analysisFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      
      {/* Show Login Page if not authenticated */}
      {!currentUser ? (
        <Login onLoginSuccess={handleLoginSuccess} />
      ) : (
      <>
      {/* Header */}
      <header className="bg-gradient-to-r from-green-600 via-green-500 to-emerald-600 text-white shadow-2xl sticky top-0 z-50 backdrop-blur-lg bg-opacity-95">
        <div className="container mx-auto px-4 py-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white bg-opacity-20 rounded-xl backdrop-blur-md">
                <Sprout size={32} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-green-100 bg-clip-text text-transparent">{t('header.title')}</h1>
                <p className="text-green-50 text-xs font-medium">{t('header.subtitle')}</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-sm text-green-50 bg-white bg-opacity-10 px-4 py-2 rounded-full backdrop-blur-md border border-white border-opacity-20">
                {t('auth.welcome') || 'Welcome'}, <span className="font-bold text-white">{currentUser.fullName || currentUser.email.split('@')[0]}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition-all duration-300 text-sm font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                title="Logout"
              >
                <LogOut size={16} />
                {t('auth.logout') || 'Logout'}
              </button>
              <LanguageSelector />
            </div>
          </div>
          <div className="flex space-x-2 flex-wrap gap-2">
            {[
              { id: 'dashboard', label: t('nav.dashboard'), icon: '📊' },
              { id: 'history', label: t('nav.history'), icon: '📜' },
              { id: 'insights', label: t('nav.insights'), icon: '💡' },
              { id: 'weather', label: t('nav.weather'), icon: '📍' },
              { id: 'market', label: t('nav.market'), icon: '📈' },
              { id: 'best-market', label: t('nav.bestMarket'), icon: '🏆' },
              { id: 'gamification', label: t('nav.achievements'), icon: '🏅' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg transition-all duration-300 text-sm font-semibold flex items-center gap-1 ${
                  activeTab === tab.id
                    ? 'bg-white text-green-600 shadow-lg scale-105'
                    : 'bg-white bg-opacity-10 text-white hover:bg-opacity-20 hover:scale-105'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="min-h-screen bg-gradient-to-b from-slate-50 via-green-50 to-slate-100 p-8">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Input Form & Widgets Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white bg-opacity-70 backdrop-blur-xl rounded-2xl shadow-xl border border-white border-opacity-30 overflow-hidden">
                <InputForm onSubmit={handleAnalyze} loading={loading} />
              </div>
              {activeTab === 'weather' && (
                <div className="bg-white bg-opacity-70 backdrop-blur-xl rounded-2xl shadow-xl border border-white border-opacity-30">
                  <WeatherWidget />
                </div>
              )}
              {activeTab === 'gamification' && (
                <div className="bg-white bg-opacity-70 backdrop-blur-xl rounded-2xl shadow-xl border border-white border-opacity-30">
                  <Gamification />
                </div>
              )}
            </div>

            {/* Results Area */}
            <div className="lg:col-span-3 space-y-6">
              {activeTab === 'dashboard' && analysisResult && (
                <>
                  <div className="bg-white bg-opacity-70 backdrop-blur-xl rounded-2xl shadow-xl border border-white border-opacity-30 overflow-hidden">
                    <Dashboard result={analysisResult} />
                  </div>
                  {analysisResult && (
                    <div className="bg-white bg-opacity-70 backdrop-blur-xl rounded-2xl shadow-xl border border-white border-opacity-30 overflow-hidden">
                      <ShareReport reportData={analysisResult} />
                    </div>
                  )}
                </>
              )}
              {activeTab === 'dashboard' && !analysisResult && (
                <div className="bg-gradient-to-br from-green-100 via-emerald-50 to-green-50 rounded-2xl shadow-xl border border-green-200 border-opacity-50 p-12 text-center">
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-full shadow-lg mb-6">
                    <Sprout size={64} className="text-green-600" />
                  </div>
                  <h3 className="text-3xl font-bold mb-3 text-green-800">{t('dashboard.welcomeTitle')}</h3>
                  <p className="text-gray-600 text-lg">{t('dashboard.welcomeDesc')}</p>
                </div>
              )}
              {activeTab === 'history' && (
                <div className="bg-white bg-opacity-70 backdrop-blur-xl rounded-2xl shadow-xl border border-white border-opacity-30 overflow-hidden">
                  <HistoryPanel />
                </div>
              )}
              {activeTab === 'insights' && (
                <div className="bg-white bg-opacity-70 backdrop-blur-xl rounded-2xl shadow-xl border border-white border-opacity-30 overflow-hidden">
                  <InsightsPanel />
                </div>
              )}
              {activeTab === 'weather' && (
                <div className="bg-white bg-opacity-70 backdrop-blur-xl rounded-2xl shadow-xl border border-white border-opacity-30 overflow-hidden">
                  <LocationWeather />
                </div>
              )}
              {activeTab === 'market' && (
                <div className="bg-white bg-opacity-70 backdrop-blur-xl rounded-2xl shadow-xl border border-white border-opacity-30 overflow-hidden">
                  <MarketPrices />
                </div>
              )}
              {activeTab === 'best-market' && (
                <div className="bg-white bg-opacity-70 backdrop-blur-xl rounded-2xl shadow-xl border border-white border-opacity-30 overflow-hidden">
                  <BestMarketFinder />
                </div>
              )}
              {activeTab === 'gamification' && (
                <div className="bg-white bg-opacity-70 backdrop-blur-xl rounded-2xl shadow-xl border border-white border-opacity-30 overflow-hidden">
                  <Gamification />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      </>
      )}
    </div>
  );
}

export default App;