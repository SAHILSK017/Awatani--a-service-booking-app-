import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, LogOut, Code, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const TopNavbar = ({ user }) => {
  const navigate = useNavigate();
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <header className="sticky top-4 z-30 w-full px-4 md:px-8 mb-8">
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="flex items-center justify-between px-6 py-3 bg-indigo-500/10 backdrop-blur-2xl border border-indigo-100/50 shadow-[0_8px_30px_rgb(0,0,0,0.06)] rounded-[2rem] max-w-7xl mx-auto ml-12 md:ml-auto"
      >
        
        {/* Advanced Search Bar */}
        <div className={`flex-1 max-w-lg hidden sm:flex items-center gap-3 px-4 py-2.5 rounded-2xl transition-all duration-300 border ${isSearchFocused ? 'bg-white border-indigo-200 shadow-[0_0_0_4px_rgba(99,102,241,0.1)]' : 'bg-gray-50/50 border-gray-100 hover:bg-white hover:border-gray-200 hover:shadow-sm'}`}>
          <Search size={18} className={`transition-colors ${isSearchFocused ? 'text-indigo-500' : 'text-gray-400'}`} />
          <input 
            type="text" 
            placeholder="Search..." 
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            className="w-full bg-transparent border-none outline-none text-sm font-medium text-gray-900 placeholder:text-gray-400"
          />
          {isSearchFocused && (
             <motion.div initial={{opacity:0, scale:0.8}} animate={{opacity:1, scale:1}} className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-600 tracking-widest border border-indigo-100">ESC</motion.div>
          )}
        </div>

        {/* Right Actions Cluster */}
        <div className="flex items-center gap-5 ml-auto">
          
          {/* Notification Hub */}
          <button className="relative p-2.5 rounded-xl text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all group">
            <Bell size={22} className="group-hover:animate-swing" />
            <span className="absolute top-2 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white shadow-[0_0_8px_rgba(239,68,68,0.6)]"></span>
          </button>
          
          <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>
          
          {/* Profile Identity Card */}
          <div className="flex items-center gap-4 pl-1">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-extrabold text-gray-900 tracking-tight">{user?.name || 'User'}</span>
              <span className="text-[11px] font-bold text-indigo-500 uppercase tracking-widest">{user?.role}</span>
            </div>
            
            <div className="relative group cursor-pointer">
              <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 p-[2px] shadow-lg shadow-indigo-500/30 group-hover:shadow-indigo-500/50 transition-all duration-300">
                <div className="w-full h-full rounded-full border-[3px] border-white bg-indigo-50 flex items-center justify-center overflow-hidden">
                    {user?.name ? (
                        <span className="text-lg font-black text-indigo-600">{userInitial}</span>
                    ) : (
                        <User size={18} className="text-indigo-500" />
                    )}
                </div>
              </div>
              
              {/* Green active dot */}
              <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full shadow-sm"></div>
            </div>
            
            <button 
              onClick={handleLogout}
              className="ml-2 p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all group/logout"
              title="Log Out"
            >
              <LogOut size={20} className="group-hover/logout:-translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </motion.div>
    </header>
  );
};
