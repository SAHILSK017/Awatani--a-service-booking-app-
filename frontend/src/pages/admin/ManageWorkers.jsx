import React, { useEffect, useState } from 'react';
import { Badge } from '../../components/ui/Badge';
import { Briefcase, Loader2 } from 'lucide-react';
import { getAllUsers, getAllBookings } from '../../services/adminService';

const ManageWorkers = () => {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkersAndStats = async () => {
      try {
        const [usersData, bookingsData] = await Promise.all([getAllUsers(), getAllBookings()]);
        const workerProfiles = usersData.filter(u => u.role === 'worker');
        
        const workerMap = {};
        workerProfiles.forEach(w => workerMap[w._id] = { ...w, jobsCompleted: 0, totalGenerated: 0 });

        bookingsData.forEach(b => {
          if (b.status === 'completed' && b.worker && workerMap[b.worker._id]) {
            workerMap[b.worker._id].jobsCompleted += 1;
            workerMap[b.worker._id].totalGenerated += (b.service?.price || 0);
          }
        });

        setWorkers(Object.values(workerMap).sort((a,b) => b.jobsCompleted - a.jobsCompleted));
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    fetchWorkersAndStats();
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
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">Workforce Command</h1>
            <p className="text-indigo-900 font-medium">Monitor worker assignments and payload value generation.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-20 -mt-16">
          <div className="bg-white/90 backdrop-blur-xl border border-white/50 rounded-3xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-400 text-xs uppercase tracking-widest border-b border-gray-100 font-bold">
                  <tr>
                    <th className="px-6 py-4">Worker Database ID</th>
                    <th className="px-6 py-4">Profile Linked</th>
                    <th className="px-6 py-4 text-center">Lifecycle Completions</th>
                    <th className="px-6 py-4 text-right">Capital Flow Generated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 bg-white">
                  {workers.map((worker) => (
                    <tr key={worker._id} className="hover:bg-gray-50 transition-colors font-medium">
                      <td className="px-6 py-5 text-xs font-mono text-gray-400">
                        {worker._id}
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl border border-indigo-100 shadow-inner">
                            <Briefcase size={20} />
                          </div>
                          <div>
                            <div className="text-gray-900 text-lg font-bold">{worker.name}</div>
                            <div className="text-gray-500 text-sm mt-1">{worker.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <Badge variant={worker.jobsCompleted > 0 ? 'success' : 'indigo'} className="bg-emerald-100 text-emerald-700 shadow-sm px-4 py-1 font-black">
                          {worker.jobsCompleted}
                        </Badge>
                      </td>
                      <td className="px-6 py-5 text-right text-2xl font-black text-indigo-600">
                        ₹{worker.totalGenerated}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {workers.length === 0 && <div className="p-12 text-center text-gray-500 font-bold text-lg">No workers onboarded.</div>}
            </div>
          </div>
      </div>
    </div>
  );
};

export default ManageWorkers;
