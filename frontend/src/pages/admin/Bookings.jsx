import { useState, useEffect } from 'react';
import Loader from '../../components/Loader.jsx';
import { getAllBookings } from '../../services/adminService.js';
import { formatPrice, formatDate, getStatusColor } from '../../utils/helpers.js';
import { motion } from 'framer-motion';
import { BookOpen, Clock, CheckCircle, XCircle, Eye, MoreVertical } from 'lucide-react';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const data = await getAllBookings();
      setBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = statusFilter === 'all' 
    ? bookings 
    : bookings.filter(booking => booking.status === statusFilter);

  const statusCounts = bookings.reduce((acc, booking) => {
    acc[booking.status] = (acc[booking.status] || 0) + 1;
    return acc;
  }, {});

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-primary-50 to-purple-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-primary-600 to-purple-600 text-white px-8 py-4 rounded-3xl shadow-2xl mb-8 backdrop-blur-sm">
            <BookOpen className="h-7 w-7" />
            <span className="text-2xl font-bold">All Bookings ({bookings.length})</span>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-12">
          {[
            { label: 'All', value: bookings.length, color: 'gray' },
            { label: 'Pending', value: statusCounts.pending || 0, color: 'yellow' },
            { label: 'Accepted', value: statusCounts.accepted || 0, color: 'blue' },
            { label: 'Completed', value: statusCounts.completed || 0, color: 'green' },
            { label: 'Cancelled', value: statusCounts.cancelled || 0, color: 'red' }
          ].map(({ label, value, color }, index) => (
            <motion.button
              key={label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setStatusFilter(label.toLowerCase())}
              className={`group bg-white/70 backdrop-blur rounded-3xl p-6 shadow-xl border-2 transition-all hover:shadow-2xl hover:scale-[1.02] cursor-pointer ${
                statusFilter === label.toLowerCase() 
                  ? `border-${color}-500 bg-${color}-50 ring-4 ring-${color}-200` 
                  : `border-transparent hover:border-${color}-200`
              }`}
            >
              <div className={`w-12 h-12 mx-auto mb-3 rounded-2xl bg-gradient-to-r from-${color}-500 to-${color}-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-all`}>
                {color === 'gray' ? <BookOpen className="h-6 w-6 text-white" /> :
                 color === 'yellow' ? <Clock className="h-6 w-6 text-white" /> :
                 color === 'blue' ? <BookOpen className="h-6 w-6 text-white" /> :
                 color === 'green' ? <CheckCircle className="h-6 w-6 text-white" /> :
                 <XCircle className="h-6 w-6 text-white" />}
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
              <p className={`text-sm font-medium capitalize ${
                statusFilter === label.toLowerCase() 
                  ? `text-${color}-600 font-bold` 
                  : 'text-gray-600'
              }`}>
                {label}
              </p>
            </motion.button>
          ))}
        </div>

        {/* Bookings Table */}
        <div className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-xl overflow-hidden border border-white/50 mb-12">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Service</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Address</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredBookings.map((booking, index) => (
                  <motion.tr
                    key={booking._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{booking.service?.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{booking.user?.name || 'N/A'}</div>
                      <div className="text-sm text-gray-500">{booking.user?.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 truncate max-w-xs" title={booking.address}>
                        {booking.address}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-emerald-600 text-lg">
                        {formatPrice(booking.service?.price)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(booking.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <button className="p-2 hover:bg-blue-100 rounded-lg text-blue-600">
                          <Eye className="h-4 w-4" />
                        </button>
                        <div className="relative">
                          <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-600">
                            <MoreVertical className="h-4 w-4" />
                          </button>
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Cancel</button>
                            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Assign Worker</button>
                            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-t">Refund</button>
                          </div>
                        </div>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredBookings.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-24 rounded-3xl bg-white/60 backdrop-blur border border-gray-200"
          >
            <BookOpen className="mx-auto h-24 w-24 text-gray-400 mb-8" />
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              No {statusFilter} bookings
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              There are no bookings matching this filter. Try another status.
            </p>
            <button
              onClick={() => setStatusFilter('all')}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all inline-flex items-center gap-2"
            >
              View All Bookings
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdminBookings;
