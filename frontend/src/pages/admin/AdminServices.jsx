import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { PlusCircle, Tag, AlignLeft, IndianRupee, LayoutList, Loader2, Info, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { addCategory, addService, getCategories, getServices } from '../../services/categoryService';

const AdminServices = () => {
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const [catName, setCatName] = useState('');
  const [catIcon, setCatIcon] = useState('🧹');
  const [servName, setServName] = useState('');
  const [servDesc, setServDesc] = useState('');
  const [servPrice, setServPrice] = useState('');
  const [servCategory, setServCategory] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const [catsData, servsData] = await Promise.all([getCategories(), getServices()]);
      setCategories(catsData); setServices(servsData);
      if (catsData.length > 0 && !servCategory) setServCategory(catsData[0]._id);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  useEffect(() => { fetchContent(); }, []);

  const handleAddCategory = async (e) => {
    e.preventDefault(); setFormLoading(true);
    try { await addCategory({ name: catName, icon: catIcon }); setCatName(''); alert("Category added successfully!"); fetchContent(); } 
    catch (err) { alert(err.response?.data?.message || 'Failed to add category'); } finally { setFormLoading(false); }
  };

  const handleAddService = async (e) => {
    e.preventDefault(); setFormLoading(true);
    try { await addService({ name: servName, description: servDesc, price: Number(servPrice), category: servCategory }); setServName(''); setServDesc(''); setServPrice(''); alert("Service added successfully!"); fetchContent(); } 
    catch (err) { alert(err.response?.data?.message || 'Failed to add service'); } finally { setFormLoading(false); }
  };

  if (loading && categories.length === 0) return <div className="flex justify-center items-center h-screen bg-gray-50"><Loader2 className="animate-spin text-indigo-600 h-10 w-10" /></div>;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-20">
      
      {/* Light Header */}
      <div className="relative h-72 w-full bg-slate-900 overflow-hidden flex items-center justify-center mb-10 shadow-lg">
        <div className="absolute inset-0">
          <img src="/customer_hero.png" alt="Premium Header" className="w-full h-full object-cover opacity-50 mix-blend-overlay filter blur-[2px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-transparent to-indigo-900/60" />
        </div>
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8 text-left pt-10">
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">Service Provisioning</h1>
            <p className="text-indigo-900 font-medium">Configure categories and deploy operational service directives.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-20 -mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            
            <motion.div initial={{opacity:0, x:-20}} animate={{opacity:1, x:0}} transition={{delay:0.1}} className="bg-white/90 backdrop-blur-xl border border-white/50 rounded-3xl overflow-hidden shadow-2xl">
                <div className="px-8 py-6 border-b border-gray-100 bg-white/50">
                    <h3 className="text-xl font-extrabold text-gray-900 flex items-center gap-3"><Tag className="text-indigo-600" /> Construct Category</h3>
                </div>
                <div className="p-8">
                    <form onSubmit={handleAddCategory} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-500 uppercase tracking-widest">Category Name</label>
                            <Input icon={LayoutList} placeholder="e.g. Home Cleaning" required value={catName} onChange={(e) => setCatName(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-500 uppercase tracking-widest">Icon / Emoji</label>
                            <Input icon={Info} placeholder="🧹" required value={catIcon} onChange={(e) => setCatIcon(e.target.value)} />
                        </div>
                        <Button type="submit" className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white shadow-md p-4 rounded-2xl font-bold" disabled={formLoading}>
                            {formLoading ? <Loader2 className="animate-spin h-5 w-5 mx-auto" /> : <><PlusCircle size={20} className="mr-2 inline" /> Add Shared Category</>}
                        </Button>
                    </form>
                </div>
            </motion.div>

            <motion.div initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} transition={{delay:0.2}} className="bg-white/90 backdrop-blur-xl border border-white/50 rounded-3xl overflow-hidden shadow-2xl">
                <div className="px-8 py-6 border-b border-gray-100 bg-white/50">
                    <h3 className="text-xl font-extrabold text-gray-900 flex items-center gap-3"><PlusCircle className="text-purple-600" /> Formulate Service Payload</h3>
                </div>
                <div className="p-8">
                    <form onSubmit={handleAddService} className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2 col-span-2 sm:col-span-1">
                                <label className="text-sm font-bold text-gray-500 uppercase tracking-widest">Service Name</label>
                                <Input icon={Tag} placeholder="Standard Cleaning" required value={servName} onChange={(e)=>setServName(e.target.value)} />
                            </div>
                            <div className="space-y-2 col-span-2 sm:col-span-1">
                                <label className="text-sm font-bold text-gray-500 uppercase tracking-widest">Base Price (₹)</label>
                                <Input icon={IndianRupee} type="number" placeholder="500" required value={servPrice} onChange={(e)=>setServPrice(e.target.value)} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-500 uppercase tracking-widest">Attach to Hub Category</label>
                            <select className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-4 text-sm font-bold text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-sm" value={servCategory} onChange={(e) => setServCategory(e.target.value)} required>
                                <option value="" disabled>Select a Category</option>
                                {categories.map(c => <option key={c._id} value={c._id}>{c.icon} {c.name}</option>)}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-500 uppercase tracking-widest">Description</label>
                            <textarea required rows="2" placeholder="Description of what the service entails..." value={servDesc} onChange={(e) => setServDesc(e.target.value)} className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-4 text-sm font-medium text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none shadow-sm" />
                        </div>
                        <Button type="submit" className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white shadow-md p-4 rounded-2xl font-bold" disabled={formLoading || categories.length === 0}>
                            {formLoading ? <Loader2 className="animate-spin h-5 w-5 mx-auto" /> : <><PlusCircle size={20} className="mr-2 inline" /> Publish Service Instance</>}
                        </Button>
                    </form>
                </div>
            </motion.div>
        </div>

        <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:0.3}}>
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3"><Activity className="text-blue-500" /> Currently Active Services</h2>
            <div className="bg-white/90 backdrop-blur-xl border border-white/50 rounded-3xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left font-medium">
                        <thead className="bg-gray-50 text-gray-400 text-xs uppercase tracking-widest border-b border-gray-100 font-bold">
                            <tr><th className="px-6 py-4">Service Details</th><th className="px-6 py-4 border-l border-gray-100 hidden sm:table-cell">Hub</th><th className="px-6 py-4">Value</th><th className="px-6 py-4 text-right">Status</th></tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 bg-white">
                            {services.map(service => (
                                <tr key={service._id} className="hover:bg-gray-50/80 transition-colors">
                                    <td className="px-6 py-5">
                                        <div className="text-gray-900 font-bold text-lg">{service.name}</div>
                                        <div className="text-gray-500 text-sm mt-1 w-64 lg:w-96 truncate font-medium">{service.description}</div>
                                        <Badge variant="indigo" className="sm:hidden mt-3 shadow-sm font-bold">{service.category?.icon} {service.category?.name || 'Null'}</Badge>
                                    </td>
                                    <td className="px-6 py-5 border-l border-gray-50 hidden sm:table-cell">
                                        <Badge variant="indigo" className="truncate max-w-[150px] inline-block shadow-sm font-bold tracking-widest">{service.category?.icon} {service.category?.name || 'Uncategorized'}</Badge>
                                    </td>
                                    <td className="px-6 py-5 font-black text-indigo-600 text-xl">₹{service.price}</td>
                                    <td className="px-6 py-5 text-right"><Badge variant="success" className="font-bold tracking-widest px-3 py-1 shadow-sm">Active</Badge></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {services.length === 0 && <div className="p-12 text-center text-gray-500 font-bold text-lg">No services indexed natively.</div>}
                </div>
            </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminServices;
