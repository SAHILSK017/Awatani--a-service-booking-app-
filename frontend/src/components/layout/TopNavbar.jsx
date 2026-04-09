import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, LogOut, User } from 'lucide-react';
import { Input } from '../ui/Input';

export const TopNavbar = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-20 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Search Bar */}
        <div className="flex-1 max-w-md hidden sm:block ml-12 md:ml-0">
          <Input 
            icon={Search} 
            placeholder="Search..." 
            className="bg-gray-50/50 border-gray-100 focus:bg-white"
          />
        </div>

        {/* Right Nav */}
        <div className="flex items-center space-x-4 ml-auto">
          <button className="p-2 text-gray-400 hover:text-indigo-600 transition-colors relative">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          
          <div className="h-8 w-px bg-gray-200 mx-2 hidden sm:block"></div>
          
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-semibold text-gray-900">{user?.name || 'User'}</span>
              <span className="text-xs text-gray-500 capitalize">{user?.role}</span>
            </div>
            <div className="h-10 w-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold shadow-sm">
              <User size={20} />
            </div>
            
            <button 
              onClick={handleLogout}
              className="ml-2 p-2 text-gray-400 hover:text-red-600 transition-colors"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
