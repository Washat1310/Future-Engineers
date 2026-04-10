import React from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function Contact() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="relative rounded-3xl overflow-hidden mb-12 bg-[#2D5A27] dark:bg-stone-900 text-white py-16 px-8 shadow-lg">
        <div className="absolute inset-0 opacity-40 dark:opacity-30">
          <img 
            src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=1920&auto=format&fit=crop" 
            alt="Contact background" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#2D5A27] to-transparent dark:from-stone-900"></div>
        </div>
        <div className="relative z-10">
          <h1 className="text-4xl font-extrabold mb-4">Contact Us</h1>
          <p className="text-stone-200 dark:text-stone-300 text-xl max-w-2xl">We're here to help. Get in touch with the Fasal Track team.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        <motion.div 
          initial={{ opacity: 0, x: -20 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-stone-900 p-8 rounded-3xl shadow-sm border border-stone-200 dark:border-stone-800"
        >
          <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100 mb-6">Send us a message</h2>
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">Full Name</label>
              <input type="text" className="w-full border border-stone-300 dark:border-stone-700 rounded-xl p-3 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-[#2D5A27] focus:border-[#2D5A27]" placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">Email Address</label>
              <input type="email" className="w-full border border-stone-300 dark:border-stone-700 rounded-xl p-3 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-[#2D5A27] focus:border-[#2D5A27]" placeholder="john@example.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">Message</label>
              <textarea rows={4} className="w-full border border-stone-300 dark:border-stone-700 rounded-xl p-3 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-[#2D5A27] focus:border-[#2D5A27]" placeholder="How can we help you?"></textarea>
            </div>
            <button type="button" className="w-full bg-[#2D5A27] text-white font-bold py-4 rounded-xl hover:bg-green-800 transition-colors flex items-center justify-center">
              <Send className="w-5 h-5 mr-2" /> Send Message
            </button>
          </form>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ delay: 0.4 }}
          className="space-y-8"
        >
          <div className="bg-white dark:bg-stone-900 p-8 rounded-3xl shadow-sm border border-stone-200 dark:border-stone-800 flex items-start">
            <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-full mr-6">
              <Mail className="w-8 h-8 text-[#2D5A27] dark:text-green-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100 mb-2">Email Us</h3>
              <p className="text-stone-600 dark:text-stone-400">support@fasaltrack.com</p>
              <p className="text-stone-600 dark:text-stone-400">info@fasaltrack.com</p>
            </div>
          </div>

          <div className="bg-white dark:bg-stone-900 p-8 rounded-3xl shadow-sm border border-stone-200 dark:border-stone-800 flex items-start">
            <div className="bg-yellow-100 dark:bg-yellow-900/30 p-4 rounded-full mr-6">
              <Phone className="w-8 h-8 text-[#F0A500]" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100 mb-2">Call Us</h3>
              <p className="text-stone-600 dark:text-stone-400">+91 1800-123-4567</p>
              <p className="text-stone-600 dark:text-stone-400">Mon-Fri, 9am to 6pm</p>
            </div>
          </div>

          <div className="bg-white dark:bg-stone-900 p-8 rounded-3xl shadow-sm border border-stone-200 dark:border-stone-800 flex items-start">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-full mr-6">
              <MapPin className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100 mb-2">Visit Us</h3>
              <p className="text-stone-600 dark:text-stone-400">Fasal Track Headquarters</p>
              <p className="text-stone-600 dark:text-stone-400">AgriTech Park, Sector 42</p>
              <p className="text-stone-600 dark:text-stone-400">New Delhi, India 110001</p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
