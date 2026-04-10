import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Stethoscope, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { motion } from 'motion/react';

interface Expert {
  id: string;
  name: string;
  department: string;
  bio: string;
  imageUrl: string;
}

export default function Experts() {
  const [experts, setExperts] = useState<Expert[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  const [booking, setBooking] = useState(false);
  
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExperts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'experts'));
        const fetchedExperts = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Expert[];
        setExperts(fetchedExperts);
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, 'experts');
      } finally {
        setLoading(false);
      }
    };

    fetchExperts();
  }, []);

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    if (!selectedExpert || !date || !time) return;

    try {
      setBooking(true);
      await addDoc(collection(db, 'appointments'), {
        userId: user.uid,
        expertId: selectedExpert.id,
        date,
        time,
        status: 'pending',
        notes,
        createdAt: new Date().toISOString()
      });

      alert('Appointment booked successfully! Check your dashboard.');
      setSelectedExpert(null);
      setDate('');
      setTime('');
      setNotes('');
      navigate('/dashboard');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'appointments');
      alert('Failed to book appointment.');
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return <div className="min-h-[50vh] flex items-center justify-center text-stone-600 dark:text-stone-400">Loading experts...</div>;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="relative rounded-3xl overflow-hidden mb-12 bg-[#2D5A27] dark:bg-stone-900 text-white py-16 px-8 shadow-lg">
        <div className="absolute inset-0 opacity-40 dark:opacity-30">
          <img 
            src="https://images.unsplash.com/photo-1574943320219-553eb213f72d?q=80&w=1920&auto=format&fit=crop" 
            alt="Agronomist background" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#2D5A27] to-transparent dark:from-stone-900"></div>
        </div>
        <div className="relative z-10">
          <h1 className="text-4xl font-extrabold mb-4">Agricultural Experts</h1>
          <p className="text-stone-200 dark:text-stone-300 text-xl max-w-2xl">Consult with top agronomists and farming doctors.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Experts List */}
        <div className="lg:col-span-2 space-y-6">
          {experts.length === 0 ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20 bg-white dark:bg-stone-900 rounded-2xl border border-stone-100 dark:border-stone-800 transition-colors duration-300">
              <Stethoscope className="mx-auto h-12 w-12 text-stone-300 dark:text-stone-600 mb-4" />
              <h3 className="text-lg font-medium text-stone-900 dark:text-stone-100">No experts available</h3>
              <p className="text-stone-500 dark:text-stone-400">Check back later.</p>
            </motion.div>
          ) : (
            experts.map((expert, index) => (
              <motion.div 
                initial={{ opacity: 0, x: -20 }} 
                animate={{ opacity: 1, x: 0 }} 
                transition={{ delay: index * 0.1 }}
                key={expert.id} 
                className={`bg-white dark:bg-stone-900 rounded-2xl p-6 border transition-all cursor-pointer duration-300 ${selectedExpert?.id === expert.id ? 'border-emerald-500 dark:border-emerald-400 ring-1 ring-emerald-500 dark:ring-emerald-400 shadow-md' : 'border-stone-200 dark:border-stone-800 hover:border-emerald-300 dark:hover:border-emerald-700'}`}
                onClick={() => setSelectedExpert(expert)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex items-start space-x-4">
                  <img 
                    src={expert.imageUrl} 
                    alt={expert.name} 
                    className="w-20 h-20 rounded-full object-cover border border-stone-100 dark:border-stone-700"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100">{expert.name}</h3>
                    <p className="text-emerald-600 dark:text-emerald-400 font-medium text-sm mb-2">{expert.department}</p>
                    <p className="text-stone-600 dark:text-stone-400 text-sm">{expert.bio}</p>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Booking Form */}
        <div className="lg:col-span-1">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="bg-white dark:bg-stone-900 rounded-2xl p-6 border border-stone-200 dark:border-stone-800 sticky top-24 shadow-sm transition-colors duration-300">
            <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100 mb-4">Book Appointment</h3>
            
            {!selectedExpert ? (
              <div className="text-center py-8 text-stone-500 dark:text-stone-400">
                Select an expert from the list to book an appointment.
              </div>
            ) : (
              <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleBook} className="space-y-4">
                <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-100 dark:border-emerald-800/30 mb-4 transition-colors duration-300">
                  <p className="text-sm text-emerald-800 dark:text-emerald-300">Booking with:</p>
                  <p className="font-bold text-emerald-900 dark:text-emerald-100">{selectedExpert.name}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Date</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <CalendarIcon className="h-5 w-5 text-stone-400 dark:text-stone-500" />
                    </div>
                    <input
                      type="date"
                      required
                      min={format(new Date(), 'yyyy-MM-dd')}
                      max={format(addDays(new Date(), 30), 'yyyy-MM-dd')}
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="pl-10 block w-full border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm border p-2 transition-colors duration-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Time</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Clock className="h-5 w-5 text-stone-400 dark:text-stone-500" />
                    </div>
                    <select
                      required
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="pl-10 block w-full border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm border p-2 transition-colors duration-300"
                    >
                      <option value="">Select a time</option>
                      <option value="09:00">09:00 AM</option>
                      <option value="10:00">10:00 AM</option>
                      <option value="11:00">11:00 AM</option>
                      <option value="13:00">01:00 PM</option>
                      <option value="14:00">02:00 PM</option>
                      <option value="15:00">03:00 PM</option>
                      <option value="16:00">04:00 PM</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Notes (Optional)</label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Describe your issue..."
                    className="block w-full border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm border p-2 transition-colors duration-300"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={booking}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
                >
                  {booking ? 'Booking...' : 'Confirm Booking'}
                </motion.button>
              </motion.form>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
