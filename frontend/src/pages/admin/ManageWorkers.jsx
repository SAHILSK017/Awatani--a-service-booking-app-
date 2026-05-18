import React, { useEffect, useState } from 'react';
import { Badge } from '../../components/ui/Badge';
import { Briefcase, Loader2, UserX, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { getAllUsers, getAllBookings, deleteUser } from '../../services/adminService';

const ManageWorkers = () => {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal & Action states
  const [deleteConfirmWorker, setDeleteConfirmWorker] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Premium Toast Notification State
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
  };

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
    } catch (err) { 
      console.error(err); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchWorkersAndStats();
  }, []);

  const handleDeleteWorker = async (id) => {
    setActionLoading(true);
    try {
      await deleteUser(id);
      setDeleteConfirmWorker(null);
      showToast('Worker successfully deleted!', 'success');
      fetchWorkersAndStats();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete worker', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen bg-gray-50"><Loader2 className="animate-spin text-indigo-600 h-10 w-10" /></div>;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-20">
      
      {/* Floating Premium Toast Notification */}
      {toast.show && (
        <div className={`fixed top-6 right-6 z-[9999] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border backdrop-blur-xl transition-all duration-500 animate-fade-in ${
          toast.type === 'success' 
            ? 'bg-emerald-50/95 border-emerald-200 text-emerald-800' 
            : 'bg-rose-50/95 border-rose-200 text-rose-800'
        }`}>
          <div className={`h-8 w-8 rounded-xl flex items-center justify-center shrink-0 shadow-inner ${
            toast.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
          }`}>
            {toast.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          </div>
          <span className="font-bold text-sm tracking-wide">{toast.message}</span>
        </div>
      )}

      {/* Light Header */}
      <div className="relative h-72 w-full bg-slate-900 overflow-hidden flex items-center justify-center mb-10 shadow-lg">
        <div className="absolute inset-0">
          <img src="/customer_hero.png" alt="Premium Header" className="w-full h-full object-cover opacity-50 mix-blend-overlay filter blur-[2px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-transparent to-indigo-900/60" />
        </div>
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8 text-left pt-10">
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">Manage Workers</h1>
            <p className="text-indigo-900 font-medium">View worker performance, completed jobs, and earnings.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-20 -mt-16">
          <div className="bg-white/90 backdrop-blur-xl border border-white/50 rounded-3xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-400 text-xs uppercase tracking-widest border-b border-gray-100 font-bold">
                  <tr>
                    <th className="px-6 py-4">Worker ID</th>
                    <th className="px-6 py-4">Worker</th>
                    <th className="px-6 py-4 text-center">Jobs Completed</th>
                    <th className="px-6 py-4">Total Earned</th>
                    <th className="px-6 py-4 text-right">Action</th>
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
                      <td className="px-6 py-5 text-2xl font-black text-indigo-600 font-mono">
                        ₹{worker.totalGenerated}
                      </td>
                      <td className="px-6 py-5 text-right">
                        <button 
                          onClick={() => setDeleteConfirmWorker(worker)}
                          className="p-3 text-red-500 hover:text-white bg-red-50 hover:bg-red-500 rounded-2xl transition-colors shadow-sm"
                          title="Delete Worker"
                        >
                          <UserX size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {workers.length === 0 && <div className="p-12 text-center text-gray-500 font-bold text-lg">No workers onboarded.</div>}
            </div>
          </div>
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmWorker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 p-8 space-y-6 transform transition-all duration-300">
            <div className="h-16 w-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center text-2xl mx-auto shadow-inner">
              <UserX size={28} />
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-black text-gray-900">Delete Worker</h3>
              <p className="text-gray-500 mt-2">
                Are you sure you want to permanently delete <strong className="text-gray-900 font-bold">{deleteConfirmWorker.name}</strong>? This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-4 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmWorker(null)}
                className="w-1/2 py-4 border border-gray-200 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 transition-colors shadow-sm"
              >
                Keep Worker
              </button>
              <button
                onClick={() => handleDeleteWorker(deleteConfirmWorker._id)}
                disabled={actionLoading}
                className="w-1/2 py-4 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-bold shadow-lg shadow-red-500/20 flex items-center justify-center transition-all duration-300"
              >
                {actionLoading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ManageWorkers;
