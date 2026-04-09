import React from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { mockData } from '../../data/mockData';
import { Users, Briefcase, Activity, DollarSign, MoreVertical } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
  const { adminStats, users, workers } = mockData;

  const statCards = [
    { title: 'Total Users', value: adminStats.totalUsers, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { title: 'Total Workers', value: adminStats.totalWorkers, icon: Briefcase, color: 'text-purple-600', bg: 'bg-purple-100' },
    { title: 'Active Services', value: adminStats.activeServices, icon: Activity, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Revenue', value: adminStats.totalRevenue, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-100' },
  ];

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
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{user.name}</div>
                      <div className="text-gray-500">{user.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={user.status === 'Active' ? 'success' : 'default'}>{user.role}</Badge>
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
                  <th className="px-6 py-3 font-medium text-center">Jobs</th>
                  <th className="px-6 py-3 font-medium text-center">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {workers.map((worker) => (
                  <tr key={worker.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{worker.name}</div>
                      <div className="text-gray-500">{worker.email}</div>
                    </td>
                    <td className="px-6 py-4 text-center font-medium">{worker.jobsCompleted}</td>
                    <td className="px-6 py-4 text-center">
                      <Badge variant="warning">⭐ {worker.rating}</Badge>
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