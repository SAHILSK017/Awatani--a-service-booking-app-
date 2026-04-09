import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Loader2, UserX } from 'lucide-react';
import { getAllUsers } from '../../services/adminService';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers();
        // Filter strictly to Customers ('user')
        const customers = data.filter(u => u.role === 'user');
        setUsers(customers);
      } catch (err) {
        console.error("Failed to load users", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-screen bg-neutral-950"><Loader2 className="animate-spin text-indigo-500 h-10 w-10" /></div>;

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans pb-20 pt-10 px-8">
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Customer Register</h1>
        <p className="text-neutral-400 mt-2">Active consumer telemetry and profiles.</p>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-[2rem] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-neutral-950/50 text-neutral-400 text-xs uppercase tracking-widest border-b border-neutral-800">
              <tr>
                <th className="px-6 py-4 font-medium">Customer Profile</th>
                <th className="px-6 py-4 font-medium">Joined Date</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-neutral-900/50 transition-colors border-b border-neutral-800 last:border-0 font-medium">
                  <td className="px-6 py-5">
                    <div className="text-white text-base">{user.name}</div>
                    <div className="text-neutral-500 text-sm">{user.email}</div>
                  </td>
                  <td className="px-6 py-5 text-neutral-400">
                    {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-5">
                    <Badge variant="success" className="bg-emerald-900/50 text-emerald-400 border border-emerald-700/50">Active</Badge>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button className="p-2 text-neutral-500 hover:text-red-400 bg-neutral-950 hover:bg-neutral-800 rounded-xl transition-colors border border-neutral-800">
                      <UserX size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && <div className="p-12 text-center text-neutral-500 text-lg">No customers initialized.</div>}
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
