
import React, { useState, useContext, useEffect } from 'react';
import { 
  LayoutDashboard, Package, ShoppingBag, Users, Settings, 
  TrendingUp, AlertCircle, Search, Bell, Cloud,
  MoreHorizontal, ArrowUpRight, ArrowDownRight, Filter, LogOut, Menu, X, Plus, Trash2, Edit2, Save, Loader2, Briefcase, Ban, CheckCircle, RotateCcw
} from 'lucide-react';
import { SALES_DATA } from '../constants';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, BarChart, Bar, Cell 
} from 'recharts';
import { Badge, Button } from '../components/UI';
import { Link } from 'react-router-dom';
import { StoreContext } from '../contexts/StoreContext';
import { Product, Order, Affiliate } from '../types';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const { 
    products, orders, customers, affiliates, stats, settings,
    addProduct, updateProduct, deleteProduct,
    updateOrderStatus, deleteOrder,
    deleteCustomer, updateSettings, isSyncing, isLoading,
    updateAffiliate
  } = useContext(StoreContext);

  // Local state for Forms/Modals
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProductForm, setNewProductForm] = useState<Partial<Product>>({});

  // Affiliate Modals
  const [isAffiliateModalOpen, setIsAffiliateModalOpen] = useState(false);
  const [editingAffiliate, setEditingAffiliate] = useState<Affiliate | null>(null);
  const [walletAdjustment, setWalletAdjustment] = useState(0);

  // Local state for Settings Form
  const [settingsForm, setSettingsForm] = useState(settings);

  useEffect(() => {
    setSettingsForm(settings);
  }, [settings]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-primary mb-4" size={48} />
        <h2 className="text-xl font-bold text-gray-900">Loading Dashboard...</h2>
        <p className="text-gray-500">Fetching data from Google Sheets</p>
      </div>
    );
  }

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard' },
    { icon: Package, label: 'Products' },
    { icon: ShoppingBag, label: 'Orders' },
    { icon: Briefcase, label: 'Affiliates' },
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
      features: [],
      commissionType: 'percentage',
      commissionValue: 5
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

  // Affiliate Helpers
  const handleEditAffiliate = (aff: Affiliate) => {
    setEditingAffiliate(aff);
    setWalletAdjustment(0);
    setIsAffiliateModalOpen(true);
  };

  const saveAffiliate = () => {
    if (editingAffiliate) {
      const updatedData = { ...editingAffiliate };
      
      // Handle Wallet Adjustment
      if (walletAdjustment !== 0) {
        updatedData.walletBalance = (updatedData.walletBalance || 0) + walletAdjustment;
        // Note: We don't automatically increase lifetime earnings on manual adjustments unless specified, keeping it simple here.
      }

      updateAffiliate(editingAffiliate.id, updatedData);
      setIsAffiliateModalOpen(false);
    }
  };

  const toggleAffiliateStatus = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'banned' : 'active';
    updateAffiliate(id, { status: newStatus as 'active' | 'banned' });
  };

  const getAffiliateMetrics = (affId: string) => {
    const affOrders = orders.filter(o => o.referralId === affId);
    const successOrders = affOrders.filter(o => o.status === 'Delivered').length;
    const pendingComm = affOrders
      .filter(o => o.status !== 'Delivered')
      .reduce((acc, o) => acc + (o.commission || (o.total * 0.05)), 0);
    
    return { successOrders, pendingComm };
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
                      className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      placeholder="https://example.com/image.png"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Primary Button</label>
                      <input 
                        value={settingsForm.hero.btnPrimary}
                        onChange={(e) => handleSettingsChange('hero', 'btnPrimary', e.target.value)}
                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Secondary Button</label>
                      <input 
                        value={settingsForm.hero.btnSecondary}
                        onChange={(e) => handleSettingsChange('hero', 'btnSecondary', e.target.value)}
                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Features Settings */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-900">Features Section</h3>
              </div>
              <div className="p-6 grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Section Title</label>
                  <input 
                    value={settingsForm.features.title}
                    onChange={(e) => handleSettingsChange('features', 'title', e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Section Subtitle</label>
                  <input 
                    value={settingsForm.features.subtitle}
                    onChange={(e) => handleSettingsChange('features', 'subtitle', e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-xl outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Testimonials Settings */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-900">Testimonials Section</h3>
              </div>
              <div className="p-6 grid md:grid-cols-2 gap-6">
                 <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Section Title</label>
                  <input 
                    value={settingsForm.testimonials.title}
                    onChange={(e) => handleSettingsChange('testimonials', 'title', e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Section Subtitle</label>
                  <input 
                    value={settingsForm.testimonials.subtitle}
                    onChange={(e) => handleSettingsChange('testimonials', 'subtitle', e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-xl outline-none"
                  />
                </div>
              </div>
            </div>

            {/* CTA Settings */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-900">Call to Action</h3>
              </div>
              <div className="p-6 space-y-4">
                 <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Main Title</label>
                  <input 
                    value={settingsForm.cta.title}
                    onChange={(e) => handleSettingsChange('cta', 'title', e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Subtitle</label>
                  <input 
                    value={settingsForm.cta.subtitle}
                    onChange={(e) => handleSettingsChange('cta', 'subtitle', e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Button Text</label>
                  <input 
                    value={settingsForm.cta.btnText}
                    onChange={(e) => handleSettingsChange('cta', 'btnText', e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-xl outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="fixed bottom-6 right-6 z-30">
              <Button 
                onClick={saveSettings} 
                className="shadow-2xl py-4 px-8 text-lg flex items-center gap-2"
                disabled={isSyncing}
              >
                {isSyncing ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                {isSyncing ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        );

      case 'Products':
        return (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <div>
                 <h2 className="text-lg font-bold text-gray-900">Product Catalog</h2>
                 <p className="text-sm text-gray-500">Manage your inventory.</p>
              </div>
              <Button onClick={handleNewProduct} className="text-sm py-2"><Plus size={16} /> Add Product</Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 font-medium">
                  <tr>
                    <th className="p-4">Product</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Affiliate Com.</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map(p => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="p-4 flex items-center gap-3">
                        <img src={p.image} alt="" className="w-10 h-10 rounded-lg bg-gray-100 object-contain" />
                        <span className="font-bold text-gray-900">{p.name}</span>
                      </td>
                      <td className="p-4 text-gray-500">{p.category}</td>
                      <td className="p-4 font-medium">₱{p.price.toLocaleString()}</td>
                      <td className="p-4 text-gray-500">
                        <Badge color="blue">
                          {p.commissionType === 'fixed' 
                            ? `₱${p.commissionValue}` 
                            : `${p.commissionValue || 5}%`
                          }
                        </Badge>
                      </td>
                      <td className="p-4 flex justify-end gap-2">
                        <button onClick={() => handleEditProduct(p)} className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg"><Edit2 size={16}/></button>
                        <button onClick={() => deleteProduct(p.id)} className="p-2 hover:bg-red-50 text-red-600 rounded-lg"><Trash2 size={16}/></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'Orders':
        return (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100">
               <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 font-medium">
                  <tr>
                    <th className="p-4">Order ID</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Total</th>
                    <th className="p-4">Commission</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map(order => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="p-4 font-medium text-gray-900">{order.id}</td>
                      <td className="p-4 text-gray-600">{order.customer}</td>
                      <td className="p-4 text-gray-500">{order.date}</td>
                      <td className="p-4">
                        <Badge color={order.status === 'Delivered' ? 'green' : order.status === 'Pending' ? 'yellow' : 'blue'}>
                          {order.status}
                        </Badge>
                      </td>
                      <td className="p-4 font-bold">₱{order.total.toLocaleString()}</td>
                      <td className="p-4 text-gray-500">
                        {order.commission ? `₱${order.commission.toLocaleString()}` : '-'}
                      </td>
                      <td className="p-4 flex justify-end gap-2">
                        {order.status !== 'Delivered' && (
                          <button onClick={() => updateOrderStatus(order.id, 'Delivered')} className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded hover:bg-green-100">Mark Delivered</button>
                        )}
                        <button onClick={() => deleteOrder(order.id)} className="p-2 hover:bg-red-50 text-red-600 rounded-lg"><Trash2 size={16}/></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'Affiliates':
        return (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Affiliate Management</h2>
              <p className="text-sm text-gray-500">Manage partners and commissions.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 font-medium">
                  <tr>
                    <th className="p-4">Affiliate</th>
                    <th className="p-4">Stats (Clicks/Orders)</th>
                    <th className="p-4">Wallet / Pending</th>
                    <th className="p-4">Total Earned</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {affiliates.map(aff => {
                    const metrics = getAffiliateMetrics(aff.id);
                    return (
                      <tr key={aff.id} className="hover:bg-gray-50">
                        <td className="p-4">
                           <div>
                              <p className="font-bold text-gray-900">{aff.name}</p>
                              <p className="text-xs text-gray-500">{aff.email}</p>
                              <p className="text-[10px] text-gray-400 font-mono mt-1">ID: {aff.id}</p>
                           </div>
                        </td>
                        <td className="p-4">
                           <div className="flex items-center gap-4">
                              <div className="text-center">
                                 <p className="font-bold">{aff.clicks || 0}</p>
                                 <p className="text-[10px] text-gray-400 uppercase">Clicks</p>
                              </div>
                              <div className="h-8 w-px bg-gray-200"></div>
                              <div className="text-center">
                                 <p className="font-bold text-green-600">{metrics.successOrders}</p>
                                 <p className="text-[10px] text-gray-400 uppercase">Orders</p>
                              </div>
                           </div>
                        </td>
                        <td className="p-4">
                           <div>
                              <p className="font-bold text-gray-900">₱{aff.walletBalance.toLocaleString()}</p>
                              {metrics.pendingComm > 0 && (
                                <p className="text-xs text-orange-500 font-medium flex items-center gap-1">
                                  <RotateCcw size={10} /> +₱{metrics.pendingComm.toLocaleString()} pending
                                </p>
                              )}
                           </div>
                        </td>
                        <td className="p-4 font-medium text-gray-600">
                           ₱{aff.lifetimeEarnings?.toLocaleString() || aff.walletBalance.toLocaleString()}
                        </td>
                        <td className="p-4">
                           <Badge color={aff.status === 'active' ? 'green' : aff.status === 'banned' ? 'red' : 'gray'}>
                              {aff.status || 'active'}
                           </Badge>
                        </td>
                        <td className="p-4 flex justify-end gap-2">
                           <button onClick={() => handleEditAffiliate(aff)} className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg" title="Edit & Adjust Wallet">
                             <Edit2 size={16} />
                           </button>
                           <button 
                             onClick={() => toggleAffiliateStatus(aff.id, aff.status || 'active')} 
                             className={`p-2 rounded-lg ${aff.status === 'banned' ? 'hover:bg-green-50 text-green-600' : 'hover:bg-red-50 text-red-600'}`}
                             title={aff.status === 'banned' ? "Activate" : "Ban"}
                           >
                             {aff.status === 'banned' ? <CheckCircle size={16} /> : <Ban size={16} />}
                           </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        );
        
      case 'Customers':
        return (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100">
               <h2 className="text-lg font-bold text-gray-900">Registered Customers</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 font-medium">
                  <tr>
                    <th className="p-4">Name</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Phone</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {customers.map(c => (
                    <tr key={c.email} className="hover:bg-gray-50">
                      <td className="p-4 font-bold text-gray-900 flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                            <img src={`https://ui-avatars.com/api/?name=${c.name}&background=random`} alt="" />
                         </div>
                         {c.name}
                      </td>
                      <td className="p-4 text-gray-500">{c.email}</td>
                      <td className="p-4 text-gray-500">{c.phone}</td>
                      <td className="p-4 flex justify-end">
                        <button onClick={() => deleteCustomer(c.email)} className="p-2 hover:bg-red-50 text-red-600 rounded-lg"><Trash2 size={16}/></button>
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
          <div className="space-y-6">
            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {kpis.map((kpi, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start justify-between hover:shadow-md transition-all">
                  <div>
                    <p className="text-gray-500 text-sm font-medium mb-1">{kpi.label}</p>
                    <h3 className="text-2xl font-black text-gray-900">{kpi.value}</h3>
                    <div className={`flex items-center gap-1 mt-2 text-xs font-bold ${kpi.trendUp ? 'text-green-600' : 'text-red-500'}`}>
                      {kpi.trendUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                      {kpi.trend}
                    </div>
                  </div>
                  <div className={`p-3 rounded-xl ${kpi.bg}`}>
                    <kpi.icon className={kpi.color} size={24} />
                  </div>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-gray-900">Sales Overview</h3>
                  <select className="bg-gray-50 border-none text-sm rounded-lg px-3 py-1 text-gray-500">
                    <option>Last 7 Days</option>
                    <option>Last Month</option>
                  </select>
                </div>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={SALES_DATA}>
                      <defs>
                        <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#C8102E" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#C8102E" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                      <Tooltip 
                        contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} 
                      />
                      <Area type="monotone" dataKey="sales" stroke="#C8102E" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                 <h3 className="font-bold text-gray-900 mb-6">Top Products</h3>
                 <div className="space-y-6">
                    {products.slice(0,3).map((p, i) => (
                      <div key={p.id} className="flex items-center gap-4">
                        <span className="text-gray-400 font-bold text-sm w-4">{i+1}</span>
                        <img src={p.image} alt="" className="w-10 h-10 bg-gray-50 rounded-lg object-contain" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-gray-900 truncate">{p.name}</p>
                          <p className="text-xs text-gray-500">{p.category}</p>
                        </div>
                        <span className="text-sm font-bold">₱{p.price.toLocaleString()}</span>
                      </div>
                    ))}
                 </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-white border-r flex-col fixed h-full z-10">
        <div className="p-6 border-b">
           <Link to="/" className="flex items-center gap-2 text-primary font-black text-xl tracking-tighter">
             <div className="bg-primary text-white p-1 rounded-lg">
               <Cloud size={16} strokeWidth={3} />
             </div>
             DITO Admin
           </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map(item => (
            <button
              key={item.label}
              onClick={() => setActiveTab(item.label)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                activeTab === item.label 
                  ? 'bg-primary text-white shadow-lg shadow-red-500/20' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t">
           <Link to="/" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-red-50 hover:text-primary rounded-xl transition-colors text-sm font-medium">
             <LogOut size={18} /> Exit to Store
           </Link>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 w-full bg-white z-20 border-b px-4 py-3 flex justify-between items-center">
        <span className="font-bold text-gray-900">Admin Dashboard</span>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2">
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-white z-10 pt-20 px-4 space-y-2">
           {menuItems.map(item => (
            <button
              key={item.label}
              onClick={() => { setActiveTab(item.label); setIsMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-4 rounded-xl text-lg font-medium ${
                activeTab === item.label ? 'bg-primary text-white' : 'text-gray-600'
              }`}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 pt-20 md:pt-8">
        <div className="flex justify-between items-center mb-8">
           <div>
             <h1 className="text-2xl font-bold text-gray-900">{activeTab}</h1>
             <p className="text-sm text-gray-500">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
           </div>
           <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-gray-200">
                 {isSyncing ? (
                    <>
                      <Loader2 className="animate-spin text-primary" size={16} />
                      <span className="text-xs font-medium text-gray-500">Syncing...</span>
                    </>
                 ) : (
                    <>
                      <Cloud size={16} className="text-green-500" />
                      <span className="text-xs font-medium text-gray-500">Saved</span>
                    </>
                 )}
              </div>
              <button className="p-2 bg-white border rounded-full text-gray-500 relative">
                 <Bell size={20} />
                 <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-primary rounded-full border-2 border-white"></span>
              </button>
              <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden border-2 border-white shadow-sm">
                 <img src="https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff" alt="Admin" />
              </div>
           </div>
        </div>

        {renderContent()}

        {/* Product Modal */}
        {isProductModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
             <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
                <h3 className="text-xl font-bold mb-4">{editingProduct ? 'Edit Product' : 'New Product'}</h3>
                <div className="space-y-4">
                   <div>
                     <label className="text-xs font-bold text-gray-500 uppercase">Name</label>
                     <input 
                       className="w-full border rounded-lg p-2 mt-1" 
                       value={newProductForm.name || ''} 
                       onChange={e => setNewProductForm({...newProductForm, name: e.target.value})}
                     />
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                     <div>
                       <label className="text-xs font-bold text-gray-500 uppercase">Price (₱)</label>
                       <input 
                         type="number"
                         className="w-full border rounded-lg p-2 mt-1" 
                         value={newProductForm.price || 0} 
                         onChange={e => setNewProductForm({...newProductForm, price: Number(e.target.value)})}
                       />
                     </div>
                     <div>
                       <label className="text-xs font-bold text-gray-500 uppercase">Category</label>
                       <select 
                         className="w-full border rounded-lg p-2 mt-1 bg-white" 
                         value={newProductForm.category || 'Modems'} 
                         onChange={e => setNewProductForm({...newProductForm, category: e.target.value})}
                       >
                         <option>Modems</option>
                         <option>Pocket WiFi</option>
                         <option>SIM Cards</option>
                       </select>
                     </div>
                   </div>
                   <div>
                     <label className="text-xs font-bold text-gray-500 uppercase">Image URL</label>
                     <input 
                       className="w-full border rounded-lg p-2 mt-1" 
                       value={newProductForm.image || ''} 
                       onChange={e => setNewProductForm({...newProductForm, image: e.target.value})}
                     />
                   </div>
                   
                   {/* Commission Settings */}
                   <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                     <h4 className="font-bold text-blue-900 mb-3 text-sm flex items-center gap-2">
                        <Users size={16} /> Affiliate Commission
                     </h4>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-bold text-blue-700 uppercase">Type</label>
                          <select 
                             className="w-full border border-blue-200 rounded-lg p-2 mt-1 bg-white text-sm"
                             value={newProductForm.commissionType || 'percentage'}
                             onChange={e => setNewProductForm({...newProductForm, commissionType: e.target.value as 'fixed' | 'percentage'})}
                          >
                             <option value="percentage">Percentage (%)</option>
                             <option value="fixed">Fixed Amount (₱)</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-xs font-bold text-blue-700 uppercase">Value</label>
                          <input 
                             type="number"
                             className="w-full border border-blue-200 rounded-lg p-2 mt-1 text-sm"
                             value={newProductForm.commissionValue ?? 5}
                             onChange={e => setNewProductForm({...newProductForm, commissionValue: Number(e.target.value)})}
                          />
                        </div>
                     </div>
                     <p className="text-xs text-blue-600 mt-2">
                       {newProductForm.commissionType === 'fixed' 
                         ? `Affiliates earn ₱${newProductForm.commissionValue} per sale.` 
                         : `Affiliates earn ${newProductForm.commissionValue}% of the sale price.`
                       }
                     </p>
                   </div>

                </div>
                <div className="flex justify-end gap-2 mt-6">
                   <Button variant="ghost" onClick={() => setIsProductModalOpen(false)}>Cancel</Button>
                   <Button onClick={saveProduct}>Save Product</Button>
                </div>
             </div>
          </div>
        )}

        {/* Affiliate Edit Modal */}
        {isAffiliateModalOpen && editingAffiliate && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
             <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
                <h3 className="text-xl font-bold mb-4">Edit Affiliate</h3>
                <div className="space-y-4">
                   <div>
                     <label className="text-xs font-bold text-gray-500 uppercase">Full Name</label>
                     <input 
                       className="w-full border rounded-lg p-2 mt-1" 
                       value={editingAffiliate.name} 
                       onChange={e => setEditingAffiliate({...editingAffiliate, name: e.target.value})}
                     />
                   </div>
                   <div>
                     <label className="text-xs font-bold text-gray-500 uppercase">Email</label>
                     <input 
                       className="w-full border rounded-lg p-2 mt-1" 
                       value={editingAffiliate.email} 
                       onChange={e => setEditingAffiliate({...editingAffiliate, email: e.target.value})}
                     />
                   </div>
                   
                   <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <h4 className="font-bold text-gray-900 text-sm mb-3">Manual Wallet Adjustment</h4>
                      <p className="text-xs text-gray-500 mb-2">Add or subtract funds manually (e.g., for payouts or corrections).</p>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-500">₱</span>
                        <input 
                           type="number"
                           className="w-full border rounded-lg p-2"
                           placeholder="0"
                           value={walletAdjustment}
                           onChange={e => setWalletAdjustment(Number(e.target.value))}
                        />
                      </div>
                      <p className="text-xs mt-2">
                        Current Balance: <span className="font-bold">₱{editingAffiliate.walletBalance.toLocaleString()}</span>
                        {walletAdjustment !== 0 && (
                          <span className="text-primary ml-2">
                             → ₱{(editingAffiliate.walletBalance + walletAdjustment).toLocaleString()}
                          </span>
                        )}
                      </p>
                   </div>
                </div>
                <div className="flex justify-end gap-2 mt-6">
                   <Button variant="ghost" onClick={() => setIsAffiliateModalOpen(false)}>Cancel</Button>
                   <Button onClick={saveAffiliate}>Save Changes</Button>
                </div>
             </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
