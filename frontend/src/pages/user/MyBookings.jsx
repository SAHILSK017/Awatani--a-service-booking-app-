import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Loader from '../../components/Loader.jsx';

import { getMyBookings } from '../../services/bookingService.js';

import { formatPrice, formatDate, getStatusColor } from '../../utils/helpers.js';

import { motion } from 'framer-motion';
import { Clock, MapPin, BookOpen, CheckCircle } from 'lucide-react';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const data = await getMyBookings();
        setBookings(data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const filteredBookings = statusFilter === 'all' ? bookings : bookings.filter(b => b.status === statusFilter);

  if (loading) return <Loader />;

  const statusCounts = bookings.reduce((acc, booking) => {
    acc[booking.status] = (acc[booking.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-3xl shadow-2xl mb-8">
            <CheckCircle className="h-6 w-6" />
            <span className="text-2xl font-bold">My Bookings</span>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Track all your service bookings in one place
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Total', value: bookings.length, color: 'blue', icon: BookOpen },
            { label: 'Pending', value: statusCounts.pending || 0, color: 'yellow', icon: Clock },
            { label: 'Accepted', value: statusCounts.accepted || 0, color: 'blue', icon: MapPin },
            { label: 'Completed', value: statusCounts.completed || 0, color: 'green', icon: CheckCircle }
          ].map(({ label, value, color, icon: Icon }, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              key={label}
              className={`bg-white/70 backdrop-blur rounded-3xl p-8 shadow-xl border border-${color}-100 hover:shadow-2xl transition-all group`}
            >
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-2xl bg-gradient-to-r from-${color}-500 to-${color}-600 shadow-lg group-hover:scale-110 transition-all duration-300`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-gray-900">{value}</p>
                  <p className={`text-sm font-medium capitalize text-${color}-600`}>{label}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Filter */}
        <div className="bg-white/60 backdrop-blur rounded-3xl p-6 shadow-xl mb-8 border border-white/40">
          <div className="flex gap-3 flex-wrap">
            {['all', 'pending', 'accepted', 'completed', 'cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-6 py-3 rounded-2xl font-medium transition-all capitalize ${
                  statusFilter === status
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300 shadow-md hover:shadow-lg'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Bookings List */}
        <div className="space-y-6">
          {filteredBookings.length > 0 ? (
            filteredBookings.map((booking) => (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl hover:shadow-2xl transition-all border border-white/50 overflow-hidden"
                key={booking._id}
              >
                <div className="p-8">
                  <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center">
                    <div className="flex flex-col lg:flex-row gap-6 flex-1">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <BookOpen className="w-10 h-10 text-white" />
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <h3 className="text-2xl font-bold text-gray-900">{booking.service?.name}</h3>
                          <span className={`px-4 py-2 rounded-full text-sm font-bold ${getStatusColor(booking.status)}`}>
                            {booking.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-6 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            {formatDate(booking.createdAt)}
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            {booking.address.slice(0, 50)}...
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 pt-4 lg:pt-0 lg:border-l lg:border-gray-200 lg:pl-8 lg:-ml-8">
                      <div className="text-2xl font-bold text-green-600">
                        {formatPrice(booking.service?.price)}
                      </div>
                      <Link
                        to={`/booking/${booking._id}`}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all whitespace-nowrap"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-24 rounded-3xl bg-white/60 backdrop-blur border border-gray-200"
            >
              <CheckCircle className="mx-auto h-24 w-24 text-gray-400 mb-8" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No bookings yet</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Your bookings will appear here once you book a service
              </p>
              <Link
                to="/user/services"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all"
              >
                Book Your First Service
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyBookings;

