import React from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { mockData } from '../../data/mockData';
import { Briefcase, CheckCircle, DollarSign, MapPin, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

const WorkerDashboard = () => {
  const { workerStats, availableJobs } = mockData;

  const statCards = [
    { title: 'Total Jobs', value: workerStats.totalJobs, icon: Briefcase, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { title: 'Completed', value: workerStats.completedJobs, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
    { title: 'Earnings', value: workerStats.earnings, icon: DollarSign, color: 'text-yellow-600', bg: 'bg-yellow-100' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Worker Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your active jobs and track earnings.</p>
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

      {/* Available Jobs List */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Available Jobs near you</h2>
        <div className="space-y-4">
          {availableJobs.map((job) => (
            <Card key={job.id} className="hover:border-indigo-100 transition-colors">
              <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                    <Badge variant="indigo">{job.price}</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><MapPin size={14} /> {job.location}</span>
                    <span className="flex items-center gap-1"><Calendar size={14} /> {job.date}</span>
                  </div>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button variant="secondary" className="flex-1 sm:flex-none">Reject</Button>
                  <Button className="flex-1 sm:flex-none">Accept Job</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorkerDashboard;