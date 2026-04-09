import { AnimatePresence, motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { X } from 'lucide-react';
import { cn } from '../../utils/helpers.js';

const SidebarContent = ({ items, subtitle, onNavigate }) => {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-white/10 px-6 pb-6 pt-8">
        <div className="inline-flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/14 text-lg font-semibold text-white shadow-lg">
            A
          </div>
          <div>
            <p className="text-xl font-semibold tracking-tight text-white">Avatani</p>
            <p className="text-sm text-indigo-100/80">{subtitle}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-2">
          {items.map((item) => {
            const Icon = item.icon;

            if (item.disabled) {
              return (
                <li key={item.label}>
                  <div className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-indigo-100/50">
                    <Icon className="h-4.5 w-4.5" />
                    <span>{item.label}</span>
                    <span className="ml-auto rounded-full bg-white/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em]">
                      Soon
                    </span>
                  </div>
                </li>
              );
            }

            return (
              <li key={`${item.label}-${item.href}`}>
                <NavLink
                  to={item.href}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all',
                      isActive
                        ? 'bg-white text-slate-950 shadow-lg'
                        : 'text-indigo-100 hover:bg-white/10 hover:text-white',
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon className={cn('h-4.5 w-4.5', isActive ? 'text-indigo-600' : '')} />
                      <span>{item.label}</span>
                    </>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

const Sidebar = ({ items, subtitle, mobileOpen, onClose }) => {
  return (
    <>
      <aside className="hidden w-80 shrink-0 lg:block">
        <div className="fixed inset-y-0 left-0 w-80 bg-gradient-to-b from-primary-900 via-purple-900 to-violet-900">
          <SidebarContent items={items} subtitle={subtitle} />
        </div>
      </aside>

      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm lg:hidden"
          >
            <motion.aside
              initial={{ x: -28, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -28, opacity: 0 }}
              className="absolute inset-y-0 left-0 w-[88%] max-w-xs bg-gradient-to-b from-primary-900 via-purple-900 to-violet-900"
            >
              <button
                type="button"
                onClick={onClose}
                className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/20 text-white"
                aria-label="Close navigation"
              >
                <X className="h-5 w-5" />
              </button>
              <SidebarContent items={items} subtitle={subtitle} onNavigate={onClose} />
            </motion.aside>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
