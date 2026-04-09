import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Loader from '../../components/Loader.jsx';
import { getCategories, getServices } from '../../services/categoryService.js';
import { motion } from 'framer-motion';
import { Search, ArrowRight, Layers, Tag } from 'lucide-react';

const Services = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [servRes, catRes] = await Promise.all([getServices(), getCategories()]);
        setServices(servRes || []);
        setCategories(catRes || []);
      } catch (error) { console.error('Error fetching:', error); } finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const filteredServices = services.filter(service => {
    const matchesCategory = !selectedCategory || service.category?._id === selectedCategory;
    const matchesSearch = (service.name || "").toLowerCase().includes(searchTerm.toLowerCase()) || (service.description || "").toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } } };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      
      {/* Massive Hero Image Section */}
      <div className="relative h-96 w-full bg-slate-900 overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0">
          <img src="/customer_hero.png" alt="Premium Header" className="w-full h-full object-cover opacity-50 mix-blend-overlay" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-transparent to-indigo-900/60" />
        </div>
        
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8 text-center pt-10">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-4 drop-shadow-lg">
              Explore Services
            </h1>
            <p className="text-xl text-indigo-50 font-medium max-w-2xl mx-auto shadow-sm">
              Search and filter our elite catalog of verified professionals.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-20 -mt-10">
        
        {/* Floating Filters */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/90 backdrop-blur-xl p-4 rounded-3xl shadow-2xl border border-white/50 mb-12 flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-600 transition-colors">
                    <Search size={20} />
                </div>
                <input type="text" placeholder="Search for anything..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50/50 border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-gray-900" />
            </div>

            <div className="relative w-full md:w-64 group pl-4 md:pl-0 border-l border-gray-100 hidden md:block" />

            <div className="relative w-full md:w-72 flex-shrink-0 group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-600 transition-colors">
                    <Layers size={20} />
                </div>
                <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50/50 border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-gray-900 appearance-none cursor-pointer">
                  <option value="">All Categories</option>
                  {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                </select>
            </div>
        </motion.div>

        {/* Services Grid matching Home */}
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredServices.length > 0 ? (
              filteredServices.map((service) => (
                <motion.div key={service._id} variants={itemVariants} className="group relative bg-white rounded-[2rem] shadow-lg hover:shadow-2xl overflow-hidden transition-all duration-300 border border-gray-100 flex flex-col h-full">
                  <div className="p-8 flex flex-col flex-grow">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center mb-6 border border-indigo-100 group-hover:scale-110 transition-transform">
                      <span className="text-3xl">{service.category?.icon || '📦'}</span>
                    </div>
                    
                    <div className="mb-auto">
                      <span className="inline-block px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold mb-4 tracking-wide uppercase">
                        {service.category?.name || 'Standard'}
                      </span>
                      <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight group-hover:text-indigo-600 transition-colors">{service.name}</h3>
                      <p className="text-gray-500 text-sm line-clamp-3 leading-relaxed mb-6">{service.description}</p>
                    </div>
                    
                    <div className="mt-auto pt-6 border-t border-gray-100 flex items-center justify-between">
                      <div>
                          <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Starting at</p>
                          <p className="text-2xl font-extrabold text-indigo-600 bg-clip-text">₹{service.price}</p>
                      </div>
                      <button 
                        onClick={() => navigate('/user/booking', { state: { selectedService: service } })}
                        className="bg-gray-900 text-white rounded-2xl p-4 hover:bg-indigo-600 transition-colors shadow-md hover:shadow-xl hover:-translate-y-1"
                      >
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-20 flex flex-col items-center justify-center text-center">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6"><Search className="text-gray-300 w-10 h-10" /></div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">No results matched your search</h3>
                  <p className="text-gray-500">Try adjusting your filters or search terms.</p>
              </div>
            )}
        </motion.div>
      </div>
    </div>
  );
};

export default Services;