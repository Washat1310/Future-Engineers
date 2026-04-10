import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { Tractor, User, LogOut, LayoutDashboard, Map, TrendingUp, Globe, History, ChevronDown, Sun, Moon, Stethoscope, ShoppingCart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { isDark, toggleTheme } = useTheme();
  const [recentCrops, setRecentCrops] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    if (user) {
      const q = query(collection(db, 'crops'), where('userId', '==', user.uid));
      const unsub = onSnapshot(q, (snapshot) => {
        const sorted = snapshot.docs
          .map(doc => doc.data())
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5);
        setRecentCrops(sorted);
      });
      return () => unsub();
    } else {
      setRecentCrops([]);
    }
  }, [user]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  const toggleLanguage = () => {
    const newLang = i18n.language.startsWith('en') ? 'hi' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <nav className="bg-[#2D5A27] dark:bg-stone-900 text-white shadow-md sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Tractor className="h-8 w-8 text-[#F0A500]" />
            <span className="font-bold text-xl tracking-tight">Fasal Track</span>
          </Link>
          
          <div className="hidden md:flex space-x-8">
            <Link to="/" className="hover:text-[#F0A500] transition-colors flex items-center font-medium">
              <Map className="w-4 h-4 mr-1"/> {t('nav.home')}
            </Link>
            <Link to="/track" className="hover:text-[#F0A500] transition-colors flex items-center font-medium">
              <Map className="w-4 h-4 mr-1"/> {t('nav.track')}
            </Link>
            <Link to="/market" className="hover:text-[#F0A500] transition-colors flex items-center font-medium">
              <TrendingUp className="w-4 h-4 mr-1"/> {t('nav.market')}
            </Link>
            <Link to="/contact" className="hover:text-[#F0A500] transition-colors flex items-center font-medium">
              <Globe className="w-4 h-4 mr-1"/> Contact Us
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <button 
              onClick={toggleTheme} 
              className="flex items-center space-x-1 hover:text-[#F0A500] transition-colors font-medium px-2"
              title="Toggle Theme"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            <button 
              onClick={toggleLanguage} 
              className="flex items-center space-x-1 hover:text-[#F0A500] transition-colors font-medium px-2"
              title="Toggle Language (English / Hindi)"
            >
              <Globe className="h-5 w-5" />
              <span className="hidden sm:inline">{i18n.language.startsWith('en') ? 'HI' : 'EN'}</span>
            </button>

            {user ? (
              <>
                <span className="hidden md:inline font-medium text-emerald-100 mr-2">
                  {t('nav.welcome', { name: user.displayName || user.email?.split('@')[0] || 'User' })}
                </span>
                
                {/* History Dropdown */}
                <div className="relative">
                  <button 
                    onClick={() => setShowHistory(!showHistory)}
                    className="flex items-center space-x-1 hover:text-[#F0A500] transition-colors font-medium"
                  >
                    <History className="h-5 w-5" />
                    <span className="hidden sm:inline">{t('nav.history')}</span>
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  
                  {showHistory && (
                    <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-stone-800 rounded-md shadow-lg py-1 z-50 border border-stone-200 dark:border-stone-700">
                      <div className="px-4 py-2 border-b border-stone-100 dark:border-stone-700">
                        <h3 className="text-sm font-bold text-stone-800 dark:text-stone-200">{t('nav.recentCrops')}</h3>
                      </div>
                      {recentCrops.length > 0 ? (
                        recentCrops.map(crop => (
                          <Link 
                            key={crop.cropId}
                            to={`/track?id=${crop.cropId}`}
                            onClick={() => setShowHistory(false)}
                            className="block px-4 py-3 hover:bg-stone-50 dark:hover:bg-stone-700 border-b border-stone-50 dark:border-stone-700 last:border-0"
                          >
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-stone-900 dark:text-stone-100">{crop.name}</span>
                              <span className="text-xs font-mono bg-stone-100 dark:bg-stone-900 text-stone-600 dark:text-stone-400 px-2 py-1 rounded">{crop.cropId}</span>
                            </div>
                          </Link>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-sm text-stone-500 dark:text-stone-400">{t('nav.noRecentCrops')}</div>
                      )}
                    </div>
                  )}
                </div>

                <Link to="/dashboard" className="flex items-center space-x-1 hover:text-[#F0A500] transition-colors font-medium">
                  <LayoutDashboard className="h-5 w-5" />
                  <span className="hidden sm:inline">{t('nav.dashboard')}</span>
                </Link>
                <button onClick={handleLogout} className="flex items-center space-x-1 hover:text-[#F0A500] transition-colors">
                  <LogOut className="h-5 w-5" />
                </button>
              </>
            ) : (
              <Link to="/login" className="flex items-center space-x-1 bg-[#F0A500] text-[#2D5A27] hover:bg-yellow-500 px-4 py-2 rounded-md transition-colors font-bold">
                <User className="h-5 w-5" />
                <span>{t('nav.login')}</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
