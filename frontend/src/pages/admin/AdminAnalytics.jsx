import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Loader2 } from 'lucide-react';
import { getAllBookings } from '../../services/adminService';
import { getServices } from '../../services/categoryService';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend
} from 'recharts';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

const AdminAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
      earningsTimeline: [],
      categoryDistribution: [],
      jobStatus: []
  });

  useEffect(() => {
      const generateAnalytics = async () => {
          try {
              const [bookings, services] = await Promise.all([
                  getAllBookings(),
                  getServices()
              ]);

              // 1. Job Status Distro (Pending, Accepted, Completed)
              let statuses = { pending: 0, accepted: 0, completed: 0 };
              bookings.forEach(b => { if (statuses[b.status] !== undefined) statuses[b.status]++ });
              
              const jobStatusData = [
                  { name: 'Pending', count: statuses.pending, fill: '#f59e0b' },
                  { name: 'In Progress', count: statuses.accepted, fill: '#6366f1' },
                  { name: 'Completed', count: statuses.completed, fill: '#10b981' }
              ];

              // 2. Category Pie Chart
              const categoryMap = {};
              services.forEach(s => {
                  const catName = s.category?.name || 'Uncategorized';
                  categoryMap[catName] = 0;
              });
              
              // Count bookings per category
              bookings.forEach(b => {
                  const catName = b.service?.category?.name || 'Uncategorized';
                  if (categoryMap[catName] !== undefined) {
                      categoryMap[catName]++;
                  } else {
                      categoryMap[catName] = 1;
                  }
              });

              const categoryData = Object.keys(categoryMap).map(key => ({
                  name: key,
                  value: categoryMap[key]
              })).filter(c => c.value > 0);

              // 3. Earnings Timeline (last 7 days simulation based on created/updated dates)
              // We'll aggregate revenue per Date string.
              const timelineMap = {};
              bookings.forEach(b => {
                 if (b.status === 'completed') {
                     const dateStr = new Date(b.updatedAt || b.createdAt).toLocaleDateString();
                     timelineMap[dateStr] = (timelineMap[dateStr] || 0) + (b.service?.price || 0);
                 }
              });

              const timelineData = Object.keys(timelineMap).map(date => ({
                  date,
                  revenue: timelineMap[date]
              })).sort((a,b) => new Date(a.date) - new Date(b.date));

              setData({
                  earningsTimeline: timelineData,
                  categoryDistribution: categoryData,
                  jobStatus: jobStatusData
              });

          } catch (err) {
              console.error("Analytics Generation Failed", err);
          } finally {
              setLoading(false);
          }
      };
      
      generateAnalytics();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-indigo-600 h-8 w-8" /></div>;
  }

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Platform Analytics</h1>
        <p className="text-gray-500 text-sm mt-1">Graphical representation of your business telemetry.</p>
      </div>

      <Card className="p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Revenue Timeline</h2>
          <div className="h-80 w-full">
              {data.earningsTimeline.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data.earningsTimeline}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis dataKey="date" stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val}`} />
                        <RechartsTooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        <Line type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={4} dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                    </LineChart>
                </ResponsiveContainer>
              ) : (
                  <div className="h-full flex items-center justify-center text-gray-500">Not enough revenue data to chart.</div>
              )}
          </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Workload State</h2>
              <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data.jobStatus} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                          <XAxis dataKey="name" stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
                          <YAxis stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
                          <RechartsTooltip cursor={{ fill: '#F3F4F6' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                              {data.jobStatus.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.fill} />
                              ))}
                          </Bar>
                      </BarChart>
                  </ResponsiveContainer>
              </div>
          </Card>

          <Card className="p-6 relative">
              <h2 className="text-lg font-bold text-gray-900 mb-2">Service Demand Distribution</h2>
              <div className="h-64 w-full">
                  {data.categoryDistribution.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                              <Pie
                                  data={data.categoryDistribution}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={60}
                                  outerRadius={90}
                                  paddingAngle={5}
                                  dataKey="value"
                              >
                                  {data.categoryDistribution.map((entry, index) => (
                                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                  ))}
                              </Pie>
                              <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                              <Legend verticalAlign="bottom" height={36} iconType="circle" />
                          </PieChart>
                      </ResponsiveContainer>
                  ) : (
                      <div className="h-full flex items-center justify-center text-gray-500">Not enough category data to chart.</div>
                  )}
              </div>
          </Card>
      </div>
    </div>
  );
};

export default AdminAnalytics;
