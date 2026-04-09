import React, { useEffect, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Loader2, Briefcase } from 'lucide-react';
import { getAllUsers, getAllBookings } from '../../services/adminService';

const ManageWorkers = () => {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkersAndStats = async () => {
      try {
        const [usersData, bookingsData] = await Promise.all([
          getAllUsers(),
          getAllBookings()
        ]);
        
        // Filter strictly to Workers
        const workerList = usersData.filter(u => u.role === 'worker');

        // Aggregation logic to compute jobs finished per worker
        const workerMap = {};
        workerList.forEach(w => workerMap[w._id] = { ...w, jobsCompleted: 0, totalGenerated: 0 });

        bookingsData.forEach(job => {
          if (job.status === 'completed' && job.worker && workerMap[job.worker._id]) {
            workerMap[job.worker._id].jobsCompleted += 1;
            workerMap[job.worker._id].totalGenerated += job.service?.price || 0;
          }
        });

        // Convert back to Array
        const finalWorkers = Object.values(workerMap).sort((a,b) => b.jobsCompleted - a.jobsCompleted);
        setWorkers(finalWorkers);
      } catch (err) {
        console.error("Failed to load workers", err);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkersAndStats();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-screen bg-neutral-950"><Loader2 className="animate-spin text-indigo-500 h-10 w-10" /></div>;

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans pb-20 pt-10 px-8">
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Workforce Command</h1>
        <p className="text-neutral-400 mt-2">Monitor worker assignments and payload value generation.</p>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-[2rem] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-neutral-950/50 text-neutral-400 text-xs uppercase tracking-widest border-b border-neutral-800">
              <tr>
                <th className="px-6 py-4 font-medium">Worker Database ID</th>
                <th className="px-6 py-4 font-medium">Profile Linked</th>
                <th className="px-6 py-4 font-medium text-center">Jobs Computed</th>
                <th className="px-6 py-4 font-medium text-right">Value Generated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {workers.map((worker) => (
                <tr key={worker._id} className="hover:bg-neutral-900/50 transition-colors border-b border-neutral-800 last:border-0 font-medium">
                  <td className="px-6 py-5 text-xs font-mono text-neutral-600">
                    {worker._id}
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-2xl border border-indigo-500/20">
                        <Briefcase size={20} />
                      </div>
                      <div>
                        <div className="text-white text-base font-bold">{worker.name}</div>
                        <div className="text-neutral-500 text-sm font-normal tracking-wide">{worker.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <Badge variant={worker.jobsCompleted > 0 ? 'success' : 'indigo'} className="bg-emerald-900/40 text-emerald-300 border border-emerald-700/50 px-3 py-1">
                      {worker.jobsCompleted}
                    </Badge>
                  </td>
                  <td className="px-6 py-5 text-right text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">
                    ₹{worker.totalGenerated}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {workers.length === 0 && <div className="p-12 text-center text-neutral-500 text-lg">No workers onboarded.</div>}
        </div>
      </div>
    </div>
  );
};

export default ManageWorkers;
