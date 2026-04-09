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
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const statCards = [
    { title: 'Total Handled', value: stats.totalJobs, icon: Briefcase, color: 'text-fuchsia-400', bg: 'bg-fuchsia-900/50' },
    { title: 'Finished', value: stats.completedJobs, icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-900/50' },
    { title: 'Verified Revenue', value: `₹${stats.earnings}`, icon: IndianRupee, color: 'text-amber-400', bg: 'bg-amber-900/50' },
  ];

  const containerVariants = {
      hidden: { opacity: 0 },
      show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVariants = {
      hidden: { opacity: 0, y: 20 },
      show: { opacity: 1, y: 0, transition: { type: 'spring' } }
  };

  if (loading && historyJobs.length === 0) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-purple-600 h-10 w-10" /></div>;

  return (
    <div className="min-h-screen bg-gray-900 pb-20">
      
      {/* Cinematic Operations Banner */}
      <div className="relative h-80 w-full rounded-b-[3rem] overflow-hidden shadow-2xl shadow-purple-900/20 mb-10">
        <img src="/worker_dash.png" alt="Operations Node" className="absolute inset-0 w-full h-full object-cover opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900" />
        <div className="absolute bottom-10 left-10">
            <motion.div initial={{opacity:0, x:-30}} animate={{opacity:1, x:0}} transition={{delay:0.2}} className="flex items-center gap-4 mb-2">
                <div className="w-14 h-14 rounded-full bg-purple-600 border-2 border-purple-400 flex items-center justify-center shadow-[0_0_20px_rgba(147,51,234,0.5)]">
                    <Briefcase className="text-white" size={24} />
                </div>
                <div>
                    <h1 className="text-4xl font-extrabold text-white tracking-tight">Provider Operations</h1>
                    <p className="text-purple-300">Terminal node active. Awaiting jobs.</p>
                </div>
            </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Floating Glass Stats Grid */}
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 -mt-16 relative z-10">
            {statCards.map((stat, idx) => (
            <motion.div key={idx} variants={itemVariants} className="bg-gray-800/60 backdrop-blur-xl border border-gray-700/50 p-6 rounded-3xl shadow-xl">
                <div className="flex items-center">
                    <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} mr-5 border border-white/5`}>
                        <stat.icon size={26} />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">{stat.title}</p>
                        <p className="text-3xl font-black text-white">{stat.value}</p>
                    </div>
                </div>
            </motion.div>
            ))}
        </motion.div>

        {/* Cinematic History Ledger */}
        <motion.div initial={{opacity:0, y:40}} animate={{opacity:1, y:0}} transition={{delay:0.4}}>
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <div className="w-3 h-8 bg-purple-600 rounded-full shadow-[0_0_10px_rgba(147,51,234,0.8)]" /> Work Telemetry Log
            </h2>
            <div className="bg-gray-800/40 backdrop-blur-lg border border-gray-700 rounded-[2rem] p-4 sm:p-8 overflow-hidden shadow-2xl">
                <div className="space-y-4">
                {historyJobs.map((job) => (
                    <motion.div key={job._id} whileHover={{ scale: 1.01 }} className="bg-gray-900 border border-gray-700 hover:border-purple-500/50 transition-all rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden group">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gray-700 group-hover:bg-purple-500 transition-colors" />
                        <div className="flex-1 pl-4">
                            <div className="flex flex-wrap items-center gap-3 mb-3">
                                <h3 className="text-xl font-bold text-white">{job.service?.name || "Service Payload"}</h3>
                                <Badge variant={job.status === 'completed' ? 'success' : 'indigo'} className="uppercase border border-white/10">{job.status}</Badge>
                            </div>
                            <div className="flex items-center gap-6 text-sm font-medium text-gray-400">
                                <span className="flex items-center gap-1.5"><MapPin size={16} className="text-purple-400"/> {job.address}</span>
                                <span className="flex items-center gap-1.5"><Calendar size={16} className="text-purple-400"/> {job.bookingDate ? new Date(job.bookingDate).toLocaleDateString() : new Date(job.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                        <div className="text-right sm:border-l sm:border-gray-700 sm:pl-8">
                            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">Generated</p>
                            <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-200">₹{job.service?.price}</p>
                        </div>
                    </motion.div>
                ))}
                {historyJobs.length === 0 && <p className="text-gray-500 text-center py-10">No operational telemetry found.</p>}
                </div>
            </div>
        </motion.div>
      </div>
    </div>
  );
};

export default WorkerDashboard;