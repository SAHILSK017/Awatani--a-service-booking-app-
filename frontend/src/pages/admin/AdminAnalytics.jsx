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

  if (loading) return <div className="flex justify-center items-center h-screen bg-neutral-950"><Loader2 className="animate-spin text-indigo-500 h-10 w-10" /></div>;

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans pb-20">
      
      {/* Header */}
      <div className="pt-12 px-10 pb-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">Platform Analytics</h1>
          <p className="text-neutral-400 text-sm">Real-time graphical telemetry of your business engine.</p>
        </motion.div>
      </div>

      <div className="max-w-[1400px] mx-auto px-10 space-y-8">
        
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
            <div className="bg-neutral-900/60 backdrop-blur-xl border border-neutral-800 rounded-[2rem] p-8 shadow-2xl">
                <h2 className="text-lg font-bold text-white mb-8 flex items-center gap-3"><span className="w-2 h-6 bg-indigo-500 rounded-full" /> Revenue Trajectory</h2>
                <div className="h-80 w-full">
                    {data.earningsTimeline.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data.earningsTimeline}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#262626" />
                                <XAxis dataKey="date" stroke="#737373" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#737373" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val}`} />
                                <RechartsTooltip cursor={{ stroke: '#404040', strokeWidth: 1, strokeDasharray: '5 5' }} contentStyle={{ backgroundColor: '#171717', borderRadius: '12px', border: '1px solid #262626', color: '#fff' }} />
                                <Line type="monotone" dataKey="revenue" stroke="#818cf8" strokeWidth={4} dot={{ r: 4, fill: '#818cf8', strokeWidth: 2, stroke: '#171717' }} activeDot={{ r: 6, fill: '#fff' }} />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : <div className="h-full flex items-center justify-center text-neutral-600">Insufficient Data.</div>}
                </div>
            </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <div className="bg-neutral-900/60 backdrop-blur-xl border border-neutral-800 rounded-[2rem] p-8 shadow-2xl">
                  <h2 className="text-lg font-bold text-white mb-8 flex items-center gap-3"><span className="w-2 h-6 bg-emerald-500 rounded-full" /> Operational Workload</h2>
                  <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={data.jobStatus} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                              <XAxis dataKey="name" stroke="#737373" fontSize={12} tickLine={false} axisLine={false} />
                              <YAxis stroke="#737373" fontSize={12} tickLine={false} axisLine={false} />
                              <RechartsTooltip cursor={{ fill: '#262626' }} contentStyle={{ backgroundColor: '#171717', borderRadius: '12px', border: '1px solid #262626', color: '#fff' }} />
                              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                                  {data.jobStatus.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                              </Bar>
                          </BarChart>
                      </ResponsiveContainer>
                  </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <div className="bg-neutral-900/60 backdrop-blur-xl border border-neutral-800 rounded-[2rem] p-8 shadow-2xl">
                  <h2 className="text-lg font-bold text-white mb-8 flex items-center gap-3"><span className="w-2 h-6 bg-fuchsia-500 rounded-full" /> Service Matrix Allocation</h2>
                  <div className="h-64 w-full">
                      {data.categoryDistribution.length > 0 ? (
                          <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                  <Pie data={data.categoryDistribution} cx="50%" cy="50%" innerRadius={70} outerRadius={90} paddingAngle={5} stroke="none" dataKey="value">
                                      {data.categoryDistribution.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                  </Pie>
                                  <RechartsTooltip contentStyle={{ backgroundColor: '#171717', borderRadius: '12px', border: '1px solid #262626', color: '#fff' }} />
                                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ color: '#a3a3a3', fontSize: '12px' }}/>
                              </PieChart>
                          </ResponsiveContainer>
                      ) : <div className="h-full flex items-center justify-center text-neutral-600">Insufficient Data.</div>}
                  </div>
              </div>
            </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
