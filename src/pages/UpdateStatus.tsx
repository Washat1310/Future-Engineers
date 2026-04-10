import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { supabase } from '../supabase';
import { motion } from 'motion/react';
import { CheckCircle, Loader2, XCircle, ArrowRight } from 'lucide-react';

export default function UpdateStatus() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [cropName, setCropName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) {
      setStatus('error');
      setMessage('No Crop ID provided.');
      return;
    }

    const updateCropStatus = async () => {
      try {
        const q = query(collection(db, 'crops'), where('cropId', '==', id.trim().toUpperCase()));
        const snapshot = await getDocs(q);
        if (snapshot.empty) {
          setStatus('error');
          setMessage('Crop not found.');
          return;
        }

        const cropDoc = snapshot.docs[0];
        const cropData = cropDoc.data();
        const currentStatus = cropData.status;
        setCropName(cropData.name);

        const statusFlow = ['Shipped', 'Transport', 'Warehouse', 'Delivered'];
        const currentIndex = statusFlow.indexOf(currentStatus);

        if (currentIndex === -1 || currentIndex === statusFlow.length - 1) {
          setStatus('success');
          setMessage(`Crop is already marked as ${currentStatus}.`);
          return;
        }

        const nextStatus = statusFlow[currentIndex + 1];
        await updateDoc(doc(db, 'crops', cropDoc.id), { status: nextStatus });

        // Update Supabase
        try {
          await supabase.from('crops').update({ status: nextStatus }).eq('crop_id', cropData.cropId);
        } catch(supaErr) {
          console.error("Supabase update error:", supaErr);
        }

        setStatus('success');
        setMessage(`Status successfully updated to: ${nextStatus}`);
      } catch (err: any) {
        setStatus('error');
        setMessage(err.message || 'Failed to update status.');
      }
    };

    updateCropStatus();
  }, [id]);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }} 
        className="bg-white dark:bg-stone-900 p-8 rounded-3xl shadow-xl border border-stone-200 dark:border-stone-800 max-w-md w-full text-center"
      >
        {status === 'loading' && (
          <div className="flex flex-col items-center">
            <Loader2 className="w-16 h-16 text-[#F0A500] animate-spin mb-6" />
            <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100 mb-2">Updating Status...</h2>
            <p className="text-stone-500 dark:text-stone-400">Please wait while we process the QR code scan.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
              <CheckCircle className="w-20 h-20 text-[#2D5A27] dark:text-green-400 mb-6" />
            </motion.div>
            <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100 mb-2">Scan Successful!</h2>
            {cropName && <p className="text-lg font-medium text-stone-600 dark:text-stone-300 mb-4">{cropName} (ID: {id})</p>}
            <div className="bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-300 p-4 rounded-xl font-bold mb-8 w-full">
              {message}
            </div>
            <button 
              onClick={() => navigate(`/track?id=${id}`)}
              className="w-full bg-[#2D5A27] text-white font-bold py-4 rounded-xl hover:bg-green-800 transition-colors flex items-center justify-center"
            >
              View Tracking Details <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
              <XCircle className="w-20 h-20 text-red-500 mb-6" />
            </motion.div>
            <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100 mb-2">Scan Failed</h2>
            <div className="bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-300 p-4 rounded-xl font-bold mb-8 w-full">
              {message}
            </div>
            <button 
              onClick={() => navigate('/track')}
              className="w-full bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-bold py-4 rounded-xl hover:bg-stone-300 dark:hover:bg-stone-700 transition-colors"
            >
              Go to Tracking
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
