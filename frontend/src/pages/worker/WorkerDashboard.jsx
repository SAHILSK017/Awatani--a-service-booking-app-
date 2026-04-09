import { useState, useEffect } from 'react';
import Loader from '../../components/Loader.jsx';
import { getWorkerBookings } from '../../services/bookingService.js';
import { formatPrice, getStatusColor } from '../../utils/helpers.js';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Clock,
  CheckCircle,
  DollarSign,
  TrendingUp,
  MapPin,
  Star,
} from 'lucide-react';

const WorkerDashboard = () => {
  const [stats, setStats] = useState({
    pending: 0,
    accepted: 0,
    completed: 0,
    revenue: 0,
    rating: 4.8,
  });

  const [loading, setLoading] = useState(true);
  const [recentBookings, setRecentBookings] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const bookings = await getWorkerBookings(); // 🔥 FIXED

      console.log("WORKER BOOKINGS:", bookings);

      const pending = bookings.filter(b => b.status === 'pending').length;
      const accepted = bookings.filter(b => b.status === 'accepted').length;
      const completed = bookings.filter(b => b.status === 'completed').length;

      const revenue = bookings.reduce(
        (sum, b) =>
          b.status === 'completed'
            ? sum + (b.service?.price || 0)
            : sum,
        0
      );

      setStats({
        pending,
        accepted,
        completed,
        revenue,
        rating: 4.8,
      });

      setRecentBookings(bookings.slice(0, 5));
    } catch (error) {
      console.error('Error fetching worker data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 py-12">
      <div className="max-w-7xl mx-auto px-4">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl font-bold">Worker Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Manage your bookings and earnings
          </p>
        </motion.div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard title="Pending" value={stats.pending} icon={Clock} />
          <StatCard title="Accepted" value={stats.accepted} icon={BookOpen} />
          <StatCard title="Completed" value={stats.completed} icon={CheckCircle} />
        </div>

        {/* EXTRA STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <StatCard title="Total Earnings" value={formatPrice(stats.revenue)} icon={DollarSign} />
          <StatCard title="Rating" value={stats.rating} icon={Star} />
        </div>

        {/* RECENT BOOKINGS */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-4">Recent Bookings</h2>

          {recentBookings.length === 0 ? (
            <p>No bookings yet</p>
          ) : (
            recentBookings.map((booking) => (
              <div
                key={booking._id}
                className="border p-4 mb-4 rounded"
              >
                <h3 className="font-semibold">
                  {booking.service?.name}
                </h3>

                <p>{booking.user?.name}</p>

                <p className="flex items-center gap-2 text-sm">
                  <MapPin size={14} />
                  {booking.address}
                </p>

                <p className="text-green-600 font-bold">
                  {formatPrice(booking.service?.price)}
                </p>

                <span
                  className={`px-2 py-1 text-sm rounded ${getStatusColor(
                    booking.status
                  )}`}
                >
                  {booking.status}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// 🔥 REUSABLE STAT CARD
const StatCard = ({ title, value, icon: Icon }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow text-center">
      <Icon className="mx-auto mb-2 text-emerald-600" size={28} />
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-gray-600">{title}</p>
    </div>
  );
};

export default WorkerDashboard;