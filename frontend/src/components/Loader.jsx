import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const Loader = ({ fullScreen = true }) => (
  <div className={`fixed inset-0 z-50 flex items-center justify-center ${fullScreen ? 'bg-white/80 backdrop-blur-sm' : ''}`}>
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full flex items-center justify-center"
    >
      <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
    </motion.div>
    <div className="absolute -bottom-16 text-xl font-semibold text-gray-700">
      Loading...
    </div>
  </div>
);

export default Loader;

