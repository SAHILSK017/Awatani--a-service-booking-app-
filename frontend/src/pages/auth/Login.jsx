import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ChevronRight, AlertCircle, Loader2, User, UserPlus, Sparkles, LayoutDashboard } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { motion, AnimatePresence } from 'framer-motion';
import { login, register } from '../../services/authService';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  
  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); 
  
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (isLogin) {
        const user = await login(email, password);
        if (user.role === 'admin') navigate('/admin/dashboard');
        else if (user.role === 'worker') navigate('/worker/dashboard');
        else navigate('/user/home');
      } else {
        await register(name, email, password, role);
        setSuccess('Registration successful! Please sign in.');
        setIsLogin(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || `${isLogin ? 'Login' : 'Registration'} failed. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="min-h-screen w-full flex bg-indigo-50 font-sans text-gray-900">
      {/* Left Column - Graphic/Branding */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-slate-900 items-center justify-center p-20">
        
        {/* Immersive Background Image */}
        <div className="absolute inset-0 z-0">
            <img src="/customer_hero.png" alt="Service Booking Platform" className="w-full h-full object-cover opacity-50 mix-blend-overlay filter blur-[2px]" />
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-950 via-purple-950/80 to-transparent" />
        </div>

        {/* Abstract Floating UI Elements (Background) */}
        <div className="absolute top-0 w-full h-full overflow-hidden z-0 opacity-40">
            <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} className="absolute top-[20%] left-[10%] w-[120px] h-[120px] rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 transform rotate-12" />
        </div>

        {/* Simplistic Branding Text */}
        <div className="relative z-10 w-full max-w-xl text-white">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}>
                
                <h1 className="text-6xl lg:text-[5.5rem] font-black leading-none tracking-tighter mb-8 drop-shadow-2xl">
                    Avatani
                </h1>
                
                <div className="bg-white/10 backdrop-blur-lg border-l-4 border-indigo-400 p-6 rounded-r-3xl shadow-xl max-w-md">
                    <p className="text-2xl text-indigo-50 leading-snug font-medium">
                        A fast and reliable service booking platform.
                    </p>
                </div>

            </motion.div>
        </div>
      </div>

      {/* Right Column - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-24 relative bg-indigo-50 z-10 shadow-[-20px_0_40px_rgb(0,0,0,0.05)]">
        
        {/* Abstract S-Curve Divider overlaying the left column */}
        <div className="hidden lg:block absolute left-0 top-0 h-full w-[150px] -translate-x-[99%] text-indigo-50 pointer-events-none">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full fill-current">
                <path d="M100 0 C0 30, 100 70, 0 100 L100 100 Z"></path>
            </svg>
        </div>

        <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-sm xl:max-w-md"
        >
          
          {/* Mobile Only Header */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 mb-4 shadow-lg shadow-indigo-200">
              <LayoutDashboard className="text-white" size={24} />
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900">Avatani</h1>
          </div>

          <div className="mb-10 text-left">
            <h2 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900 tracking-tight">
              {isLogin ? 'Welcome back' : 'Create account'}
            </h2>
            <p className="text-gray-500 text-base">
              {isLogin ? 'Enter your details to access your dashboard.' : 'Start your journey with Avatani today.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <div className="p-4 bg-red-50 text-red-700 rounded-2xl text-sm flex items-center gap-3 border border-red-100 font-medium">
                    <AlertCircle size={18} className="text-red-500 shrink-0" />
                    {error}
                  </div>
                </motion.div>
              )}
              {success && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <div className="p-4 bg-emerald-50 text-emerald-700 rounded-2xl text-sm flex items-center gap-3 border border-emerald-100 font-medium">
                    <AlertCircle size={18} className="text-emerald-500 shrink-0" />
                    {success}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {!isLogin && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-2 overflow-hidden">
                <label className="text-sm font-semibold text-gray-700 ml-1">Full Name</label>
                <Input 
                  icon={User} 
                  type="text" 
                  placeholder="John Doe" 
                  required={!isLogin} 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </motion.div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 ml-1">Email Address</label>
              <Input 
                icon={Mail} 
                type="email" 
                placeholder="hello@avatani.com" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                 <label className="text-sm font-semibold text-gray-700">Password</label>
                 {isLogin && <a href="#" className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">Forgot password?</a>}
              </div>
              <Input 
                icon={Lock} 
                type="password" 
                placeholder="••••••••" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {!isLogin && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-2 overflow-hidden">
                <label className="text-sm font-semibold text-gray-700 ml-1">I want to...</label>
                <select 
                  className="w-full rounded-2xl border-2 border-gray-100 bg-gray-50/50 hover:bg-gray-50 px-4 py-3.5 text-sm text-gray-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="user" className="font-medium">Book Services (Customer)</option>
                  <option value="worker" className="font-medium">Accept Jobs (Provider)</option>
                </select>
              </motion.div>
            )}

            <Button type="submit" className="w-full group py-4 mt-8 rounded-2xl shadow-xl shadow-indigo-600/20 font-bold text-base" disabled={loading}>
              {loading ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create Free Account'}
                  {isLogin ? (
                    <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  ) : (
                    <UserPlus className="ml-2 h-5 w-5 transition-transform group-hover:scale-110" />
                  )}
                </>
              )}
            </Button>
          </form>

          <div className="mt-10 text-center">
            <button 
              type="button"
              onClick={toggleMode}
              className="group text-sm text-gray-500 hover:text-gray-900 font-medium focus:outline-none transition-colors"
            >
              {isLogin ? (
                  <>Don't have an account? <span className="text-indigo-600 font-bold ml-1 group-hover:underline decoration-2 underline-offset-4">Sign up</span></>
              ) : (
                  <>Already have an account? <span className="text-indigo-600 font-bold ml-1 group-hover:underline decoration-2 underline-offset-4">Sign in</span></>
              )}
            </button>
          </div>
          
        </motion.div>
      </div>
    </div>
  );
};

export default Login;