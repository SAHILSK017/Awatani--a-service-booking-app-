import { useState, useEffect } from 'react';
import CategoryCard from '../../components/CategoryCard.jsx';
import ServiceCard from '../../components/ServiceCard.jsx';
import Loader from '../../components/Loader.jsx';
import { getCategories, getServices } from '../../services/categoryService.js';
import { motion } from 'framer-motion';
import { StatCard } from '../../components/dashboard/StatCard.jsx';
import { BookOpen, DollarSign, Star, Clock, Sparkles, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatPrice } from '../../utils/helpers.js';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [catsRes, servRes] = await Promise.all([getCategories(), getServices()]);
        setCategories(catsRes);
        setServices(servRes);
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Dummy stats (replace with API)
  const activeServices = 2;
  const totalSpent = 450;
  // Use services.length for demo
  const bookingsLength = services.length;

  const filteredServices = selectedCategory 
    ? services.filter(s => s.category._id === selectedCategory._id)
    : services.slice(0, 6); // featured

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-primary-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {loading ? <Loader /> : (
          <>
            {/* Welcome & Stats & Quick Actions */}
            {/* ... existing content ... */}
            {/* Featured Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {services.slice(0, 6).map((service) => (
                <ServiceCard key={service._id} service={service} />
              ))}
            </div>
          </>
        )}
        {/* Welcome */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-primary-600 to-purple-600 text-white px-8 py-4 rounded-3xl shadow-2xl mb-8 backdrop-blur-sm">
            <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-2xl font-bold">Customer Dashboard</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Welcome Back!
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Manage your bookings, explore services, and track everything in one place
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard
            title="Total Bookings"
            value={bookings.length}
            subtitle="All time"
            growth="+12%"
            icon={BookOpen}
            tone="primary"
          />
          <StatCard
            title="Active Services"
            value={activeServices}
            subtitle="Currently booked"
            growth="+3%"
            icon={Clock}
            tone="purple"
          />
          <StatCard
            title="Total Spent"
            value={formatPrice(totalSpent)}
            subtitle="Lifetime"
            growth="+23%"
            icon={DollarSign}
            tone="indigo"
          />
          <StatCard
            title="Avg Rating"
            value="4.8"
            subtitle="Services"
            growth="+0.2"
            icon={Star}
            tone="yellow"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <motion.div 
            className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all cursor-pointer group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
          >
            <Sparkles className="h-12 w-12 text-primary-500 mb-4 group-hover:scale-110 transition-all" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Browse Services</h3>
            <p className="text-gray-600 mb-6">Discover new services</p>
            <Link to="/user/services" className="text-primary-600 font-semibold hover:text-primary-700">View Services →</Link>
          </motion.div>

          <motion.div 
            className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all cursor-pointer group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
          >
            <BookOpen className="h-12 w-12 text-primary-500 mb-4 group-hover:scale-110 transition-all" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">My Bookings</h3>
            <p className="text-gray-600 mb-6">Manage active bookings</p>
            <Link to="/user/mybookings" className="text-primary-600 font-semibold hover:text-primary-700">View Bookings →</Link>
          </motion.div>

          <motion.div 
            className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all cursor-pointer group md:col-span-2 lg:col-span-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
          >
            <Users className="h-12 w-12 text-primary-500 mb-4 group-hover:scale-110 transition-all" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Recommended Workers</h3>
            <p className="text-gray-600 mb-6">Top rated providers</p>
            <Link to="/user/workers" className="text-primary-600 font-semibold hover:text-primary-700">Find Workers →</Link>
          </motion.div>
        </div>

      {/* Categories */}
      <section id="categories" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Service Categories
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Browse our wide range of professional services
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {categories.map((category) => (
              <CategoryCard
                key={category._id}
                category={category}
                onClick={() => setSelectedCategory(category)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Services */}
      {filteredServices.length > 0 && (
        <section id="services" className="py-24 bg-gradient-to-b from-white to-blue-50 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                {selectedCategory ? `${selectedCategory.name} Services` : 'Featured Services'}
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Professional, reliable, and affordable services
              </p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredServices.map((service) => (
                <ServiceCard key={service._id} service={service} onBook={() => {/* navigate to booking */}} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;

