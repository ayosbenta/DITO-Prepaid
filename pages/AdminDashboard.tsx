import React, { useState, useContext, useEffect } from 'react';
import { 
  LayoutDashboard, Package, ShoppingBag, Users, Settings, 
  TrendingUp, AlertCircle, Search, Bell,
  MoreHorizontal, ArrowUpRight, ArrowDownRight, Filter, LogOut, Menu, X, Plus, Trash2, Edit2, Save
} from 'lucide-react';
import { SALES_DATA } from '../constants';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, BarChart, Bar, Cell 
} from 'recharts';
import { Badge, Button } from '../components/UI';
import { Link } from 'react-router-dom';
import { StoreContext } from '../contexts/StoreContext';
import { Product, Order } from '../types';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const { 
    products, orders, customers, stats, settings,
    addProduct, updateProduct, deleteProduct,
    updateOrderStatus, deleteOrder,
    deleteCustomer, updateSettings
  } = useContext(StoreContext);

  // Local state for Forms/Modals
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProductForm, setNewProductForm] = useState<Partial<Product>>({});

  // Local state for Settings Form
  const [settingsForm, setSettingsForm] = useState(settings);

  useEffect(() => {
    setSettingsForm(settings);
  }, [settings]);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard' },
    { icon: Package, label: 'Products' },
    { icon: ShoppingBag, label: 'Orders' },
    { icon: Users, label: 'Customers' },
    { icon: Settings, label: 'Settings' },
  ];

  // --- Helper Functions ---

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setNewProductForm(product);
    setIsProductModalOpen(true);
  };

  const handleNewProduct = () => {
    setEditingProduct(null);
    setNewProductForm({
      id: `prod-${Date.now()}`,
      category: 'Modems',
      rating: 5,
      reviews: 0,
      gallery: [],
      specs: {},
      features: []
    });
    setIsProductModalOpen(true);
  };

  const saveProduct = () => {
    if (!newProductForm.name || !newProductForm.price) return alert("Name and Price required");

    const productToSave = {
      ...newProductForm,
      image: newProductForm.image || 'https://picsum.photos/200',
      description: newProductForm.description || 'No description',
      subtitle: newProductForm.subtitle || 'New Product'
    } as Product;

    if (editingProduct) {
      updateProduct(editingProduct.id, productToSave);
    } else {
      addProduct(productToSave);
    }
    setIsProductModalOpen(false);
  };

  const handleSettingsChange = (section: keyof typeof settings, key: string, value: string) => {
    setSettingsForm(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  const saveSettings = () => {
    updateSettings(settingsForm);
    alert('Settings saved successfully!');
  };

  const kpis = [
    { 
      label: 'Total Revenue', 
      value: `₱${stats.revenue.toLocaleString()}`, 
      trend: '+12.5%', 
      trendUp: true,
      icon: TrendingUp, 
      color: 'text-primary', 
      bg: 'bg-red-50' 
    },
    { 
      label: 'Total Orders', 
      value: stats.totalOrders.toString(), 
      trend: '+4.2%', 
      trendUp: true,
      icon: ShoppingBag, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50' 
    },
    { 
      label: 'Customers', 
      value: stats.totalCustomers.toString(), 
      trend: '-2.1%', 
      trendUp: false, 
      icon: Users, 
      color: 'text-emerald-600', 
      bg: 'bg-emerald-50' 
    },
    { 
      label: 'Low Stock', 
      value: stats.lowStock.toString(), 
      trend: 'Urgent', 
      trendUp: false, 
      icon: AlertCircle, 
      color: 'text-orange-600', 
      bg: 'bg-orange-50' 
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'Settings':
        return (
          <div className="max-w-4xl mx-auto space-y-8 pb-20">
            {/* Hero Settings */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-900">Hero Section Configuration</h3>
                <p className="text-sm text-gray-500 mt-1">Customize the main banner on the homepage.</p>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Headline Prefix</label>
                    <input 
                      value={settingsForm.hero.titlePrefix}
                      onChange={(e) => handleSettingsChange('hero', 'titlePrefix', e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Highlighted Text (Red)</label>
                    <input 
                      value={settingsForm.hero.titleHighlight}
                      onChange={(e) => handleSettingsChange('hero', 'titleHighlight', e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-primary font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Headline Suffix</label>
                    <input 
                      value={settingsForm.hero.titleSuffix}
                      onChange={(e) => handleSettingsChange('hero', 'titleSuffix', e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Subtitle</label>
                    <textarea 
                      rows={3}
                      value={settingsForm.hero.subtitle}
                      onChange={(e) => handleSettingsChange('hero', 'subtitle', e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Hero Image URL</label>
                    <input 
                      value={settingsForm.hero.heroImage}
                      onChange={(e) => handleSettingsChange('hero', 'heroImage', e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-xl outline-none"
                      placeholder="https://example.com/image.png"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Primary Button</label>
                      <input 
                        value={settingsForm.hero.btnPrimary}
                        onChange={(e) => handleSettingsChange('hero', 'btnPrimary', e.target.value)}
                        className="w-full p-3 border border-gray-200 rounded-xl outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Secondary Button</label>
                      <input 
                        value={settingsForm.hero.btnSecondary}
                        onChange={(e) => handleSettingsChange('hero', 'btnSecondary', e.target.value)}
                        className="w-full p-3 border border-gray-200 rounded-xl outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Other Sections */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-900">Page Sections</h3>
              </div>
              <div className="p-6 space-y-8">
                {/* Features */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Features Title</label>
                      <input 
                        value={settingsForm.features.title}
                        onChange={(e) => handleSettingsChange('features', 'title', e.target.value)}
                        className="w-full p-3 border border-gray-200 rounded-xl outline-none"
                      />
                   </div>
                   <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Features Subtitle</label>
                      <input 
                        value={settingsForm.features.subtitle}
                        onChange={(e) => handleSettingsChange('features', 'subtitle', e.target.value)}
                        className="w-full p-3 border border-gray-200 rounded-xl outline-none"
                      />
                   </div>
                </div>

                <div className="w-full h-px bg-gray-100"></div>

                {/* Testimonials */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Testimonials Title</label>
                      <input 
                        value={settingsForm.testimonials.title}
                        onChange={(e) => handleSettingsChange('testimonials', 'title', e.target.value)}
                        className="w-full p-3 border border-gray-200 rounded-xl outline-none"
                      />
                   </div>
                   <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Testimonials Subtitle</label>
                      <input 
                        value={settingsForm.testimonials.subtitle}
                        onChange={(e) => handleSettingsChange('testimonials', 'subtitle', e.target.value)}
                        className="w-full p-3 border border-gray-200 rounded-xl outline-none"
                      />
                   </div>
                </div>

                <div className="w-full h-px bg-gray-100"></div>

                {/* CTA */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Call to Action Title</label>
                      <input 
                        value={settingsForm.cta.title}
                        onChange={(e) => handleSettingsChange('cta', 'title', e.target.value)}
                        className="w-full p-3 border border-gray-200 rounded-xl outline-none"
                      />
                   </div>
                   <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">CTA Subtitle</label>
                      <input 
                        value={settingsForm.cta.subtitle}
                        onChange={(e) => handleSettingsChange('cta', 'subtitle', e.target.value)}
                        className="w-full p-3 border border-gray-200 rounded-xl outline-none"
                      />
                   </div>
                   <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">CTA Button</label>
                      <input 
                        value={settingsForm.cta.btnText}
                        onChange={(e) => handleSettingsChange('cta', 'btnText', e.target.value)}
                        className="w-full p-3 border border-gray-200 rounded-xl outline-none"
                      />
                   </div>
                </div>
              </div>
            </div>

            {/* Save Action */}
            <div className="fixed bottom-6 right-6 z-40">
               <Button onClick={saveSettings} className="shadow-2xl shadow-red-900/40 py-4 px-8 text-lg flex items-center gap-3">
                 <Save size={20} /> Save Changes
               </Button>
            </div>
          </div>
        );

      case 'Products':
        return (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">Product Management</h3>
              <Button onClick={handleNewProduct} className="py-2 text-sm gap-2">
                <Plus size={16} /> Add Product
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Product</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Category</th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase">Price</th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map(product => (
                    <tr key={product.id} className="hover:bg-gray-50/50">
                      <td className="px-6 py-4 flex items-center gap-3">
                        <img src={product.image} alt="" className="w-10 h-10 rounded-lg object-cover bg-gray-100" />
                        <span className="font-medium text-gray-900">{product.name}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{product.category}</td>
                      <td className="px-6 py-4 text-sm font-bold text-right">₱{product.price.toLocaleString()}</td>
                      <td className="px-6 py-4 flex justify-center gap-2">
                        <button onClick={() => handleEditProduct(product)} className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg"><Edit2 size={16} /></button>
                        <button onClick={() => deleteProduct(product.id)} className="p-2 hover:bg-red-50 text-red-600 rounded-lg"><Trash2 size={16} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Modal */}
            {isProductModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 animate-fade-in-up max-h-[90vh] overflow-y-auto">
                  <h2 className="text-xl font-bold mb-4">{editingProduct ? 'Edit Product' : 'New Product'}</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Name</label>
                      <input 
                        value={newProductForm.name || ''} 
                        onChange={e => setNewProductForm({...newProductForm, name: e.target.value})}
                        className="w-full p-2 border rounded-lg" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Price</label>
                      <input 
                        type="number"
                        value={newProductForm.price || ''} 
                        onChange={e => setNewProductForm({...newProductForm, price: Number(e.target.value)})}
                        className="w-full p-2 border rounded-lg" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Category</label>
                      <select 
                        value={newProductForm.category || 'Modems'}
                        onChange={e => setNewProductForm({...newProductForm, category: e.target.value})}
                        className="w-full p-2 border rounded-lg"
                      >
                        <option>Modems</option>
                        <option>Pocket WiFi</option>
                        <option>SIM Cards</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Image URL</label>
                      <input 
                        value={newProductForm.image || ''} 
                        onChange={e => setNewProductForm({...newProductForm, image: e.target.value})}
                        className="w-full p-2 border rounded-lg" 
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <Button variant="outline" onClick={() => setIsProductModalOpen(false)} fullWidth>Cancel</Button>
                    <Button onClick={saveProduct} fullWidth>Save</Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 'Orders':
        return (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">Order Management</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Order ID</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Customer</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase">Total</th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map(order => (
                    <tr key={order.id} className="hover:bg-gray-50/50">
                      <td className="px-6 py-4 text-sm font-medium">{order.id}</td>
                      <td className="px-6 py-4 text-sm">{order.customer}</td>
                      <td className="px-6 py-4">
                        <select 
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                          className="text-xs border-none bg-transparent font-bold cursor-pointer focus:ring-0"
                          style={{ color: order.status === 'Delivered' ? 'green' : 'orange' }}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-right">₱{order.total.toLocaleString()}</td>
                      <td className="px-6 py-4 flex justify-center">
                         <button onClick={() => deleteOrder(order.id)} className="p-2 hover:bg-red-50 text-red-600 rounded-lg"><Trash2 size={16} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'Customers':
        return (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">Customer List</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Email</th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {customers.map((customer, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/50">
                      <td className="px-6 py-4 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-primary font-bold text-xs">
                          {customer.name.charAt(0)}
                        </div>
                        <span className="font-medium text-gray-900">{customer.name}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{customer.email}</td>
                      <td className="px-6 py-4 flex justify-center">
                        <button onClick={() => deleteCustomer(customer.email)} className="p-2 hover:bg-red-50 text-red-600 rounded-lg"><Trash2 size={16} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      default: // Dashboard
        return (
          <>
            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
              {kpis.map((kpi, idx) => (
                <div key={idx} className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${kpi.bg} group-hover:scale-110 transition-transform duration-300`}>
                      <kpi.icon className={kpi.color} size={24} />
                    </div>
                    <span className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg ${kpi.trendUp ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50'}`}>
                      {kpi.trend}
                      {kpi.trendUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                    </span>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm font-medium mb-1">{kpi.label}</p>
                    <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">{kpi.value}</h3>
                  </div>
                </div>
              ))}
            </div>

            {/* Charts Section */}
            <div className="grid lg:grid-cols-3 gap-6 sm:gap-8 mb-8">
              <div className="lg:col-span-2 bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Revenue Analytics</h3>
                <div className="h-[250px] sm:h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={SALES_DATA}>
                      <defs>
                        <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#C8102E" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#C8102E" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} />
                      <Tooltip />
                      <Area type="monotone" dataKey="sales" stroke="#C8102E" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Daily Orders</h3>
                <div className="h-[250px] sm:h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={SALES_DATA}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 11}} dy={10} />
                      <Tooltip cursor={{fill: '#F8FAFC'}} />
                      <Bar dataKey="sales" radius={[6, 6, 0, 0]} barSize={24} fill="#C8102E" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </>
        );
    }
  };

  const handleMenuClick = (label: string) => {
    setActiveTab(label);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-gray-900 relative overflow-x-hidden">
      
      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-20 xl:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        w-72 bg-white border-r border-gray-100 fixed inset-y-0 left-0 z-30 flex flex-col transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
        xl:translate-x-0 xl:shadow-none
      `}>
        <div className="p-6 sm:p-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-red-600/20 text-white font-black">
              D
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">DITO Admin</span>
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="xl:hidden p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 px-6 py-4 space-y-2 overflow-y-auto">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-4">Main Menu</div>
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleMenuClick(item.label)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                activeTab === item.label 
                  ? 'bg-red-50 text-primary shadow-sm' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon size={20} className={activeTab === item.label ? 'text-primary' : 'text-gray-400 group-hover:text-gray-600'} />
              {item.label}
            </button>
          ))}
        </div>

        <div className="p-6 border-t border-gray-50">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors">
            <img src="https://ui-avatars.com/api/?name=Admin+User&background=C8102E&color=fff" alt="Admin" className="w-10 h-10 rounded-full" />
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold text-gray-900 truncate">Admin User</p>
              <p className="text-xs text-gray-500 truncate">admin@dito.ph</p>
            </div>
            <LogOut size={16} className="text-gray-400" />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 xl:ml-72 p-4 sm:p-8 overflow-y-auto w-full">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-500 hover:bg-gray-50 xl:hidden shadow-sm active:scale-95 transition-transform"
            >
              <Menu size={20} />
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{activeTab} Overview</h1>
              <p className="text-gray-500 text-xs sm:text-sm mt-0.5">Manage your store efficiently.</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
             <Link to="/" className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm whitespace-nowrap text-sm font-medium flex-shrink-0">
                View Site
            </Link>
          </div>
        </header>

        {renderContent()}
      </main>
    </div>
  );
};

export default AdminDashboard;