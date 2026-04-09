import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { IndianRupee, CalendarCheck, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { getWorkerBookings } from '../../services/bookingService';

const WorkerEarnings = () => {
  const [completedJobs, setCompletedJobs] = useState([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const jobsData = await getWorkerBookings();
      const currentUser = JSON.parse(localStorage.getItem('user'));
      
      let sum = 0;
      const history = jobsData.filter(job => {
          if (job.worker?._id === currentUser.id && job.status === 'completed') {
              sum += job.service?.price || 0;
              return true;
          }
          return false;
      });

      setTotalEarnings(sum);
      setCompletedJobs(history);
    } catch (err) {
      console.error("Failed to load worker earnings", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-indigo-600 h-8 w-8" /></div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Earnings</h1>
        <p className="text-gray-500 text-sm mt-1">Detailed breakdown of your completed job revenues.</p>
      </div>

      <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <Card className="bg-gradient-to-r from-gray-900 to-indigo-900 text-white">
              <CardContent className="p-8 flex items-center justify-between">
                  <div>
                      <p className="text-gray-300 font-medium mb-1">Total Verified Earnings</p>
                      <h2 className="text-4xl font-extrabold">₹{totalEarnings}</h2>
                  </div>
                  <div className="p-4 bg-white/10 rounded-full">
                      <IndianRupee size={40} className="text-yellow-400" />
                  </div>
              </CardContent>
          </Card>
      </motion.div>

      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"><CalendarCheck size={20} /> Transaction Ledger</h2>
        <Card className="overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                        <tr>
                            <th className="px-6 py-4 font-medium">Service Name</th>
                            <th className="px-6 py-4 font-medium">Date Completed</th>
                            <th className="px-6 py-4 font-medium">Status</th>
                            <th className="px-6 py-4 font-medium text-right">Amount Earned</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {completedJobs.map(job => (
                            <tr key={job._id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4 font-medium text-gray-900">{job.service?.name}</td>
                                <td className="px-6 py-4 text-gray-500">
                                    {new Date(job.updatedAt || job.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4">
                                    <Badge variant="success">Paid</Badge>
                                </td>
                                <td className="px-6 py-4 text-right font-bold text-green-600">
                                    +₹{job.service?.price}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {completedJobs.length === 0 && <div className="p-8 text-center text-gray-500">No earnings recorded yet.</div>}
            </div>
        </Card>
      </div>
    </div>
  );
};

export default WorkerEarnings;
