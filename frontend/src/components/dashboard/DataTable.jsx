import { motion } from 'framer-motion';
import Panel from './Panel.jsx';

const DataTable = ({ title, description, columns, rows, mobileCard }) => {
  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
      <Panel className="overflow-hidden p-0">
        <div className="border-b border-slate-200/80 px-6 py-5">
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          {description ? <p className="mt-1 text-sm text-slate-500">{description}</p> : null}
        </div>

        <div className="hidden overflow-x-auto lg:block">
          <table className="min-w-full divide-y divide-slate-200/80">
            <thead className="bg-slate-50/80">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500"
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/70 bg-white/70">
              {rows}
            </tbody>
          </table>
        </div>

        <div className="space-y-4 p-4 lg:hidden">{mobileCard}</div>
      </Panel>
    </motion.div>
  );
};

export default DataTable;
