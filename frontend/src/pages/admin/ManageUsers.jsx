import React, { useEffect, useState } from 'react';
import { Badge } from '../../components/ui/Badge';
import { UserX, Loader2 } from 'lucide-react';
import { getAllUsers } from '../../services/adminService';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers();
        setUsers(data.filter(u => u.role === 'user'));
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    fetchUsers();
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
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">Customer Register</h1>
            <p className="text-indigo-900 font-medium">Active consumer telemetry and profiles.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-20 -mt-16">
          <div className="bg-white/90 backdrop-blur-xl border border-white/50 rounded-3xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-400 text-xs uppercase tracking-widest border-b border-gray-100 font-bold">
                  <tr>
                    <th className="px-6 py-4">Customer Profile</th>
                    <th className="px-6 py-4">Joined Date</th>
                    <th className="px-6 py-4">State</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 bg-white">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50 transition-colors font-medium">
                      <td className="px-6 py-5">
                        <div className="text-gray-900 font-bold text-lg">{user.name}</div>
                        <div className="text-gray-500 text-sm mt-1">{user.email}</div>
                      </td>
                      <td className="px-6 py-5 text-gray-500">
                        {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-5">
                        <Badge variant="success" className="bg-emerald-100 text-emerald-700 shadow-sm px-3 py-1 font-bold">Active</Badge>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <button className="p-3 text-red-500 hover:text-white bg-red-50 hover:bg-red-500 rounded-2xl transition-colors shadow-sm">
                          <UserX size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {users.length === 0 && <div className="p-12 text-center text-gray-500 font-bold text-lg">No customers initialized.</div>}
            </div>
          </div>
      </div>
    </div>
  );
};

export default ManageUsers;
