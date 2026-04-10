import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';

export default function KrishiBot() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user'|'bot', text: string}[]>([
    { role: 'bot', text: "Hello! I'm Krishi-Bot. Ask me about crop prices or track your crop ID (e.g., 'Where is A1B2C3?')." }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setInput('');

    const lowerInput = userText.toLowerCase();
    let botResponse = "";

    if (lowerInput.includes('price') || lowerInput.includes('rate')) {
      if (lowerInput.includes('wheat')) botResponse = "Wheat prices: AgriCorp ₹2200, FreshMart ₹2150, Local Mandi ₹2300.";
      else if (lowerInput.includes('tomato')) botResponse = "Tomato prices: AgriCorp ₹1500, FreshMart ₹1800, Local Mandi ₹1400.";
      else if (lowerInput.includes('rice')) botResponse = "Rice prices: AgriCorp ₹4500, FreshMart ₹4200, Local Mandi ₹4350.";
      else botResponse = "I can help with prices for Wheat, Tomatoes, and Rice. Which one do you need?";
    } else if (lowerInput.includes('where') || lowerInput.includes('track') || lowerInput.includes('status') || /[a-z0-9]{6}/i.test(lowerInput)) {
      const match = userText.match(/[A-Za-z0-9]{6}/);
      if (match) {
        const id = match[0].toUpperCase();
        try {
          const q = query(collection(db, 'crops'), where('cropId', '==', id));
          const snap = await getDocs(q);
          if (!snap.empty) {
            const data = snap.docs[0].data();
            botResponse = `Crop ${id} (${data.name}) is currently: ${data.status}.`;
          } else {
            botResponse = `I couldn't find a crop with ID ${id}.`;
          }
        } catch (err) {
          botResponse = "Sorry, I encountered an error looking up that crop.";
        }
      } else {
        botResponse = "Please provide the 6-digit Crop ID to track it.";
      }
    } else {
      botResponse = "I'm not sure about that. Please contact your nearest Market Dealer: AgriCorp (North Zone) - 555-0102.";
    }

    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'bot', text: botResponse }]);
    }, 500);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen ? (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.9 }} 
            animate={{ opacity: 1, y: 0, scale: 1 }} 
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="bg-white dark:bg-stone-900 rounded-2xl shadow-2xl w-80 sm:w-96 overflow-hidden border border-stone-200 dark:border-stone-800 flex flex-col h-[500px] transition-colors duration-300"
          >
            <div className="bg-[#2D5A27] dark:bg-stone-800 text-white p-4 flex justify-between items-center transition-colors duration-300">
              <div className="flex items-center space-x-2">
                <MessageCircle className="w-5 h-5 text-[#F0A500]" />
                <h3 className="font-bold text-lg">Krishi-Bot</h3>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-emerald-100 dark:text-stone-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto bg-stone-50 dark:bg-stone-950 space-y-4 transition-colors duration-300">
              {messages.map((msg, idx) => (
                <motion.div 
                  initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  key={idx} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] p-3 rounded-2xl ${msg.role === 'user' ? 'bg-[#2D5A27] dark:bg-emerald-800 text-white rounded-tr-none' : 'bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 rounded-tl-none shadow-sm'} transition-colors duration-300`}>
                    <p className="text-sm">{msg.text}</p>
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} className="p-3 bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 flex items-center space-x-2 transition-colors duration-300">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about prices or track crop..."
                className="flex-1 border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-[#2D5A27] dark:focus:border-emerald-500 focus:ring-1 focus:ring-[#2D5A27] dark:focus:ring-emerald-500 transition-colors duration-300"
              />
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit" 
                disabled={!input.trim()} 
                className="bg-[#F0A500] text-[#2D5A27] p-2 rounded-full hover:bg-yellow-500 transition-colors disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </motion.button>
            </form>
          </motion.div>
        ) : (
          <motion.button 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="bg-[#F0A500] text-[#2D5A27] p-4 rounded-full shadow-lg hover:bg-yellow-500 transition-colors flex items-center justify-center"
          >
            <MessageCircle className="w-7 h-7" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
