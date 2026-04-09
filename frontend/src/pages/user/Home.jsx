import React from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { mockData } from '../../data/mockData';
import { CalendarCheck, Briefcase, Clock, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
  const { userStats, services } = mockData;

  const statCards = [
    { title: 'Total Bookings', value: userStats.totalBookings, icon: CalendarCheck, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { title: 'Active Services', value: userStats.activeServices, icon: Briefcase, color: 'text-green-600', bg: 'bg-green-100' },
    { title: 'Pending Requests', value: userStats.pendingRequests, icon: Clock, color: 'text-orange-600', bg: 'bg-orange-100' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back!</h1>
          <p className="text-gray-500 text-sm mt-1">Here is what's happening with your services today.</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus size={18} /> Book a Service
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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

      {/* Recommended Services Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recommended Services</h2>
          <Button variant="ghost" size="sm">View All</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <motion.div key={service.id} whileHover={{ y: -4 }}>
              <Card className="h-full flex flex-col">
                <div className="h-32 bg-gradient-to-br from-indigo-100 to-purple-50"></div>
                <CardContent className="flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant={service.status === 'Active' ? 'success' : 'warning'}>
                      {service.category}
                    </Badge>
                    <span className="font-semibold text-indigo-600">{service.price}</span>
                  </div>
                  <h3 className="text-gray-900 font-medium mb-1">{service.title}</h3>
                  <div className="mt-auto pt-4">
                    <Button variant="secondary" className="w-full">View Details</Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
