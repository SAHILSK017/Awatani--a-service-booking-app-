import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Sparkles } from 'lucide-react';
import { formatPrice } from '../utils/helpers.js';

const ServiceCard = ({ service, onBook }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="group flex h-full flex-col rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200"
    >
      {/* Top Section */}
      <div className="flex items-start gap-4 mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
          <BookOpen className="w-8 h-8 text-white" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight">
            {service?.name || "Service"}
          </h3>

          <p className="text-gray-600 mb-2 line-clamp-2">
            {service?.description || "No description"}
          </p>

          <div className="flex items-center gap-2 text-sm font-medium text-blue-600 bg-blue-100/80 px-3 py-1 rounded-full backdrop-blur-sm">
            {service?.category?.name || 'Uncategorized'}
          </div>
        </div>
      </div>

      {/* Price */}
      <div className="flex items-center justify-between mb-8">
        <div className="text-3xl font-bold text-blue-600">
          {formatPrice(service?.price || 0)}
        </div>
      </div>

      {/* Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
        onClick={onBook} // ✅ FIXED (NO PARAM PASS)
      >
        Book Service
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
          />
        </svg>
      </motion.button>
    </motion.div>
  );
};

export default ServiceCard;
