import React, { useEffect, useState } from 'react';
import { Badge } from '../../components/ui/Badge';
import { Users, Briefcase, Activity, IndianRupee, MoreVertical, Loader2 } from 'lucide-react';
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
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statCards = [
    { title: 'Platform Users', value: stats.totalUsers, icon: Users, color: 'text-indigo-400', border: 'border-indigo-500/30' },
    { title: 'Workforce Hub', value: stats.totalWorkers, icon: Briefcase, color: 'text-purple-400', border: 'border-purple-500/30' },
    { title: 'Active Services', value: stats.activeServices, icon: Activity, color: 'text-cyan-400', border: 'border-cyan-500/30' },
    { title: 'Gross Revenue', value: `₹${stats.totalRevenue}`, icon: IndianRupee, color: 'text-emerald-400', border: 'border-emerald-500/30' },
  ];

  if (loading) return <div className="flex justify-center items-center h-screen bg-gray-950"><Loader2 className="animate-spin text-indigo-500 h-10 w-10" /></div>;

  return (
    <div className="min-h-screen bg-neutral-950 text-white pb-20 font-sans">
      
      {/* Command Node Header */}
      <div className="relative h-96 w-full overflow-hidden shadow-2xl">
        <img src="/admin_command.png" alt="Admin Master Node" className="absolute inset-0 w-full h-full object-cover opacity-70 mix-blend-lighten" />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent" />
        
        <div className="absolute bottom-12 left-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold tracking-widest uppercase border border-white/20 mb-4 inline-block text-indigo-200">System Administrator</span>
            <h1 className="text-5xl font-black tracking-tight text-white drop-shadow-lg leading-none mb-2">Master Control Node</h1>
            <p className="text-lg text-neutral-400 font-medium max-w-xl">Centralized telemetry and structural oversight for the Avatani infrastructure.</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 -mt-8 relative z-20">
        
        {/* Neon Glass Stats */}
        <motion.div initial="hidden" animate="show" variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {statCards.map((stat, idx) => (
            <motion.div key={idx} variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } }} 
              className={`bg-neutral-900/80 backdrop-blur-xl rounded-[2rem] p-6 border ${stat.border} shadow-2xl overflow-hidden relative group`}
            >
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors" />
              <stat.icon className={`h-8 w-8 ${stat.color} mb-6`} />
              <div>
                <p className="text-neutral-400 font-semibold text-sm uppercase tracking-wider mb-1">{stat.title}</p>
                <p className="text-4xl font-extrabold text-white tracking-tight">{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Frosted Table: Customers */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="bg-neutral-900 border border-neutral-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
            <div className="px-8 py-6 border-b border-neutral-800 flex justify-between items-center bg-neutral-900/50">
              <h3 className="text-xl font-bold text-white flex items-center gap-3"><Users className="text-indigo-400"/> Newest Deployments (Users)</h3>
            </div>
            <div className="p-4">
              <div className="bg-neutral-950 rounded-3xl overflow-hidden border border-neutral-800">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-neutral-900 text-neutral-400 text-xs uppercase tracking-widest border-b border-neutral-800">
                      <tr><th className="px-6 py-4">Data Profile</th><th className="px-6 py-4 text-right">Clearance</th></tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800 font-medium">
                      {usersList.map((user) => (
                        <tr key={user._id} className="hover:bg-neutral-900 transition-colors">
                          <td className="px-6 py-4"><div className="text-white">{user.name}</div><div className="text-neutral-500 text-xs">{user.email}</div></td>
                          <td className="px-6 py-4 text-right"><Badge variant="indigo" className="bg-indigo-900/50 text-indigo-300 border border-indigo-700/50">{user.role}</Badge></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
              </div>
            </div>
          </motion.div>

          {/* Frosted Table: Workers */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="bg-neutral-900 border border-neutral-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
            <div className="px-8 py-6 border-b border-neutral-800 flex justify-between items-center bg-neutral-900/50">
              <h3 className="text-xl font-bold text-white flex items-center gap-3"><Briefcase className="text-purple-400"/> Operational Forces (Top Workers)</h3>
            </div>
            <div className="p-4">
               <div className="bg-neutral-950 rounded-3xl overflow-hidden border border-neutral-800">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-neutral-900 text-neutral-400 text-xs uppercase tracking-widest border-b border-neutral-800">
                      <tr><th className="px-6 py-4">Node Profile</th><th className="px-6 py-4 text-center">Executed</th></tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800 font-medium">
                      {workersList.map((worker) => (
                        <tr key={worker._id} className="hover:bg-neutral-900 transition-colors">
                          <td className="px-6 py-4"><div className="text-white">{worker.name}</div><div className="text-neutral-500 text-xs">{worker.email}</div></td>
                          <td className="px-6 py-4 text-center"><Badge variant="success" className="bg-emerald-900/50 text-emerald-400 border border-emerald-700/50">{worker.jobsCompleted}</Badge></td>
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