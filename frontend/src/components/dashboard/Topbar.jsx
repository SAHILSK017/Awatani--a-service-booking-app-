import { Menu, Search, Bell, ChevronDown } from 'lucide-react';
import { useMemo, useState } from 'react';

const Topbar = ({ title, user, onToggleSidebar }) => {
  const [search, setSearch] = useState('');
  const initials = useMemo(() => {
    if (!user?.name) return 'AV';
    return user.name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }, [user]);

  return (
    <header className="sticky top-0 z-20 border-b border-white/70 bg-white/80 backdrop-blur-xl">
      <div className="flex items-center gap-3 px-4 py-4 sm:px-6 xl:px-8">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200/70 bg-white/90 backdrop-blur-xs text-slate-600 shadow-sm lg:hidden hover:shadow-xl transition-shadow">
          aria-label="Toggle navigation"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Avatani</p>
          <h2 className="truncate text-lg font-semibold text-slate-900">{title}</h2>
        </div>

        <div className="hidden min-w-[280px] flex-1 lg:block xl:max-w-md">
          <label className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white px-4 py-3 shadow-sm">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search services, bookings, customers..."
              className="w-full border-0 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />
          </label>
        </div>

        <button
          type="button"
          className="relative inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-rose-500" />
        </button>

        <button
          type="button"
          className="inline-flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 text-sm font-semibold text-white">
            {initials}
          </div>
          <div className="hidden text-left sm:block">
            <p className="text-sm font-semibold text-slate-900">{user?.name || 'Avatani User'}</p>
            <p className="text-xs capitalize text-slate-500">{user?.role || 'member'}</p>
          </div>
          <ChevronDown className="hidden h-4 w-4 text-slate-400 sm:block" />
        </button>
      </div>
    </header>
  );
};

export default Topbar;
