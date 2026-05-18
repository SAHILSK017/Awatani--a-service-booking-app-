import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, Sun, Moon, Palette, Bell, Shield, Sparkles, CheckCircle2, 
  AlertCircle, ToggleLeft, ToggleRight, Laptop, HelpCircle, Save, Check
} from 'lucide-react';

const SettingsPage = () => {
  // Theme State
  const [theme, setTheme] = useState(() => localStorage.getItem('avatani_theme') || 'light');
  
  // Custom Toggles State
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('avatani_notifications');
    return saved ? JSON.parse(saved) : { email: true, sms: true, push: false };
  });

  const [animations, setAnimations] = useState(() => {
    const saved = localStorage.getItem('avatani_animations');
    return saved !== 'false'; // Defaults to true
  });

  // Premium Toast Notification State
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
  };

  // Change Theme Handler
  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('avatani_theme', newTheme);
    
    const root = document.documentElement;
    root.classList.remove('theme-dark', 'theme-amber');
    if (newTheme !== 'light') {
      root.classList.add(`theme-${newTheme}`);
    }
    showToast(`Theme set to ${newTheme.toUpperCase()}`, 'success');
  };

  // Save Settings Handler
  const handleSaveSettings = () => {
    localStorage.setItem('avatani_notifications', JSON.stringify(notifications));
    localStorage.setItem('avatani_animations', animations.toString());
    showToast('Settings saved successfully!', 'success');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      
      {/* Floating Premium Toast */}
      <AnimatePresence>
        {toast.show && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className={`fixed top-6 right-6 z-[9999] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border backdrop-blur-xl transition-all duration-300 ${
              toast.type === 'success' 
                ? 'bg-emerald-50/95 border-emerald-200 text-emerald-800 theme-dark:bg-emerald-950/90 theme-dark:border-emerald-800 theme-dark:text-emerald-200' 
                : 'bg-rose-50/95 border-rose-200 text-rose-800'
            }`}
          >
            <div className={`h-8 w-8 rounded-xl flex items-center justify-center shrink-0 shadow-inner ${
              toast.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
            }`}>
              {toast.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            </div>
            <span className="font-bold text-sm tracking-wide">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
          <Settings className="text-indigo-600 animate-spin-slow" size={32} />
          Settings & Preferences
        </h1>
        <p className="text-gray-500 mt-2 text-base font-medium">
          Customize your appearance and booking status notifications.
        </p>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-8"
      >
        {/* APPEARANCE SECTION */}
        <motion.div variants={cardVariants} className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-lg relative overflow-hidden">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
            <Palette className="text-indigo-600" size={24} />
            <h2 className="text-xl font-black text-gray-900">1. Theme & Appearance</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* LIGHT THEME */}
            <div 
              onClick={() => handleThemeChange('light')}
              className={`group cursor-pointer rounded-2xl border-2 p-5 flex flex-col justify-between h-40 transition-all ${
                theme === 'light' 
                  ? 'border-indigo-600 bg-indigo-50/15 shadow-md scale-[1.02]' 
                  : 'border-gray-100 hover:border-gray-200 bg-white'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-indigo-500 shadow-sm" />
                  <span className="h-3 w-3 rounded-full bg-purple-500 shadow-sm" />
                </div>
                <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${theme === 'light' ? 'border-indigo-600 bg-indigo-600' : 'border-gray-200'}`}>
                  {theme === 'light' && <div className="h-2 w-2 rounded-full bg-white" />}
                </div>
              </div>
              <div>
                <h3 className="text-base font-black text-gray-900 flex items-center gap-1.5">
                  <Sun size={16} className="text-amber-500" />
                  Sleek Light
                </h3>
                <p className="text-xs text-gray-500 mt-1">Soft indigo flares, clean high-contrast canvas.</p>
              </div>
            </div>

            {/* DARK THEME */}
            <div 
              onClick={() => handleThemeChange('dark')}
              className={`group cursor-pointer rounded-2xl border-2 p-5 flex flex-col justify-between h-40 transition-all ${
                theme === 'dark' 
                  ? 'border-indigo-600 bg-indigo-950/20 shadow-md scale-[1.02]' 
                  : 'border-gray-100 hover:border-gray-200 bg-white'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-slate-900 shadow-sm" />
                  <span className="h-3 w-3 rounded-full bg-violet-600 shadow-sm" />
                </div>
                <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${theme === 'dark' ? 'border-indigo-600 bg-indigo-600' : 'border-gray-200'}`}>
                  {theme === 'dark' && <div className="h-2 w-2 rounded-full bg-white" />}
                </div>
              </div>
              <div>
                <h3 className="text-base font-black text-gray-900 flex items-center gap-1.5">
                  <Moon size={16} className="text-violet-400" />
                  Obsidian Dark
                </h3>
                <p className="text-xs text-gray-500 mt-1">Obsidian canvas, bright glowing notifications.</p>
              </div>
            </div>

            {/* AMBER THEME */}
            <div 
              onClick={() => handleThemeChange('amber')}
              className={`group cursor-pointer rounded-2xl border-2 p-5 flex flex-col justify-between h-40 transition-all ${
                theme === 'amber' 
                  ? 'border-amber-500 bg-amber-50/25 shadow-md scale-[1.02]' 
                  : 'border-gray-100 hover:border-gray-200 bg-white'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-amber-500 shadow-sm" />
                  <span className="h-3 w-3 rounded-full bg-orange-500 shadow-sm" />
                </div>
                <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${theme === 'amber' ? 'border-amber-500 bg-amber-500' : 'border-gray-200'}`}>
                  {theme === 'amber' && <div className="h-2 w-2 rounded-full bg-white" />}
                </div>
              </div>
              <div>
                <h3 className="text-base font-black text-gray-900 flex items-center gap-1.5">
                  <Palette size={16} className="text-amber-600" />
                  Creamy Sunset
                </h3>
                <p className="text-xs text-gray-500 mt-1">Cozy honey glow, warm paper contrast canvas.</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* NOTIFICATIONS SECTION */}
        <motion.div variants={cardVariants} className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-lg">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
            <Bell className="text-indigo-600" size={24} />
            <h2 className="text-xl font-black text-gray-900">2. Booking Status Notifications</h2>
          </div>

          <div className="space-y-6">
            {/* Email Toggles */}
            <div className="flex justify-between items-center py-2 border-b border-gray-50">
              <div>
                <h3 className="text-base font-black text-gray-900">Email Notifications</h3>
                <p className="text-xs text-gray-500 mt-0.5">Receive receipts and booking updates in your email.</p>
              </div>
              <button 
                onClick={() => setNotifications({ ...notifications, email: !notifications.email })}
                className="text-indigo-600 hover:scale-105 active:scale-95 transition-transform"
              >
                {notifications.email ? <ToggleRight size={44} /> : <ToggleLeft className="text-gray-300" size={44} />}
              </button>
            </div>

            {/* SMS Toggles */}
            <div className="flex justify-between items-center py-2 border-b border-gray-50">
              <div>
                <h3 className="text-base font-black text-gray-900">SMS Notifications</h3>
                <p className="text-xs text-gray-500 mt-0.5">Get text alerts when a worker is assigned.</p>
              </div>
              <button 
                onClick={() => setNotifications({ ...notifications, sms: !notifications.sms })}
                className="text-indigo-600 hover:scale-105 active:scale-95 transition-transform"
              >
                {notifications.sms ? <ToggleRight size={44} /> : <ToggleLeft className="text-gray-300" size={44} />}
              </button>
            </div>

            {/* Push Toggles */}
            <div className="flex justify-between items-center py-2">
              <div>
                <h3 className="text-base font-black text-gray-900">Push Notifications</h3>
                <p className="text-xs text-gray-500 mt-0.5">Show browser notifications when booking status changes.</p>
              </div>
              <button 
                onClick={() => setNotifications({ ...notifications, push: !notifications.push })}
                className="text-indigo-600 hover:scale-105 active:scale-95 transition-transform"
              >
                {notifications.push ? <ToggleRight size={44} /> : <ToggleLeft className="text-gray-300" size={44} />}
              </button>
            </div>
          </div>
        </motion.div>

        {/* PERFORMANCE SECTION */}
        <motion.div variants={cardVariants} className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-lg">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
            <Sparkles className="text-indigo-600" size={24} />
            <h2 className="text-xl font-black text-gray-900">3. System & Performance</h2>
          </div>

          <div className="space-y-6">
            <div className="flex justify-between items-center py-2">
              <div>
                <h3 className="text-base font-black text-gray-900">Enable Animations</h3>
                <p className="text-xs text-gray-500 mt-0.5">Turn off animations if you want to save battery life.</p>
              </div>
              <button 
                onClick={() => setAnimations(!animations)}
                className="text-indigo-600 hover:scale-105 active:scale-95 transition-transform"
              >
                {animations ? <ToggleRight size={44} /> : <ToggleLeft className="text-gray-300" size={44} />}
              </button>
            </div>
          </div>
        </motion.div>

        {/* SAVE PANEL */}
        <motion.div variants={cardVariants} className="flex justify-end gap-4 pt-4">
          <button 
            onClick={handleSaveSettings}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-4 rounded-2xl shadow-lg shadow-indigo-600/30 flex items-center gap-2 transform active:scale-95 transition-all"
          >
            <Save size={18} />
            Save Settings
          </button>
        </motion.div>

      </motion.div>
    </div>
  );
};

export default SettingsPage;
