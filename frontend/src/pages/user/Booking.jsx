import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import Loader from '../../components/Loader.jsx';
import { getServices, getCategories } from '../../services/categoryService.js';
import { createBooking } from '../../services/bookingService.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { motion } from 'framer-motion';
import { MapPin, Calendar, DollarSign, CheckCircle, ArrowLeft, Clock, Package } from 'lucide-react';
import { formatPrice } from '../../utils/helpers.js';

const Booking = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation(); // ✅ ADD
  const { user } = useAuth();

  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    service: '',
    address: '',
    date: '',
    time: ''
  });

  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [servRes, catRes] = await Promise.all([
        getServices(),
        getCategories()
      ]);

      setServices(servRes || []);
      setCategories(catRes || []);

      // 🔥 FROM NAVIGATION (IMPORTANT)
      if (location.state?.selectedService || location.state?.service) {
        setFormData(prev => ({
          ...prev,
          service: (location.state.selectedService || location.state.service)._id
        }));
      }

      // 🔥 FROM URL (fallback)
      const serviceId = searchParams.get('service');
      if (serviceId) {
        setFormData(prev => ({ ...prev, service: serviceId }));
      }

    } catch (error) {
      console.error('Error fetching booking data:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectedService = services.find(
    s => s._id === formData.service
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.service || !formData.address || !formData.date || !formData.time) {
      alert("Please fill all required fields including Date and Time");
      return;
    }

    setSubmitLoading(true);

    try {
      const combinedDateTime = new Date(`${formData.date}T${formData.time}`).toISOString();
      await createBooking(formData.service, formData.address, combinedDateTime);
      navigate('/user/mybookings');
    } catch (error) {
      console.error('Error creating booking:', error);
      alert(error.response?.data?.message || 'Booking failed');
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="max-w-2xl mx-auto px-4">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium mb-6"
          >
            <ArrowLeft className="h-5 w-5" />
            Back
          </button>

          <div className="bg-blue-600 text-white px-6 py-3 rounded-xl inline-block">
            <span className="text-xl font-bold">Book Service</span>
          </div>
        </motion.div>

        <div className="bg-white p-6 rounded-xl shadow">

          {/* NO SERVICE SELECTED */}
          {!selectedService && (
            <div className="text-center py-10">
              <Package className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <p>No service selected</p>
              <button
                onClick={() => navigate('/user/services')}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
              >
                Browse Services
              </button>
            </div>
          )}

          {/* SERVICE DETAILS */}
          {selectedService && (
            <>
              <h2 className="text-xl font-bold mb-2">
                {selectedService.name}
              </h2>

              <p className="text-gray-600 mb-2">
                {selectedService.description}
              </p>

              <p className="text-blue-600 font-bold mb-4">
                {formatPrice(selectedService.price)}
              </p>

              {/* FORM */}
              <form onSubmit={handleSubmit} className="mt-8">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Service Date</label>
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full rounded-2xl bg-gray-50/50 border border-gray-200 p-4 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-gray-900"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Service Time</label>
                    <input
                      type="time"
                      required
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="w-full rounded-2xl bg-gray-50/50 border border-gray-200 p-4 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-gray-900"
                    />
                  </div>
                </div>

                <div className="space-y-1 mb-6">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Service Location</label>

                <textarea
                  required
                  placeholder="Enter your accurate location address..."
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className="w-full min-h-[120px] rounded-2xl bg-gray-50/50 border border-gray-200 p-4 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-gray-900 resize-none"
                />
                </div>

                <button
                  type="submit"
                  disabled={submitLoading}
                  className="w-full bg-indigo-600 text-white font-bold text-lg py-4 rounded-2xl shadow-lg shadow-indigo-600/30 hover:bg-indigo-700 hover:shadow-indigo-600/40 transition-all active:scale-[0.98]"
                >
                  {submitLoading ? "Processing Booking..." : "Confirm Booking"}
                </button>

              </form>
            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default Booking;