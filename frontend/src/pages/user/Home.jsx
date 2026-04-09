import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { CalendarCheck, Briefcase, Clock, Plus, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { getMyBookings } from '../../services/bookingService';
import { getServices } from '../../services/categoryService';

const Home = () => {
  const [stats, setStats] = useState({ totalBookings: 0, activeServices: 0, pendingRequests: 0 });
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookingsData, servicesData] = await Promise.all([
          getMyBookings(),
          getServices()
        ]);
        
        let active = 0, pending = 0;
        bookingsData.forEach(b => {
          if (b.status === 'accepted') active++;
          if (b.status === 'pending') pending++;
        });

        setStats({
          totalBookings: bookingsData.length,
          activeServices: active,
          pendingRequests: pending
        });
        
        setServices(servicesData);
      } catch (err) {
        console.error("Failed to load user dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statCards = [
    { title: 'Total Bookings', value: stats.totalBookings, icon: CalendarCheck, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { title: 'Active Services', value: stats.activeServices, icon: Briefcase, color: 'text-green-600', bg: 'bg-green-100' },
    { title: 'Pending Requests', value: stats.pendingRequests, icon: Clock, color: 'text-orange-600', bg: 'bg-orange-100' },
  ];

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-indigo-600 h-8 w-8" /></div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back!</h1>
          <p className="text-gray-500 text-sm mt-1">Here is what's happening with your services today.</p>
        </div>
        <Button className="flex items-center gap-2" onClick={() => navigate('/user/services')}>
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
          <h2 className="text-lg font-semibold text-gray-900">Available Platform Services</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <motion.div key={service._id} whileHover={{ y: -4 }}>
              <Card className="h-full flex flex-col">
                <div className="h-32 bg-gray-100 flex items-center justify-center text-4xl">
                  {service.category?.icon}
                </div>
                <CardContent className="flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="indigo">
                      {service.category?.name || 'Category'}
                    </Badge>
                    <span className="font-semibold text-indigo-600">₹{service.price}</span>
                  </div>
                  <h3 className="text-gray-900 font-medium mb-1">{service.name}</h3>
                  <div className="mt-auto pt-4">
                    <Button variant="secondary" className="w-full" onClick={() => navigate('/user/booking', { state: { service } })}>Book Now</Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
          {services.length === 0 && <p className="text-gray-500 text-sm">No services found.</p>}
        </div>
      </div>
    </div>
  );
};

export default Home;
