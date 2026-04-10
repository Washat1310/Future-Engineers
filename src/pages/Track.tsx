import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Search, CheckCircle, Truck, Home as HomeIcon, Package, QrCode, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Scanner } from '@yudiel/react-qr-scanner';

export default function Track() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [cropId, setCropId] = useState(searchParams.get('id') || '');
  const [cropData, setCropData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    const idParam = searchParams.get('id');
    if (idParam) {
      setCropId(idParam);
      fetchCropData(idParam);
    }
  }, [searchParams]);

  const fetchCropData = async (idToSearch: string) => {
    if (!idToSearch.trim()) return;
    
    setLoading(true);
    setError('');
    setCropData(null);

    try {
      const q = query(collection(db, 'crops'), where('cropId', '==', idToSearch.trim().toUpperCase()));
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        setError(t('track.notFound'));
      } else {
        setCropData({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() });
      }
    } catch (err) {
      setError('Error fetching tracking data.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    fetchCropData(cropId);
  };

  const getStageStatus = (stageName: string, currentStatus: string) => {
    let currentIndex = -1;
    switch(currentStatus) {
      case 'Harvested': // Fallback for old data
      case 'Shipped': currentIndex = 0; break;
      case 'Transport': currentIndex = 1; break;
      case 'Warehouse': currentIndex = 2; break;
      case 'Delivered': currentIndex = 3; break;
    }
    
    let stageIndex = -1;
    switch(stageName) {
      case 'Shipped': stageIndex = 0; break;
      case 'Transport': stageIndex = 1; break;
      case 'Warehouse': stageIndex = 2; break;
      case 'Delivered': stageIndex = 3; break;
    }

    if (stageIndex < currentIndex) return 'completed';
    if (stageIndex === currentIndex) return 'active';
    return 'pending';
  };

  const handleScan = (text: string) => {
    setIsScanning(false);
    try {
      const url = new URL(text);
      const id = url.searchParams.get('id');
      if (id) {
        navigate(`/update-status?id=${id}`);
        return;
      }
    } catch (e) {
      if (text.trim()) {
        navigate(`/update-status?id=${text.trim()}`);
      }
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="max-w-4xl mx-auto px-4 py-12">
      <div className="relative rounded-3xl overflow-hidden mb-12 bg-[#2D5A27] dark:bg-stone-900 text-white py-16 px-8 shadow-lg text-center">
        <div className="absolute inset-0 opacity-40 dark:opacity-30">
          <img 
            src="https://images.unsplash.com/photo-1586528116311-ad8ed7c508b0?q=80&w=1920&auto=format&fit=crop" 
            alt="Logistics background" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#2D5A27] dark:to-stone-900"></div>
        </div>
        <div className="relative z-10">
          <h1 className="text-4xl font-extrabold mb-4">{t('track.title')}</h1>
          <p className="text-stone-200 dark:text-stone-300 text-xl max-w-2xl mx-auto">{t('track.subtitle')}</p>
        </div>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2 mb-12">
        <input
          type="text"
          value={cropId}
          onChange={(e) => setCropId(e.target.value)}
          placeholder={t('track.placeholder')}
          className="flex-grow border-2 border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 rounded-lg px-4 py-3 text-lg focus:border-[#2D5A27] focus:ring-0 uppercase font-mono font-bold tracking-widest transition-colors duration-300"
          maxLength={6}
        />
        <button 
          type="submit" 
          disabled={loading}
          className="bg-[#F0A500] text-[#2D5A27] font-bold px-8 py-3 rounded-lg hover:bg-yellow-500 transition-colors flex items-center text-lg disabled:opacity-50"
        >
          <Search className="w-5 h-5 mr-2" />
          <span className="hidden sm:inline">{loading ? t('track.searching') : t('track.btn')}</span>
        </button>
        <button 
          type="button" 
          onClick={() => setIsScanning(true)}
          className="bg-[#2D5A27] text-white font-bold px-6 py-3 rounded-lg hover:bg-green-800 transition-colors flex items-center text-lg"
          title="Scan QR Code"
        >
          <QrCode className="w-6 h-6" />
        </button>
      </form>

      {isScanning && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 bg-stone-900 p-4 rounded-3xl overflow-hidden relative shadow-xl border border-stone-800 max-w-md mx-auto">
          <button 
            onClick={() => setIsScanning(false)}
            className="absolute top-4 right-4 z-50 bg-stone-800/80 text-white p-2 rounded-full hover:bg-stone-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="rounded-2xl overflow-hidden">
            <Scanner 
              onScan={(result: any) => {
                if (Array.isArray(result) && result.length > 0) {
                  handleScan(result[0].rawValue);
                } else if (typeof result === 'string') {
                  handleScan(result);
                } else if (result && result.text) {
                  handleScan(result.text);
                }
              }} 
            />
          </div>
          <p className="text-center text-stone-300 mt-4 font-medium">Point your camera at the Crop QR Code</p>
        </motion.div>
      )}

      {error && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-lg text-center font-bold mb-8">
          {error}
        </motion.div>
      )}

      {cropData && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-stone-900 rounded-2xl shadow-sm border border-stone-200 dark:border-stone-800 p-8 transition-colors duration-300">
          <div className="flex justify-between items-start mb-8 border-b border-stone-100 dark:border-stone-800 pb-6">
            <div>
              <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100">{cropData.name}</h2>
              <p className="text-stone-500 dark:text-stone-400 mt-1 font-medium">ID: <span className="font-mono font-bold text-[#2D5A27] dark:text-green-400">{cropData.cropId}</span></p>
              <p className="text-stone-500 dark:text-stone-400 font-medium">{t('track.qty')}: {cropData.quantity} kg</p>
            </div>
            {cropData.imageBase64 && (
              <img src={cropData.imageBase64} alt="Crop" className="w-24 h-24 object-cover rounded-lg border border-stone-200 dark:border-stone-700" />
            )}
          </div>

          <div className="relative">
            {/* Vertical Stepper */}
            <div className="absolute left-6 top-2 bottom-2 w-1 bg-stone-200 dark:bg-stone-800 rounded-full"></div>
            
            <div className="space-y-0 relative">
              {[
                { title: 'Shipped', icon: Package, address: 'Local Farm, District A', delay: 0 },
                { title: 'Transport', icon: Truck, address: 'Highway 42 Checkpoint', delay: 12 },
                { title: 'Warehouse', icon: HomeIcon, address: 'Central Storage Facility', delay: 24 },
                { title: 'Delivered', icon: CheckCircle, address: 'Market Dealer, City Center', delay: 36 }
              ].map((stage, index) => {
                const status = getStageStatus(stage.title, cropData.status);
                const isCurrent = status === 'active';
                const Icon = stage.icon;
                
                let circleClass = "bg-stone-200 dark:bg-stone-800 text-stone-400 dark:text-stone-500 pending";
                let textClass = "text-stone-400 dark:text-stone-500 pending";
                
                switch(status) {
                  case 'completed':
                    circleClass = "bg-[#2D5A27] text-white completed";
                    textClass = "text-stone-900 dark:text-stone-100 completed";
                    break;
                  case 'active':
                    circleClass = "bg-[#F0A500] text-white active";
                    textClass = "text-stone-900 dark:text-stone-100 active";
                    break;
                  case 'pending':
                    circleClass = "bg-stone-200 dark:bg-stone-800 text-stone-400 dark:text-stone-500 pending";
                    textClass = "text-stone-400 dark:text-stone-500 pending";
                    break;
                }
                
                const stageDate = new Date(new Date(cropData.createdAt || Date.now()).getTime() + stage.delay * 60 * 60 * 1000);
                const dateStr = stageDate.toLocaleDateString();
                const timeStr = stageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                
                return (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    transition={{ delay: index * 0.1 }}
                    key={stage.title} 
                    className="flex items-start relative pb-8 last:pb-0"
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center z-10 border-4 border-white dark:border-stone-900 shrink-0 mt-1 transition-colors duration-300 ${circleClass}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="ml-6 flex-1 pt-2">
                      <h3 className={`text-lg font-bold transition-colors duration-300 ${textClass}`}>
                        {t(`status.${stage.title}`)}
                      </h3>
                      {(status === 'completed' || status === 'active') && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-3 bg-stone-50 dark:bg-stone-800/50 p-4 rounded-xl border border-stone-100 dark:border-stone-800 text-sm space-y-2 shadow-sm transition-colors duration-300">
                          <div className="flex items-center text-stone-600 dark:text-stone-300">
                            <span className="font-bold text-stone-800 dark:text-stone-100 w-20">{t('track.date')}:</span> 
                            <span>{dateStr}</span>
                          </div>
                          <div className="flex items-center text-stone-600 dark:text-stone-300">
                            <span className="font-bold text-stone-800 dark:text-stone-100 w-20">{t('track.time')}:</span> 
                            <span>{timeStr}</span>
                          </div>
                          <div className="flex items-start text-stone-600 dark:text-stone-300">
                            <span className="font-bold text-stone-800 dark:text-stone-100 w-20 shrink-0">{t('track.address')}:</span> 
                            <span className="leading-tight">{stage.address}</span>
                          </div>
                        </motion.div>
                      )}
                      {isCurrent && <p className="text-[#F0A500] font-bold text-sm mt-3">{t('track.currentStatus')}</p>}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
