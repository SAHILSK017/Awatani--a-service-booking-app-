import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ ADD
import ServiceCard from '../../components/ServiceCard.jsx';
import Loader from '../../components/Loader.jsx';
import { getCategories, getServices } from '../../services/categoryService.js';
import { motion } from 'framer-motion';
import { Filter } from 'lucide-react';

const Services = () => {
  const navigate = useNavigate(); // ✅ ADD

  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [servRes, catRes] = await Promise.all([
          getServices(),
          getCategories()
        ]);

        // ✅ SAFE SET
        setServices(servRes || []);
        setCategories(catRes || []);

      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ✅ SAFE FILTER
  const filteredServices = services.filter(service => {
    const matchesCategory =
      !selectedCategory || service.category?._id === selectedCategory;

    const matchesSearch =
      (service.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (service.description || "").toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold mb-6">
            All Services
          </h1>
          <p className="text-xl text-gray-600">
            Find the perfect service for your needs
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white p-6 rounded-xl shadow mb-10"
        >
          <div className="flex flex-col md:flex-row gap-4">

            <input
              type="text"
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 p-3 border rounded-lg"
            />

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="p-3 border rounded-lg"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>

          </div>
        </motion.div>

        {/* Services */}
        <div className="grid md:grid-cols-3 gap-6">

          {filteredServices.length > 0 ? (
            filteredServices.map((service) => (
              <ServiceCard
                key={service._id}
                service={service}
                onBook={() =>
                  navigate('/user/booking', { state: { service } })
                }
              />
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              No services found
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default Services;