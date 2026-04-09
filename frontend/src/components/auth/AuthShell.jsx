import { motion } from 'framer-motion';

const AuthShell = ({ title, description, children, asideTitle, asideDescription }) => {
  return (
    <div className="min-h-screen overflow-hidden bg-app">
      <div className="mx-auto grid min-h-screen max-w-7xl items-center gap-8 px-4 py-8 lg:grid-cols-[1.1fr_0.9fr] lg:px-6">
        <motion.section
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative hidden overflow-hidden rounded-[36px] bg-gradient-to-br from-slate-950 via-indigo-950 to-violet-900 p-10 text-white shadow-soft lg:block"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.16),transparent_22%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.1),transparent_20%)]" />
          <div className="relative z-10 flex h-full flex-col justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-indigo-200">Avatani</p>
              <h1 className="mt-6 max-w-md text-4xl font-semibold tracking-tight">{asideTitle}</h1>
              <p className="mt-5 max-w-lg text-base leading-7 text-indigo-100/82">{asideDescription}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                ['Bookings', 'Live service tracking'],
                ['Workers', 'Verified provider operations'],
                ['Insights', 'One clean control center'],
              ].map(([heading, copy]) => (
                <div key={heading} className="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                  <p className="text-lg font-semibold">{heading}</p>
                  <p className="mt-2 text-sm text-indigo-100/75">{copy}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          className="mx-auto w-full max-w-xl rounded-[32px] border border-white/70 bg-white/92 p-6 shadow-soft backdrop-blur sm:p-8"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-500">Avatani Access</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">{title}</h2>
          <p className="mt-3 text-sm leading-6 text-slate-500">{description}</p>
          <div className="mt-8">{children}</div>
        </motion.section>
      </div>
    </div>
  );
};

export default AuthShell;
