import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { supabase } from '../supabase';
import { useAuth } from '../context/AuthContext';
import QRCode from 'react-qr-code';
import { Package, Truck, CheckCircle, Plus, Image as ImageIcon, Loader2, Sparkles, RefreshCw, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';

export default function Dashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [crops, setCrops] = useState<any[]>([]);
  
  // Form State
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [imageBase64, setImageBase64] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [qualityGrade, setQualityGrade] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'crops'), where('userId', '==', user.uid));
    const unsub = onSnapshot(q, (snapshot) => {
      setCrops(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, [user]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.src = reader.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 400; // Compress image to avoid 1MB Firestore limit
          const scaleSize = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
          setImageBase64(canvas.toDataURL('image/jpeg', 0.7));
          
          setIsAnalyzing(true);
          setQualityGrade(null);
          setTimeout(() => {
            const grades = ['A', 'B', 'C', 'D'];
            const randomGrade = grades[Math.floor(Math.random() * grades.length)];
            setQualityGrade(randomGrade);
            setIsAnalyzing(false);
          }, 1500);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const generateCropId = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const handleRegisterCrop = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !name || !quantity) return;
    
    setIsSubmitting(true);
    try {
      const cropId = generateCropId();
      const newCrop = {
        userId: user.uid,
        cropId,
        name,
        quantity: Number(quantity),
        phone,
        address,
        imageBase64,
        qualityGrade,
        status: 'Shipped',
        createdAt: new Date().toISOString()
      };
      
      await addDoc(collection(db, 'crops'), newCrop);

      // Sync to Supabase
      try {
        await supabase.from('crops').insert([
          {
            crop_id: newCrop.cropId,
            user_id: newCrop.userId,
            name: newCrop.name,
            quantity: newCrop.quantity,
            phone_number: newCrop.phone,
            address: newCrop.address,
            image_base64: newCrop.imageBase64,
            quality_grade: newCrop.qualityGrade,
            status: newCrop.status,
            created_at: newCrop.createdAt
          }
        ]);
      } catch (supaErr) {
        console.error("Supabase sync error:", supaErr);
      }

      // Submit to Formspree
      try {
        await fetch('https://formspree.io/f/mvzvjjjg', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            cropId: newCrop.cropId,
            userEmail: user.email,
            name: newCrop.name,
            quantity: newCrop.quantity,
            phone: newCrop.phone,
            address: newCrop.address,
            qualityGrade: newCrop.qualityGrade,
            status: newCrop.status,
            createdAt: newCrop.createdAt
          })
        });
      } catch (formspreeErr) {
        console.error("Formspree sync error:", formspreeErr);
      }

      setName('');
      setQuantity('');
      setPhone('');
      setAddress('');
      setImageBase64('');
      setQualityGrade(null);
    } catch (error) {
      alert('Failed to register crop');
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * updateStatus logic:
   * Updates the status field in Firestore. 
   * The UI stepper in Track.tsx will automatically reflect this change.
   */
  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'crops', id), { status: newStatus });
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const handleDeleteCrop = async (id: string, cropId: string) => {
    try {
      // Delete from Firestore
      await deleteDoc(doc(db, 'crops', id));
      
      // Delete from Supabase
      try {
        await supabase.from('crops').delete().eq('crop_id', cropId);
      } catch (supaErr) {
        console.error("Supabase delete error:", supaErr);
      }
    } catch (error) {
      console.error('Failed to delete crop:', error);
      alert('Failed to delete crop');
    }
  };

  const handleSyncToSupabase = async () => {
    if (!crops.length) return;
    try {
      const formattedCrops = crops.map(c => ({
        crop_id: c.cropId,
        user_id: c.userId,
        name: c.name,
        quantity: Number(c.quantity),
        phone_number: c.phone || null,
        address: c.address || null,
        image_base64: c.imageBase64,
        quality_grade: c.qualityGrade,
        status: c.status,
        created_at: c.createdAt
      }));
      
      const { error } = await supabase.from('crops').upsert(formattedCrops, { onConflict: 'crop_id' });
      if (error) throw error;
      alert('Successfully synced all crops to Supabase!');
    } catch (err: any) {
      console.error(err);
      alert('Failed to sync to Supabase: ' + err.message);
    }
  };

  // Summary Stats
  const totalCrops = crops.length;
  const inTransit = crops.filter(c => c.status === 'Transport').length;
  const delivered = crops.filter(c => c.status === 'Delivered').length;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="max-w-7xl mx-auto px-4 py-12">
      <div className="relative rounded-3xl overflow-hidden mb-12 bg-[#2D5A27] dark:bg-stone-900 text-white py-12 px-8 shadow-lg">
        <div className="absolute inset-0 opacity-40 dark:opacity-30">
          <img 
            src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=1920&auto=format&fit=crop" 
            alt="Dashboard background" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#2D5A27] to-transparent dark:from-stone-900"></div>
        </div>
        <div className="relative z-10">
          <h1 className="text-4xl font-extrabold">{t('dash.title')}</h1>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <motion.div whileHover={{ y: -5 }} className="bg-white dark:bg-stone-900 p-6 rounded-2xl shadow-sm border border-stone-200 dark:border-stone-800 flex items-center transition-colors duration-300">
          <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-full mr-4"><Package className="text-[#2D5A27] dark:text-green-400 w-8 h-8" /></div>
          <div>
            <p className="text-stone-500 dark:text-stone-400 text-sm font-medium">{t('dash.total')}</p>
            <p className="text-3xl font-bold text-stone-900 dark:text-stone-100">{totalCrops}</p>
          </div>
        </motion.div>
        <motion.div whileHover={{ y: -5 }} className="bg-white dark:bg-stone-900 p-6 rounded-2xl shadow-sm border border-stone-200 dark:border-stone-800 flex items-center transition-colors duration-300">
          <div className="bg-yellow-100 dark:bg-yellow-900/30 p-4 rounded-full mr-4"><Truck className="text-[#F0A500] w-8 h-8" /></div>
          <div>
            <p className="text-stone-500 dark:text-stone-400 text-sm font-medium">{t('dash.transit')}</p>
            <p className="text-3xl font-bold text-stone-900 dark:text-stone-100">{inTransit}</p>
          </div>
        </motion.div>
        <motion.div whileHover={{ y: -5 }} className="bg-white dark:bg-stone-900 p-6 rounded-2xl shadow-sm border border-stone-200 dark:border-stone-800 flex items-center transition-colors duration-300">
          <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-full mr-4"><CheckCircle className="text-blue-600 dark:text-blue-400 w-8 h-8" /></div>
          <div>
            <p className="text-stone-500 dark:text-stone-400 text-sm font-medium">{t('dash.delivered')}</p>
            <p className="text-3xl font-bold text-stone-900 dark:text-stone-100">{delivered}</p>
          </div>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Register Form */}
        <div className="lg:col-span-1">
          <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="bg-white dark:bg-stone-900 rounded-2xl shadow-sm border border-stone-200 dark:border-stone-800 p-6 sticky top-24 transition-colors duration-300">
            <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100 mb-6 flex items-center">
              <Plus className="mr-2" /> {t('dash.registerTitle')}
            </h2>
            <form onSubmit={handleRegisterCrop} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">{t('dash.cropName')}</label>
                <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full border border-stone-300 dark:border-stone-700 rounded-lg p-2.5 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-[#2D5A27] focus:border-[#2D5A27]" placeholder="e.g. Organic Wheat" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">{t('dash.qty')}</label>
                <input required type="number" value={quantity} onChange={e => setQuantity(e.target.value)} className="w-full border border-stone-300 dark:border-stone-700 rounded-lg p-2.5 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-[#2D5A27] focus:border-[#2D5A27]" placeholder="100" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Phone Number</label>
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full border border-stone-300 dark:border-stone-700 rounded-lg p-2.5 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-[#2D5A27] focus:border-[#2D5A27]" placeholder="+91 9876543210" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Address</label>
                <textarea value={address} onChange={e => setAddress(e.target.value)} rows={2} className="w-full border border-stone-300 dark:border-stone-700 rounded-lg p-2.5 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-[#2D5A27] focus:border-[#2D5A27]" placeholder="Farm Location..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">{t('dash.image')}</label>
                <div className="border-2 border-dashed border-stone-300 dark:border-stone-700 rounded-lg p-4 text-center hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors relative">
                  <input type="file" accept="image/*" onChange={handleImageChange} disabled={isAnalyzing} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed" />
                  {imageBase64 ? (
                    <img src={imageBase64} alt="Preview" className="mx-auto h-20 object-cover rounded" />
                  ) : (
                    <div className="text-stone-500 dark:text-stone-400 flex flex-col items-center">
                      <ImageIcon className="w-8 h-8 mb-2" />
                      <span className="text-sm font-medium">{t('dash.imageHint')}</span>
                    </div>
                  )}
                </div>
                {isAnalyzing && (
                  <p className="text-sm text-blue-600 mt-2 flex items-center font-medium">
                    <Loader2 className="w-4 h-4 mr-1 animate-spin" /> {t('dash.analyzing')}
                  </p>
                )}
                {qualityGrade && !isAnalyzing && (
                  <p className="text-sm text-[#2D5A27] mt-2 flex items-center font-bold">
                    <Sparkles className="w-4 h-4 mr-1 text-[#F0A500]" /> {t('dash.qualityGrade')}: {qualityGrade}
                  </p>
                )}
              </div>
              <button type="submit" disabled={isSubmitting || isAnalyzing} className="w-full bg-[#2D5A27] text-white font-bold py-3 rounded-lg hover:bg-green-800 transition-colors mt-4 disabled:opacity-50">
                {isSubmitting ? t('dash.saving') : t('dash.saveBtn')}
              </button>
            </form>
          </motion.div>
        </div>

        {/* Crops List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">{t('dash.myCrops')}</h2>
            <button 
              onClick={handleSyncToSupabase}
              className="bg-blue-100 hover:bg-blue-200 text-blue-800 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 dark:text-blue-300 px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center"
            >
              <RefreshCw className="w-4 h-4 mr-2" /> Sync to Supabase
            </button>
          </div>
          {crops.length === 0 ? (
            <div className="text-center py-12 bg-stone-50 dark:bg-stone-900/50 rounded-2xl border border-stone-200 dark:border-stone-800 text-stone-500 dark:text-stone-400 font-medium transition-colors duration-300">
              {t('dash.noCrops')}
            </div>
          ) : (
            crops.map((crop, index) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: index * 0.1 }}
                key={crop.id} 
                className="bg-white dark:bg-stone-900 p-6 rounded-2xl shadow-sm border border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row gap-6 transition-colors duration-300"
              >
                {/* QR Code binds to Crop ID visually and allows scanning to update status */}
                <div className="flex-shrink-0 bg-stone-50 dark:bg-white p-4 rounded-xl border border-stone-100 dark:border-stone-200 flex flex-col items-center justify-center">
                  <QRCode value={`${window.location.origin}/update-status?id=${crop.cropId}`} size={100} />
                  <p className="mt-2 font-mono font-bold text-[#2D5A27] tracking-widest">{crop.cropId}</p>
                </div>
                
                <div className="flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100">{crop.name}</h3>
                    <div className="flex items-center space-x-2">
                      <span className="bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs font-bold px-3 py-1 rounded-full">
                        {crop.quantity} kg
                      </span>
                      <button 
                        onClick={() => handleDeleteCrop(crop.id, crop.cropId)}
                        className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 dark:bg-red-900/30 dark:hover:bg-red-900/50 p-1.5 rounded-lg transition-colors"
                        title="Delete Crop"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  {crop.qualityGrade && (
                    <div className="mb-4 flex flex-wrap gap-2">
                      <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 text-xs font-bold px-3 py-1 rounded-full flex items-center">
                        <Sparkles className="w-3 h-3 mr-1" /> Grade {crop.qualityGrade}
                      </span>
                      <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs font-bold px-3 py-1 rounded-full">
                        {t('dash.suggestedPrice')}: ₹{
                          (() => {
                            const n = crop.name.toLowerCase();
                            let basePrice = 20;
                            if (n.includes('wheat')) basePrice = 22;
                            if (n.includes('tomato')) basePrice = 15;
                            if (n.includes('rice')) basePrice = 43;
                            let total = basePrice * crop.quantity;
                            if (crop.qualityGrade === 'A') total *= 1.1;
                            return total.toFixed(0);
                          })()
                        }
                        {crop.qualityGrade === 'A' && ` ${t('dash.boost')}`}
                      </span>
                    </div>
                  )}
                  
                  <p className="text-xs text-stone-400 dark:text-stone-500 font-medium">{t('dash.registeredOn')} {new Date(crop.createdAt).toLocaleDateString()}</p>
                </div>
                
                {crop.imageBase64 && (
                  <div className="hidden sm:block flex-shrink-0">
                    <img src={crop.imageBase64} alt={crop.name} className="w-24 h-24 object-cover rounded-xl border border-stone-200 dark:border-stone-700" />
                  </div>
                )}
              </motion.div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
}
