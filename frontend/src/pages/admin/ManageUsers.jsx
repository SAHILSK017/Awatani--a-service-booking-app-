import React, { useEffect, useState } from 'react';
import { Badge } from '../../components/ui/Badge';
import { UserX, Loader2, Plus, Edit2, Eye, X, Mail, User, Shield, Search, CheckCircle2, AlertCircle } from 'lucide-react';
import { getAllUsers, createUser, updateUser, deleteUser } from '../../services/adminService';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Modal States
  const [selectedUser, setSelectedUser] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [deleteConfirmUser, setDeleteConfirmUser] = useState(null);

  // Form States
  const [createForm, setCreateForm] = useState({ name: '', email: '', password: '', role: 'user' });
  const [editForm, setEditForm] = useState({ name: '', email: '', password: '', role: 'user' });
  const [formLoading, setFormLoading] = useState(false);

  // Premium Toast Notification State
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
  };

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data.filter(u => u.role === 'user'));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      await createUser(createForm);
      setIsCreateOpen(false);
      setCreateForm({ name: '', email: '', password: '', role: 'user' });
      showToast('User created successfully!', 'success');
      fetchUsers();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to create user', 'error');
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      await updateUser(editUser._id, editForm);
      setEditUser(null);
      showToast('User updated successfully!', 'success');
      fetchUsers();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update user', 'error');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    setFormLoading(true);
    try {
      await deleteUser(id);
      setDeleteConfirmUser(null);
      showToast('User deleted successfully!', 'success');
      fetchUsers();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete user', 'error');
    } finally {
      setFormLoading(false);
    }
  };

  // Filter users based on search
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <Loader2 className="animate-spin text-indigo-600 h-10 w-10" />
      </div>
    );
  }

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

      {/* Premium Header */}
      <div className="relative h-72 w-full bg-slate-900 overflow-hidden flex items-center justify-center mb-10 shadow-lg">
        <div className="absolute inset-0">
          <img
            src="/customer_hero.png"
            alt="Premium Header"
            className="w-full h-full object-cover opacity-50 mix-blend-overlay filter blur-[2px]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-transparent to-indigo-900/60" />
        </div>
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8 text-left pt-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">Manage Customers</h1>
            <p className="text-indigo-900 font-medium">View and manage registered customer accounts.</p>
          </div>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-2xl shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 transform active:scale-95"
          >
            <Plus size={20} />
            Add Customer
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-20 -mt-16">
        
        {/* Search Bar */}
        <div className="mb-6 max-w-md bg-white rounded-2xl border border-gray-200 shadow-md p-2 flex items-center gap-3">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
            <Search size={20} />
          </div>
          <input
            type="text"
            placeholder="Search by name or email..."
            className="w-full bg-transparent border-none outline-none font-medium text-sm text-gray-700 placeholder-gray-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* User Database Card */}
        <div className="bg-white/90 backdrop-blur-xl border border-white/50 rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-400 text-xs uppercase tracking-widest border-b border-gray-100 font-bold">
                <tr>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Joined Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 bg-white">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 transition-colors font-medium">
                    <td className="px-6 py-5">
                      <div className="text-gray-900 font-bold text-lg">{user.name}</div>
                      <div className="text-gray-500 text-sm mt-1">{user.email}</div>
                    </td>
                    <td className="px-6 py-5 text-gray-500">
                      {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-5">
                      <Badge variant="success" className="bg-emerald-100 text-emerald-700 shadow-sm px-3 py-1 font-bold">
                        Active
                      </Badge>
                    </td>
                    <td className="px-6 py-5 text-right flex justify-end gap-2">
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="p-3 text-indigo-500 hover:text-white bg-indigo-50 hover:bg-indigo-500 rounded-2xl transition-colors shadow-sm"
                        title="View User"
                      >
                        <Eye size={20} />
                      </button>
                      <button
                        onClick={() => {
                          setEditUser(user);
                          setEditForm({ name: user.name, email: user.email, role: user.role, password: '' });
                        }}
                        className="p-3 text-amber-500 hover:text-white bg-amber-50 hover:bg-amber-500 rounded-2xl transition-colors shadow-sm"
                        title="Edit User"
                      >
                        <Edit2 size={20} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmUser(user)}
                        className="p-3 text-red-500 hover:text-white bg-red-50 hover:bg-red-500 rounded-2xl transition-colors shadow-sm"
                        title="Delete User"
                      >
                        <UserX size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredUsers.length === 0 && (
              <div className="p-12 text-center text-gray-500 font-bold text-lg">
                No customers found matching the filter.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CREATE MODAL */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 transform transition-all duration-300">
            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-xl font-extrabold text-gray-900">Add New Customer</h3>
              <button onClick={() => setIsCreateOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 rounded-xl transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreateUser} className="p-8 space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Name</label>
                <div className="relative flex items-center">
                  <User className="absolute left-4 text-gray-400" size={18} />
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    value={createForm.name}
                    onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 bg-white text-sm text-gray-900 font-semibold focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-sm"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Email Address</label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-4 text-gray-400" size={18} />
                  <input
                    type="email"
                    required
                    placeholder="john@example.com"
                    value={createForm.email}
                    onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 bg-white text-sm text-gray-900 font-semibold focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-sm"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Password</label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-4 text-gray-400" size={18} />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={createForm.password}
                    onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 bg-white text-sm text-gray-900 font-semibold focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-sm"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Role</label>
                <div className="relative flex items-center">
                  <Shield className="absolute left-4 text-gray-400" size={18} />
                  <select
                    value={createForm.role}
                    onChange={(e) => setCreateForm({ ...createForm, role: e.target.value })}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 bg-white text-sm text-gray-900 font-bold focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-sm"
                  >
                    <option value="user">User</option>
                    <option value="worker">Worker</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="w-1/2 py-4 border border-gray-200 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 transition-colors shadow-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="w-1/2 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold shadow-lg shadow-indigo-500/20 flex items-center justify-center transition-all duration-300"
                >
                  {formLoading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Create Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW DETAILS MODAL */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 transform transition-all duration-300">
            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-xl font-extrabold text-gray-900">Customer Details</h3>
              <button onClick={() => setSelectedUser(null)} className="p-2 text-gray-400 hover:text-gray-600 rounded-xl transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 bg-gradient-to-tr from-indigo-500 to-purple-600 text-white rounded-2xl flex items-center justify-center text-2xl font-black shadow-md">
                  {selectedUser.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-2xl font-black text-gray-900">{selectedUser.name}</h4>
                  <Badge variant="indigo" className="mt-1 font-bold uppercase tracking-wider">{selectedUser.role}</Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-b border-gray-100 py-6">
                <div>
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-widest block">Email Address</span>
                  <span className="text-gray-900 font-semibold">{selectedUser.email}</span>
                </div>
                <div>
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-widest block">Account Status</span>
                  <Badge variant="success" className="bg-emerald-100 text-emerald-700 shadow-sm mt-1 px-3 py-1 font-bold">Active</Badge>
                </div>
                <div className="mt-4">
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-widest block">Joined Date</span>
                  <span className="text-gray-950 font-semibold">{new Date(selectedUser.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="mt-4">
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-widest block">User ID</span>
                  <span className="text-xs font-mono text-gray-400 select-all">{selectedUser._id}</span>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setSelectedUser(null);
                    setEditUser(selectedUser);
                    setEditForm({ name: selectedUser.name, email: selectedUser.email, role: selectedUser.role, password: '' });
                  }}
                  className="w-1/2 py-4 bg-amber-50 hover:bg-amber-500 text-amber-600 hover:text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all duration-300 border border-amber-200"
                >
                  <Edit2 size={18} />
                  Edit Details
                </button>
                <button
                  onClick={() => {
                    setSelectedUser(null);
                    setDeleteConfirmUser(selectedUser);
                  }}
                  className="w-1/2 py-4 bg-red-50 hover:bg-red-500 text-red-600 hover:text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all duration-300 border border-red-200"
                >
                  <UserX size={18} />
                  Delete User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 transform transition-all duration-300">
            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-xl font-extrabold text-gray-900">Edit Customer</h3>
              <button onClick={() => setEditUser(null)} className="p-2 text-gray-400 hover:text-gray-600 rounded-xl transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleUpdateUser} className="p-8 space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Name</label>
                <div className="relative flex items-center">
                  <User className="absolute left-4 text-gray-400" size={18} />
                  <input
                    type="text"
                    required
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 bg-white text-sm text-gray-900 font-semibold focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-sm"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Email Address</label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-4 text-gray-400" size={18} />
                  <input
                    type="email"
                    required
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 bg-white text-sm text-gray-900 font-semibold focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-sm"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Update Password (Leave blank to keep existing)</label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-4 text-gray-400" size={18} />
                  <input
                    type="password"
                    placeholder="New password (optional)"
                    value={editForm.password}
                    onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 bg-white text-sm text-gray-900 font-semibold focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-sm"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Role</label>
                <div className="relative flex items-center">
                  <Shield className="absolute left-4 text-gray-400" size={18} />
                  <select
                    value={editForm.role}
                    onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 bg-white text-sm text-gray-900 font-bold focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-sm"
                  >
                    <option value="user">User</option>
                    <option value="worker">Worker</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setEditUser(null)}
                  className="w-1/2 py-4 border border-gray-200 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 transition-colors shadow-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="w-1/2 py-4 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-bold shadow-lg shadow-amber-500/20 flex items-center justify-center transition-all duration-300"
                >
                  {formLoading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 p-8 space-y-6 transform transition-all duration-300">
            <div className="h-16 w-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center text-2xl mx-auto shadow-inner">
              <UserX size={28} />
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-black text-gray-900">Delete Account</h3>
              <p className="text-gray-500 mt-2">
                Are you absolutely sure you want to permanently delete user <strong className="text-gray-900 font-bold">{deleteConfirmUser.name}</strong>? This action is irreversible.
              </p>
            </div>
            <div className="flex gap-4 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmUser(null)}
                className="w-1/2 py-4 border border-gray-200 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 transition-colors shadow-sm"
              >
                Keep Account
              </button>
              <button
                onClick={() => handleDeleteUser(deleteConfirmUser._id)}
                disabled={formLoading}
                className="w-1/2 py-4 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-bold shadow-lg shadow-red-500/20 flex items-center justify-center transition-all duration-300"
              >
                {formLoading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ManageUsers;
