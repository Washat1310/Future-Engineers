import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { Tractor, Stethoscope, Plus, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';

export default function Admin() {
  const [activeTab, setActiveTab] = useState<'rentals' | 'experts' | 'orders' | 'appointments'>('rentals');
  
  // Data states
  const [rentalItems, setRentalItems] = useState<any[]>([]);
  const [experts, setExperts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);

  // Form states
  const [newItem, setNewItem] = useState({ name: '', description: '', price: 0, imageUrl: '', category: '', available: true });
  const [newExpert, setNewExpert] = useState({ name: '', department: '', bio: '', imageUrl: '' });

  useEffect(() => {
    const unsubItems = onSnapshot(collection(db, 'rentalItems'), 
      (snap) => setRentalItems(snap.docs.map(d => ({ id: d.id, ...d.data() }))),
      (err) => handleFirestoreError(err, OperationType.LIST, 'rentalItems')
    );
    const unsubExperts = onSnapshot(collection(db, 'experts'), 
      (snap) => setExperts(snap.docs.map(d => ({ id: d.id, ...d.data() }))),
      (err) => handleFirestoreError(err, OperationType.LIST, 'experts')
    );
    const unsubOrders = onSnapshot(collection(db, 'rentalOrders'), 
      (snap) => setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() }))),
      (err) => handleFirestoreError(err, OperationType.LIST, 'rentalOrders')
    );
    const unsubApts = onSnapshot(collection(db, 'appointments'), 
      (snap) => setAppointments(snap.docs.map(d => ({ id: d.id, ...d.data() }))),
      (err) => handleFirestoreError(err, OperationType.LIST, 'appointments')
    );

    return () => { unsubItems(); unsubExperts(); unsubOrders(); unsubApts(); };
  }, []);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'rentalItems'), { ...newItem, price: Number(newItem.price) });
      setNewItem({ name: '', description: '', price: 0, imageUrl: '', category: '', available: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'rentalItems');
    }
  };

  const handleAddExpert = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'experts'), newExpert);
      setNewExpert({ name: '', department: '', bio: '', imageUrl: '' });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'experts');
    }
  };

  const handleDelete = async (collectionName: string, id: string) => {
    if (!confirm('Are you sure?')) return;
    try {
      await deleteDoc(doc(db, collectionName, id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `${collectionName}/${id}`);
    }
  };

  const updateOrderStatus = async (id: string, field: string, value: string) => {
    try {
      await updateDoc(doc(db, 'rentalOrders', id), { [field]: value });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `rentalOrders/${id}`);
    }
  };

  const updateAptStatus = async (id: string, status: string) => {
    try {
      await updateDoc(doc(db, 'appointments', id), { status });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `appointments/${id}`);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100 mb-8">Admin Dashboard</h1>

      {/* Tabs */}
      <div className="flex space-x-4 mb-8 border-b border-stone-200 dark:border-stone-800">
        {(['rentals', 'experts', 'orders', 'appointments'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 px-2 font-medium capitalize transition-colors duration-300 ${activeTab === tab ? 'text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-600 dark:border-emerald-400' : 'text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl shadow-sm border border-stone-200 dark:border-stone-800 p-6 transition-colors duration-300">
        
        {/* RENTALS TAB */}
        {activeTab === 'rentals' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="text-xl font-bold mb-4 text-stone-900 dark:text-stone-100">Manage Equipment</h2>
            <form onSubmit={handleAddItem} className="grid md:grid-cols-2 gap-4 mb-8 bg-stone-50 dark:bg-stone-800 p-4 rounded-xl transition-colors duration-300">
              <input required placeholder="Name" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} className="border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 p-2 rounded focus:ring-emerald-500 focus:border-emerald-500" />
              <input required placeholder="Category" value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})} className="border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 p-2 rounded focus:ring-emerald-500 focus:border-emerald-500" />
              <input required type="number" placeholder="Price/day" value={newItem.price} onChange={e => setNewItem({...newItem, price: Number(e.target.value)})} className="border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 p-2 rounded focus:ring-emerald-500 focus:border-emerald-500" />
              <input required placeholder="Image URL" value={newItem.imageUrl} onChange={e => setNewItem({...newItem, imageUrl: e.target.value})} className="border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 p-2 rounded focus:ring-emerald-500 focus:border-emerald-500" />
              <textarea required placeholder="Description" value={newItem.description} onChange={e => setNewItem({...newItem, description: e.target.value})} className="border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 p-2 rounded md:col-span-2 focus:ring-emerald-500 focus:border-emerald-500" />
              <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded font-bold md:col-span-2 flex justify-center items-center transition-colors">
                <Plus className="w-5 h-5 mr-1" /> Add Equipment
              </button>
            </form>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {rentalItems.map(item => (
                <div key={item.id} className="border border-stone-200 dark:border-stone-800 p-4 rounded-xl flex justify-between items-start bg-white dark:bg-stone-900 transition-colors duration-300">
                  <div>
                    <h3 className="font-bold text-stone-900 dark:text-stone-100">{item.name}</h3>
                    <p className="text-sm text-stone-500 dark:text-stone-400">${item.price}/day</p>
                  </div>
                  <button onClick={() => handleDelete('rentalItems', item.id)} className="text-red-500 hover:text-red-600 transition-colors"><Trash2 className="w-5 h-5" /></button>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* EXPERTS TAB */}
        {activeTab === 'experts' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="text-xl font-bold mb-4 text-stone-900 dark:text-stone-100">Manage Experts</h2>
            <form onSubmit={handleAddExpert} className="grid md:grid-cols-2 gap-4 mb-8 bg-stone-50 dark:bg-stone-800 p-4 rounded-xl transition-colors duration-300">
              <input required placeholder="Name" value={newExpert.name} onChange={e => setNewExpert({...newExpert, name: e.target.value})} className="border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 p-2 rounded focus:ring-emerald-500 focus:border-emerald-500" />
              <input required placeholder="Department" value={newExpert.department} onChange={e => setNewExpert({...newExpert, department: e.target.value})} className="border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 p-2 rounded focus:ring-emerald-500 focus:border-emerald-500" />
              <input required placeholder="Image URL" value={newExpert.imageUrl} onChange={e => setNewExpert({...newExpert, imageUrl: e.target.value})} className="border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 p-2 rounded md:col-span-2 focus:ring-emerald-500 focus:border-emerald-500" />
              <textarea required placeholder="Bio" value={newExpert.bio} onChange={e => setNewExpert({...newExpert, bio: e.target.value})} className="border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 p-2 rounded md:col-span-2 focus:ring-emerald-500 focus:border-emerald-500" />
              <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded font-bold md:col-span-2 flex justify-center items-center transition-colors">
                <Plus className="w-5 h-5 mr-1" /> Add Expert
              </button>
            </form>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {experts.map(expert => (
                <div key={expert.id} className="border border-stone-200 dark:border-stone-800 p-4 rounded-xl flex justify-between items-start bg-white dark:bg-stone-900 transition-colors duration-300">
                  <div>
                    <h3 className="font-bold text-stone-900 dark:text-stone-100">{expert.name}</h3>
                    <p className="text-sm text-stone-500 dark:text-stone-400">{expert.department}</p>
                  </div>
                  <button onClick={() => handleDelete('experts', expert.id)} className="text-red-500 hover:text-red-600 transition-colors"><Trash2 className="w-5 h-5" /></button>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="text-xl font-bold mb-4 text-stone-900 dark:text-stone-100">Rental Orders</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-stone-100 dark:bg-stone-800 transition-colors duration-300">
                    <th className="p-3 border-b border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100">ID</th>
                    <th className="p-3 border-b border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100">User ID</th>
                    <th className="p-3 border-b border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100">Status</th>
                    <th className="p-3 border-b border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100">Tracking</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.id} className="border-b border-stone-100 dark:border-stone-800 transition-colors duration-300">
                      <td className="p-3 text-sm text-stone-600 dark:text-stone-400">{order.id.substring(0,8)}</td>
                      <td className="p-3 text-sm text-stone-600 dark:text-stone-400">{order.userId.substring(0,8)}</td>
                      <td className="p-3">
                        <select value={order.status} onChange={(e) => updateOrderStatus(order.id, 'status', e.target.value)} className="border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 rounded p-1 text-sm focus:ring-emerald-500 focus:border-emerald-500">
                          <option value="pending">Pending</option>
                          <option value="active">Active</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="p-3">
                        <select value={order.trackingStatus} onChange={(e) => updateOrderStatus(order.id, 'trackingStatus', e.target.value)} className="border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 rounded p-1 text-sm focus:ring-emerald-500 focus:border-emerald-500">
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="returned">Returned</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* APPOINTMENTS TAB */}
        {activeTab === 'appointments' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="text-xl font-bold mb-4 text-stone-900 dark:text-stone-100">Appointments</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-stone-100 dark:bg-stone-800 transition-colors duration-300">
                    <th className="p-3 border-b border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100">Date/Time</th>
                    <th className="p-3 border-b border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100">User ID</th>
                    <th className="p-3 border-b border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100">Expert ID</th>
                    <th className="p-3 border-b border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map(apt => (
                    <tr key={apt.id} className="border-b border-stone-100 dark:border-stone-800 transition-colors duration-300">
                      <td className="p-3 text-sm text-stone-600 dark:text-stone-400">{apt.date} {apt.time}</td>
                      <td className="p-3 text-sm text-stone-600 dark:text-stone-400">{apt.userId.substring(0,8)}</td>
                      <td className="p-3 text-sm text-stone-600 dark:text-stone-400">{apt.expertId.substring(0,8)}</td>
                      <td className="p-3">
                        <select value={apt.status} onChange={(e) => updateAptStatus(apt.id, e.target.value)} className="border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 rounded p-1 text-sm focus:ring-emerald-500 focus:border-emerald-500">
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

      </div>
    </motion.div>
  );
}
