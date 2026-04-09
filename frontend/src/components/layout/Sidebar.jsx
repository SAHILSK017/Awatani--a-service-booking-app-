import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Briefcase, 
  CalendarCheck, 
  User, 
  Settings, 
  Menu, 
  X,
  CreditCard,
  Users,
  Activity,
  BarChart3
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

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button 
          onClick={toggleSidebar}
          className="p-2 rounded-xl bg-white shadow-sm border border-gray-100 text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <AnimatePresence>
        {(isOpen || window.innerWidth >= 768) && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={cn(
              "fixed top-0 left-0 z-40 h-screen w-64 bg-white border-r border-gray-100 shadow-sm flex flex-col transition-transform md:translate-x-0"
            )}
            style={{ x: isOpen || window.innerWidth >= 768 ? 0 : -280 }}
          >
            <div className="p-6">
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Avatani
              </span>
            </div>

            <nav className="flex-1 px-4 space-y-2 overflow-y-auto mt-4">
              {menu.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={() => window.innerWidth < 768 && setIsOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center px-4 py-3 text-sm font-medium rounded-2xl transition-all duration-200 group',
                      isActive
                        ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <item.icon 
                        className={cn(
                          "mr-3 h-5 w-5 transition-colors",
                          isActive ? "text-indigo-600" : "text-gray-400 group-hover:text-gray-600"
                        )} 
                      />
                      {item.name}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            <div className="p-4 border-t border-gray-50">
              <NavLink
                to="/settings"
                className="flex items-center px-4 py-3 text-sm font-medium text-gray-600 rounded-2xl hover:bg-gray-50 transition-colors group"
              >
                <Settings className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-600" />
                Settings
              </NavLink>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
      
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};
