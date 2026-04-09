import { useState, useEffect } from 'react';
import Loader from '../../components/Loader.jsx';
import { getCategories, getServices, addCategory, addService } from '../../services/categoryService.js';
import { motion } from 'framer-motion';
import { Plus, Edit3, Trash2, Filter, Search, Package, Layers } from 'lucide-react';

const AdminServices = () => {
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('categories');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', description: '', price: '', category: '', icon: '' });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [catRes, servRes] = await Promise.all([getCategories(), getServices()]);
      setCategories(catRes);
      setServices(servRes);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (activeTab === 'categories') {
        await addCategory(newItem);
      } else {
        await addService(newItem);
      }
      setShowAddModal(false);
      setNewItem(activeTab === 'categories' ? { name: '', icon: '' } : { name: '', description: '', price: '', category: '' });
      fetchData();
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const filteredItems = activeTab === 'categories' 
    ? categories.filter(cat => cat.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : services.filter(service => 
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase())
      );

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-primary-50 to-purple-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-primary-600 to-purple-600 text-white px-8 py-4 rounded-3xl shadow-2xl mb-8 backdrop-blur-sm">
            {activeTab === 'categories' ? <Layers className="h-7 w-7" /> : <Package className="h-7 w-7" />}
            <span className="text-2xl font-bold">
              Manage {activeTab === 'categories' ? 'Categories' : 'Services'}
            </span>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="bg-white/60 backdrop-blur rounded-3xl shadow-xl border border-white/40 p-6 mb-8">
          <div className="flex border-b border-gray-200">
            <motion.button
              onClick={() => setActiveTab('categories')}
              className={`px-6 py-4 font-bold border-b-2 transition-all relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-gradient-to-r after:from-primary-500 after:to-purple-600 after:scale-x-0 after:origin-left group-hover:after:scale-x-100 ${
                activeTab === 'categories'
                  ? 'border-primary-500 text-primary-600 after:scale-x-100'
                  : 'border-transparent text-slate-600 hover:text-primary-600'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Categories
            </motion.button>

            <motion.button
              onClick={() => setActiveTab('services')}
              className={`px-6 py-4 font-bold border-b-2 transition-all ml-1 relative ${
                activeTab === 'services'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-slate-600 hover:text-primary-600 hover:border-primary-200'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Services
            </motion.button>
          </div>
        </div>

        {/* Search & Add */}
        <div className="bg-white/60 backdrop-blur rounded-3xl shadow-xl border border-white/40 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder={`Search ${activeTab === 'categories' ? 'categories' : 'services'}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-lg"
              />
            </div>
              <motion.button
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-primary-500 to-purple-600 hover:from-primary-600 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all flex items-center gap-2 whitespace-nowrap"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus className="h-5 w-5" />
              Add {activeTab === 'categories' ? 'Category' : 'Service'}
            </motion.button>
          </div>
        </div>

        {/* Items List */}
        {filteredItems.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-24 bg-white/60 backdrop-blur rounded-3xl border border-white/40"
          >
            <Package className="mx-auto h-24 w-24 text-gray-400 mb-8" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No {activeTab}s found
            </h3>
            <p className="text-gray-600 mb-8">
              {searchTerm ? 'Try adjusting your search' : `Get started by adding your first ${activeTab}`}
            </p>
            <motion.button
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-primary-500 to-purple-600 hover:from-primary-600 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all"
              whileHover={{ scale: 1.05 }}
            >
              Add First {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </motion.button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white/70 backdrop-blur rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all border border-white/50 group"
              >
                <div className="flex items-start justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">{item.name}</h3>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                    <button className="p-2 hover:bg-blue-100 rounded-xl text-blue-600">
                      <Edit3 className="h-5 w-5" />
                    </button>
                    <button className="p-2 hover:bg-red-100 rounded-xl text-red-600">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                {activeTab === 'services' && (
                  <div className="space-y-4 mb-6">
                    <p className="text-gray-600">{item.description}</p>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-bold">
                        ${item.price}
                      </span>
                      <span className="text-sm text-gray-500">
                        Category: {item.category?.name}
                      </span>
                    </div>
                  </div>
                )}
                {item.icon && (
                  <div className="text-3xl mb-6">{item.icon}</div>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* Add Modal */}
        {showAddModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Add New {activeTab === 'categories' ? 'Category' : 'Service'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newItem.name}
                    onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Enter name"
                  />
                </div>
                {activeTab === 'services' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        value={newItem.description}
                        onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-vertical"
                        rows="3"
                        placeholder="Service description"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price *
                      </label>
                      <input
                        type="number"
                        required
                        value={newItem.price}
                        onChange={(e) => setNewItem({...newItem, price: parseFloat(e.target.value)})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="Price (e.g. 50)"
                        step="0.01"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category *
                      </label>
                      <select
                        required
                        value={newItem.category}
                        onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      >
                        <option value="">Select category</option>
                        {categories.map(cat => (
                          <option key={cat._id} value={cat._id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                  </>
                )}
                {activeTab === 'categories' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Icon (Emoji)
                    </label>
                    <input
                      value={newItem.icon}
                      onChange={(e) => setNewItem({...newItem, icon: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="e.g. 🏠"
                    />
                  </div>
                )}
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-bold py-3 px-4 rounded-2xl transition-all"
                  >
                    Cancel
                  </button>
                  <motion.button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-primary-500 to-purple-600 hover:from-primary-600 hover:to-purple-700 text-white font-bold py-3 px-4 rounded-2xl shadow-lg hover:shadow-xl transition-all"
                    whileHover={{ scale: 1.02 }}
                  >
                    Add {activeTab === 'categories' ? 'Category' : 'Service'}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdminServices;
