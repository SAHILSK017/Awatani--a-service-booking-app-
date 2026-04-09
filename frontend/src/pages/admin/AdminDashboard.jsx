import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Users, Briefcase, Activity, IndianRupee, MoreVertical, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { getAllUsers, getAllBookings, getAllServices } from '../../services/adminService';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalWorkers: 0, totalRevenue: 0, activeServices: 0 });
  const [usersList, setUsersList] = useState([]);
  const [workersList, setWorkersList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersData, bookingsData, servicesData] = await Promise.all([
          getAllUsers(),
          getAllBookings(),
          getAllServices()
        ]);
        
        let revenue = 0;
        bookingsData.forEach(b => {
          if (b.status === 'completed') {
            revenue += b.service?.price || 0;
          }
        });

        const registeredUsers = usersData.filter(u => u.role === 'user');
        const registeredWorkers = usersData.filter(u => u.role === 'worker');

        setStats({
          totalUsers: registeredUsers.length,
          totalWorkers: registeredWorkers.length,
          totalRevenue: revenue,
          activeServices: servicesData.length
        });
        
        setUsersList(registeredUsers.slice(0, 5)); // First 5 for preview table
        
        // Calculate jobs completed per worker for the top workers table
        const workerStatsMap = {};
        registeredWorkers.forEach(w => workerStatsMap[w._id] = { ...w, jobsCompleted: 0 });
        bookingsData.forEach(b => {
          if (b.status === 'completed' && b.worker && workerStatsMap[b.worker._id]) {
            workerStatsMap[b.worker._id].jobsCompleted += 1;
          }
        });
        
        const sortedWorkers = Object.values(workerStatsMap).sort((a, b) => b.jobsCompleted - a.jobsCompleted);
        setWorkersList(sortedWorkers.slice(0, 5));

      } catch (err) {
        console.error("Failed to load admin dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statCards = [
    { title: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { title: 'Total Workers', value: stats.totalWorkers, icon: Briefcase, color: 'text-purple-600', bg: 'bg-purple-100' },
    { title: 'Active Services', value: stats.activeServices, icon: Activity, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Revenue', value: `₹${stats.totalRevenue}`, icon: IndianRupee, color: 'text-green-600', bg: 'bg-green-100' },
  ];

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-indigo-600 h-8 w-8" /></div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Overview</h1>
        <p className="text-gray-500 text-sm mt-1">Platform monitor and management dashboard.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <motion.div key={idx} whileHover={{ y: -4 }}>
            <Card>
              <CardContent className="flex items-center p-6">
                <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} mr-4`}>
                  <stat.icon size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Users Table */}
        <Card className="overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-gray-50 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Recent Users</h3>
            <Button variant="ghost" size="sm">View All</Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                <tr>
                  <th className="px-6 py-3 font-medium">Name</th>
                  <th className="px-6 py-3 font-medium">Role</th>
                  <th className="px-6 py-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {usersList.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{user.name}</div>
                      <div className="text-gray-500">{user.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="success" className="capitalize">{user.role}</Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-gray-400 hover:text-gray-600"><MoreVertical size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Workers Table */}
        <Card className="overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-gray-50 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Top Workers</h3>
            <Button variant="ghost" size="sm">View All</Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                <tr>
                  <th className="px-6 py-3 font-medium">Worker</th>
                  <th className="px-6 py-3 font-medium text-center">Jobs Completed</th>
                  <th className="px-6 py-3 font-medium text-center">Account</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {workersList.map((worker) => (
                  <tr key={worker._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{worker.name}</div>
                      <div className="text-gray-500">{worker.email}</div>
                    </td>
                    <td className="px-6 py-4 text-center font-medium">{worker.jobsCompleted}</td>
                    <td className="px-6 py-4 text-center">
                      <Badge variant="indigo">Active</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;