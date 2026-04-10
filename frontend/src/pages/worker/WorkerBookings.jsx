import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '../../components/ui/Badge';
import { BookOpen, Clock, MapPin, CheckCircle, ChevronRight, Loader2, ArrowRight } from 'lucide-react';
import { getWorkerBookings, acceptBooking, completeBooking } from '../../services/bookingService.js';
import { formatPrice, formatDate, getStatusColor } from '../../utils/helpers.js';

const WorkerBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('all');
    const [updatingId, setUpdatingId] = useState(null);

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const data = await getWorkerBookings();
            const currentUser = JSON.parse(localStorage.getItem('user'));
            // Ensure this list focuses dynamically on jobs belonging to this worker specifically
            const myJobs = data.filter(job => job.worker?._id === currentUser.id || job.status === 'pending');
            setBookings(myJobs);
        } catch (error) { console.error('Error fetching worker bookings:', error); } finally { setLoading(false); }
    };

    useEffect(() => { fetchBookings(); }, []);

    const handleAccept = async (id) => { setUpdatingId(id); try { await acceptBooking(id); fetchBookings(); } catch (error) {} finally { setUpdatingId(null); } };
    const handleComplete = async (id) => { setUpdatingId(id); try { await completeBooking(id); fetchBookings(); } catch (error) {} finally { setUpdatingId(null); } };

    const filteredBookings = statusFilter === 'all' ? bookings : bookings.filter(b => b.status === statusFilter);
    const statusCounts = bookings.reduce((acc, booking) => { acc[booking.status] = (acc[booking.status] || 0) + 1; return acc; }, {});

    const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
    const itemVariants = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } } };

    if (loading) return <div className="flex justify-center items-center h-screen bg-gray-50"><Loader2 className="animate-spin text-indigo-600 h-10 w-10" /></div>;

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            
            <div className="relative h-96 w-full bg-slate-900 overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0">
                    <img src="/customer_hero.png" alt="Premium Header" className="w-full h-full object-cover opacity-50 mix-blend-overlay filter blur-[2px]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-transparent to-indigo-900/60" />
                </div>
                
                <div className="relative z-10 w-full max-w-6xl mx-auto px-6 lg:px-8 text-center pt-10">
                    <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-4 drop-shadow-lg">
                            My Operations
                        </h1>
                        <p className="text-xl text-indigo-100 font-medium max-w-2xl mx-auto shadow-sm">
                            Comprehensive record of all assigned workflows and pending payloads.
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 lg:px-8 relative z-20 -mt-16">

                {/* Cinematic Stats Grid */}
                <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {[
                        { label: 'Total Assumes', value: bookings.length, color: 'text-indigo-600', bg: 'bg-indigo-100', icon: BookOpen },
                        { label: 'Pending', value: statusCounts.pending || 0, color: 'text-amber-600', bg: 'bg-amber-100', icon: Clock },
                        { label: 'Authorized', value: statusCounts.accepted || 0, color: 'text-blue-600', bg: 'bg-blue-100', icon: MapPin },
                        { label: 'Finalized', value: statusCounts.completed || 0, color: 'text-emerald-600', bg: 'bg-emerald-100', icon: CheckCircle }
                    ].map(({ label, value, color, bg, icon: Icon }, index) => (
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

                {/* Filters */}
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

                {/* Operations List */}
                <motion.div layout className="space-y-6">
                    <AnimatePresence>
                        {filteredBookings.length > 0 ? (
                            filteredBookings.map((booking) => (
                                <motion.div layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                                    className="bg-white rounded-[2rem] shadow-lg hover:shadow-xl transition-all border border-gray-100 overflow-hidden relative group" key={booking._id}>
                                    
                                    <div className={`absolute left-0 top-0 bottom-0 w-2 ${booking.status === 'completed' ? 'bg-emerald-500' : booking.status === 'pending' ? 'bg-amber-400' : booking.status === 'cancelled' ? 'bg-red-500' : 'bg-blue-500'}`} />
                                    
                                    <div className="p-6 md:p-8 ml-2 flex flex-col lg:flex-row gap-6 md:gap-8 items-start lg:items-center">
                                        <div className="flex-1 flex flex-col md:flex-row gap-6">
                                            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 shadow-inner shrink-0 group-hover:bg-indigo-50 transition-colors">
                                                <BookOpen className="w-8 h-8 text-indigo-500" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-xl md:text-2xl font-extrabold text-gray-900">{booking.service?.name || 'Service Package'}</h3>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-current ${getStatusColor(booking.status)}`}>{booking.status}</span>
                                                </div>
                                                <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-gray-500">
                                                    <span className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100"><Clock size={16} className="text-indigo-400"/> {formatDate(booking.createdAt)}</span>
                                                    <span className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100"><MapPin size={16} className="text-indigo-400"/> {booking.address}</span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center justify-between lg:justify-end w-full lg:w-auto gap-6 lg:border-l lg:border-gray-100 lg:pl-8 pt-4 lg:pt-0 border-t border-gray-100 lg:border-t-0 mt-2 lg:mt-0">
                                            <div>
                                                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Contract Total</p>
                                                <p className="text-2xl font-black text-indigo-600">{formatPrice(booking.service?.price)}</p>
                                            </div>
                                            
                                            <div className="flex gap-2">
                                                {booking.status === 'pending' && (
                                                    <button onClick={() => handleAccept(booking._id)} disabled={updatingId === booking._id} className="bg-gray-900 hover:bg-indigo-600 hover:-translate-y-1 transition-all text-white px-6 py-4 rounded-2xl font-bold shadow-lg flex items-center">
                                                        {updatingId === booking._id ? <Loader2 size={20} className="animate-spin" /> : <><CheckCircle size={18} className="mr-2" /> Accept</>}
                                                    </button>
                                                )}
                                                {booking.status === 'accepted' && (
                                                    <button onClick={() => handleComplete(booking._id)} disabled={updatingId === booking._id} className="bg-emerald-500 hover:bg-emerald-600 hover:-translate-y-1 transition-all text-white px-6 py-4 rounded-2xl font-bold shadow-lg flex items-center">
                                                        {updatingId === booking._id ? <Loader2 size={20} className="animate-spin" /> : <><CheckCircle size={18} className="mr-2" /> Complete</>}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <motion.div initial={{opacity:0}} animate={{opacity:1}} className="text-center py-32 rounded-[3rem] bg-white border border-gray-100 shadow-sm">
                                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle className="text-gray-300 w-10 h-10" /></div>
                                <h3 className="text-2xl font-extrabold text-gray-900 mb-2">No logging data arrays found.</h3>
                                <p className="text-gray-500 mb-8 font-medium">Your authorized telemetry spans will appear here.</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
};

export default WorkerBookings;