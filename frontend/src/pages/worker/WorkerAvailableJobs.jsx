import React, { useEffect, useState } from 'react';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Clock, MapPin, Loader2, ArrowRight, CheckCircle2, Activity, CalendarDays, Search, Filter, User, Zap, AlertCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getWorkerBookings, acceptBooking, completeBooking } from '../../services/bookingService';

const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

const WorkerAvailableJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterUrgency, setFilterUrgency] = useState('all');
    const [toast, setToast] = useState(null);
    const [confirmAction, setConfirmAction] = useState(null);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            const jobsData = await getWorkerBookings();
            const myJobs = jobsData.filter(job => {
                return job.status === 'pending' || job.status === 'accepted';
            });
            setJobs(myJobs);
        } catch (err) { console.error(err); } finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const handleUpdateStatus = async (id, newStatus) => {
        setConfirmAction(null);
        setUpdating(id);
        try {
            if (newStatus === 'accepted') {
                await acceptBooking(id);
                showToast('🎉 Job accepted! Check "My Jobs" for details.', 'success');
            } else if (newStatus === 'completed') {
                await completeBooking(id);
                showToast('✅ Job marked as completed!', 'success');
            }
            fetchData();
        } catch (error) { 
            console.error("Error updating status"); 
            showToast('❌ Something went wrong. Please try again.', 'error');
        } finally { setUpdating(null); }
    };

    // Filter & Search
    const filteredJobs = jobs.filter(job => {
        const matchesSearch = !searchQuery || 
            job.service?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.address?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesUrgency = filterUrgency === 'all' || job.urgency === filterUrgency;
        return matchesSearch && matchesUrgency;
    });

    const pendingJobs = filteredJobs.filter(j => j.status === 'pending');
    const acceptedJobs = filteredJobs.filter(j => j.status === 'accepted');

    if (loading) return <div className="flex justify-center items-center h-screen bg-gray-50"><Loader2 className="animate-spin text-indigo-600 h-10 w-10" /></div>;

    const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
    const itemVariants = { hidden: { opacity: 0, y: 20, scale: 0.97 }, show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', damping: 20 } } };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 pb-20 font-sans">
            {/* Toast Notification */}
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
                            <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle2 className="text-indigo-600 w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-center text-gray-900 mb-2">
                                {confirmAction.status === 'accepted' ? 'Accept this job?' : 'Mark as completed?'}
                            </h3>
                            <p className="text-center text-gray-500 text-sm mb-6">
                                {confirmAction.status === 'accepted' 
                                    ? 'You will be assigned to this service request and the customer will be notified.'
                                    : 'This will mark the job as finished and your earnings will be updated.'}
                            </p>
                            <div className="flex gap-3">
                                <button onClick={() => setConfirmAction(null)} className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition-colors">
                                    Cancel
                                </button>
                                <button 
                                    onClick={() => handleUpdateStatus(confirmAction.id, confirmAction.status)}
                                    className="flex-1 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors shadow-lg"
                                >
                                    Confirm
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
                <div className="relative z-10 px-6 py-10 max-w-7xl mx-auto">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/15 backdrop-blur-md rounded-full text-white/90 font-semibold text-xs border border-white/20">
                                <Activity size={14} /> {jobs.length} {jobs.length === 1 ? 'Job' : 'Jobs'} Available
                            </span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2 text-white">Available Jobs</h1>
                        <p className="text-indigo-200 font-medium max-w-xl">Browse new service requests from customers and accept the ones you'd like to work on.</p>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6">
                {/* Search & Filter Bar */}
                <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="flex flex-col sm:flex-row gap-3 mb-8">
                    <div className="relative flex-1">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Search by service name or address..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all"
                        />
                    </div>
                    <div className="flex gap-2">
                        {['all', 'standard', 'priority', 'express'].map(urgency => (
                            <button 
                                key={urgency}
                                onClick={() => setFilterUrgency(urgency)}
                                className={`px-4 py-3 rounded-xl text-xs font-bold capitalize transition-all whitespace-nowrap ${
                                    filterUrgency === urgency 
                                        ? 'bg-gray-900 text-white shadow-md' 
                                        : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'
                                }`}
                            >
                                {urgency === 'all' ? '🔍 All' : urgency === 'express' ? '⚡ Express' : urgency === 'priority' ? '🔥 Priority' : '📋 Standard'}
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Accepted Jobs Section */}
                {acceptedJobs.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <div className="w-2 h-5 bg-blue-500 rounded-full" /> Your Active Jobs ({acceptedJobs.length})
                        </h2>
                        <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {acceptedJobs.map(job => (
                                <motion.div key={job._id} variants={itemVariants} className="bg-blue-50 border border-blue-100 rounded-2xl p-5 group hover:shadow-md transition-all">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl border border-blue-100 shadow-sm">
                                            {job.service?.category?.icon || '🔧'}
                                        </div>
                                        <Badge variant="indigo" className="text-[10px] font-bold uppercase">In Progress</Badge>
                                    </div>
                                    <h3 className="font-bold text-gray-900 mb-1">{job.service?.name || 'Service'}</h3>
                                    <p className="text-xs text-gray-500 flex items-center gap-1 mb-1"><MapPin size={12} /> {job.address}</p>
                                    <p className="text-xs text-gray-400 flex items-center gap-1 mb-4"><User size={12} /> {job.user?.name || 'Customer'}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-lg font-black text-gray-900">₹{job.service?.price}</span>
                                        <Button 
                                            onClick={() => setConfirmAction({ id: job._id, status: 'completed' })} 
                                            disabled={updating === job._id} 
                                            className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl px-4 py-2.5 font-bold text-xs shadow-sm transition-colors"
                                        >
                                            {updating === job._id ? <Loader2 className="animate-spin" size={16} /> : <><CheckCircle2 size={14} className="mr-1 inline" /> Done</>}
                                        </Button>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                )}

                {/* Pending Jobs Section */}
                <div className="mb-8">
                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <div className="w-2 h-5 bg-amber-400 rounded-full" /> New Requests ({pendingJobs.length})
                    </h2>
                    <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <AnimatePresence>
                            {pendingJobs.map((job) => (
                                <motion.div variants={itemVariants} key={job._id} exit={{ opacity: 0, scale: 0.9 }} layout
                                    className="group bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden"
                                >
                                    {/* Urgency Banner */}
                                    {job.urgency && job.urgency !== 'standard' && (
                                        <div className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                                            job.urgency === 'express' ? 'bg-red-500 text-white' : 'bg-amber-400 text-amber-900'
                                        }`}>
                                            <Zap size={12} /> {job.urgency} Request
                                        </div>
                                    )}
                                    
                                    <div className="p-5 flex flex-col flex-grow">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-2xl border border-gray-100 group-hover:scale-105 transition-transform">
                                                {job.service?.category?.icon || '🔧'}
                                            </div>
                                            <span className="text-xs text-gray-400 font-medium">{timeAgo(job.createdAt)}</span>
                                        </div>
                                        
                                        <h3 className="text-lg font-bold text-gray-900 mb-3">{job.service?.name || 'Service'}</h3>
                                        
                                        <div className="space-y-2 mb-4 text-xs">
                                            <p className="text-gray-500 flex items-center gap-2"><MapPin size={14} className="text-gray-400 shrink-0" /> {job.address}</p>
                                            <p className="text-gray-500 flex items-center gap-2"><CalendarDays size={14} className="text-gray-400 shrink-0" /> {new Date(job.bookingDate || job.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                                            <p className="text-gray-500 flex items-center gap-2"><User size={14} className="text-gray-400 shrink-0" /> {job.user?.name || 'Customer'}</p>
                                        </div>

                                        {job.notes && (
                                            <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl text-xs text-amber-800 mb-4">
                                                <span className="font-bold">Customer Note:</span> {job.notes}
                                            </div>
                                        )}

                                        {/* Footer */}
                                        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                                            <div>
                                                <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Earnings</p>
                                                <p className="text-xl font-black text-emerald-600">₹{job.service?.price}</p>
                                            </div>
                                            <Button 
                                                onClick={() => setConfirmAction({ id: job._id, status: 'accepted' })} 
                                                disabled={updating === job._id} 
                                                className="bg-gray-900 hover:bg-indigo-600 text-white rounded-xl px-5 py-3 font-bold text-sm shadow-lg hover:shadow-indigo-500/20 transition-all hover:-translate-y-0.5"
                                            >
                                                {updating === job._id ? <Loader2 className="animate-spin" size={16} /> : <>Accept <ArrowRight size={16} className="ml-1 inline" /></>}
                                            </Button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                </div>

                {filteredJobs.length === 0 && (
                    <motion.div key="empty" initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} className="max-w-md mx-auto mt-12 p-10 text-center bg-white rounded-2xl border border-gray-100 shadow-sm">
                        <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle2 className="text-indigo-300 w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {searchQuery ? 'No matching jobs' : 'All caught up!'}
                        </h3>
                        <p className="text-gray-400 text-sm">
                            {searchQuery ? 'Try different search terms or remove filters.' : 'No new service requests right now. Check back soon!'}
                        </p>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default WorkerAvailableJobs;
