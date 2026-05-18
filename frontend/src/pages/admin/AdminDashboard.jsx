import React, { useEffect, useState } from 'react';
import { Badge } from '../../components/ui/Badge';
import { Users, Briefcase, Activity, IndianRupee, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { getAllUsers, getAllBookings, getAllServices } from '../../services/adminService';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalWorkers: 0, totalRevenue: 0, activeServices: 0 });
  const [usersList, setUsersList] = useState([]);
  const [workersList, setWorkersList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersData, bookingsData, servicesData] = await Promise.all([
          getAllUsers(), getAllBookings(), getAllServices()
        ]);
        let revenue = 0; bookingsData.forEach(b => { if (b.status === 'completed') revenue += b.service?.price || 0; });
        const regUsers = usersData.filter(u => u.role === 'user');
        const regWorkers = usersData.filter(u => u.role === 'worker');

        setStats({ totalUsers: regUsers.length, totalWorkers: regWorkers.length, totalRevenue: revenue, activeServices: servicesData.length });
        setUsersList(regUsers.slice(0, 5));
        
        const workerMap = {};
        regWorkers.forEach(w => workerMap[w._id] = { ...w, jobsCompleted: 0 });
        bookingsData.forEach(b => { if (b.status === 'completed' && b.worker && workerMap[b.worker._id]) workerMap[b.worker._id].jobsCompleted += 1; });
        
        setWorkersList(Object.values(workerMap).sort((a, b) => b.jobsCompleted - a.jobsCompleted).slice(0, 5));
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const statCards = [
    { title: 'Platform Users', value: stats.totalUsers, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { title: 'Workers', value: stats.totalWorkers, icon: Briefcase, color: 'text-purple-600', bg: 'bg-purple-100' },
    { title: 'Active Services', value: stats.activeServices, icon: Activity, color: 'text-sky-600', bg: 'bg-sky-100' },
    { title: 'Gross Revenue', value: `₹${stats.totalRevenue}`, icon: IndianRupee, color: 'text-emerald-600', bg: 'bg-emerald-100' },
  ];

  if (loading) return <div className="flex justify-center items-center h-screen bg-gray-50"><Loader2 className="animate-spin text-indigo-600 h-10 w-10" /></div>;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-20 font-sans">
      
      {/* Light Mode Command Header */}
      <div className="relative h-96 w-full overflow-hidden shadow-xl mb-12">
        <div className="absolute inset-0">
            <img src="/customer_hero.png" alt="Admin Dashboard" className="w-full h-full object-cover opacity-60 mix-blend-overlay filter blur-[1px]" />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-transparent to-indigo-900/60" />
        </div>
        
        <div className="absolute bottom-12 left-10 z-10 w-full max-w-7xl px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="px-4 py-1.5 bg-white/40 backdrop-blur-md rounded-full text-xs font-black tracking-widest text-indigo-900 mb-4 inline-block shadow-sm">ADMIN PANEL</span>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900 drop-shadow-sm leading-none mb-3">Admin Dashboard</h1>
            <p className="text-lg text-indigo-900 font-medium max-w-xl">Manage users, workers, services, and platform activity.</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-20 -mt-16">
        
        {/* Light Glass Stats */}
        <motion.div initial="hidden" animate="show" variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {statCards.map((stat, idx) => (
            <motion.div key={idx} variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } }} 
              className={`bg-white/90 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/50 overflow-hidden relative group`}
            >
              <div className={`p-4 rounded-2xl w-max ${stat.bg} ${stat.color} mb-6 shadow-inner`}>
                  <stat.icon className="h-8 w-8" />
              </div>
              <div>
                <p className="text-gray-500 font-bold text-sm uppercase tracking-widest mb-1">{stat.title}</p>
                <p className="text-4xl font-extrabold text-gray-900 tracking-tight">{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Light Table: Customers */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-[2.5rem] overflow-hidden shadow-2xl">
            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-white/50">
              <h3 className="text-xl font-extrabold text-gray-900 flex items-center gap-3"><Users className="text-indigo-600"/> Registered Users</h3>
            </div>
            <div className="p-6">
              <div className="bg-white rounded-[2rem] overflow-hidden border border-gray-50 shadow-sm">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-400 text-xs uppercase tracking-widest font-bold">
                      <tr><th className="px-6 py-4">User</th><th className="px-6 py-4 text-right">Role</th></tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 font-medium">
                      {usersList.map((user) => (
                        <tr key={user._id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-5"><div className="text-gray-900 font-bold">{user.name}</div><div className="text-gray-500 font-medium mt-1">{user.email}</div></td>
                          <td className="px-6 py-5 text-right"><Badge variant="indigo" className="font-bold tracking-wider">{user.role}</Badge></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
              </div>
            </div>
          </motion.div>

          {/* Light Table: Workers */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-[2.5rem] overflow-hidden shadow-2xl">
            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-white/50">
              <h3 className="text-xl font-extrabold text-gray-900 flex items-center gap-3"><Briefcase className="text-purple-600"/> Top Workers</h3>
            </div>
            <div className="p-6">
               <div className="bg-white rounded-[2rem] overflow-hidden border border-gray-50 shadow-sm">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-400 text-xs uppercase tracking-widest font-bold">
                      <tr><th className="px-6 py-4">Worker</th><th className="px-6 py-4 text-center">Jobs Done</th></tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 font-medium">
                      {workersList.map((worker) => (
                        <tr key={worker._id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-5"><div className="text-gray-900 font-bold">{worker.name}</div><div className="text-gray-500 font-medium mt-1">{worker.email}</div></td>
                          <td className="px-6 py-5 text-center"><Badge variant="success" className="font-bold tracking-wider">{worker.jobsCompleted}</Badge></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
               </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;