import React from 'react';
import { Sidebar } from './Sidebar';
import { TopNavbar } from './TopNavbar';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

export const DashboardLayout = ({ children, user }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <Sidebar role={user?.role} />
      
      <div className="md:ml-64 flex flex-col min-h-screen transition-all duration-300">
        <TopNavbar user={user} />
        
        <main className="flex-1 p-6 sm:p-8 overflow-x-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};
