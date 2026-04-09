import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Briefcase, CheckCircle, IndianRupee, MapPin, Calendar, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { getWorkerBookings } from '../../services/bookingService';

const WorkerDashboard = () => {
  const [stats, setStats] = useState({ totalJobs: 0, completedJobs: 0, earnings: 0 });
  const [historyJobs, setHistoryJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const jobsData = await getWorkerBookings();
      
      let completedCount = 0;
      let totalEarnings = 0;
      let history = [];
      
      const currentUser = JSON.parse(localStorage.getItem('user'));
      
      jobsData.forEach(job => {
        if (job.worker?._id === currentUser.id) {
            history.push(job);
            if (job.status === 'completed') {
                completedCount++;
                totalEarnings += job.service?.price || 0;
            }
        }
      });

      setStats({
        totalJobs: history.length,
        completedJobs: completedCount,
        earnings: totalEarnings
      });

      setHistoryJobs(history.reverse()); // latest first
    } catch (err) {
      console.error("Failed to load worker jobs", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const statCards = [
    { title: 'Total Assigned Jobs', value: stats.totalJobs, icon: Briefcase, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { title: 'Completed', value: stats.completedJobs, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
    { title: 'Est. Earnings', value: `₹${stats.earnings}`, icon: IndianRupee, color: 'text-yellow-600', bg: 'bg-yellow-100' },
  ];

  if (loading && historyJobs.length === 0) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-indigo-600 h-8 w-8" /></div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Worker Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Snapshot of your overall activity and job history.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, idx) => (
          <motion.div key={idx} whileHover={{ y: -4 }}>
            <Card>
              <CardContent className="flex items-center p-6">
                <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} mr-4`}>
                  <stat.icon size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* History List */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Job History</h2>
        <div className="space-y-4">
          {historyJobs.map((job) => (
            <Card key={job._id} className="hover:border-indigo-100 transition-colors">
              <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{job.service?.name || "Service"}</h3>
                    <Badge variant={job.status === 'completed' ? 'success' : 'indigo'} className="uppercase">
                        {job.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><MapPin size={14} /> {job.address}</span>
                    <span className="flex items-center gap-1"><Calendar size={14} /> {job.bookingDate ? new Date(job.bookingDate).toLocaleDateString() : new Date(job.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="text-right">
                    <p className="text-xl font-bold text-gray-900">₹{job.service?.price}</p>
                </div>
              </CardContent>
            </Card>
          ))}
          {historyJobs.length === 0 && <p className="text-gray-500 text-sm">No job history found.</p>}
        </div>
      </div>
    </div>
  );
};

export default WorkerDashboard;