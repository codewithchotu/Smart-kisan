import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { History, Calendar, TrendingUp, AlertCircle, RefreshCw, Leaf, Droplets, FlaskConical } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

const API_URL = 'http://localhost:5000/api';

const HistoryPanel = () => {
  const { t } = useTranslation();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/history`);
      setHistory(response.data.data);
      if (response.data.data.length === 0) {
        toast(t('history.noHistoryDesc'), {
          icon: '📊',
          duration: 3000
        });
      }
    } catch (error) {
      console.error('Error fetching history:', error);
      toast.error(t('alerts.error') + ': ' + t('weather.unableToLoad'));
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString(undefined, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRiskBadge = (risk) => {
    const styles = {
      'Low': 'bg-green-100 text-green-700 border-green-200',
      'Medium': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'High': 'bg-red-100 text-red-700 border-red-200'
    };
    return styles[risk] || 'bg-gray-100 text-gray-700';
  };

  const getSoilIcon = (soil) => {
    switch(soil) {
      case 'sandy': return '🏖️';
      case 'clay': return '🧱';
      case 'loamy': return '🌱';
      default: return '🪴';
    }
  };

  if (loading) {
    return (
      <div className="card text-center py-12">
        <div className="animate-pulse">
          <RefreshCw size={48} className="mx-auto text-green-500 mb-4 animate-spin" />
          <p className="text-gray-600">{t('history.loading') || 'Loading history...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-green-800 flex items-center">
          <History className="mr-2" size={24} />
          {t('history.title')}
        </h2>
        <button 
          onClick={fetchHistory} 
          className="btn-secondary text-sm flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-all font-semibold text-gray-700"
        >
          <RefreshCw size={16} />
          {t('history.refresh')}
        </button>
      </div>

      {history.length === 0 ? (
        <div className="card text-center py-12">
          <AlertCircle size={48} className="mx-auto text-gray-400 mb-3" />
          <p className="text-gray-600 mb-2">{t('history.noHistory')}</p>
          <p className="text-sm text-gray-500">{t('history.noHistoryDesc')}</p>
        </div>
      ) : (
        <>
          <div className="text-sm text-gray-500 mb-2">
            {t('history.showingReports', { count: history.length })}
          </div>
          {history.map((record, idx) => (
            <div key={idx} className="card hover:shadow-lg transition-all duration-300 p-6 bg-white border-2 border-gray-100 rounded-2xl mb-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-green-700 capitalize flex items-center gap-2">
                    <span>{getSoilIcon(record.soil)}</span>
                    {t(`form.${record.crop}`)} - {t(`form.${record.soil}`)} {t('form.soilType')}
                  </h3>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <Calendar size={14} className="mr-1" />
                    {formatDate(record.createdAt)}
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getRiskBadge(record.result.riskLevel)}`}>
                  {record.result.riskLevel} {t('history.risk')}
                </span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 pt-3 border-t">
                <div>
                  <p className="text-xs text-gray-500 mb-1">{t('history.soilPh')}</p>
                  <p className="text-sm font-semibold flex items-center gap-1">
                    <FlaskConical size={14} className="text-blue-500" />
                    {record.ph}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">{t('form.rainfall')}</p>
                  <p className="text-sm font-semibold flex items-center gap-1">
                    <Droplets size={14} className="text-blue-400" />
                    {t(`form.rainfall${record.rainfall.charAt(0).toUpperCase() + record.rainfall.slice(1)}`)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">{t('history.soilScore')}</p>
                  <p className="text-sm font-semibold">{record.result.soilScore}/100</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">{t('history.yield')}</p>
                  <p className="text-sm font-semibold">{record.result.yieldPrediction} q/acre</p>
                </div>
              </div>
              
              <div className="mt-3 pt-3 border-t">
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <TrendingUp size={14} className="text-green-600" />
                  <span className="font-medium">{t('history.bestStrategy')}:</span>
                  {record.result.bestStrategy.name}
                  <span className="text-green-600 font-semibold ml-auto">
                    {t('history.profit')}: ₹{record.result.bestStrategy.profit.toLocaleString()}
                  </span>
                </p>
              </div>

              {record.result.summary && (
                <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-500 italic">
                  {record.result.summary.substring(0, 150)}...
                </div>
              )}
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default HistoryPanel;