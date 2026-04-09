import { useState, useEffect } from 'react';
import Loader from '../../components/Loader.jsx';
import { getAllUsers } from '../../services/adminService.js';
import { motion } from 'framer-motion';
import { Users, Edit3, Mail, UserCheck, UserX } from 'lucide-react';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const data = await getAllUsers();

        // ✅ Safe handling
        if (Array.isArray(data)) {
          setUsers(data);
        } else if (data?.users) {
          setUsers(data.users);
        } else {
          setUsers([]);
        }

      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to load users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // ✅ Safe filter (no crash)
  const filteredUsers = users.filter(user =>
    (user?.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user?.email || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadge = (role) => {
    const colors = {
      admin: 'bg-purple-100 text-purple-800',
      worker: 'bg-blue-100 text-blue-800',
      user: 'bg-gray-100 text-gray-800'
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500 text-xl">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-primary-50 to-purple-50 py-12">
      <div className="max-w-7xl mx-auto px-4">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-primary-600 to-purple-600 text-white px-6 py-3 rounded-2xl shadow-xl backdrop-blur-sm">
            <Users className="h-6 w-6" />
            <span className="text-xl font-bold">User Management</span>
          </div>
        </motion.div>

        {/* Search */}
        <div className="bg-white p-6 rounded-xl shadow mb-6">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Table */}
        {filteredUsers.length === 0 ? (
          <div className="text-center py-16">
            <Users className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <p>No users found</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-4 text-left">Name</th>
                  <th className="p-4 text-left">Email</th>
                  <th className="p-4 text-left">Role</th>
                  <th className="p-4 text-left">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="border-t">
                    
                    <td className="p-4">
                      {user?.name || "N/A"}
                    </td>

                    <td className="p-4">
                      {user?.email || "N/A"}
                    </td>

                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-sm ${getRoleBadge(user?.role)}`}>
                        {user?.role || "user"}
                      </span>
                    </td>

                    <td className="p-4 flex gap-2">

                      <button className="p-2 bg-blue-100 rounded hover:bg-blue-200">
                        <Edit3 size={16} />
                      </button>

                      <button className="p-2 bg-green-100 rounded hover:bg-green-200">
                        <UserCheck size={16} />
                      </button>

                      <button className="p-2 bg-red-100 rounded hover:bg-red-200">
                        <UserX size={16} />
                      </button>

                      <button className="p-2 bg-gray-100 rounded hover:bg-gray-200">
                        <Mail size={16} />
                      </button>

                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
};

export default UsersPage;