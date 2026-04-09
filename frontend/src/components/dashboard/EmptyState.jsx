import { motion } from 'framer-motion';
import Panel from './Panel.jsx';

const EmptyState = ({ icon: Icon, title, description, action }) => {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
      <Panel className="py-14 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-slate-500">
          <Icon className="h-8 w-8" />
        </div>
        <h3 className="mt-5 text-xl font-semibold text-slate-900">{title}</h3>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">{description}</p>
        {action ? <div className="mt-6">{action}</div> : null}
      </Panel>
    </motion.div>
  );
};

export default EmptyState;
