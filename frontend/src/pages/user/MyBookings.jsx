import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Loader from '../../components/Loader.jsx';
import { getMyBookings, deleteBooking } from '../../services/bookingService.js';
import { formatPrice, formatDate, getStatusColor } from '../../utils/helpers.js';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, MapPin, BookOpen, CheckCircle, ArrowRight, XCircle, CheckCircle2, AlertCircle, ShieldAlert, BadgeInfo, Zap, Loader2 } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  // Deletion Modal and Loading States
  const [deleteConfirmBooking, setDeleteConfirmBooking] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  // Premium Toast Notification State
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
  };

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const data = await getMyBookings();
      setBookings(data || []);
    } catch (error) { 
      console.error(error); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (id) => {
    setCancelLoading(true);
    try {
      await deleteBooking(id);
      setDeleteConfirmBooking(null);
      showToast('Booking successfully cancelled!', 'success');
      // Refresh list
      const data = await getMyBookings();
      setBookings(data || []);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to cancel booking', 'error');
    } finally {
      setCancelLoading(false);
    }
  };

  const filteredBookings = statusFilter === 'all' ? bookings : bookings.filter(b => b.status === statusFilter);
  const statusCounts = bookings.reduce((acc, booking) => { acc[booking.status] = (acc[booking.status] || 0) + 1; return acc; }, {});

  const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } } };

  if (loading && bookings.length === 0) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans text-gray-900">
      
      {/* Floating Premium Toast Notification */}
      {toast.show && (
        <div className={`fixed top-6 right-6 z-[9999] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border backdrop-blur-xl transition-all duration-500 animate-fade-in ${
          toast.type === 'success' 
            ? 'bg-emerald-50/95 border-emerald-200 text-emerald-800' 
            : 'bg-rose-50/95 border-rose-200 text-rose-800'
        }`}>
          <div className={`h-8 w-8 rounded-xl flex items-center justify-center shrink-0 shadow-inner ${
            toast.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
          }`}>
            {toast.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          </div>
          <span className="font-bold text-sm tracking-wide">{toast.message}</span>
        </div>
      )}

      {/* Massive Hero Image Section */}
      <div className="relative h-96 w-full bg-slate-900 overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0">
          <img src="/customer_hero.png" alt="Premium Header" className="w-full h-full object-cover opacity-50 mix-blend-overlay filter blur-[2px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-transparent to-purple-900/60" />
        </div>
        
        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 lg:px-8 text-center pt-10">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-4 drop-shadow-lg">
              My Bookings
            </h1>
            <p className="text-xl text-purple-100 font-medium max-w-2xl mx-auto shadow-sm">
              Track and manage all your service requests in real time.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-8 relative z-20 -mt-16">

        {/* Cinematic Stats Grid */}
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Total Bookings', value: bookings.length, color: 'text-indigo-600', bg: 'bg-indigo-100', icon: BookOpen },
            { label: 'Pending', value: statusCounts.pending || 0, color: 'text-amber-600', bg: 'bg-amber-100', icon: Clock },
            { label: 'Accepted', value: statusCounts.accepted || 0, color: 'text-blue-600', bg: 'bg-blue-100', icon: MapPin },
            { label: 'Completed', value: statusCounts.completed || 0, color: 'text-emerald-600', bg: 'bg-emerald-100', icon: CheckCircle }
          ].map(({ label, value, color, bg, icon: Icon }) => (
            <motion.div key={label} variants={itemVariants} className="bg-white/90 backdrop-blur-xl rounded-[2rem] p-6 shadow-xl border border-white/50 hover:shadow-2xl transition-all group flex items-center justify-between">
                <div>
                  <p className="text-3xl font-extrabold text-gray-900">{value}</p>
                  <p className={`text-xs font-bold uppercase tracking-widest mt-1 ${color}`}>{label}</p>
                </div>
                <div className={`p-4 rounded-full ${bg} ${color} shadow-inner group-hover:scale-110 transition-transform`}>
                  <Icon className="h-6 w-6" />
                </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Premium Pill Filters */}
        <div className="flex justify-center mb-10">
          <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} className="inline-flex bg-white/80 backdrop-blur-md p-2 rounded-full border border-gray-200 shadow-lg overflow-x-auto max-w-full">
            {['all', 'pending', 'accepted', 'completed', 'cancelled'].map((status) => (
              <button key={status} onClick={() => setStatusFilter(status)}
                className={`px-6 py-2.5 rounded-full text-sm font-bold capitalize transition-all whitespace-nowrap ${
                  statusFilter === status ? 'bg-gray-900 text-white shadow-md' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                }`}>
                {status}
              </button>
            ))}
          </motion.div>
        </div>

        {/* Deep List Bookings */}
        <motion.div layout className="space-y-6">
          <AnimatePresence>
            {filteredBookings.length > 0 ? (
              filteredBookings.map((booking) => {
                // Calculate actual display price based on urgency levels and discounts
                const basePrice = booking.service?.price || 0;
                const urgencyFee = booking.urgency === 'priority' ? 99 : booking.urgency === 'express' ? 199 : 0;
                const discount = booking.discountCode === 'WELCOME10' ? Math.round(basePrice * 0.1) : booking.discountCode === 'SAVINGS50' ? 50 : 0;
                const computedTotal = Math.max(0, basePrice + urgencyFee - discount);

                return (
                  <motion.div layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-[2rem] shadow-lg hover:shadow-xl transition-all border border-gray-100 overflow-hidden relative group" key={booking._id}>
                    
                    {/* Left Color Bar based on status */}
                    <div className={`absolute left-0 top-0 bottom-0 w-2 ${booking.status === 'completed' ? 'bg-emerald-500' : booking.status === 'pending' ? 'bg-amber-400' : booking.status === 'cancelled' ? 'bg-red-500' : 'bg-blue-500'}`} />
                    
                    <div className="p-6 md:p-8 ml-2 flex flex-col lg:flex-row gap-6 md:gap-8 items-start lg:items-center">
                      <div className="flex-1 flex flex-col md:flex-row gap-6">
                          <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 shadow-inner shrink-0 group-hover:bg-indigo-50 transition-colors">
                              <BookOpen className="w-8 h-8 text-indigo-500" />
                          </div>
                          <div>
                              <div className="flex flex-wrap items-center gap-3 mb-2">
                                  <h3 className="text-xl md:text-2xl font-extrabold text-gray-900">{booking.service?.name || 'Service Record'}</h3>
                                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-current ${getStatusColor(booking.status)}`}>{booking.status}</span>
                                  
                                  {/* Dynamic Badges displaying new parameters */}
                                  {booking.urgency && booking.urgency !== 'standard' && (
                                    <Badge variant="indigo" className="bg-amber-50 text-amber-700 hover:bg-amber-100 text-[10px] font-bold py-0.5 border border-amber-200">
                                      ⚡ {booking.urgency.toUpperCase()}
                                    </Badge>
                                  )}
                                  {booking.paymentMethod && (
                                    <Badge variant="indigo" className="bg-slate-50 text-slate-700 hover:bg-slate-100 text-[10px] font-bold py-0.5 border border-slate-200">
                                      💳 {booking.paymentMethod.toUpperCase()}
                                    </Badge>
                                  )}
                              </div>
                              <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-gray-500">
                                  <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100"><Clock size={16} className="text-indigo-400"/> {formatDate(booking.createdAt)}</span>
                                  <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100"><MapPin size={16} className="text-indigo-400"/> {booking.address}</span>
                              </div>
                              {booking.notes && (
                                <p className="text-xs font-semibold text-indigo-900 bg-indigo-50/50 border border-indigo-50 px-3 py-2 rounded-xl mt-3 max-w-xl italic">
                                  Note: {booking.notes}
                                </p>
                              )}
                          </div>
                      </div>
                      
                      <div className="flex items-center justify-between lg:justify-end w-full lg:w-auto gap-6 lg:border-l lg:border-gray-100 lg:pl-8 pt-4 lg:pt-0 border-t border-gray-100 lg:border-t-0 mt-2 lg:mt-0">
                          <div>
                              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Total Price</p>
                              <p className="text-2xl font-black text-indigo-600 font-mono">{formatPrice(computedTotal)}</p>
                          </div>
                          
                          <div className="flex items-center gap-3">
                              {booking.status === 'pending' && (
                                  <button
                                      onClick={() => setDeleteConfirmBooking(booking)}
                                      className="bg-red-50 hover:bg-red-500 text-red-500 hover:text-white px-5 py-4 rounded-2xl transition-all duration-300 font-bold text-sm shrink-0 border border-red-100 shadow-sm transform active:scale-95"
                                      title="Cancel Booking"
                                  >
                                      Cancel
                                  </button>
                              )}
                              <Link to={`/booking/${booking._id}`} className="bg-gray-900 hover:bg-indigo-600 hover:-translate-y-1 transition-all text-white p-4 rounded-2xl shadow-lg hover:shadow-indigo-500/25">
                                  <ArrowRight size={20} />
                              </Link>
                          </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <motion.div initial={{opacity:0}} animate={{opacity:1}} className="text-center py-32 rounded-[3rem] bg-white border border-gray-100 shadow-sm">
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle className="text-gray-300 w-10 h-10" /></div>
                <h3 className="text-2xl font-extrabold text-gray-900 mb-2">No bookings found</h3>
                <p className="text-gray-500 mb-8 font-medium">Book a service to get started!</p>
                <Link to="/user/services" className="inline-block bg-gray-900 hover:bg-indigo-600 text-white px-8 py-3 rounded-full font-bold shadow-xl transition-all hover:-translate-y-1">
                  Book a Service
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* CANCEL BOOKING WARNING MODAL */}
      {deleteConfirmBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 p-8 space-y-6 transform transition-all duration-300">
            <div className="h-16 w-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center text-2xl mx-auto shadow-inner">
              <ShieldAlert size={28} />
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-black text-gray-900">Cancel Booking</h3>
              <p className="text-gray-500 mt-2">
                Are you sure you want to cancel your booking for <strong className="text-gray-900 font-bold">{deleteConfirmBooking.service?.name}</strong>? This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-4 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmBooking(null)}
                className="w-1/2 py-4 border border-gray-200 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 transition-colors shadow-sm"
              >
                Keep Booking
              </button>
              <button
                onClick={() => handleCancelBooking(deleteConfirmBooking._id)}
                disabled={cancelLoading}
                className="w-1/2 py-4 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-bold shadow-lg shadow-red-500/20 flex items-center justify-center transition-all duration-300"
              >
                {cancelLoading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Yes, Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default MyBookings;
