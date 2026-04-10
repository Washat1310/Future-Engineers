import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Tractor, Calendar } from 'lucide-react';
import { addDays, format } from 'date-fns';
import { motion } from 'motion/react';

interface RentalItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  available: boolean;
}

export default function Rentals() {
  const [items, setItems] = useState<RentalItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [rentingId, setRentingId] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'rentalItems'));
        const fetchedItems = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as RentalItem[];
        setItems(fetchedItems);
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, 'rentalItems');
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const handleRent = async (item: RentalItem) => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      setRentingId(item.id);
      const startDate = new Date();
      const endDate = addDays(startDate, 7); // Default 1 week rental

      await addDoc(collection(db, 'rentalOrders'), {
        userId: user.uid,
        rentalItemId: item.id,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        status: 'pending',
        trackingStatus: 'processing',
        totalAmount: item.price * 7,
        createdAt: new Date().toISOString()
      });

      alert('Rental request submitted successfully! Check your dashboard.');
      navigate('/dashboard');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'rentalOrders');
      alert('Failed to submit rental request.');
    } finally {
      setRentingId(null);
    }
  };

  if (loading) {
    return <div className="min-h-[50vh] flex items-center justify-center text-stone-600 dark:text-stone-400">Loading equipment...</div>;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="relative rounded-3xl overflow-hidden mb-12 bg-[#2D5A27] dark:bg-stone-900 text-white py-16 px-8 shadow-lg">
        <div className="absolute inset-0 opacity-40 dark:opacity-30">
          <img 
            src="https://images.unsplash.com/photo-1592982537447-6f2a6a0a3023?q=80&w=1920&auto=format&fit=crop" 
            alt="Tractor background" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#2D5A27] to-transparent dark:from-stone-900"></div>
        </div>
        <div className="relative z-10">
          <h1 className="text-4xl font-extrabold mb-4">Equipment Rental</h1>
          <p className="text-stone-200 dark:text-stone-300 text-xl max-w-2xl">Browse and rent high-quality farming equipment.</p>
        </div>
      </div>

      {items.length === 0 ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20 bg-white dark:bg-stone-900 rounded-2xl border border-stone-100 dark:border-stone-800 transition-colors duration-300">
          <Tractor className="mx-auto h-12 w-12 text-stone-300 dark:text-stone-600 mb-4" />
          <h3 className="text-lg font-medium text-stone-900 dark:text-stone-100">No equipment available</h3>
          <p className="text-stone-500 dark:text-stone-400">Check back later for new arrivals.</p>
        </motion.div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item, index) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: index * 0.1 }}
              key={item.id} 
              className="bg-white dark:bg-stone-900 rounded-2xl overflow-hidden border border-stone-100 dark:border-stone-800 shadow-sm hover:shadow-md transition-all flex flex-col"
            >
              <div className="h-48 overflow-hidden bg-stone-100 dark:bg-stone-800">
                <img 
                  src={item.imageUrl} 
                  alt={item.name} 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100">{item.name}</h3>
                  <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 text-xs px-2 py-1 rounded-full font-medium">
                    {item.category}
                  </span>
                </div>
                <p className="text-stone-600 dark:text-stone-400 text-sm mb-4 line-clamp-2">{item.description}</p>
                
                <div className="mt-auto pt-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">${item.price}</span>
                    <span className="text-stone-500 dark:text-stone-400 text-sm">/day</span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleRent(item)}
                    disabled={!item.available || rentingId === item.id}
                    className="bg-stone-900 dark:bg-white hover:bg-stone-800 dark:hover:bg-stone-100 text-white dark:text-stone-900 px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {rentingId === item.id ? 'Processing...' : (item.available ? 'Rent Now' : 'Unavailable')}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
