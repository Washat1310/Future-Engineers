import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, TrendingUp, ShieldCheck, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';

export default function Home() {
  const { t } = useTranslation();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      {/* Hero Section */}
      <section className="relative bg-[#2D5A27] dark:bg-stone-900 text-white py-24 sm:py-32 overflow-hidden transition-colors duration-300">
        <div className="absolute inset-0 opacity-40 dark:opacity-30">
          <img 
            src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=1920&auto=format&fit=crop" 
            alt="Modern agriculture background" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#2D5A27] dark:to-stone-900"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            transition={{ delay: 0.2 }}
            className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6"
          >
            {t('home.title')} <span className="text-[#F0A500]">{t('home.titleHighlight')}</span>
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            transition={{ delay: 0.3 }}
            className="text-xl sm:text-2xl text-stone-200 dark:text-stone-300 max-w-3xl mx-auto mb-10"
          >
            {t('home.subtitle')}
          </motion.p>
          <motion.div 
            initial={{ y: 20, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <Link to="/dashboard" className="bg-[#F0A500] hover:bg-yellow-500 text-[#2D5A27] px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105 hover:shadow-lg flex items-center justify-center">
              {t('home.registerBtn')} <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link to="/track" className="bg-white/90 backdrop-blur-sm dark:bg-stone-800/90 text-[#2D5A27] dark:text-white hover:bg-white dark:hover:bg-stone-700 px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105 hover:shadow-lg flex items-center justify-center">
              {t('home.trackBtn')}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-stone-50 dark:bg-stone-950 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div 
              initial={{ y: 20, opacity: 0 }} 
              whileInView={{ y: 0, opacity: 1 }} 
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-stone-900 p-8 rounded-3xl shadow-sm hover:shadow-md border border-stone-100 dark:border-stone-800 transition-all duration-300 hover:-translate-y-2"
            >
              <div className="bg-green-100 dark:bg-green-900/30 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                <MapPin className="h-8 w-8 text-[#2D5A27] dark:text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100 mb-3">{t('home.feature1.title')}</h3>
              <p className="text-stone-600 dark:text-stone-400">{t('home.feature1.desc')}</p>
            </motion.div>
            <motion.div 
              initial={{ y: 20, opacity: 0 }} 
              whileInView={{ y: 0, opacity: 1 }} 
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-stone-900 p-8 rounded-3xl shadow-sm hover:shadow-md border border-stone-100 dark:border-stone-800 transition-all duration-300 hover:-translate-y-2"
            >
              <div className="bg-yellow-100 dark:bg-yellow-900/30 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                <TrendingUp className="h-8 w-8 text-[#F0A500]" />
              </div>
              <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100 mb-3">{t('home.feature2.title')}</h3>
              <p className="text-stone-600 dark:text-stone-400">{t('home.feature2.desc')}</p>
            </motion.div>
            <motion.div 
              initial={{ y: 20, opacity: 0 }} 
              whileInView={{ y: 0, opacity: 1 }} 
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-stone-900 p-8 rounded-3xl shadow-sm hover:shadow-md border border-stone-100 dark:border-stone-800 transition-all duration-300 hover:-translate-y-2"
            >
              <div className="bg-blue-100 dark:bg-blue-900/30 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                <ShieldCheck className="h-8 w-8 text-blue-700 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100 mb-3">{t('home.feature3.title')}</h3>
              <p className="text-stone-600 dark:text-stone-400">{t('home.feature3.desc')}</p>
            </motion.div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
