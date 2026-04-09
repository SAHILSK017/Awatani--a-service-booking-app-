import React, { useState, useEffect } from 'react';
import { LogOut, User, Mail, Shield, Camera, Edit2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  if (!user) return null;

  return (
    <div className="min-h-[90vh] bg-gray-50 flex items-center justify-center p-6 sm:p-12">
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', damping: 20 }}
        className="max-w-2xl w-full bg-white rounded-[3rem] shadow-2xl shadow-indigo-100 overflow-hidden border border-gray-100 relative"
      >
        {/* Profile Header Block */}
        <div className="h-48 bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-600 relative overflow-hidden">
            <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-white/10 rounded-full blur-3xl mix-blend-overlay" />
            <div className="absolute bottom-[-50px] left-[-20px] w-40 h-40 bg-black/10 rounded-full blur-2xl mix-blend-overlay" />
        </div>

        {/* Profile Content */}
        <div className="px-10 pb-12">
            <div className="relative -mt-20 mb-8 flex justify-between items-end">
                <div className="relative group">
                    <div className="w-40 h-40 rounded-full border-8 border-white bg-gradient-to-r from-gray-100 to-gray-200 overflow-hidden shadow-xl flex items-center justify-center">
                        {user.profileImage ? (
                            <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <User size={64} className="text-gray-400" />
                        )}
                    </div>
                    <button className="absolute bottom-2 right-2 p-3 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-colors opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 duration-200">
                        <Camera size={18} />
                    </button>
                </div>
                
                <button className="mb-4 px-6 py-2.5 bg-indigo-50 text-indigo-700 rounded-full font-bold text-sm tracking-wide hover:bg-indigo-100 transition-colors flex items-center gap-2">
                    <Edit2 size={16} /> Edit Profile
                </button>
            </div>

            <div className="mb-10 lg:pl-4 border-l-4 border-indigo-500 rounded-l-md">
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight leading-none mb-2 ml-4">
                    {user.name}
                </h1>
                <p className="text-gray-500 font-medium ml-4 uppercase tracking-widest text-sm flex items-center gap-2">
                    {user.role} <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Authorized
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-2.5 bg-white shadow-sm rounded-xl text-indigo-600">
                            <Mail size={20} />
                        </div>
                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Email Address</h3>
                    </div>
                    <p className="text-lg font-bold text-gray-900 mt-2 pl-[3.25rem] truncate">{user.email}</p>
                </div>

                <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-2.5 bg-white shadow-sm rounded-xl text-fuchsia-600">
                            <Shield size={20} />
                        </div>
                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Security Level</h3>
                    </div>
                    <p className="text-lg font-bold text-gray-900 mt-2 pl-[3.25rem] capitalize">{user.role} Clearances</p>
                </div>
            </div>

            <button 
                onClick={handleLogout}
                className="w-full sm:w-auto px-8 py-4 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-3 shadow-sm hover:shadow-xl hover:shadow-red-500/20"
            >
                <LogOut size={20} /> Terminate Session
            </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
