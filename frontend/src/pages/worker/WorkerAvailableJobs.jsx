import React, { useEffect, useState } from 'react';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Clock, MapPin, Loader2, ArrowRight, CheckCircle2, ChevronRight, Activity, CalendarDays } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getWorkerBookings, acceptBooking, completeBooking } from '../../services/bookingService';

const WorkerAvailableJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const jobsData = await getWorkerBookings();
            const currentUser = JSON.parse(localStorage.getItem('user'));
            const myJobs = jobsData.filter(job => 
                (job.status === 'pending') || 
                (job.worker?._id === currentUser.id && job.status === 'accepted')
            );
            setJobs(myJobs);
        } catch (err) { console.error(err); } finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const handleUpdateStatus = async (id, newStatus) => {
        setUpdating(id);
        try {
            if (newStatus === 'accepted') await acceptBooking(id);
            else if (newStatus === 'completed') await completeBooking(id);
            fetchData();
        } catch (error) { console.error("Error updating status"); } finally { setUpdating(null); }
    };

    if (loading) return <div className="flex justify-center items-center h-screen bg-gray-50"><Loader2 className="animate-spin text-indigo-600 h-10 w-10" /></div>;

    const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
    const itemVariants = { hidden: { opacity: 0, y: 30, scale: 0.95 }, show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 120 } } };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 pb-20 font-sans">
            <div className="relative h-80 w-full bg-slate-900 overflow-hidden flex items-center justify-center mb-10 shadow-xl rounded-b-[3rem]">
                <div className="absolute inset-0">
                    <img src="/customer_hero.png" alt="Premium Header" className="w-full h-full object-cover opacity-60 mix-blend-overlay filter blur-[4px]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-transparent to-indigo-900/80" />
                </div>
                <div className="relative z-10 w-full max-w-7xl mx-auto px-6 text-center pt-8">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-white font-bold tracking-widest text-xs uppercase mb-4 shadow-sm border border-white/20"><Activity size={16} /> Operational Dispatch</span>
                        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 text-gray-900 drop-shadow-lg">Action Hub</h1>
                        <p className="text-indigo-900 font-medium text-lg max-w-2xl mx-auto">Manage active authorizations and process incoming workloads seamlessly.</p>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-20 -mt-16">
                <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence>
                        {jobs.map((job) => {
                            const isPending = job.status === 'pending';
                            return (
                                <motion.div variants={itemVariants} key={job._id} exit={{ opacity: 0, scale: 0.8 }} className="group relative bg-white/90 backdrop-blur-xl border border-gray-100 rounded-[2.5rem] shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col h-full overflow-hidden">
                                    
                                    {/* Abstract Inner Header Graphic */}
                                    <div className={`h-32 w-full relative overflow-hidden ${isPending ? 'bg-gradient-to-br from-amber-100 to-orange-50' : 'bg-gradient-to-br from-blue-100 to-indigo-50'}`}>
                                        <div className="absolute top-0 left-0 w-full h-full opacity-30 mix-blend-overlay" style={{backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '16px 16px'}} />
                                        <div className="absolute inset-6 flex justify-between items-start">
                                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-sm border border-white/50 group-hover:scale-110 transition-transform">
                                                {job.service?.category?.icon || '📦'}
                                            </div>
                                            <Badge variant={isPending ? 'warning' : 'indigo'} className="font-extrabold uppercase shadow-sm border-white/40">{job.status}</Badge>
                                        </div>
                                    </div>

                                    {/* Ticket Body */}
                                    <div className="p-8 flex flex-col flex-grow">
                                        <h3 className="text-2xl font-extrabold text-gray-900 mb-4 leading-tight">{job.service?.name || "Service Payload"}</h3>
                                        
                                        <div className="space-y-4 mb-8">
                                            <div className="flex items-start gap-3">
                                                <div className="p-2.5 bg-gray-50 rounded-xl text-indigo-500 shrink-0 border border-gray-100">
                                                    <MapPin size={18} />
                                                </div>
                                                <p className="text-sm font-medium text-gray-600 pt-2 line-clamp-2">{job.address}</p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="p-2.5 bg-gray-50 rounded-xl text-indigo-500 shrink-0 border border-gray-100">
                                                    <CalendarDays size={18} />
                                                </div>
                                                <p className="text-sm font-bold text-gray-700">{new Date(job.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>

                                        {/* Progressive Timeline Bar */}
                                        <div className="w-full h-2 rounded-full bg-gray-100 mb-8 overflow-hidden">
                                            <motion.div initial={{ width: 0 }} animate={{ width: isPending ? '30%' : '70%' }} className={`h-full rounded-full ${isPending ? 'bg-amber-400' : 'bg-blue-500'}`} transition={{ duration: 1, delay: 0.5 }} />
                                        </div>

                                        {/* Ticket Footer Action */}
                                        <div className="mt-auto pt-6 border-t border-gray-100 flex items-center justify-between">
                                            <div>
                                                <p className="text-xs text-gray-400 font-extrabold uppercase tracking-widest mb-1">Contract Value</p>
                                                <p className="text-2xl font-black text-emerald-600 bg-clip-text">₹{job.service?.price}</p>
                                            </div>

                                            {isPending ? (
                                                <Button onClick={() => handleUpdateStatus(job._id, 'accepted')} disabled={updating === job._id} className="bg-gray-900 hover:bg-indigo-600 text-white rounded-2xl p-4 shadow-lg hover:shadow-indigo-500/30 group/btn transition-colors">
                                                    {updating === job._id ? <Loader2 className="animate-spin" size={20} /> : <ArrowRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />}
                                                </Button>
                                            ) : (
                                                <Button onClick={() => handleUpdateStatus(job._id, 'completed')} disabled={updating === job._id} className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl shadow-lg hover:shadow-emerald-500/30 px-6 py-4 font-bold tracking-wide transition-colors">
                                                    {updating === job._id ? <Loader2 className="animate-spin mr-2" size={20} /> : <><CheckCircle2 size={18} className="mr-2 inline" /> Resolve</>}
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </motion.div>

                {jobs.length === 0 && (
                    <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} className="max-w-xl mx-auto mt-20 p-12 text-center bg-white/80 backdrop-blur-xl rounded-[3rem] border border-gray-100 shadow-xl">
                        <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 className="text-indigo-300 w-12 h-12" />
                        </div>
                        <h3 className="text-3xl font-extrabold text-gray-900 mb-3">No Active Operations</h3>
                        <p className="text-gray-500 font-medium text-lg">Your queue is fully cleared. Awaiting new dispatch protocols.</p>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default WorkerAvailableJobs;
