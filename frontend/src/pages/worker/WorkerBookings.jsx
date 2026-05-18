import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '../../components/ui/Badge';
import { BookOpen, Clock, MapPin, CheckCircle, Loader2, Search, User, CalendarDays, IndianRupee, ChevronDown, ChevronUp, X, Phone, Zap, ArrowRight } from 'lucide-react';
import { getWorkerBookings, completeBooking } from '../../services/bookingService.js';
import { formatPrice, formatDate, getStatusColor } from '../../utils/helpers.js';
import { useNavigate } from 'react-router-dom';

const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
};

const WorkerBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('all');
    const [updatingId, setUpdatingId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedId, setExpandedId] = useState(null);
    const [toast, setToast] = useState(null);
    const [confirmAction, setConfirmAction] = useState(null);
    const navigate = useNavigate();

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const data = await getWorkerBookings();
            const myJobs = data.filter(job => job.status !== 'pending');
            setBookings(myJobs);
        } catch (error) { console.error('Error fetching worker bookings:', error); } finally { setLoading(false); }
    };

    useEffect(() => { fetchBookings(); }, []);

    const handleComplete = async (id) => {
        setConfirmAction(null);
        setUpdatingId(id);
        try {
            await completeBooking(id);
            showToast('✅ Job completed! Your earnings have been updated.');
            fetchBookings();
        } catch (error) {
            showToast('❌ Could not complete job. Please try again.', 'error');
        } finally { setUpdatingId(null); }
    };

    // Filtering
    const filteredBookings = bookings.filter(b => {
        const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
        const matchesSearch = !searchQuery || 
            b.service?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            b.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            b.user?.name?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const statusCounts = bookings.reduce((acc, booking) => { acc[booking.status] = (acc[booking.status] || 0) + 1; return acc; }, {});
    const totalEarnings = bookings.filter(b => b.status === 'completed').reduce((sum, b) => sum + (b.service?.price || 0), 0);

    if (loading) return <div className="flex justify-center items-center h-screen bg-gray-50"><Loader2 className="animate-spin text-indigo-600 h-10 w-10" /></div>;

    const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
    const itemVariants = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0, transition: { type: 'spring', damping: 20 } } };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Toast */}
            <AnimatePresence>
                {toast && (
                    <motion.div 
                        initial={{ opacity: 0, y: -50, x: '-50%' }} 
                        animate={{ opacity: 1, y: 0, x: '-50%' }} 
                        exit={{ opacity: 0, y: -50, x: '-50%' }}
                        className={`fixed top-6 left-1/2 z-50 px-6 py-3 rounded-2xl shadow-2xl font-semibold text-sm flex items-center gap-2 ${
                            toast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
                        }`}
                    >
                        {toast.message}
                        <button onClick={() => setToast(null)} className="ml-2 hover:opacity-70"><X size={14} /></button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Confirmation Modal */}
            <AnimatePresence>
                {confirmAction && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
                        onClick={() => setConfirmAction(null)}
                    >
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="text-emerald-600 w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-center text-gray-900 mb-2">Mark as Completed?</h3>
                            <p className="text-center text-gray-500 text-sm mb-6">
                                This will mark the job as finished. The customer will be notified and your earnings will be updated.
                            </p>
                            <div className="flex gap-3">
                                <button onClick={() => setConfirmAction(null)} className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition-colors">
                                    Cancel
                                </button>
                                <button 
                                    onClick={() => handleComplete(confirmAction.id)}
                                    className="flex-1 py-3 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors shadow-lg"
                                >
                                    Yes, Complete
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 rounded-b-[2.5rem] overflow-hidden mb-8 relative">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
                </div>
                <div className="relative z-10 px-6 py-10 max-w-6xl mx-auto">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-2">My Jobs</h1>
                        <p className="text-indigo-200 font-medium">Track all your assigned and completed service jobs</p>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 lg:px-8">

                {/* Summary Cards */}
                <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: 'Total Jobs', value: bookings.length, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100', icon: BookOpen },
                        { label: 'Active', value: statusCounts.accepted || 0, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', icon: Clock },
                        { label: 'Completed', value: statusCounts.completed || 0, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', icon: CheckCircle },
                        { label: 'Earned', value: `₹${totalEarnings.toLocaleString('en-IN')}`, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', icon: IndianRupee },
                    ].map(({ label, value, color, bg, border, icon: Icon }) => (
                        <motion.div key={label} variants={itemVariants} className={`bg-white ${border} border p-5 rounded-2xl shadow-sm`}>
                            <div className={`p-2 rounded-lg ${bg} ${color} w-fit mb-3`}><Icon size={18} /></div>
                            <p className="text-2xl font-extrabold text-gray-900">{value}</p>
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-1">{label}</p>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Search + Filter */}
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    <div className="relative flex-1">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Search jobs by service, address, or customer..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all"
                        />
                    </div>
                    <div className="flex bg-white border border-gray-200 rounded-xl p-1 overflow-x-auto">
                        {['all', 'accepted', 'completed', 'cancelled'].map((status) => (
                            <button key={status} onClick={() => setStatusFilter(status)}
                                className={`px-4 py-2 rounded-lg text-xs font-bold capitalize transition-all whitespace-nowrap ${
                                    statusFilter === status ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                                }`}>
                                {status === 'all' ? `All (${bookings.length})` : `${status} (${statusCounts[status] || 0})`}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Jobs List */}
                <motion.div layout className="space-y-3">
                    <AnimatePresence>
                        {filteredBookings.length > 0 ? (
                            filteredBookings.map((booking) => (
                                <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97 }}
                                    className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-100 overflow-hidden" key={booking._id}
                                >
                                    {/* Job Row */}
                                    <div 
                                        className="p-5 flex items-center gap-4 cursor-pointer"
                                        onClick={() => setExpandedId(expandedId === booking._id ? null : booking._id)}
                                    >
                                        {/* Status Dot */}
                                        <div className={`w-2 h-10 rounded-full shrink-0 ${
                                            booking.status === 'completed' ? 'bg-emerald-500' : 
                                            booking.status === 'accepted' ? 'bg-blue-500' : 
                                            booking.status === 'cancelled' ? 'bg-red-400' : 'bg-amber-400'
                                        }`} />
                                        
                                        <div className="w-11 h-11 bg-gray-50 rounded-xl flex items-center justify-center text-xl border border-gray-100 shrink-0">
                                            {booking.service?.category?.icon || '🔧'}
                                        </div>
                                        
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-bold text-gray-900 truncate">{booking.service?.name || 'Service'}</h3>
                                                {booking.urgency && booking.urgency !== 'standard' && (
                                                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                                                        booking.urgency === 'express' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                                                    }`}>
                                                        <Zap size={10} className="inline mr-0.5" />{booking.urgency}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-3 text-xs text-gray-400">
                                                <span className="flex items-center gap-1"><MapPin size={12} /> {booking.address?.substring(0, 25)}{booking.address?.length > 25 ? '...' : ''}</span>
                                                <span>{timeAgo(booking.createdAt)}</span>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-4 shrink-0">
                                            <div className="text-right hidden sm:block">
                                                <p className="font-bold text-gray-900">{formatPrice(booking.service?.price)}</p>
                                                <p className="text-xs text-gray-400 capitalize">{booking.paymentMethod || 'Cash'}</p>
                                            </div>
                                            <Badge variant={booking.status === 'completed' ? 'success' : booking.status === 'accepted' ? 'indigo' : 'warning'} 
                                                className="text-[10px] font-bold uppercase tracking-wider">
                                                {booking.status}
                                            </Badge>
                                            {booking.status === 'accepted' && (
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); setConfirmAction({ id: booking._id }); }}
                                                    disabled={updatingId === booking._id}
                                                    className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-sm transition-all hover:-translate-y-0.5 flex items-center gap-1"
                                                >
                                                    {updatingId === booking._id ? <Loader2 size={14} className="animate-spin" /> : <><CheckCircle size={14} /> Done</>}
                                                </button>
                                            )}
                                            {expandedId === booking._id ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                                        </div>
                                    </div>
                                    
                                    {/* Expanded Details */}
                                    <AnimatePresence>
                                        {expandedId === booking._id && (
                                            <motion.div 
                                                initial={{ height: 0, opacity: 0 }} 
                                                animate={{ height: 'auto', opacity: 1 }} 
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="px-5 pb-5 pt-2 border-t border-gray-50">
                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                                        <div>
                                                            <p className="text-gray-400 text-xs font-semibold mb-1">Customer</p>
                                                            <p className="font-semibold text-gray-700 flex items-center gap-1"><User size={14} /> {booking.user?.name || 'N/A'}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-gray-400 text-xs font-semibold mb-1">Booking Date</p>
                                                            <p className="font-semibold text-gray-700 flex items-center gap-1"><CalendarDays size={14} /> {formatDate(booking.bookingDate || booking.createdAt)}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-gray-400 text-xs font-semibold mb-1">Payment Method</p>
                                                            <p className="font-semibold text-gray-700 capitalize">{booking.paymentMethod || 'Cash'}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-gray-400 text-xs font-semibold mb-1">Amount</p>
                                                            <p className="font-bold text-emerald-600 text-lg">{formatPrice(booking.service?.price)}</p>
                                                        </div>
                                                    </div>
                                                    <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                                                        <MapPin size={14} className="text-gray-400 shrink-0" />
                                                        <span className="font-medium">{booking.address}</span>
                                                    </div>
                                                    {booking.notes && (
                                                        <div className="mt-3 p-3 bg-amber-50 border border-amber-100 rounded-xl text-sm text-amber-800">
                                                            <span className="font-bold">Customer Note:</span> {booking.notes}
                                                        </div>
                                                    )}
                                                    <div className="mt-3 flex justify-end">
                                                        <button 
                                                            onClick={(e) => { e.stopPropagation(); navigate(`/booking/${booking._id}`); }}
                                                            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 px-4 py-2 rounded-xl transition-all flex items-center gap-1"
                                                        >
                                                            View Full Details <ArrowRight size={14} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            ))
                        ) : (
                            <motion.div key="empty-state" initial={{opacity:0}} animate={{opacity:1}} className="text-center py-20 rounded-2xl bg-white border border-gray-100 shadow-sm">
                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle className="text-gray-300 w-8 h-8" /></div>
                                <h3 className="text-lg font-bold text-gray-900 mb-1">
                                    {searchQuery ? 'No matching jobs' : 'No jobs yet'}
                                </h3>
                                <p className="text-gray-400 text-sm">
                                    {searchQuery ? 'Try different search terms or clear filters.' : 'Jobs you accept will show up here.'}
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
};

export default WorkerBookings;