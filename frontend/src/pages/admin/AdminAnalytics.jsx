import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { getAllBookings } from '../../services/adminService';
import { getServices } from '../../services/categoryService';
import { motion } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend
} from 'recharts';

const COLORS = ['#818cf8', '#34d399', '#fbbf24', '#f87171', '#c084fc', '#22d3ee'];

const AdminAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ earningsTimeline: [], categoryDistribution: [], jobStatus: [] });

  useEffect(() => {
      const generateAnalytics = async () => {
          try {
              const [bookings, services] = await Promise.all([getAllBookings(), getServices()]);
              let statuses = { pending: 0, accepted: 0, completed: 0 };
              bookings.forEach(b => { if (statuses[b.status] !== undefined) statuses[b.status]++ });
              
              const jobStatusData = [
                  { name: 'Pending', count: statuses.pending, fill: '#fbbf24' },
                  { name: 'In Progress', count: statuses.accepted, fill: '#818cf8' },
                  { name: 'Completed', count: statuses.completed, fill: '#34d399' }
              ];

              const categoryMap = {};
              services.forEach(s => categoryMap[s.category?.name || 'Uncategorized'] = 0);
              bookings.forEach(b => {
                  const catName = b.service?.category?.name || 'Uncategorized';
                  categoryMap[catName] = (categoryMap[catName] || 0) + 1;
              });
              const categoryData = Object.keys(categoryMap).map(key => ({ name: key, value: categoryMap[key] })).filter(c => c.value > 0);

              const timelineMap = {};
              bookings.forEach(b => {
                 if (b.status === 'completed') {
                     const dateStr = new Date(b.updatedAt || b.createdAt).toLocaleDateString();
                     timelineMap[dateStr] = (timelineMap[dateStr] || 0) + (b.service?.price || 0);
                 }
              });
              const timelineData = Object.keys(timelineMap).map(date => ({ date, revenue: timelineMap[date] })).sort((a,b) => new Date(a.date) - new Date(b.date));
              setData({ earningsTimeline: timelineData, categoryDistribution: categoryData, jobStatus: jobStatusData });
          } catch (err) { console.error(err); } finally { setLoading(false); }
      };
      generateAnalytics();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-screen bg-gray-50"><Loader2 className="animate-spin text-indigo-600 h-10 w-10" /></div>;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-20">
      
      {/* Light Header */}
      <div className="relative h-72 w-full bg-slate-900 overflow-hidden flex items-center justify-center mb-10 shadow-lg">
        <div className="absolute inset-0">
          <img src="/customer_hero.png" alt="Premium Header" className="w-full h-full object-cover opacity-50 mix-blend-overlay filter blur-[2px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-transparent to-indigo-900/60" />
        </div>
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8 text-left pt-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">Platform Analytics</h1>
            <p className="text-indigo-900 font-medium">Real-time graphical telemetry of your business engine.</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-8 relative z-20 -mt-16">
        
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
            <div className="bg-white/90 backdrop-blur-xl border border-white/50 rounded-3xl p-8 shadow-xl">
                <h2 className="text-lg font-bold text-gray-900 mb-8 flex items-center gap-3"><span className="w-2 h-6 bg-indigo-500 rounded-full" /> Revenue Trajectory</h2>
                <div className="h-80 w-full">
                    {data.earningsTimeline.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data.earningsTimeline}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
                                <XAxis dataKey="date" stroke="#737373" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#737373" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val}`} />
                                <RechartsTooltip cursor={{ stroke: '#e5e5e5', strokeWidth: 1, strokeDasharray: '5 5' }} contentStyle={{ backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #e5e5e5', color: '#111827', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} />
                                <Line type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={4} dot={{ r: 4, fill: '#4f46e5', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6, fill: '#4f46e5' }} />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : <div className="h-full flex items-center justify-center text-gray-400 font-medium">Insufficient Data.</div>}
                </div>
            </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <div className="bg-white/90 backdrop-blur-xl border border-white/50 rounded-3xl p-8 shadow-xl">
                  <h2 className="text-lg font-bold text-gray-900 mb-8 flex items-center gap-3"><span className="w-2 h-6 bg-emerald-500 rounded-full" /> Operational Workload</h2>
                  <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={data.jobStatus} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                              <XAxis dataKey="name" stroke="#737373" fontSize={12} tickLine={false} axisLine={false} />
                              <YAxis stroke="#737373" fontSize={12} tickLine={false} axisLine={false} />
                              <RechartsTooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #e5e5e5', color: '#111827', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} />
                              <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                                  {data.jobStatus.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                              </Bar>
                          </BarChart>
                      </ResponsiveContainer>
                  </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <div className="bg-white/90 backdrop-blur-xl border border-white/50 rounded-3xl p-8 shadow-xl">
                  <h2 className="text-lg font-bold text-gray-900 mb-8 flex items-center gap-3"><span className="w-2 h-6 bg-purple-500 rounded-full" /> Service Matrix Allocation</h2>
                  <div className="h-64 w-full">
                      {data.categoryDistribution.length > 0 ? (
                          <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                  <Pie data={data.categoryDistribution} cx="50%" cy="50%" innerRadius={70} outerRadius={90} paddingAngle={5} stroke="none" dataKey="value">
                                      {data.categoryDistribution.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                  </Pie>
                                  <RechartsTooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #e5e5e5', color: '#111827', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} />
                                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ color: '#4b5563', fontSize: '12px', fontWeight: 'bold' }}/>
                              </PieChart>
                          </ResponsiveContainer>
                      ) : <div className="h-full flex items-center justify-center text-gray-400 font-medium">Insufficient Data.</div>}
                  </div>
              </div>
            </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
