import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Briefcase, CalendarCheck, User, Settings, Menu, X, CreditCard, Users, Activity, BarChart3, Hexagon
} from 'lucide-react';
import { cn } from '../ui/Button';

const userMenu = [
  { name: 'Dashboard', path: '/user/home', icon: LayoutDashboard },
  { name: 'Services', path: '/user/services', icon: Briefcase },
  { name: 'My Bookings', path: '/user/mybookings', icon: CalendarCheck },
  { name: 'Profile', path: '/user/profile', icon: User },
];

const workerMenu = [
  { name: 'Dashboard', path: '/worker/dashboard', icon: LayoutDashboard },
  { name: 'Available Jobs', path: '/worker/available-jobs', icon: Briefcase },
  { name: 'My Jobs', path: '/worker/bookings', icon: CalendarCheck },
  { name: 'Earnings', path: '/worker/earnings', icon: CreditCard },
  { name: 'Profile', path: '/worker/profile', icon: User },
];

const adminMenu = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Manage Users', path: '/admin/users', icon: Users },
  { name: 'Manage Workers', path: '/admin/workers', icon: Briefcase },
  { name: 'Services', path: '/admin/services', icon: Activity },
  { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
];

export const Sidebar = ({ role }) => {
  const [isOpen, setIsOpen] = useState(false);

  let menu;
  if (role === 'admin') menu = adminMenu;
  else if (role === 'worker') menu = workerMenu;
  else menu = userMenu;

  return (
    <>
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button onClick={() => setIsOpen(!isOpen)} className="p-3 rounded-2xl bg-white/90 backdrop-blur-md shadow-lg border border-gray-100 text-gray-900 focus:outline-none">
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <AnimatePresence>
        {(isOpen || window.innerWidth >= 768) && (
          <motion.aside
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={cn(
              "fixed top-0 left-0 z-40 h-screen w-72 bg-indigo-500/10 backdrop-blur-3xl border-r border-indigo-100/50 shadow-[8px_0_30px_rgb(0,0,0,0.06)] flex flex-col transition-transform md:translate-x-0 overflow-hidden rounded-r-[2.5rem]"
            )}
            style={{ x: isOpen || window.innerWidth >= 768 ? 0 : -300 }}
          >
            {/* Logo Area */}
            <div className="p-8 pb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <Hexagon className="text-white w-6 h-6" />
              </div>
              <span className="text-3xl font-black bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent tracking-tight">
                Avatani
              </span>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 px-5 space-y-2 overflow-y-auto mt-2 custom-scrollbar">
              {menu.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={() => window.innerWidth < 768 && setIsOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center px-5 py-4 text-[15px] font-bold rounded-2xl transition-all duration-300 group relative',
                      isActive
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20'
                        : 'text-gray-500 hover:bg-white hover:text-gray-900 hover:shadow-sm border border-transparent hover:border-gray-100'
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <item.icon 
                        className={cn(
                          "mr-4 h-[22px] w-[22px] transition-transform duration-300",
                          isActive ? "text-white scale-110" : "text-gray-400 group-hover:text-indigo-600 group-hover:scale-110"
                        )} 
                      />
                      <span className="relative z-10 tracking-wide">{item.name}</span>
                      
                      {isActive && (
                          <motion.div layoutId="activeNavIndicator" className="absolute right-3 w-2 h-2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            {/* Footer Connect */}
            <div className="p-6 m-4 bg-gray-50 rounded-3xl border border-gray-100">
              <NavLink
                to="/settings"
                className="flex items-center justify-center w-full px-4 py-3 text-sm font-bold text-gray-700 bg-white rounded-xl shadow-sm border border-gray-100 hover:border-indigo-200 hover:text-indigo-700 transition-colors group"
              >
                <Settings className="mr-2 h-5 w-5 text-gray-400 group-hover:text-indigo-500 transition-colors" />
                Settings & Preferences
              </NavLink>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
      
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};
