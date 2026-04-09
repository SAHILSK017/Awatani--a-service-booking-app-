import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { PlusCircle, Tag, AlignLeft, IndianRupee, LayoutList, Loader2, Info, Activity } from 'lucide-react';
import { addCategory, addService, getCategories, getServices } from '../../services/categoryService';

const AdminServices = () => {
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form States
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
      const [catsData, servsData] = await Promise.all([
          getCategories(),
          getServices()
      ]);
      setCategories(catsData);
      setServices(servsData);
      if (catsData.length > 0 && !servCategory) setServCategory(catsData[0]._id);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      await addCategory({ name: catName, icon: catIcon });
      setCatName('');
      alert("Category added successfully!");
      fetchContent();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add category');
    } finally {
      setFormLoading(false);
    }
  };

  const handleAddService = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      await addService({ 
          name: servName, 
          description: servDesc, 
          price: Number(servPrice), 
          category: servCategory 
      });
      setServName('');
      setServDesc('');
      setServPrice('');
      alert("Service added successfully!");
      fetchContent();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add service');
    } finally {
      setFormLoading(false);
    }
  };

  if (loading && categories.length === 0) return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-indigo-600 h-8 w-8" /></div>;

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Manage Services</h1>
        <p className="text-gray-500 text-sm mt-1">Create new business categories and dispatchable services.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Category Builder */}
        <Card>
            <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Tag size={18} className="text-indigo-600" /> Construct Category
                </h3>
            </div>
            <CardContent className="p-6">
                <form onSubmit={handleAddCategory} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Category Name</label>
                        <Input icon={LayoutList} placeholder="e.g. Home Cleaning" required value={catName} onChange={(e) => setCatName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Icon / Emoji</label>
                        <Input icon={Info} placeholder="🧹" required value={catIcon} onChange={(e) => setCatIcon(e.target.value)} />
                    </div>
                    <Button type="submit" className="w-full mt-4" disabled={formLoading}>
                        {formLoading ? <Loader2 className="animate-spin h-5 w-5" /> : <><PlusCircle size={18} className="mr-2" /> Add Category</>}
                    </Button>
                </form>
            </CardContent>
        </Card>

        {/* Service Builder */}
        <Card className="h-full">
            <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <PlusCircle size={18} className="text-indigo-600" /> Formulate Service
                </h3>
            </div>
            <CardContent className="p-6">
                <form onSubmit={handleAddService} className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2 col-span-2 sm:col-span-1">
                            <label className="text-sm font-medium text-gray-700">Service Name</label>
                            <Input icon={Tag} placeholder="Standard Cleaning" required value={servName} onChange={(e)=>setServName(e.target.value)} />
                        </div>
                        <div className="space-y-2 col-span-2 sm:col-span-1">
                            <label className="text-sm font-medium text-gray-700">Price (₹)</label>
                            <Input icon={IndianRupee} type="number" placeholder="50" required value={servPrice} onChange={(e)=>setServPrice(e.target.value)} />
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Attach to Category</label>
                        <select 
                            className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            value={servCategory}
                            onChange={(e) => setServCategory(e.target.value)}
                            required
                        >
                            <option value="" disabled>Select a Category</option>
                            {categories.map(c => (
                                <option key={c._id} value={c._id}>{c.icon} {c.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Description</label>
                        <textarea 
                            required
                            rows="3"
                            placeholder="Detailed description of what the service includes..."
                            value={servDesc}
                            onChange={(e) => setServDesc(e.target.value)}
                            className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
                        />
                    </div>

                    <Button type="submit" className="w-full mt-4" disabled={formLoading || categories.length === 0}>
                        {formLoading ? <Loader2 className="animate-spin h-5 w-5" /> : <><PlusCircle size={18} className="mr-2" /> Publish Service</>}
                    </Button>
                </form>
            </CardContent>
        </Card>
      </div>

      {/* Available Services Table */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"><Activity size={20} /> Currently Available Services</h2>
        <Card className="overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                        <tr>
                            <th className="px-6 py-4 font-medium">Service Info</th>
                            <th className="px-6 py-4 font-medium">Category</th>
                            <th className="px-6 py-4 font-medium">Price</th>
                            <th className="px-6 py-4 font-medium text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {services.map(service => (
                            <tr key={service._id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="font-medium text-gray-900">{service.name}</div>
                                    <div className="text-gray-500 text-xs mt-1 w-64 truncate" title={service.description}>{service.description}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <Badge variant="indigo" className="truncate max-w-[150px] inline-block">
                                        {service.category?.icon} {service.category?.name || 'Uncategorized'}
                                    </Badge>
                                </td>
                                <td className="px-6 py-4 font-bold text-gray-900">
                                    ₹{service.price}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <Badge variant="success">Active</Badge>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {services.length === 0 && <div className="p-8 text-center text-gray-500">No services have been published yet.</div>}
            </div>
        </Card>
      </div>

    </div>
  );
};

export default AdminServices;
