import React, { useEffect, useState } from 'react';
import { Badge } from '../../components/ui/Badge';
import { IndianRupee, CalendarCheck, Loader2, TrendingUp, ArrowUpRight, ArrowDownRight, Search, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getWorkerBookings } from '../../services/bookingService';

const WorkerEarnings = () => {
  const [historyJobs, setHistoryJobs] = useState([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');

  useEffect(() => {
      const fetchData = async () => {
          try {
              setLoading(true);
              const jobsData = await getWorkerBookings();
              let earnings = 0;
              const completed = jobsData.filter(job => {
                  if (job.status === 'completed') {
                      earnings += job.service?.price || 0;
                      return true;
                  }
                  return false;
              });
              setHistoryJobs(completed.reverse());
              setTotalEarnings(earnings);
          } catch (err) { console.error(err); } finally { setLoading(false); }
      };
      fetchData();
  }, []);

  // Monthly earnings breakdown
  const monthlyData = historyJobs.reduce((acc, job) => {
    const date = new Date(job.updatedAt || job.createdAt);
    const key = date.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
    acc[key] = (acc[key] || 0) + (job.service?.price || 0);
    return acc;
  }, {});

  // Average per job
  const avgPerJob = historyJobs.length > 0 ? Math.round(totalEarnings / historyJobs.length) : 0;
  
  // Highest earning job
  const highestJob = historyJobs.reduce((max, job) => (job.service?.price || 0) > (max?.service?.price || 0) ? job : max, historyJobs[0]);

  // Filtered & sorted
  const filteredJobs = historyJobs
    .filter(job => !searchQuery || 
      job.service?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.address?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === 'newest') return new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt);
      if (sortOrder === 'oldest') return new Date(a.updatedAt || a.createdAt) - new Date(b.updatedAt || b.createdAt);
      if (sortOrder === 'highest') return (b.service?.price || 0) - (a.service?.price || 0);
      return (a.service?.price || 0) - (b.service?.price || 0);
    });

  if (loading) return <div className="flex justify-center items-center h-screen bg-gray-50"><Loader2 className="animate-spin text-indigo-600 h-10 w-10" /></div>;

  const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
  const itemVariants = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0, transition: { type: 'spring', damping: 20 } } };

  return (
      <div className="min-h-screen bg-gray-50 text-gray-900 pb-20 font-sans">
          
          {/* Header */}
          <div className="bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-700 rounded-b-[2.5rem] overflow-hidden mb-8 relative">
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-400 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
            </div>
            <div className="relative z-10 px-6 py-10 max-w-5xl mx-auto">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2 text-white">My Earnings</h1>
                    <p className="text-emerald-100 font-medium">Track all your completed job payments</p>
                </motion.div>
            </div>
          </div>

          <div className="max-w-5xl mx-auto px-6">
              
              {/* Earnings Hero Card */}
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mb-8">
                  <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl shadow-xl p-8 flex flex-col md:flex-row items-center justify-between overflow-hidden relative">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500 rounded-full blur-3xl mix-blend-screen opacity-40" />
                      <div className="relative z-10">
                          <p className="text-emerald-100 font-semibold text-sm uppercase tracking-wider mb-1">Total Earnings</p>
                          <h2 className="text-5xl md:text-6xl font-black text-white">₹{totalEarnings.toLocaleString('en-IN')}</h2>
                          <p className="text-emerald-200 text-sm mt-2">{historyJobs.length} completed {historyJobs.length === 1 ? 'job' : 'jobs'}</p>
                      </div>
                      <div className="p-5 bg-white/15 rounded-2xl backdrop-blur-xl border border-white/20 mt-6 md:mt-0 relative z-10">
                          <IndianRupee size={40} className="text-amber-300" />
                      </div>
                  </div>
              </motion.div>

              {/* Stats Grid */}
              <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <motion.div variants={itemVariants} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Avg. Per Job</p>
                          <div className="p-2 bg-blue-50 rounded-lg"><TrendingUp size={16} className="text-blue-600" /></div>
                      </div>
                      <p className="text-2xl font-extrabold text-gray-900">₹{avgPerJob.toLocaleString('en-IN')}</p>
                  </motion.div>
                  <motion.div variants={itemVariants} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Highest Earning</p>
                          <div className="p-2 bg-amber-50 rounded-lg"><ArrowUpRight size={16} className="text-amber-600" /></div>
                      </div>
                      <p className="text-2xl font-extrabold text-gray-900">₹{(highestJob?.service?.price || 0).toLocaleString('en-IN')}</p>
                      <p className="text-xs text-gray-400 mt-1 truncate">{highestJob?.service?.name || 'N/A'}</p>
                  </motion.div>
                  <motion.div variants={itemVariants} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">This Month</p>
                          <div className="p-2 bg-emerald-50 rounded-lg"><Calendar size={16} className="text-emerald-600" /></div>
                      </div>
                      {(() => {
                          const thisMonth = new Date().toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
                          return <p className="text-2xl font-extrabold text-gray-900">₹{(monthlyData[thisMonth] || 0).toLocaleString('en-IN')}</p>;
                      })()}
                  </motion.div>
              </motion.div>

              {/* Monthly Breakdown */}
              {Object.keys(monthlyData).length > 1 && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-8">
                      <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Monthly Breakdown</h3>
                      <div className="space-y-3">
                          {Object.entries(monthlyData).map(([month, amount]) => {
                              const percentage = totalEarnings > 0 ? (amount / totalEarnings) * 100 : 0;
                              return (
                                  <div key={month} className="flex items-center gap-4">
                                      <span className="text-sm font-semibold text-gray-600 w-24">{month}</span>
                                      <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                                          <motion.div 
                                              initial={{ width: 0 }} 
                                              animate={{ width: `${percentage}%` }}
                                              transition={{ duration: 0.8, delay: 0.3 }}
                                              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                                          />
                                      </div>
                                      <span className="text-sm font-bold text-gray-900 w-24 text-right">₹{amount.toLocaleString('en-IN')}</span>
                                  </div>
                              );
                          })}
                      </div>
                  </motion.div>
              )}

              {/* Transaction History */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                  <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                          <CalendarCheck className="text-emerald-500" size={20} /> Payment History
                      </h3>
                  </div>

                  {/* Search & Sort */}
                  <div className="flex flex-col sm:flex-row gap-3 mb-4">
                      <div className="relative flex-1">
                          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input 
                              type="text" 
                              placeholder="Search by service name..." 
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all"
                          />
                      </div>
                      <select 
                          value={sortOrder} 
                          onChange={(e) => setSortOrder(e.target.value)}
                          className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 cursor-pointer"
                      >
                          <option value="newest">Newest First</option>
                          <option value="oldest">Oldest First</option>
                          <option value="highest">Highest Amount</option>
                          <option value="lowest">Lowest Amount</option>
                      </select>
                  </div>
                  
                  {/* Job cards */}
                  <div className="space-y-2">
                      <AnimatePresence>
                          {filteredJobs.map((job, idx) => (
                              <motion.div 
                                  key={job._id}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0 }}
                                  transition={{ delay: idx * 0.03 }}
                                  className="bg-white border border-gray-100 rounded-xl p-4 flex items-center gap-4 hover:shadow-sm transition-all group"
                              >
                                  <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center text-lg shrink-0 border border-emerald-100 group-hover:scale-105 transition-transform">
                                      {job.service?.category?.icon || '🔧'}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                      <p className="font-semibold text-gray-900 truncate">{job.service?.name || 'Service'}</p>
                                      <p className="text-xs text-gray-400">{new Date(job.updatedAt || job.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                                  </div>
                                  <Badge variant="success" className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-bold px-2.5 py-1">Paid</Badge>
                                  <p className="font-black text-emerald-600 text-lg shrink-0">+₹{job.service?.price?.toLocaleString('en-IN')}</p>
                              </motion.div>
                          ))}
                      </AnimatePresence>
                  </div>

                  {filteredJobs.length === 0 && (
                      <div className="p-12 text-center bg-white rounded-2xl border border-gray-100 mt-4">
                          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                              <IndianRupee className="text-gray-300 w-8 h-8" />
                          </div>
                          <h3 className="text-lg font-bold text-gray-900 mb-1">
                              {searchQuery ? 'No matching payments' : 'No earnings yet'}
                          </h3>
                          <p className="text-gray-400 text-sm">
                              {searchQuery ? 'Try a different search term.' : 'Complete service jobs to start earning!'}
                          </p>
                      </div>
                  )}
              </motion.div>
          </div>
      </div>
  );
};

export default WorkerEarnings;
