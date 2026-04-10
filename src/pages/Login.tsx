import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { Tractor } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';

export default function Login() {
  const { t } = useTranslation();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      setError('');
      setLoading(true);
      await signInWithPopup(auth, googleProvider);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to log in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex bg-stone-50 dark:bg-stone-950 transition-colors duration-300">
      {/* Left side - Video Background */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="https://assets.mixkit.co/videos/34045/34045-720.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {/* Gradient overlays for a premium 3D cinematic feel */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#2D5A27]/40 to-transparent dark:from-stone-900/80 dark:to-stone-900/20 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        
        {/* Decorative text overlay */}
        <div className="absolute bottom-12 left-12 right-12 z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <h3 className="text-white text-4xl font-extrabold mb-2 drop-shadow-lg">The Future of Farming</h3>
            <p className="text-stone-200 text-lg font-medium drop-shadow-md max-w-md">Track your crops, manage logistics, and optimize your agricultural supply chain with real-time data.</p>
          </motion.div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }}
          className="max-w-md w-full space-y-8 bg-white/80 dark:bg-stone-900/80 backdrop-blur-sm p-10 rounded-3xl shadow-xl border border-stone-100 dark:border-stone-800 transition-colors duration-300"
        >
        <div className="text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }}>
            <Tractor className="mx-auto h-12 w-12 text-[#2D5A27] dark:text-green-400" />
          </motion.div>
          <h2 className="mt-6 text-3xl font-extrabold text-stone-900 dark:text-stone-100">
            {t('login.welcome')}
          </h2>
          <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">
            {t('login.subtitle')}
          </p>
        </div>
        
        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-md text-sm font-medium">
            {error}
          </motion.div>
        )}

        <div className="mt-8 space-y-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-stone-300 dark:border-stone-700 rounded-md shadow-sm bg-white dark:bg-stone-800 text-sm font-bold text-stone-700 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2D5A27] disabled:opacity-50 transition-colors"
          >
            <img 
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
              alt="Google logo" 
              className="h-5 w-5 mr-2" 
            />
            {loading ? t('login.signingIn') : t('login.btn')}
          </motion.button>
        </div>
        </motion.div>
      </div>
    </div>
  );
}
