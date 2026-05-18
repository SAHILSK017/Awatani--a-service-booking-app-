import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import Loader from '../../components/Loader.jsx';
import { getServices, getCategories } from '../../services/categoryService.js';
import { createBooking } from '../../services/bookingService.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, DollarSign, CheckCircle, ArrowLeft, Clock, Package, AlertCircle, CheckCircle2, Ticket, ShieldCheck, Zap, Sparkles, Loader2 } from 'lucide-react';
import { formatPrice } from '../../utils/helpers.js';
import { Badge } from '../../components/ui/Badge';

const Booking = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Expanded Form States
  const [formData, setFormData] = useState({
    service: '',
    address: '',
    date: '',
    time: '',
    urgency: 'standard', // standard, priority, express
    notes: '',
    paymentMethod: 'cash', // cash, upi, card
    discountCode: ''
  });

  // Promo Code Validation States
  const [promoInput, setPromoInput] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');

  const [submitLoading, setSubmitLoading] = useState(false);
  
  // Premium Toast Notification State
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [servRes, catRes] = await Promise.all([
        getServices(),
        getCategories()
      ]);

      setServices(servRes || []);
      setCategories(catRes || []);

      if (location.state?.selectedService || location.state?.service) {
        setFormData(prev => ({
          ...prev,
          service: (location.state.selectedService || location.state.service)._id
        }));
      }

      const serviceId = searchParams.get('service');
      if (serviceId) {
        setFormData(prev => ({ ...prev, service: serviceId }));
      }

    } catch (error) {
      console.error('Error fetching booking data:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectedService = services.find(
    s => s._id === formData.service
  );

  // Dynamic Price Calculations
  const basePrice = selectedService?.price || 0;
  
  const urgencyFee = 
    formData.urgency === 'priority' ? 99 : 
    formData.urgency === 'express' ? 199 : 0;

  const discountAmount = promoApplied 
    ? (promoInput.toUpperCase() === 'WELCOME10' ? Math.round(basePrice * 0.1) : 
       promoInput.toUpperCase() === 'SAVINGS50' ? 50 : 0)
    : 0;

  const totalPrice = Math.max(0, basePrice + urgencyFee - discountAmount);

  // Apply Coupon Code
  const handleApplyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    if (!code) {
      setPromoError('Please enter a coupon code.');
      setPromoSuccess('');
      return;
    }

    if (code === 'WELCOME10') {
      setPromoApplied(true);
      setPromoSuccess('Promo WELCOME10 applied! You saved 10% off base price.');
      setPromoError('');
      setFormData(prev => ({ ...prev, discountCode: code }));
    } else if (code === 'SAVINGS50') {
      setPromoApplied(true);
      setPromoSuccess('Promo SAVINGS50 applied! Flat ₹50 off base price.');
      setPromoError('');
      setFormData(prev => ({ ...prev, discountCode: code }));
    } else {
      setPromoError('Invalid coupon code. Try WELCOME10 or SAVINGS50.');
      setPromoSuccess('');
      setPromoApplied(false);
    }
  };

  const handleRemovePromo = () => {
    setPromoApplied(false);
    setPromoInput('');
    setPromoSuccess('');
    setPromoError('');
    setFormData(prev => ({ ...prev, discountCode: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.service || !formData.address || !formData.date || !formData.time) {
      showToast("Please fill all required fields including Date, Time and Location", "error");
      return;
    }

    setSubmitLoading(true);

    try {
      const combinedDateTime = new Date(`${formData.date}T${formData.time}`).toISOString();
      await createBooking(
        formData.service, 
        formData.address, 
        combinedDateTime,
        formData.urgency,
        formData.notes,
        formData.paymentMethod,
        formData.discountCode
      );
      navigate('/user/mybookings');
    } catch (error) {
      console.error('Error creating booking:', error);
      showToast(error.response?.data?.message || 'Booking failed. Please try again.', 'error');
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 font-sans pb-20">
      
      {/* Floating Premium Toast Notification */}
      {toast.show && (
        <div className={`fixed top-6 right-6 z-[9999] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border backdrop-blur-xl transition-all duration-500 animate-fade-in ${
          toast.type === 'success' 
            ? 'bg-emerald-50/95 border-emerald-200 text-emerald-800' 
            : 'bg-rose-50/95 border-rose-200 text-rose-800'
        }`}>
          <div className={`h-8 w-8 rounded-xl flex items-center justify-center shrink-0 shadow-inner ${
            toast.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
          }`}>
            {toast.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          </div>
          <span className="font-bold text-sm tracking-wide">{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="relative h-72 w-full bg-slate-900 overflow-hidden flex items-center justify-center mb-10 shadow-lg">
        <div className="absolute inset-0">
          <img src="/customer_hero.png" alt="Checkout Header" className="w-full h-full object-cover opacity-50 mix-blend-overlay filter blur-[2px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-transparent to-indigo-900/60" />
        </div>
        <div className="relative z-10 w-full max-w-5xl mx-auto px-6 lg:px-8 text-left pt-10 flex items-center gap-6">
          <button
            onClick={() => navigate(-1)}
            className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl transition-all border border-white/10"
            title="Go back"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div>
            <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">Configure Booking</h1>
            <p className="text-indigo-200 font-medium">Set your schedule, choose urgency, and confirm your booking.</p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 lg:px-8 relative z-20 -mt-16">
        
        {/* NO SERVICE SELECTED */}
        {!selectedService && (
          <div className="bg-white/90 backdrop-blur-xl border border-white/50 p-16 rounded-3xl text-center shadow-2xl space-y-6">
            <Package className="mx-auto h-20 w-20 text-indigo-300" />
            <h3 className="text-2xl font-black text-gray-900">No Service Selected</h3>
            <p className="text-gray-500 max-w-md mx-auto">Please select a service from the catalog before booking.</p>
            <button
              onClick={() => navigate('/user/services')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-4 rounded-2xl shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
            >
              Browse Active Services
            </button>
          </div>
        )}

        {/* DETAILED BOOKING WRAPPER */}
        {selectedService && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* LEFT COLUMN: OPTIONS FORM */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* SERVICE CARD HEADER */}
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-gray-100 p-8 rounded-3xl shadow-xl flex items-center gap-6">
                <div className="h-16 w-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-3xl shadow-inner shrink-0">
                  {selectedService.category?.icon || '🛠️'}
                </div>
                <div>
                  <Badge variant="indigo" className="mb-1 text-xs font-bold tracking-widest">{selectedService.category?.name}</Badge>
                  <h2 className="text-2xl font-black text-gray-900 leading-tight">{selectedService.name}</h2>
                  <p className="text-gray-500 text-sm mt-1">{selectedService.description}</p>
                </div>
              </motion.div>

              {/* CHECKOUT CONFIG FORM */}
              <form onSubmit={handleSubmit} className="space-y-8">
                
                {/* SECTION 1: TIMING */}
                <div className="bg-white border border-gray-100 p-8 rounded-3xl shadow-xl space-y-6">
                  <h3 className="text-lg font-black text-gray-900 flex items-center gap-3 border-b border-gray-50 pb-4">
                    <Calendar className="text-indigo-600" size={20} />
                    1. Scheduling & Timing
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Service Date</label>
                      <input
                        type="date"
                        required
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full rounded-2xl bg-gray-50/50 border border-gray-200 p-4 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-bold text-gray-900 shadow-inner"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Service Time</label>
                      <input
                        type="time"
                        required
                        value={formData.time}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                        className="w-full rounded-2xl bg-gray-50/50 border border-gray-200 p-4 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-bold text-gray-900 shadow-inner"
                      />
                    </div>
                  </div>
                </div>

                {/* SECTION 2: URGENCY TIERS */}
                <div className="bg-white border border-gray-100 p-8 rounded-3xl shadow-xl space-y-6">
                  <h3 className="text-lg font-black text-gray-900 flex items-center gap-3 border-b border-gray-50 pb-4">
                    <Zap className="text-amber-500 animate-pulse" size={20} />
                    2. Choose Urgency Tier
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    
                    {/* STANDARD */}
                    <div 
                      onClick={() => setFormData({ ...formData, urgency: 'standard' })}
                      className={`cursor-pointer p-5 rounded-2xl border-2 transition-all flex flex-col justify-between h-36 ${
                        formData.urgency === 'standard' 
                          ? 'border-indigo-600 bg-indigo-50/20 shadow-md' 
                          : 'border-gray-100 hover:border-gray-200 bg-white'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Normal</span>
                        <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${formData.urgency === 'standard' ? 'border-indigo-600 bg-indigo-600' : 'border-gray-200'}`}>
                          {formData.urgency === 'standard' && <div className="h-2 w-2 rounded-full bg-white" />}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-base font-black text-gray-900">Standard Tier</h4>
                        <p className="text-xs text-gray-500 mt-1">Regular response time.</p>
                      </div>
                      <span className="text-sm font-black text-indigo-600 font-mono">Free</span>
                    </div>

                    {/* PRIORITY */}
                    <div 
                      onClick={() => setFormData({ ...formData, urgency: 'priority' })}
                      className={`cursor-pointer p-5 rounded-2xl border-2 transition-all flex flex-col justify-between h-36 ${
                        formData.urgency === 'priority' 
                          ? 'border-indigo-600 bg-indigo-50/20 shadow-md' 
                          : 'border-gray-100 hover:border-gray-200 bg-white'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-bold text-indigo-500 uppercase tracking-widest">Fast</span>
                        <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${formData.urgency === 'priority' ? 'border-indigo-600 bg-indigo-600' : 'border-gray-200'}`}>
                          {formData.urgency === 'priority' && <div className="h-2 w-2 rounded-full bg-white" />}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-base font-black text-gray-900">Priority Tier</h4>
                        <p className="text-xs text-gray-500 mt-1">Faster worker assignment.</p>
                      </div>
                      <span className="text-sm font-black text-indigo-600 font-mono">+₹99</span>
                    </div>

                    {/* EXPRESS */}
                    <div 
                      onClick={() => setFormData({ ...formData, urgency: 'express' })}
                      className={`cursor-pointer p-5 rounded-2xl border-2 transition-all flex flex-col justify-between h-36 ${
                        formData.urgency === 'express' 
                          ? 'border-indigo-600 bg-indigo-50/20 shadow-md' 
                          : 'border-gray-100 hover:border-gray-200 bg-white'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">Instant</span>
                        <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${formData.urgency === 'express' ? 'border-indigo-600 bg-indigo-600' : 'border-gray-200'}`}>
                          {formData.urgency === 'express' && <div className="h-2 w-2 rounded-full bg-white" />}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-base font-black text-gray-900">Express Tier</h4>
                        <p className="text-xs text-gray-500 mt-1">Top priority, fastest assignment.</p>
                      </div>
                      <span className="text-sm font-black text-indigo-600 font-mono">+₹199</span>
                    </div>

                  </div>
                </div>

                {/* SECTION 3: ADDRESS & NOTES */}
                <div className="bg-white border border-gray-100 p-8 rounded-3xl shadow-xl space-y-6">
                  <h3 className="text-lg font-black text-gray-900 flex items-center gap-3 border-b border-gray-50 pb-4">
                    <MapPin className="text-indigo-600" size={20} />
                    3. Service Address & Notes
                  </h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Service Location</label>
                      <textarea
                        required
                        placeholder="Enter your accurate residential or business location address..."
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="w-full min-h-[100px] rounded-2xl bg-gray-50/50 border border-gray-200 p-4 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-semibold text-gray-900 resize-none shadow-inner"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Instructions / Special Notes (Optional)</label>
                      <textarea
                        placeholder="e.g. Please bring extra detergents, pet-friendly requirements, gate entry passcode, etc."
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        className="w-full min-h-[80px] rounded-2xl bg-gray-50/50 border border-gray-200 p-4 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-semibold text-gray-900 resize-none shadow-inner"
                      />
                    </div>
                  </div>
                </div>

                {/* SECTION 4: PAYMENT OPTIONS */}
                <div className="bg-white border border-gray-100 p-8 rounded-3xl shadow-xl space-y-6">
                  <h3 className="text-lg font-black text-gray-900 flex items-center gap-3 border-b border-gray-50 pb-4">
                    <ShieldCheck className="text-indigo-600" size={20} />
                    4. Secure Payment Method
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    
                    {/* CASH */}
                    <div 
                      onClick={() => setFormData({ ...formData, paymentMethod: 'cash' })}
                      className={`cursor-pointer p-4 rounded-xl border flex items-center gap-3 transition-all ${
                        formData.paymentMethod === 'cash' ? 'border-indigo-600 bg-indigo-50/15' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`h-4 w-4 rounded-full border flex items-center justify-center shrink-0 ${formData.paymentMethod === 'cash' ? 'border-indigo-600 bg-indigo-600' : 'border-gray-300'}`}>
                        {formData.paymentMethod === 'cash' && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                      </div>
                      <span className="font-bold text-sm text-gray-900">Cash on Service</span>
                    </div>

                    {/* UPI */}
                    <div 
                      onClick={() => setFormData({ ...formData, paymentMethod: 'upi' })}
                      className={`cursor-pointer p-4 rounded-xl border flex items-center gap-3 transition-all ${
                        formData.paymentMethod === 'upi' ? 'border-indigo-600 bg-indigo-50/15' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`h-4 w-4 rounded-full border flex items-center justify-center shrink-0 ${formData.paymentMethod === 'upi' ? 'border-indigo-600 bg-indigo-600' : 'border-gray-300'}`}>
                        {formData.paymentMethod === 'upi' && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                      </div>
                      <span className="font-bold text-sm text-gray-900">UPI Instant</span>
                    </div>

                    {/* CARD */}
                    <div 
                      onClick={() => setFormData({ ...formData, paymentMethod: 'card' })}
                      className={`cursor-pointer p-4 rounded-xl border flex items-center gap-3 transition-all ${
                        formData.paymentMethod === 'card' ? 'border-indigo-600 bg-indigo-50/15' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`h-4 w-4 rounded-full border flex items-center justify-center shrink-0 ${formData.paymentMethod === 'card' ? 'border-indigo-600 bg-indigo-600' : 'border-gray-300'}`}>
                        {formData.paymentMethod === 'card' && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                      </div>
                      <span className="font-bold text-sm text-gray-900">Credit / Debit Card</span>
                    </div>

                  </div>
                </div>

              </form>
            </div>

            {/* RIGHT COLUMN: BILL BREAKDOWN & PROMO CODE */}
            <div className="space-y-8">
              
              {/* ORDER SUMMARY */}
              <div className="bg-white border border-indigo-100 p-8 rounded-3xl shadow-xl space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 h-24 w-24 bg-indigo-600/5 rounded-full translate-x-8 -translate-y-8" />
                <h3 className="text-xl font-black text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-4">
                  <Sparkles className="text-indigo-600" size={20} />
                  Order Summary
                </h3>

                <div className="space-y-4 font-bold text-sm">
                  
                  <div className="flex justify-between text-gray-500">
                    <span>Base Service Price</span>
                    <span className="font-mono text-gray-900">₹{basePrice}</span>
                  </div>

                  <div className="flex justify-between text-gray-500">
                    <span>Urgency Add-on ({formData.urgency.toUpperCase()})</span>
                    <span className="font-mono text-gray-900">₹{urgencyFee}</span>
                  </div>

                  {promoApplied && (
                    <div className="flex justify-between text-emerald-600">
                      <span>Promo Discount ({formData.discountCode})</span>
                      <span className="font-mono">-₹{discountAmount}</span>
                    </div>
                  )}

                  <div className="border-t border-gray-100 pt-4 flex justify-between items-center text-lg font-black text-gray-900">
                    <span>Total Payable</span>
                    <span className="text-2xl font-black text-indigo-600 font-mono">₹{totalPrice}</span>
                  </div>

                </div>

                <button
                  onClick={handleSubmit}
                  disabled={submitLoading}
                  className="w-full bg-indigo-600 text-white font-bold text-lg py-4 rounded-2xl shadow-lg shadow-indigo-600/30 hover:bg-indigo-700 hover:shadow-indigo-600/40 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  {submitLoading ? <Loader2 className="animate-spin h-5 w-5" /> : "Confirm & Book"}
                </button>
              </div>

              {/* PROMO CODES */}
              <div className="bg-white border border-gray-100 p-8 rounded-3xl shadow-xl space-y-6">
                <h3 className="text-lg font-black text-gray-900 flex items-center gap-2 border-b border-gray-50 pb-4">
                  <Ticket className="text-indigo-600" size={18} />
                  Apply Promo Code
                </h3>

                {promoApplied ? (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-emerald-800">Coupon Active</span>
                      <button 
                        onClick={handleRemovePromo}
                        className="text-xs text-red-500 hover:text-red-700 font-bold hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                    <p className="text-xs text-emerald-700 font-medium leading-relaxed">{promoSuccess}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="WELCOME10 or SAVINGS50"
                        value={promoInput}
                        onChange={(e) => {
                          setPromoInput(e.target.value);
                          setPromoError('');
                        }}
                        className="w-full px-4 py-3.5 rounded-xl border border-gray-200 outline-none focus:border-indigo-500 font-bold text-sm text-gray-700 shadow-inner"
                      />
                      <button
                        type="button"
                        onClick={handleApplyPromo}
                        className="bg-slate-900 text-white px-5 py-3.5 rounded-xl font-bold hover:bg-slate-800 transition-colors text-sm"
                      >
                        Apply
                      </button>
                    </div>

                    <AnimatePresence mode="wait">
                      {promoError && (
                        <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-xs font-bold text-red-500 flex items-center gap-1.5">
                          <AlertCircle size={14} />
                          {promoError}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="border-t border-dashed border-gray-100 pt-3">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Available Coupons</span>
                      <div className="space-y-2">
                        <div 
                          onClick={() => setPromoInput('WELCOME10')}
                          className="cursor-pointer p-2.5 bg-gray-50 border border-gray-100 rounded-lg hover:bg-indigo-50/10 hover:border-indigo-200 transition-all flex justify-between items-center text-xs"
                        >
                          <span className="font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">WELCOME10</span>
                          <span className="text-gray-400 font-medium">Save 10% off service base price</span>
                        </div>
                        <div 
                          onClick={() => setPromoInput('SAVINGS50')}
                          className="cursor-pointer p-2.5 bg-gray-50 border border-gray-100 rounded-lg hover:bg-indigo-50/10 hover:border-indigo-200 transition-all flex justify-between items-center text-xs"
                        >
                          <span className="font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">SAVINGS50</span>
                          <span className="text-gray-400 font-medium">Get flat ₹50 discount</span>
                        </div>
                      </div>
                    </div>

                  </div>
                )}
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default Booking;