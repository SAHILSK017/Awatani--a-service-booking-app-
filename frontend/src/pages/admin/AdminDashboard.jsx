import { useState, useEffect } from 'react';
import Loader from '../../components/Loader.jsx';
import { getAllUsers, getAllBookings, getAllServices } from '../../services/adminService.js';
import { formatPrice } from '../../utils/helpers.js';
import StatCard from '../../components/dashboard/StatCard.jsx';
import DataTable from '../../components/dashboard/DataTable.jsx';
import { Users, BookOpen, Package, DollarSign, Clock, TrendingUp, Users2, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { Users, BookOpen, Package, DollarSign, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom'; // ✅ FIXED

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBookings: 0,
    totalServices: 0,
    totalRevenue: 0,
    pendingBookings: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // ✅ added

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const [usersRes, bookingsRes, servicesRes] = await Promise.all([
          getAllUsers(),
          getAllBookings(),
          getAllServices()
        ]);

        const pending = bookingsRes.filter(b => b.status === 'pending').length;
        const revenue = bookingsRes.reduce((sum, booking) => {
          return booking.status === 'completed'
            ? sum + (booking.service?.price || 0)
            : sum;
        }, 0);

        setStats({
          totalUsers: usersRes.length,
          totalBookings: bookingsRes.length,
          totalServices: servicesRes.length,
          totalRevenue: revenue,
          pendingBookings: pending
        });
        setRecentBookings(bookingsRes.slice(0, 5));

      } catch (err) {
        console.error('Error fetching admin stats:', err);
        setError('Failed to load admin data'); // ✅ show error
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500 text-xl">
        {error}
      </div>
    );
  }

  const statsData = [
    {
      title: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      subtitle: 'All registered users',
      growth: '+12% from last month',
      icon: Users,
      tone: 'primary'
    },
    {
      title: 'Total Bookings',
      value: stats.totalBookings.toLocaleString(),
      subtitle: 'All service bookings',
      growth: '+8%',
      icon: BookOpen,
      tone: 'emerald'
    },
    {
      title: 'Active Services',
      value: stats.totalServices.toLocaleString(),
      subtitle: 'Available services',
      growth: '+5%',
      icon: Package,
      tone: 'amber'
    },
    {
      title: 'Total Revenue',
      value: formatPrice(stats.totalRevenue),
      subtitle: 'Completed bookings',
      growth: '+23%',
      icon: DollarSign,
      tone: 'primary'
    },
    {
      title: 'Pending Bookings',
      value: stats.pendingBookings.toLocaleString(),
      subtitle: 'Needs attention',
      growth: '+15%',
      icon: Clock,
      tone: 'rose'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-3xl shadow-2xl mb-8">
            <TrendingUp className="h-7 w-7" />
            <span className="text-2xl font-bold">Admin Dashboard</span>
          </div>
          <p className="text-xl text-gray-600">
            Complete overview of your platform
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5 gap-6 mb-12">
          {statsData.map((stat, index) => (
            <StatCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              subtitle={stat.subtitle}
              growth={stat.growth}
              icon={stat.icon}
              tone={stat.tone}
            />
          ))}
        </div>

        {/* Recent Bookings Table */}
        <DataTable
          title="Recent Bookings"
          description="Latest activity across your platform"
          columns={[
            { key: 'customer', label: 'Customer' },
            { key: 'service', label: 'Service' },
            { key: 'status', label: 'Status' },
            { key: 'price', label: 'Price' },
            { key: 'date', label: 'Date' }
          ]}
          rows={recentBookings.map(b => ({
            customer: b.user?.name || 'N/A',
            service: b.service?.name || 'N/A',
            status: b.status,
            price: formatPrice(b.service?.price || 0),
            date: new Date(b.createdAt).toLocaleDateString()
          }))}
        />

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Link 
            to="/admin/users" 
            className="group relative rounded-3xl bg-gradient-to-r from-primary-500 to-purple-600 p-8 text-white shadow-2xl hover:shadow-3xl transition-all hover:-translate-y-2 flex flex-col items-center text-center"
          >
            <motion.div 
              className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition"
            >
              <Users className="h-8 w-8" />
            </motion.div>
            <h3 className="text-xl font-bold mb-2">Manage Users</h3>
            <p className="text-primary-100 text-sm opacity-90">View &amp; edit user profiles</p>
          </Link>

          <Link 
            to="/admin/services" 
            className="group relative rounded-3xl bg-gradient-to-r from-emerald-500 to-teal-600 p-8 text-white shadow-2xl hover:shadow-3xl transition-all hover:-translate-y-2 flex flex-col items-center text-center"
          >
            <motion.div 
              className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition"
            >
              <Package className="h-8 w-8" />
            </motion.div>
            <h3 className="text-xl font-bold mb-2">Manage Services</h3>
            <p className="text-emerald-100 text-sm opacity-90">Add &amp; categorize services</p>
          </Link>

          <Link 
            to="/admin/bookings" 
            className="group relative rounded-3xl bg-gradient-to-r from-amber-500 to-orange-600 p-8 text-white shadow-2xl hover:shadow-3xl transition-all hover:-translate-y-2 flex flex-col items-center text-center"
          >
            <motion.div 
              className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition"
            >
              <BookOpen className="h-8 w-8" />
            </motion.div>
            <h3 className="text-xl font-bold mb-2">All Bookings</h3>
            <p className="text-amber-100 text-sm opacity-90">Review pending &amp; completed</p>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;