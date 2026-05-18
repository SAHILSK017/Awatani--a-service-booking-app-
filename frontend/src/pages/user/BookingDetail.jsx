import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, Clock, MapPin, User, Mail, DollarSign, ShieldAlert, CheckCircle2, 
  Sparkles, ShieldCheck, Compass, MessageSquare, Phone, ChevronRight, AlertCircle, 
  FileText, Activity, Loader2, Zap, CalendarDays, IndianRupee, Briefcase, X
} from 'lucide-react';
import { getBookingDetails, deleteBooking, completeBooking } from '../../services/bookingService';
import { Badge } from '../../components/ui/Badge';
import { motion, AnimatePresence } from 'framer-motion';

const BookingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [toast, setToast] = useState(null);

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const isWorker = currentUser?.role === 'worker';
  const isAdmin = currentUser?.role === 'admin';

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const data = await getBookingDetails(id);
      setBooking(data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to load booking details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDetails(); }, [id]);

  const handleCancelBooking = async () => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      setCancelling(true);
      await deleteBooking(id);
      navigate('/user/mybookings');
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel booking.");
    } finally {
      setCancelling(false);
    }
  };

  const handleCompleteBooking = async () => {
    if (!window.confirm("Mark this job as completed?")) return;
    try {
      setCompleting(true);
      await completeBooking(id);
      showToast('✅ Job marked as completed!');
      fetchDetails();
    } catch (err) {
      showToast('❌ Could not complete job.', 'error');
    } finally {
      setCompleting(false);
    }
  };

  // Back path based on role
  const getBackPath = () => {
    if (isWorker) return '/worker/bookings';
    if (isAdmin) return '/admin/dashboard';
    return '/user/mybookings';
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full shadow-md"
        />
        <p className="text-gray-500 font-bold text-sm tracking-wide">Loading booking details...</p>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center">
        <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-rose-100 shadow-sm">
          <ShieldAlert className="text-rose-500 w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-gray-900">Failed to load booking</h2>
        <p className="text-gray-500 mt-2 font-medium">{error || 'The requested booking could not be found.'}</p>
        <Link to={getBackPath()} className="inline-flex items-center gap-2 mt-8 bg-indigo-600 text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:bg-indigo-700 transition-colors">
          <ArrowLeft size={16} /> Go Back
        </Link>
      </div>
    );
  }

  // Price Calculations
  const basePrice = booking.service?.price || 0;
  const urgencyFee = booking.urgency === 'priority' ? 99 : booking.urgency === 'express' ? 199 : 0;
  const discount = booking.discountCode === 'WELCOME10' ? Math.round(basePrice * 0.1) : booking.discountCode === 'SAVINGS50' ? 50 : 0;
  const computedTotal = Math.max(0, basePrice + urgencyFee - discount);

  // Status Stepper — adapts labels based on role
  const statusSteps = isWorker ? [
    { key: 'pending', label: 'Job Posted', desc: 'A customer has requested this service.', icon: Sparkles },
    { key: 'accepted', label: 'You Accepted', desc: 'You have accepted this job. Head to the location.', icon: CheckCircle2 },
    { key: 'completed', label: 'Job Completed', desc: 'You have completed this service. Payment confirmed.', icon: ShieldCheck }
  ] : [
    { key: 'pending', label: 'Booking Created', desc: 'Your booking has been placed. Finding a worker.', icon: Sparkles },
    { key: 'accepted', label: 'Worker Assigned', desc: 'A professional worker has been assigned to your job.', icon: User },
    { key: 'completed', label: 'Service Completed', desc: 'The service has been completed successfully.', icon: ShieldCheck }
  ];

  const getActiveStepIndex = () => {
    if (booking.status === 'pending') return 0;
    if (booking.status === 'accepted') return 1;
    if (booking.status === 'completed') return 2;
    return -1;
  };

  const activeIndex = getActiveStepIndex();

  return (
    <div className="max-w-6xl mx-auto pb-24">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: -50, x: '-50%' }} 
            animate={{ opacity: 1, y: 0, x: '-50%' }} 
            exit={{ opacity: 0, y: -50, x: '-50%' }}
            className={`fixed top-6 left-1/2 z-50 px-6 py-3 rounded-2xl shadow-2xl font-semibold text-sm flex items-center gap-2 ${
              toast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
            }`}
          >
            {toast.message}
            <button onClick={() => setToast(null)} className="ml-2 hover:opacity-70"><X size={14} /></button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back Button */}
      <div className="mb-8">
        <Link 
          to={getBackPath()}
          className="inline-flex items-center gap-2 text-gray-500 hover:text-indigo-600 font-black text-sm transition-colors group"
        >
          <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
          {isWorker ? 'Back to My Jobs' : 'Back to My Bookings'}
        </Link>
      </div>

      {/* Header Panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <span className="text-xs text-gray-400 font-bold uppercase tracking-widest block mb-1">Booking ID: #{booking._id.substring(18)}</span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
            {booking.service?.name || 'Service Details'}
            <Badge 
              variant="indigo" 
              className={`px-3.5 py-1 text-xs uppercase tracking-widest font-black ${
                booking.status === 'completed' 
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                  : booking.status === 'pending' 
                  ? 'bg-amber-50 text-amber-700 border border-amber-200 animate-pulse' 
                  : booking.status === 'cancelled'
                  ? 'bg-red-50 text-red-700 border border-red-200'
                  : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
              }`}
            >
              {booking.status}
            </Badge>
          </h1>
        </div>
        
        <div className="flex gap-3">
          {/* Worker: Complete button */}
          {isWorker && booking.status === 'accepted' && (
            <button
              onClick={handleCompleteBooking}
              disabled={completing}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3.5 rounded-2xl transition-all font-bold text-sm shadow-lg flex items-center gap-2 hover:-translate-y-0.5 disabled:opacity-50"
            >
              {completing ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
              {completing ? 'Completing...' : 'Mark as Done'}
            </button>
          )}
          {/* User: Cancel button */}
          {!isWorker && booking.status === 'pending' && (
            <button
              onClick={handleCancelBooking}
              disabled={cancelling}
              className="bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white px-6 py-3.5 rounded-2xl transition-all duration-300 font-bold text-sm border border-rose-100 shadow-sm flex items-center gap-2 active:scale-95 disabled:opacity-50"
            >
              <ShieldAlert size={16} />
              {cancelling ? 'Cancelling...' : 'Cancel Booking'}
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* STATUS STEPPER */}
          <div className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-lg">
            <h2 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-2">
              <Activity className="text-indigo-600" size={22} />
              {isWorker ? 'Job Progress' : 'Booking Status'}
            </h2>

            {booking.status === 'cancelled' ? (
              <div className="p-4 bg-rose-50 text-rose-700 rounded-2xl text-sm flex items-center gap-3 border border-rose-100 font-semibold mb-2">
                <ShieldAlert size={20} className="text-rose-500 shrink-0" />
                This booking has been cancelled.
              </div>
            ) : (
              <div className="relative pl-6 border-l-2 border-indigo-100 space-y-10 py-2 ml-4">
                {statusSteps.map((step, idx) => {
                  const StepIcon = step.icon;
                  const isCompleted = idx <= activeIndex;
                  const isCurrent = idx === activeIndex;

                  return (
                    <div className="relative group" key={step.key}>
                      <div className={`absolute -left-[35px] top-0 h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        isCompleted 
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-500/20' 
                          : 'bg-white border-indigo-100 text-gray-300'
                      }`}>
                        {isCompleted ? <span className="text-[10px] font-bold">✓</span> : <span className="h-1.5 w-1.5 rounded-full bg-gray-200" />}
                      </div>

                      <div className="pl-6">
                        <h3 className={`text-base font-black ${isCompleted ? 'text-gray-900' : 'text-gray-400'} flex items-center gap-2`}>
                          <StepIcon size={16} className={isCurrent ? 'text-indigo-600 animate-bounce' : isCompleted ? 'text-indigo-500' : 'text-gray-400'} />
                          {step.label}
                        </h3>
                        <p className={`text-xs mt-1 ${isCompleted ? 'text-gray-500 font-medium' : 'text-gray-400'}`}>
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* PERSON CARD — Shows Customer (for worker) or Worker (for user) */}
          <div className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-lg relative overflow-hidden">
            <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 h-44 w-44 rounded-full bg-indigo-50/20 blur-xl pointer-events-none" />
            
            <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
              <User className="text-indigo-600" size={22} />
              {isWorker ? 'Customer Details' : 'Assigned Worker'}
            </h2>

            {isWorker ? (
              /* WORKER VIEW: Show customer info */
              booking.user ? (
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-slate-50 border border-slate-100 p-6 rounded-2xl relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-md text-white font-black text-xl shrink-0">
                      {booking.user.name?.substring(0, 1).toUpperCase() || 'C'}
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-gray-900">{booking.user.name || 'Customer'}</h3>
                      <p className="text-xs text-gray-400 mt-0.5">Customer</p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:items-end text-sm text-gray-500 font-medium space-y-1 w-full sm:w-auto">
                    {booking.user.email && (
                      <span className="flex items-center gap-1.5 bg-white border border-gray-100 px-3.5 py-2 rounded-xl text-gray-700 text-xs">
                        <Mail size={14} className="text-indigo-400" />
                        {booking.user.email}
                      </span>
                    )}
                    <div className="flex gap-2 mt-3 pt-2 w-full">
                      <button 
                        onClick={() => alert("Opening secure chat with the customer...")}
                        className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition-all"
                      >
                        <MessageSquare size={13} /> Message
                      </button>
                      <button 
                        onClick={() => alert("Calling customer...")}
                        className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 bg-white border border-gray-200 hover:border-indigo-600 hover:text-indigo-600 text-gray-700 font-bold text-xs px-4 py-2.5 rounded-xl transition-all"
                      >
                        <Phone size={13} /> Call
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 bg-slate-50 border border-slate-100 rounded-2xl">
                  <p className="text-gray-400 font-bold text-sm">Customer information not available.</p>
                </div>
              )
            ) : (
              /* USER VIEW: Show worker info */
              booking.worker ? (
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-slate-50 border border-slate-100 p-6 rounded-2xl relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-500/10 text-white font-black text-xl shrink-0">
                      {booking.worker.name.substring(0, 1).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-gray-900">{booking.worker.name}</h3>
                      <p className="text-xs text-gray-400 mt-0.5">Service Professional</p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:items-end text-sm text-gray-500 font-medium space-y-1 w-full sm:w-auto">
                    <span className="flex items-center gap-1.5 bg-white border border-gray-100 px-3.5 py-2 rounded-xl text-gray-700 text-xs">
                      <Mail size={14} className="text-indigo-400" />
                      {booking.worker.email}
                    </span>
                    
                    <div className="flex gap-2 mt-3 pt-2 w-full">
                      <button 
                        onClick={() => alert("Connecting you to a secure chat with your worker...")}
                        className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition-all"
                      >
                        <MessageSquare size={13} /> Chat
                      </button>
                      <button 
                        onClick={() => alert(`Calling worker...`)}
                        className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 bg-white border border-gray-200 hover:border-indigo-600 hover:text-indigo-600 text-gray-700 font-bold text-xs px-4 py-2.5 rounded-xl transition-all"
                      >
                        <Phone size={13} /> Call
                      </button>
                    </div>
                  </div>
                </div>
              ) : booking.status === 'cancelled' ? (
                <div className="text-center py-10 bg-slate-50 border border-slate-100 rounded-2xl">
                  <p className="text-gray-400 font-bold text-sm">No worker assigned to cancelled booking.</p>
                </div>
              ) : (
                <div className="text-center py-12 bg-indigo-50/20 border border-indigo-100/50 rounded-3xl relative z-10 flex flex-col items-center">
                  <div className="relative mb-6">
                    <motion.div 
                      animate={{ scale: [1, 1.4, 1] }} 
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                      className="absolute inset-0 bg-indigo-500/10 rounded-full blur-sm" 
                    />
                    <div className="relative h-16 w-16 bg-white border border-indigo-100 shadow-md rounded-2xl flex items-center justify-center">
                      <Compass className="text-indigo-600 h-8 w-8" style={{ animation: 'spin 4s linear infinite' }} />
                    </div>
                  </div>
                  <h3 className="text-base font-black text-indigo-950">Finding a Worker...</h3>
                  <p className="text-xs text-gray-500 mt-2 max-w-sm px-6 font-medium leading-relaxed">
                    We are connecting you to the best available professional. This usually takes less than 5 minutes.
                  </p>
                </div>
              )
            )}
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-8">
          
          {/* PRICE / EARNINGS CARD */}
          <div className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 flex justify-between px-6 pointer-events-none opacity-20">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="h-4 w-4 rounded-full bg-slate-100 -translate-y-2 shrink-0" />
              ))}
            </div>

            <div className="text-center border-b border-dashed border-gray-200 pb-6 mb-6 pt-4 relative z-10">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-indigo-50 text-indigo-600 mb-3 shadow-inner">
                <FileText size={22} />
              </div>
              <h2 className="text-lg font-black text-gray-900">{isWorker ? 'Job Earnings' : 'Price Details'}</h2>
              <p className="text-xs text-gray-400 mt-0.5">Avatani Service Receipt</p>
            </div>

            <div className="space-y-4 relative z-10 text-sm font-semibold">
              <div className="flex justify-between items-center text-gray-500">
                <span>Service</span>
                <span className="text-gray-900 font-extrabold">{booking.service?.name || 'Service'}</span>
              </div>

              <div className="flex justify-between items-center text-gray-500">
                <span>{isWorker ? 'Your earnings' : 'Base price'}</span>
                <span className="text-gray-900 font-mono font-bold">₹{basePrice}</span>
              </div>

              {booking.urgency && booking.urgency !== 'standard' && (
                <div className="flex justify-between items-center text-gray-500">
                  <span className="flex items-center gap-1">⚡ {booking.urgency} fee</span>
                  <span className="text-amber-600 font-mono font-bold">+₹{urgencyFee}</span>
                </div>
              )}

              {!isWorker && booking.discountCode && (
                <div className="flex justify-between items-center text-emerald-600">
                  <span>🏷️ Coupon ({booking.discountCode})</span>
                  <span className="font-mono font-bold">-₹{discount}</span>
                </div>
              )}

              <div className="flex justify-between items-center text-gray-500 border-b border-gray-100 pb-4 mb-4">
                <span>Payment method</span>
                <span className="text-gray-900 capitalize uppercase text-xs px-2.5 py-1 bg-slate-100 rounded-lg">{booking.paymentMethod}</span>
              </div>

              <div className="flex justify-between items-end pt-2">
                <div>
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-widest block">
                    {isWorker ? 'You Earn' : 'Total Price'}
                  </span>
                  <span className="text-[10px] text-gray-400 font-bold block">
                    {isWorker ? '(After service completion)' : '(Includes all taxes & fees)'}
                  </span>
                </div>
                <span className={`text-3xl font-black font-mono ${isWorker ? 'text-emerald-600' : 'text-indigo-600'}`}>₹{isWorker ? basePrice : computedTotal}</span>
              </div>
            </div>
          </div>

          {/* SERVICE LOCATION */}
          <div className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-lg">
            <h2 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
              <MapPin className="text-indigo-600" size={20} />
              Service Location
            </h2>

            <div className="space-y-4 text-xs font-semibold">
              <div>
                <span className="text-[10px] text-gray-400 uppercase font-black tracking-widest block mb-1">Address</span>
                <span className="text-gray-700 bg-slate-50 border border-slate-100 px-3 py-2.5 rounded-xl block font-medium leading-relaxed">
                  {booking.address}
                </span>
              </div>

              {booking.bookingDate && (
                <div>
                  <span className="text-[10px] text-gray-400 uppercase font-black tracking-widest block mb-1">Scheduled Date</span>
                  <span className="text-gray-700 bg-slate-50 border border-slate-100 px-3 py-2.5 rounded-xl block font-medium flex items-center gap-1.5">
                    <CalendarDays size={14} className="text-indigo-400" />
                    {new Date(booking.bookingDate).toLocaleDateString('en-IN', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
                  </span>
                </div>
              )}

              {booking.notes && (
                <div>
                  <span className="text-[10px] text-gray-400 uppercase font-black tracking-widest block mb-1">
                    {isWorker ? 'Customer Notes' : 'Special Instructions'}
                  </span>
                  <span className="text-indigo-900 bg-indigo-50/50 border border-indigo-50 px-3.5 py-3 rounded-xl block font-medium leading-relaxed italic">
                    "{booking.notes}"
                  </span>
                </div>
              )}

              {booking.urgency && booking.urgency !== 'standard' && (
                <div>
                  <span className="text-[10px] text-gray-400 uppercase font-black tracking-widest block mb-1">Priority Level</span>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold text-xs ${
                    booking.urgency === 'express' ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-amber-50 text-amber-700 border border-amber-100'
                  }`}>
                    <Zap size={14} /> {booking.urgency.charAt(0).toUpperCase() + booking.urgency.slice(1)} Request
                  </span>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default BookingDetail;
