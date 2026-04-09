import { useMemo, useState } from 'react';
import Sidebar from './Sidebar.jsx';
import Topbar from './Topbar.jsx';
import { roleIcons, roleLabels, roleNavigation } from '../../data/navigation.js';
import { useAuth } from '../../context/AuthContext.jsx';

const AppShell = ({ title, children }) => {
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const role = user?.role || 'user';
  const items = useMemo(() => roleNavigation[role] || roleNavigation.user, [role]);
  const subtitle = roleLabels[role] || roleLabels.user;
  const RoleIcon = roleIcons[role] || roleIcons.user;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-primary-50 to-purple-50 text-slate-900">
      <div className="flex min-h-screen">
        <Sidebar
          items={items}
          subtitle={subtitle}
          mobileOpen={mobileOpen}
          onClose={() => setMobileOpen(false)}
        />

        <div className="min-w-0 flex-1 lg:pl-0">
          <Topbar title={title} user={user} onToggleSidebar={() => setMobileOpen(true)} />

          <main className="px-4 py-6 sm:px-6 xl:px-8 xl:py-8">
            <div className="mx-auto max-w-7xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-200/70 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600 shadow-sm">
                <RoleIcon className="h-3.5 w-3.5" />
                {subtitle}
              </div>
              <div className="space-y-6">{children}</div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AppShell;
