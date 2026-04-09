import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Clock, Star, MapPin, IndianRupee, ArrowRight, Loader2 } from 'lucide-react';
import { getServices } from '../../services/categoryService.js';

const Home = () => {
  const navigate = useNavigate();
  const [servicesList, setServicesList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getServices();
        setServicesList(data);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleBookService = (service) => {
    navigate('/user/booking', { state: { selectedService: service } });
  };

  // Stagger animation definitions
  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      
      {/* Massive Hero Image Section */}
      <div className="relative h-[60vh] min-h-[500px] w-full bg-slate-900 overflow-hidden flex items-center">
        <div className="absolute inset-0">
          <img 
            src="/customer_hero.png" 
            alt="Premium Home Services Background" 
            className="w-full h-full object-cover opacity-60 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-transparent to-indigo-900/40" />
        </div>
        
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8 pt-20">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-2xl">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-sm font-semibold mb-6">
              <Star className="w-4 h-4 text-yellow-300" /> Premium Services Available
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6 drop-shadow-lg">
              Expert solutions,<br/>at your doorstep.
            </h1>
            <p className="text-xl text-indigo-50 font-medium mb-10 max-w-lg leading-relaxed shadow-sm">
              Connect instantly with highly-rated professionals for immediate dispatch and guaranteed quality.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Floating Value Props */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 lg:px-8 -mt-20">
          <motion.div 
            variants={containerVariants} initial="hidden" animate="show"
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {[
              { title: 'Verified Pros', icon: Shield, color: 'text-indigo-600', bg: 'bg-indigo-50' },
              { title: 'Instant Dispatch', icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
              { title: 'Secure Payments', icon: IndianRupee, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            ].map((feature, idx) => (
              <motion.div key={idx} variants={itemVariants} className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl shadow-xl border border-white/50 flex items-center gap-4 hover:shadow-2xl transition-all">
                <div className={`p-4 rounded-2xl ${feature.bg} shadow-inner`}>
                  <feature.icon className={`h-8 w-8 ${feature.color}`} />
                </div>
                <h3 className="text-lg font-bold text-gray-900">{feature.title}</h3>
              </motion.div>
            ))}
          </motion.div>
      </div>

      {/* Primary Services Grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-24">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Available Services</h2>
            <p className="text-gray-500 mt-2">Explore our most popular customer requests.</p>
          </div>
        </div>

        {loading ? (
            <div className="flex justify-center items-center py-20"><Loader2 className="w-12 h-12 text-indigo-600 animate-spin" /></div>
        ) : (
          <motion.div 
            variants={containerVariants} initial="hidden" animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            {servicesList.map((service) => (
              <motion.div 
                key={service._id} variants={itemVariants}
                className="group relative bg-white rounded-[2rem] shadow-lg hover:shadow-2xl overflow-hidden transition-all duration-300 border border-gray-100 flex flex-col h-full"
              >
                <div className="p-8 flex flex-col flex-grow">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center mb-6 border border-indigo-100 group-hover:scale-110 transition-transform">
                    <span className="text-3xl">{service.category?.icon || '📦'}</span>
                  </div>
                  
                  <div className="mb-auto">
                    <span className="inline-block px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold mb-4 tracking-wide uppercase">
                      {service.category?.name || 'Standard'}
                    </span>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight group-hover:text-indigo-600 transition-colors">{service.name}</h3>
                    <p className="text-gray-500 text-sm line-clamp-3 leading-relaxed">{service.description}</p>
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Starting at</p>
                        <p className="text-2xl font-extrabold text-indigo-600 bg-clip-text">₹{service.price}</p>
                    </div>
                    <button 
                      onClick={() => handleBookService(service)}
                      className="bg-gray-900 text-white rounded-2xl p-4 hover:bg-indigo-600 transition-colors shadow-md hover:shadow-xl hover:-translate-y-1"
                    >
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

    </div>
  );
};

export default Home;
