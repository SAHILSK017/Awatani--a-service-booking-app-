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
      setCategories(catsData);
      setServices(servsData);
      if (catsData.length > 0 && !servCategory) setServCategory(catsData[0]._id);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  useEffect(() => { fetchContent(); }, []);

  const handleAddCategory = async (e) => {
    e.preventDefault(); setFormLoading(true);
    try {
      await addCategory({ name: catName, icon: catIcon });
      setCatName(''); alert("Category added successfully!"); fetchContent();
    } catch (err) { alert(err.response?.data?.message || 'Failed to add category'); } finally { setFormLoading(false); }
  };

  const handleAddService = async (e) => {
    e.preventDefault(); setFormLoading(true);
    try {
      await addService({ name: servName, description: servDesc, price: Number(servPrice), category: servCategory });
      setServName(''); setServDesc(''); setServPrice(''); alert("Service added successfully!"); fetchContent();
    } catch (err) { alert(err.response?.data?.message || 'Failed to add service'); } finally { setFormLoading(false); }
  };

  if (loading && categories.length === 0) return <div className="flex justify-center items-center h-screen bg-neutral-950"><Loader2 className="animate-spin text-indigo-500 h-10 w-10" /></div>;

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans pb-20 pt-10 px-8">
      <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}}>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Service Provisioning</h1>
        <p className="text-neutral-400 mt-2 mb-10">Configure categories and deploy operational service directives.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <motion.div initial={{opacity:0, x:-20}} animate={{opacity:1, x:0}} transition={{delay:0.1}} className="bg-neutral-900 border border-neutral-800 rounded-[2rem] overflow-hidden shadow-2xl">
            <div className="px-8 py-6 border-b border-neutral-800 bg-neutral-900/50">
                <h3 className="text-xl font-bold text-white flex items-center gap-3"><Tag className="text-indigo-400" /> Construct Category</h3>
            </div>
            <div className="p-8">
                <form onSubmit={handleAddCategory} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-neutral-400">Category Name</label>
                        <Input icon={LayoutList} placeholder="e.g. Home Cleaning" required value={catName} onChange={(e) => setCatName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-neutral-400">Icon / Emoji</label>
                        <Input icon={Info} placeholder="🧹" required value={catIcon} onChange={(e) => setCatIcon(e.target.value)} />
                    </div>
                    <Button type="submit" className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white" disabled={formLoading}>
                        {formLoading ? <Loader2 className="animate-spin h-5 w-5 mx-auto" /> : <><PlusCircle size={18} className="mr-2 inline" /> Add Category</>}
                    </Button>
                </form>
            </div>
        </motion.div>

        <motion.div initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} transition={{delay:0.2}} className="bg-neutral-900 border border-neutral-800 rounded-[2rem] overflow-hidden shadow-2xl">
            <div className="px-8 py-6 border-b border-neutral-800 bg-neutral-900/50">
                <h3 className="text-xl font-bold text-white flex items-center gap-3"><PlusCircle className="text-purple-400" /> Formulate Service Payload</h3>
            </div>
            <div className="p-8">
                <form onSubmit={handleAddService} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2 col-span-2 sm:col-span-1">
                            <label className="text-sm font-semibold text-neutral-400">Service Name</label>
                            <Input icon={Tag} placeholder="Standard Cleaning" required value={servName} onChange={(e)=>setServName(e.target.value)} />
                        </div>
                        <div className="space-y-2 col-span-2 sm:col-span-1">
                            <label className="text-sm font-semibold text-neutral-400">Base Price (₹)</label>
                            <Input icon={IndianRupee} type="number" placeholder="500" required value={servPrice} onChange={(e)=>setServPrice(e.target.value)} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-neutral-400">Attach to Hub Category</label>
                        <select className="w-full rounded-2xl border border-neutral-700 bg-neutral-950 px-4 py-3 text-sm text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" value={servCategory} onChange={(e) => setServCategory(e.target.value)} required>
                            <option value="" disabled>Select a Category</option>
                            {categories.map(c => <option key={c._id} value={c._id}>{c.icon} {c.name}</option>)}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-neutral-400">Description</label>
                        <textarea required rows="2" placeholder="Description of what the service entails..." value={servDesc} onChange={(e) => setServDesc(e.target.value)} className="w-full rounded-2xl border border-neutral-700 bg-neutral-950 px-4 py-3 text-sm text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none" />
                    </div>
                    <Button type="submit" className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white" disabled={formLoading || categories.length === 0}>
                        {formLoading ? <Loader2 className="animate-spin h-5 w-5 mx-auto" /> : <><PlusCircle size={18} className="mr-2 inline" /> Publish Service</>}
                    </Button>
                </form>
            </div>
        </motion.div>
      </div>

      <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:0.3}}>
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3"><Activity className="text-cyan-400" /> Currently Active Services</h2>
        <div className="bg-neutral-900 border border-neutral-800 rounded-[2rem] overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
                <table className="w-full text-left font-medium">
                    <thead className="bg-neutral-950/50 text-neutral-400 text-xs uppercase tracking-widest border-b border-neutral-800">
                        <tr><th className="px-6 py-4">Service Details</th><th className="px-6 py-4 border-l border-neutral-800 hidden sm:table-cell">Hub</th><th className="px-6 py-4">Value</th><th className="px-6 py-4 text-right">Status</th></tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800">
                        {services.map(service => (
                            <tr key={service._id} className="hover:bg-neutral-900/50 transition-colors">
                                <td className="px-6 py-5">
                                    <div className="text-white text-base">{service.name}</div>
                                    <div className="text-neutral-500 text-xs mt-1 w-64 lg:w-96 truncate">{service.description}</div>
                                    {/* Mobile Hub Tag */}
                                    <Badge variant="indigo" className="sm:hidden mt-2 bg-indigo-900/30 text-indigo-400 border border-indigo-800/50">{service.category?.icon} {service.category?.name || 'Null'}</Badge>
                                </td>
                                <td className="px-6 py-5 border-l border-neutral-800 hidden sm:table-cell">
                                    <Badge variant="indigo" className="bg-indigo-900/40 text-indigo-300 border border-indigo-700/50 truncate max-w-[150px] inline-block">{service.category?.icon} {service.category?.name || 'Uncategorized'}</Badge>
                                </td>
                                <td className="px-6 py-5 font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-200">₹{service.price}</td>
                                <td className="px-6 py-5 text-right"><Badge variant="success" className="bg-emerald-900/40 text-emerald-400 border-none">Active</Badge></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {services.length === 0 && <div className="p-12 text-center text-neutral-500 text-lg">No services indexed natively.</div>}
            </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminServices;
