import { motion } from 'framer-motion';

const CategoryCard = ({ category, onClick }) => (
  <motion.div
    whileHover={{ scale: 1.05, y: -5 }}
    whileTap={{ scale: 0.98 }}
    className="group bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-2xl hover:shadow-3xl border border-white/20 hover:border-blue-500/50 transition-all duration-500 cursor-pointer max-w-sm mx-auto"
    onClick={() => onClick(category)}
  >
    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform duration-500">
      <span className="text-2xl font-bold text-white">
        {category.icon || category.name[0].toUpperCase()}
      </span>
    </div>
    <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center group-hover:text-blue-600 transition-colors">
      {category.name}
    </h3>
    <p className="text-gray-600 text-center mb-6 opacity-0 group-hover:opacity-100 transition-all duration-300">
      Explore top services in this category
    </p>
    <div className="flex items-center justify-center gap-2 text-sm text-blue-600 font-semibold">
      View Services
      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
      </svg>
    </div>
  </motion.div>
);

export default CategoryCard;

