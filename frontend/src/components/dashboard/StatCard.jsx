import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import Panel from './Panel.jsx';

const StatCard = ({ title, value, subtitle, growth, icon: Icon, tone = 'indigo' }) => {
const tones = {
    primary: 'from-primary-500 to-purple-600 text-primary-600 border-primary-100',
    emerald: 'from-emerald-500 to-teal-500 text-emerald-600 bg-emerald-50',
    amber: 'from-amber-500 to-orange-500 text-amber-600 bg-amber-50',
    rose: 'from-rose-500 to-pink-500 text-rose-600 bg-rose-50',
    slate: 'from-slate-500 to-slate-700 text-slate-600 bg-slate-100',
  };

  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
      <Panel className="h-full">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">{value}</p>
            {subtitle ? <p className="mt-2 text-sm text-slate-500">{subtitle}</p> : null}
          </div>
          <motion.div 
            className={`p-3 rounded-2xl shadow-xl ${tones[tone]}`} 
            whileHover={{ scale: 1.05, y: -2 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <Icon className="h-5 w-5" />
          </motion.div>
        </div>
        {growth ? (
          <div className={`mt-6 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${tones[tone].split(' ').slice(2).join(' ')}`}>
            <ArrowUpRight className="h-3.5 w-3.5" />
            {growth}
          </div>
        ) : null}
      </Panel>
    </motion.div>
  );
};

export default StatCard;
