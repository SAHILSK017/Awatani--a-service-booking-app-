import React, { useEffect, useState } from 'react';
import { Badge } from '../../components/ui/Badge';
import { Briefcase, CheckCircle, IndianRupee, MapPin, Calendar, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { getWorkerBookings } from '../../services/bookingService';

const WorkerDashboard = () => {
  const [stats, setStats] = useState({ totalJobs: 0, completedJobs: 0, earnings: 0 });
  const [historyJobs, setHistoryJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const jobsData = await getWorkerBookings();
      
      let completedCount = 0;
      let totalEarnings = 0;
      let history = [];
      const currentUser = JSON.parse(localStorage.getItem('user'));
      
      jobsData.forEach(job => {
        if (job.worker?._id === currentUser.id) {
            history.push(job);
            if (job.status === 'completed') {
                completedCount++;
                totalEarnings += job.service?.price || 0;
            }
        }
      });
      setStats({ totalJobs: history.length, completedJobs: completedCount, earnings: totalEarnings });
      setHistoryJobs(history.reverse());
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const statCards = [
    { title: 'Total Handled', value: stats.totalJobs, icon: Briefcase, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { title: 'Finished', value: stats.completedJobs, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { title: 'Verified Revenue', value: `₹${stats.earnings}`, icon: IndianRupee, color: 'text-blue-600', bg: 'bg-blue-100' },
  ];

  const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: 'spring' } } };

  if (loading && historyJobs.length === 0) return <div className="flex h-screen items-center justify-center bg-gray-50"><Loader2 className="animate-spin text-indigo-600 h-10 w-10" /></div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      
      {/* Cinematic Operations Banner */}
      <div className="relative h-96 w-full bg-slate-900 overflow-hidden flex items-center justify-center mb-10">
        <div className="absolute inset-0">
            <img src="/customer_hero.png" alt="Worker Node" className="w-full h-full object-cover opacity-60 mix-blend-overlay filter blur-[2px]" />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-transparent to-indigo-900/60" />
        </div>
        <div className="absolute bottom-12 left-10 z-10 w-full max-w-7xl mx-auto px-6 lg:px-8">
            <motion.div initial={{opacity:0, x:-30}} animate={{opacity:1, x:0}} transition={{delay:0.2}} className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="w-20 h-20 rounded-3xl bg-indigo-600 border border-indigo-400/50 flex items-center justify-center shadow-2xl">
                    <Briefcase className="text-white w-10 h-10" />
                </div>
                <div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 drop-shadow-sm tracking-tight mb-2">Provider Operations</h1>
                    <p className="text-indigo-800 font-medium text-lg">Terminal node active. Manage and execute assigned workloads.</p>
                </div>
            </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Floating Glass Stats Grid */}
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 -mt-8 relative z-20">
            {statCards.map((stat, idx) => (
            <motion.div key={idx} variants={itemVariants} className="bg-white/90 backdrop-blur-xl border border-white/50 p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all">
                <div className="flex items-center">
                    <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} mr-5 shadow-inner`}>
                        <stat.icon size={28} />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">{stat.title}</p>
                        <p className="text-4xl font-extrabold text-gray-900 mt-1">{stat.value}</p>
                    </div>
                </div>
            </motion.div>
            ))}
        </motion.div>

        {/* Cinematic History Ledger */}
        <motion.div initial={{opacity:0, y:40}} animate={{opacity:1, y:0}} transition={{delay:0.4}}>
            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                <div className="w-3 h-8 bg-indigo-600 rounded-full shadow-[0_0_10px_rgba(79,70,229,0.3)]" /> Work Telemetry Log
            </h2>
            <div className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-[2.5rem] p-4 sm:p-8 overflow-hidden shadow-xl">
                <div className="space-y-4">
                {historyJobs.map((job) => (
                    <motion.div key={job._id} whileHover={{ scale: 1.01 }} className="bg-white border border-gray-100 hover:border-indigo-500/30 transition-all rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden group shadow-sm hover:shadow-md">
                        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gray-200 group-hover:bg-indigo-500 transition-colors" />
                        <div className="flex-1 pl-4">
                            <div className="flex flex-wrap items-center gap-3 mb-3">
                                <h3 className="text-xl font-bold text-gray-900">{job.service?.name || "Service Payload"}</h3>
                                <Badge variant={job.status === 'completed' ? 'success' : 'indigo'} className="uppercase font-bold tracking-wider">{job.status}</Badge>
                            </div>
                            <div className="flex items-center gap-6 text-sm font-medium text-gray-500">
                                <span className="flex items-center gap-1.5"><MapPin size={16} className="text-indigo-400"/> {job.address}</span>
                                <span className="flex items-center gap-1.5"><Calendar size={16} className="text-indigo-400"/> {job.bookingDate ? new Date(job.bookingDate).toLocaleDateString() : new Date(job.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                        <div className="text-right sm:border-l sm:border-gray-100 sm:pl-8">
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Generated</p>
                            <p className="text-2xl font-black text-indigo-600 drop-shadow-sm">₹{job.service?.price}</p>
                        </div>
                    </motion.div>
                ))}
                {historyJobs.length === 0 && <p className="text-gray-500 text-center py-12 font-medium">No operational telemetry found.</p>}
                </div>
            </div>
        </motion.div>
      </div>
    </div>
  );
};

export default WorkerDashboard;