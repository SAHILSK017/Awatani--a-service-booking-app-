import React from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { User, Mail, Shield, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, logout } from '../../services/authService';

const Profile = () => {
  const navigate = useNavigate();
  const user = getCurrentUser() || {};

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your account settings and preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column: Avatar & Quick Snapshot */}
        <div className="md:col-span-1 space-y-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-24 h-24 mx-auto bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-4 border-4 border-white shadow-sm">
                  <User size={40} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">{user.name || 'User'}</h3>
                <p className="text-gray-500 text-sm mb-4">{user.email}</p>
                <Badge variant="indigo" className="capitalize px-4 py-1 text-sm">
                  {user.role || 'Member'}
                </Badge>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Right Column: Settings Form */}
        <div className="md:col-span-2 space-y-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card>
              <div className="px-6 py-4 border-b border-gray-50">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Shield size={18} className="text-indigo-600" /> Account Details
                </h3>
              </div>
              <CardContent className="p-6 space-y-6">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Full Name</label>
                    <Input icon={User} defaultValue={user.name} disabled className="bg-gray-50" />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Email Address</label>
                    <Input icon={Mail} defaultValue={user.email} disabled className="bg-gray-50" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Account Type</label>
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-600 capitalize flex items-center justify-between">
                    <span>{user.role} Account</span>
                    <Badge variant="success">Active</Badge>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-gray-50">
                  <Button variant="secondary" onClick={handleLogout} className="text-red-600 hover:bg-red-50 hover:text-red-700 border-none px-0 shadow-none hover:shadow-none bg-transparent">
                    <LogOut size={16} className="mr-2" /> Sign Out
                  </Button>
                  <Button disabled>Save Changes</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
