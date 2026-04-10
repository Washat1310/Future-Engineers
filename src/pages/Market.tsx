import React from 'react';
import { TrendingUp, Award } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';

const marketData = [
  { crop: 'Wheat', dealers: [
    { name: 'AgriCorp', price: 2200, location: 'North Zone' },
    { name: 'FreshMart', price: 2150, location: 'City Center' },
    { name: 'Local Mandi', price: 2300, location: 'East District', bestValue: true }
  ]},
  { crop: 'Tomatoes', dealers: [
    { name: 'AgriCorp', price: 1500, location: 'North Zone' },
    { name: 'FreshMart', price: 1800, location: 'City Center', bestValue: true },
    { name: 'Local Mandi', price: 1400, location: 'East District' }
  ]},
  { crop: 'Rice (Basmati)', dealers: [
    { name: 'AgriCorp', price: 4500, location: 'North Zone', bestValue: true },
    { name: 'FreshMart', price: 4200, location: 'City Center' },
    { name: 'Local Mandi', price: 4350, location: 'East District' }
  ]}
];

export default function Market() {
  const { t } = useTranslation();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="max-w-5xl mx-auto px-4 py-12">
      <div className="relative rounded-3xl overflow-hidden mb-12 bg-[#2D5A27] dark:bg-stone-900 text-white py-16 px-8 shadow-lg">
        <div className="absolute inset-0 opacity-40 dark:opacity-30">
          <img 
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1920&auto=format&fit=crop" 
            alt="Market background" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#2D5A27] to-transparent dark:from-stone-900"></div>
        </div>
        <div className="relative z-10">
          <h1 className="text-4xl font-extrabold mb-4 flex items-center">
            <TrendingUp className="mr-4 h-10 w-10 text-[#F0A500]" /> {t('market.title')}
          </h1>
          <p className="text-stone-200 dark:text-stone-300 text-xl max-w-2xl">{t('market.subtitle')}</p>
        </div>
      </div>

      <div className="space-y-12">
        {marketData.map((data, index) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: index * 0.1 }}
            key={data.crop} 
            className="bg-white dark:bg-stone-900 rounded-2xl shadow-sm border border-stone-200 dark:border-stone-800 overflow-hidden transition-colors duration-300"
          >
            <div className="bg-[#2D5A27] dark:bg-stone-800 text-white px-6 py-4 transition-colors duration-300">
              <h2 className="text-xl font-bold">{data.crop}</h2>
              <p className="text-emerald-100 dark:text-stone-400 text-sm font-medium">{t('market.pricePerQuintal')}</p>
            </div>
            <div className="p-0 overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-stone-50 dark:bg-stone-900/50 border-b border-stone-200 dark:border-stone-800 transition-colors duration-300">
                    <th className="p-4 font-bold text-stone-600 dark:text-stone-400">{t('market.dealerName')}</th>
                    <th className="p-4 font-bold text-stone-600 dark:text-stone-400">{t('market.location')}</th>
                    <th className="p-4 font-bold text-stone-600 dark:text-stone-400">{t('market.price')}</th>
                    <th className="p-4 font-bold text-stone-600 dark:text-stone-400">{t('market.recommendation')}</th>
                  </tr>
                </thead>
                <tbody>
                  {data.dealers.map((dealer, idx) => (
                    <tr key={idx} className={`border-b border-stone-100 dark:border-stone-800 transition-colors duration-300 ${dealer.bestValue ? 'bg-yellow-50/50 dark:bg-yellow-900/10' : ''}`}>
                      <td className="p-4 font-bold text-stone-900 dark:text-stone-100">{dealer.name}</td>
                      <td className="p-4 text-stone-600 dark:text-stone-400 font-medium">{dealer.location}</td>
                      <td className="p-4 font-bold text-stone-900 dark:text-stone-100 text-lg">₹{dealer.price}</td>
                      <td className="p-4">
                        {dealer.bestValue && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-[#F0A500] text-[#2D5A27]">
                            <Award className="w-4 h-4 mr-1" /> {t('market.bestValue')}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
