import React, { useEffect, useState } from 'react';
import { Badge } from '../../components/ui/Badge';
import { Briefcase, CheckCircle, IndianRupee, MapPin, Calendar, Loader2, TrendingUp, Clock, Star, ChevronDown, ChevronUp, User, Phone, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getWorkerBookings } from '../../services/bookingService';
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

const WorkerDashboard = () => {
  const [stats, setStats] = useState({ totalJobs: 0, completedJobs: 0, earnings: 0, activeJobs: 0 });
  const [historyJobs, setHistoryJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedJob, setExpandedJob] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  const fetchData = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      const jobsData = await getWorkerBookings();
      
      let completedCount = 0;
      let totalEarnings = 0;
      let activeCount = 0;
      let history = [];
      
      jobsData.forEach(job => {
        if (job.status !== 'pending') {
          history.push(job);
          if (job.status === 'completed') {
            completedCount++;
            totalEarnings += job.service?.price || 0;
          }
          if (job.status === 'accepted') {
            activeCount++;
          }
        }
      });
      setStats({ totalJobs: history.length, completedJobs: completedCount, earnings: totalEarnings, activeJobs: activeCount });
      setHistoryJobs(history.reverse());
    } catch (err) { console.error(err); } finally { setLoading(false); setRefreshing(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const completionRate = stats.totalJobs > 0 ? Math.round((stats.completedJobs / stats.totalJobs) * 100) : 0;

  const statCards = [
    { title: 'Total Jobs', value: stats.totalJobs, icon: Briefcase, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100' },
    { title: 'Active Now', value: stats.activeJobs, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
    { title: 'Completed', value: stats.completedJobs, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
    { title: 'Total Earned', value: `₹${stats.earnings.toLocaleString('en-IN')}`, icon: IndianRupee, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
  ];

  const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: 'spring', damping: 20 } } };

  if (loading && historyJobs.length === 0) return <div className="flex h-screen items-center justify-center bg-gray-50"><Loader2 className="animate-spin text-indigo-600 h-10 w-10" /></div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      
      {/* Welcome Banner */}
      <div className="relative w-full bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 overflow-hidden mb-8 rounded-b-[2.5rem]">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-400 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
        </div>
        <div className="relative z-10 px-6 lg:px-8 py-10 max-w-7xl mx-auto">
          <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <p className="text-indigo-200 font-medium text-sm mb-1">Welcome back,</p>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-2">
                {currentUser?.name || 'Worker'} 👋
              </h1>
              <p className="text-indigo-200 font-medium">Here's your work summary for today</p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => fetchData(true)}
                disabled={refreshing}
                className="flex items-center gap-2 px-5 py-3 bg-white/15 hover:bg-white/25 backdrop-blur-md text-white rounded-2xl font-semibold transition-all border border-white/20"
              >
                <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} /> Refresh
              </button>
              <button 
                onClick={() => navigate('/worker/available-jobs')}
                className="flex items-center gap-2 px-5 py-3 bg-white text-indigo-700 rounded-2xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
              >
                <Briefcase size={16} /> Find Jobs
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Stats Grid */}
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((stat, idx) => (
            <motion.div key={idx} variants={itemVariants} className={`bg-white ${stat.border} border p-5 rounded-2xl shadow-sm hover:shadow-md transition-all group cursor-default`}>
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color}`}>
                  <stat.icon size={20} />
                </div>
              </div>
              <p className="text-2xl lg:text-3xl font-extrabold text-gray-900">{stat.value}</p>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-1">{stat.title}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Completion Rate + Quick Actions */}
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <motion.div variants={itemVariants} className="md:col-span-1 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Completion Rate</h3>
            <div className="relative w-32 h-32 mx-auto mb-4">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" stroke="#f3f4f6" strokeWidth="10" fill="none" />
                <motion.circle 
                  cx="60" cy="60" r="50" 
                  stroke={completionRate >= 70 ? '#10b981' : completionRate >= 40 ? '#f59e0b' : '#ef4444'}
                  strokeWidth="10" fill="none" strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 50}`}
                  initial={{ strokeDashoffset: 2 * Math.PI * 50 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 50 * (1 - completionRate / 100) }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-black text-gray-900">{completionRate}%</span>
              </div>
            </div>
            <p className="text-center text-sm text-gray-500 font-medium">
              {completionRate >= 70 ? '🎉 Great work!' : completionRate >= 40 ? '💪 Keep going!' : '🚀 You got this!'}
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="md:col-span-2 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Available Jobs', desc: 'Browse new requests', icon: Briefcase, path: '/worker/available-jobs', color: 'from-indigo-500 to-purple-500' },
                { label: 'My Jobs', desc: 'View assigned work', icon: CheckCircle, path: '/worker/bookings', color: 'from-emerald-500 to-teal-500' },
                { label: 'Earnings', desc: 'Track your income', icon: IndianRupee, path: '/worker/earnings', color: 'from-blue-500 to-cyan-500' },
                { label: 'Profile', desc: 'Update your info', icon: User, path: '/worker/profile', color: 'from-amber-500 to-orange-500' },
              ].map(action => (
                <button
                  key={action.label}
                  onClick={() => navigate(action.path)}
                  className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-100 transition-all text-left group hover:-translate-y-0.5"
                >
                  <div className={`p-2.5 rounded-xl bg-gradient-to-br ${action.color} text-white shadow-sm`}>
                    <action.icon size={18} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{action.label}</p>
                    <p className="text-xs text-gray-400">{action.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Recent Jobs */}
        <motion.div initial={{opacity:0, y:30}} animate={{opacity:1, y:0}} transition={{delay:0.3}}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <div className="w-2 h-6 bg-indigo-600 rounded-full" /> Recent Jobs
            </h2>
            <button onClick={() => navigate('/worker/bookings')} className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
              View all →
            </button>
          </div>
          
          <div className="space-y-3">
            {historyJobs.slice(0, 5).map((job) => (
              <motion.div 
                key={job._id} 
                layout
                className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all"
              >
                <div 
                  className="p-5 flex items-center justify-between cursor-pointer"
                  onClick={() => setExpandedJob(expandedJob === job._id ? null : job._id)}
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-2xl border border-gray-100 shrink-0">
                      {job.service?.category?.icon || '🔧'}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-gray-900 truncate">{job.service?.name || 'Service'}</h3>
                      <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                        <span className="flex items-center gap-1"><MapPin size={12} /> {job.address?.substring(0, 30)}{job.address?.length > 30 ? '...' : ''}</span>
                        <span>{timeAgo(job.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <span className="font-bold text-gray-900">₹{job.service?.price}</span>
                    <Badge variant={job.status === 'completed' ? 'success' : job.status === 'accepted' ? 'indigo' : 'warning'} className="uppercase text-[10px] font-bold tracking-wider">
                      {job.status}
                    </Badge>
                    {expandedJob === job._id ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                  </div>
                </div>
                
                <AnimatePresence>
                  {expandedJob === job._id && (
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
                            <p className="font-semibold text-gray-700 flex items-center gap-1"><User size={14} /> {job.user?.name || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-xs font-semibold mb-1">Booked On</p>
                            <p className="font-semibold text-gray-700 flex items-center gap-1"><Calendar size={14} /> {new Date(job.bookingDate || job.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-xs font-semibold mb-1">Payment</p>
                            <p className="font-semibold text-gray-700 capitalize">{job.paymentMethod || 'Cash'}</p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-xs font-semibold mb-1">Urgency</p>
                            <Badge variant={job.urgency === 'express' ? 'warning' : job.urgency === 'priority' ? 'indigo' : 'default'} className="text-[10px] uppercase font-bold">
                              {job.urgency || 'Standard'}
                            </Badge>
                          </div>
                        </div>
                        {job.notes && (
                          <div className="mt-3 p-3 bg-amber-50 border border-amber-100 rounded-xl text-sm text-amber-800">
                            <span className="font-bold">Note:</span> {job.notes}
                          </div>
                        )}
                        <div className="mt-3 flex justify-end">
                          <button 
                            onClick={(e) => { e.stopPropagation(); navigate(`/booking/${job._id}`); }}
                            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 px-4 py-2 rounded-xl transition-all"
                          >
                            View Details →
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
            {historyJobs.length === 0 && (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="text-gray-300 w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">No jobs yet</h3>
                <p className="text-gray-400 text-sm mb-4">Start by accepting available service requests</p>
                <button onClick={() => navigate('/worker/available-jobs')} className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-colors">
                  Browse Jobs
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default WorkerDashboard;