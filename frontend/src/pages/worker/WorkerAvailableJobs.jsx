import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { MapPin, Calendar, Loader2, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';
import { getWorkerBookings, acceptBooking } from '../../services/bookingService';

const WorkerAvailableJobs = () => {
  const [availableJobs, setAvailableJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const jobsData = await getWorkerBookings();
      const pendingJobs = jobsData.filter(job => job.status === 'pending');
      setAvailableJobs(pendingJobs);
    } catch (err) {
      console.error("Failed to load worker jobs", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAcceptJob = async (id) => {
    try {
      await acceptBooking(id);
      fetchData(); // Refresh list
    } catch (err) {
      alert("Failed to accept job: " + (err.response?.data?.message || err.message));
    }
  };

  if (loading && availableJobs.length === 0) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-indigo-600 h-8 w-8" /></div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Available Jobs</h1>
        <p className="text-gray-500 text-sm mt-1">Claim jobs available in your vicinity.</p>
      </div>

      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {availableJobs.map((job) => (
            <motion.div key={job._id} whileHover={{ y: -4 }}>
                <Card className="h-full flex flex-col hover:border-indigo-100 transition-colors">
                <CardContent className="p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                                <Briefcase size={20} />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">{job.service?.name || "Service"}</h3>
                                <Badge variant="indigo">₹{job.service?.price}</Badge>
                            </div>
                        </div>
                    </div>
                    <div className="mb-6 space-y-2 text-sm text-gray-500">
                        <p className="flex items-center gap-2"><MapPin size={16} /> {job.address}</p>
                        <p className="flex items-center gap-2"><Calendar size={16} /> {job.bookingDate ? new Date(job.bookingDate).toLocaleDateString() : 'ASAP'}</p>
                    </div>
                    <div className="mt-auto flex gap-3">
                        <Button variant="secondary" className="flex-1">Ignore</Button>
                        <Button 
                            className="flex-1"
                            onClick={() => handleAcceptJob(job._id)}
                        >
                            Accept
                        </Button>
                    </div>
                </CardContent>
                </Card>
            </motion.div>
          ))}
          {availableJobs.length === 0 && <p className="text-gray-500 text-sm">No new jobs currently available.</p>}
        </div>
      </div>
    </div>
  );
};

export default WorkerAvailableJobs;
