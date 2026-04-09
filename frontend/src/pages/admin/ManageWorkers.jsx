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

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-indigo-600 h-8 w-8" /></div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Manage Workforce</h1>
        <p className="text-gray-500 text-sm mt-1">Monitor your service providers and their completed job stats.</p>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="px-6 py-4 font-medium">Worker Database ID</th>
                <th className="px-6 py-4 font-medium">Profile Linked</th>
                <th className="px-6 py-4 font-medium text-center">Jobs Computed</th>
                <th className="px-6 py-4 font-medium text-right">Value Generated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {workers.map((worker) => (
                <tr key={worker._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-xs font-mono text-gray-400">
                    {worker._id}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                        <Briefcase size={16} />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{worker.name}</div>
                        <div className="text-gray-500 text-xs">{worker.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Badge variant={worker.jobsCompleted > 0 ? 'success' : 'indigo'}>
                      {worker.jobsCompleted}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-gray-900">
                    ₹{worker.totalGenerated}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {workers.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No workers found. Assign roles or onboard accounts!
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ManageWorkers;
