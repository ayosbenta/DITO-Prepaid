
import React, { useState, useContext, useEffect } from 'react';
import { 
  LayoutDashboard, Package, ShoppingBag, Users, Settings, 
  TrendingUp, AlertCircle, Search, Bell, Cloud,
  MoreHorizontal, ArrowUpRight, ArrowDownRight, Filter, LogOut, Menu, X, Plus, Trash2, Edit2, Save, Loader2, Briefcase, Ban, CheckCircle, RotateCcw, CreditCard, ExternalLink, Image as ImageIcon, DollarSign, XCircle, RefreshCw,
  Clock, MousePointer, Lock, Shield, Printer, Boxes, AlertTriangle, Percent, FileSpreadsheet, List, AlignLeft, Box, Coins,
  ChevronDown, Check, Truck, Smartphone, Landmark, Map, MapPin, Mail, User as UserIcon, FileText, MessageSquare, Eye
} from 'lucide-react';
import { SALES_DATA } from '../constants';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, BarChart, Bar, Cell 
} from 'recharts';
import { Badge, Button } from '../components/UI';
import { Link } from 'react-router-dom';
import { StoreContext } from '../contexts/StoreContext';
import { Product, Order, Affiliate, ShippingZone, Courier, EmailTemplate, LandingPageSettings, PaymentSettings } from '../types';

const AdminDashboard: React.FC = () => {
  // --- Authentication State ---
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('dito_admin_auth') === 'true';
  });
  const [authForm, setAuthForm] = useState({ username: '', password: '' });
  const [authError, setAuthError] = useState('');

  // --- Dashboard State ---
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const { 
    products, orders, customers, affiliates, stats, settings, paymentSettings, smtpSettings, payouts,
    addProduct, updateProduct, deleteProduct,
    updateOrderStatus, deleteOrder,
    deleteCustomer, updateSettings, updatePaymentSettings, updateSMTPSettings, isSyncing, isLoading, isRefreshing, refreshData,
    updateAffiliate, updatePayoutStatus, forceInventorySync
  } = useContext(StoreContext);

  // --- Product Modal State ---
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProductForm, setNewProductForm] = useState<Partial<Product>>({});
  const [activeProductTab, setActiveProductTab] = useState<'general' | 'inventory' | 'images' | 'advanced'>('general');
  
  // Inputs
  const [specInput, setSpecInput] = useState({ key: '', value: '' });
  const [inclusionInput, setInclusionInput] = useState('');
  const [galleryInput, setGalleryInput] = useState('');
  const [bulkDiscountInput, setBulkDiscountInput] = useState({ minQty: 0, percentage: 0 });

  // --- Order Modal State ---
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);

  // --- Affiliate Modal State ---
  const [isAffiliateModalOpen, setIsAffiliateModalOpen] = useState(false);
  const [editingAffiliate, setEditingAffiliate] = useState<Affiliate | null>(null);
  const [walletAdjustment, setWalletAdjustment] = useState(0);
  const [activeAffiliateTab, setActiveAffiliateTab] = useState<'wallet' | 'profile'>('wallet');

  // --- Settings Forms ---
  const [settingsForm, setSettingsForm] = useState(settings);
  const [paymentSettingsForm, setPaymentSettingsForm] = useState(paymentSettings);
  const [smtpSettingsForm, setSmtpSettingsForm] = useState(smtpSettings);

  // --- Sub-Tabs ---
  const [activeSMTPTab, setActiveSMTPTab] = useState<'server' | 'templates'>('server');
  const [activeShippingTab, setActiveShippingTab] = useState<'general' | 'couriers' | 'zones'>('general');
  const [newCourierName, setNewCourierName] = useState('');
  const [newCourierUrl, setNewCourierUrl] = useState('');

  // Sync Forms with Context
  useEffect(() => { setSettingsForm(settings); }, [settings]);
  useEffect(() => { setPaymentSettingsForm(paymentSettings); }, [paymentSettings]);
  useEffect(() => { setSmtpSettingsForm(smtpSettings); }, [smtpSettings]);

  // --- Auth Handlers ---
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (authForm.username === 'admin' && authForm.password === 'M@y191992') {
      setIsAuthenticated(true);
      localStorage.setItem('dito_admin_auth', 'true');
      setAuthError('');
    } else {
      setAuthError('Invalid username or password');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('dito_admin_auth');
    setAuthForm({ username: '', password: '' });
    setActiveTab('Dashboard');
  };

  // --- Product Logic ---
  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setNewProductForm(JSON.parse(JSON.stringify(product))); // Deep copy
    setActiveProductTab('general');
    setIsProductModalOpen(true);
  };

  const handleNewProduct = () => {
    setEditingProduct(null);
    setNewProductForm({
      id: `prod-${Date.now()}`,
      name: '', description: '', price: 0, costPrice: 0,
      category: 'Modems', image: '', gallery: [],
      specs: {}, features: [], inclusions: [],
      stock: 0, minStockLevel: 5, sku: '',
      commissionType: 'percentage', commissionValue: 5,
      bulkDiscounts: []
    });
    setActiveProductTab('general');
    setIsProductModalOpen(true);
  };

  const saveProduct = () => {
    if (editingProduct) {
      updateProduct(editingProduct.id, { ...editingProduct, ...newProductForm } as Product);
    } else {
      addProduct({
        ...newProductForm,
        id: newProductForm.id || `prod-${Date.now()}`,
        rating: 5,
        reviews: 0
      } as Product);
    }
    setIsProductModalOpen(false);
  };

  // Product Array Manipulators
  const addSpec = () => {
    if (specInput.key && specInput.value) {
      setNewProductForm(p => ({ ...p, specs: { ...p.specs, [specInput.key]: specInput.value } }));
      setSpecInput({ key: '', value: '' });
    }
  };
  const removeSpec = (k: string) => {
    const s = { ...newProductForm.specs }; delete s[k];
    setNewProductForm(p => ({ ...p, specs: s }));
  };
  const addInclusion = () => {
    if (inclusionInput) {
       setNewProductForm(p => ({ ...p, inclusions: [...(p.inclusions || []), inclusionInput] }));
       setInclusionInput('');
    }
  };
  const removeInclusion = (i: number) => {
    setNewProductForm(p => ({ ...p, inclusions: p.inclusions?.filter((_, idx) => idx !== i) }));
  };
  const addGalleryImage = () => {
    if (galleryInput) {
      setNewProductForm(p => ({ ...p, gallery: [...(p.gallery || []), galleryInput] }));
      setGalleryInput('');
    }
  };
  const removeGalleryImage = (i: number) => {
    setNewProductForm(p => ({ ...p, gallery: p.gallery?.filter((_, idx) => idx !== i) }));
  };
  const addBulkDiscount = () => {
    if (bulkDiscountInput.minQty > 0 && bulkDiscountInput.percentage > 0) {
      setNewProductForm(p => ({ ...p, bulkDiscounts: [...(p.bulkDiscounts || []), bulkDiscountInput] }));
      setBulkDiscountInput({ minQty: 0, percentage: 0 });
    }
  };
  const removeBulkDiscount = (i: number) => {
    setNewProductForm(p => ({ ...p, bulkDiscounts: p.bulkDiscounts?.filter((_, idx) => idx !== i) }));
  };

  // --- Affiliate Logic ---
  const handleEditAffiliate = (aff: Affiliate) => {
    setEditingAffiliate(aff);
    setWalletAdjustment(0);
    setActiveAffiliateTab('wallet');
    setIsAffiliateModalOpen(true);
  };
  const saveAffiliate = () => { 
    if (editingAffiliate) {
        const updated = { ...editingAffiliate };
        if (walletAdjustment !== 0) updated.walletBalance += walletAdjustment;
        updateAffiliate(editingAffiliate.id, updated);
        setIsAffiliateModalOpen(false); 
    }
  };
  const toggleAffiliateStatus = (id: string, status: string) => {
      updateAffiliate(id, { status: status === 'active' ? 'banned' : 'active' } as any);
  };

  // --- Settings Logic ---
  const handleSettingsChange = (section: any, key: any, value: any) => {
      setSettingsForm(prev => ({ ...prev, [section]: { ...prev[section as keyof LandingPageSettings], [key]: value } }));
  };
  const handlePaymentSettingsChange = (method: any, key: any, value: any) => {
      setPaymentSettingsForm(prev => ({ ...prev, [method]: { ...prev[method as keyof PaymentSettings], [key]: value } }));
  };
  const handleSmtpSettingsChange = (key: string, value: any) => {
    setSmtpSettingsForm(prev => ({ ...prev, [key]: value }));
  };
  const handleTemplateChange = (templateKey: string, field: keyof EmailTemplate, value: any) => {
     setSmtpSettingsForm(prev => ({
        ...prev,
        templates: { ...prev.templates, [templateKey]: { ...prev.templates[templateKey], [field]: value } }
     }));
  };
  
  const saveSettings = () => updateSettings(settingsForm);
  const savePaymentSettings = () => updatePaymentSettings(paymentSettingsForm);
  const saveSmtpSettings = () => updateSMTPSettings(smtpSettingsForm);

  // --- Shipping Logic ---
  const handleShippingChange = (key: any, value: any) => {
      setSettingsForm(prev => ({ ...prev, shipping: { ...prev.shipping, [key]: value } }));
  };
  const handleUpdateZone = (idx: number, field: any, value: any) => {
      const z = [...settingsForm.shipping.zones];
      z[idx] = { ...z[idx], [field]: value };
      setSettingsForm(prev => ({ ...prev, shipping: { ...prev.shipping, zones: z } }));
  };
  const handleAddCourier = () => { 
    if(newCourierName && newCourierUrl) {
      const newC: Courier = { id: `cour-${Date.now()}`, name: newCourierName, trackingUrl: newCourierUrl, status: 'active' };
      setSettingsForm(prev => ({ ...prev, shipping: { ...prev.shipping, couriers: [...prev.shipping.couriers, newC] } }));
      setNewCourierName(''); setNewCourierUrl('');
    }
  };
  const handleDeleteCourier = (id: string) => {
      setSettingsForm(prev => ({ ...prev, shipping: { ...prev.shipping, couriers: prev.shipping.couriers.filter(c => c.id !== id) } }));
  };

  // --- Quick Inventory Logic ---
  const handleStockChange = (id: string, change: number) => {
    const p = products.find(x => x.id === id);
    if (p) updateProduct(id, { ...p, stock: Math.max(0, (p.stock || 0) + change) });
  };

  const handlePrintWaybill = (order: Order) => {
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    if (printWindow) {
      const html = `
        <html>
          <head>
            <title>Waybill - ${order.id}</title>
            <style>
              body { font-family: 'Courier New', Courier, monospace; padding: 20px; border: 2px solid #000; max-width: 800px; margin: 0 auto; }
              .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
              .row { display: flex; border-bottom: 1px solid #000; padding-bottom: 10px; margin-bottom: 10px; }
              .col { flex: 1; padding: 0 10px; }
              .label { font-weight: bold; font-size: 10px; text-transform: uppercase; color: #555; margin-bottom: 4px; }
              .value { font-size: 14px; font-weight: bold; }
              .barcode-area { text-align: center; padding: 20px; border: 2px solid #000; margin: 20px 0; }
              .footer { font-size: 10px; text-align: center; margin-top: 20px; }
              @media print {
                body { border: none; }
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>DITO HOME FULFILLMENT</h1>
              <p>WAYBILL / PACKING LIST</p>
            </div>
            <div class="row">
              <div class="col" style="border-right: 1px solid #000;">
                <div class="label">Sender</div>
                <div class="value">DITO Home Store<br>Manila Fulfillment Center<br>Philippines</div>
              </div>
              <div class="col">
                <div class="label">Order ID</div>
                <div class="value" style="font-size: 18px;">${order.id}</div>
                <div class="label" style="margin-top: 10px;">Date</div>
                <div class="value">${order.date}</div>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <div class="label">Ship To</div>
                <div class="value">
                  ${order.customer}<br>
                  ${order.shippingDetails?.mobile || ''}<br>
                  ${order.shippingDetails?.street || ''}<br>
                  ${order.shippingDetails?.barangay || ''}, ${order.shippingDetails?.city || ''}<br>
                  ${order.shippingDetails?.province || ''} ${order.shippingDetails?.zipCode || ''}
                </div>
              </div>
            </div>
            <div class="barcode-area">
              <div class="label">Tracking Number</div>
              <div style="font-size: 24px; font-weight: bold; letter-spacing: 2px;">${order.trackingNumber || 'PENDING'}</div>
              <div style="margin-top: 10px; font-size: 12px;">${order.id}</div>
            </div>
            <div class="row" style="border: none;">
              <div class="col">
                <div class="label">Payment Method</div>
                <div class="value">${order.paymentMethod}</div>
              </div>
              <div class="col" style="text-align: right;">
                <div class="label">Amount to Collect</div>
                <div class="value" style="font-size: 20px;">${order.paymentMethod === 'COD' ? 'P' + order.total.toLocaleString() : 'PAID'}</div>
              </div>
            </div>
            <div class="row" style="border-top: 1px solid #000; padding-top: 10px;">
               <div class="col">
                  <div class="label">Items</div>
                  ${order.orderItems?.map(item => `
                    <div style="display: flex; justify-content: space-between; font-size: 12px;">
                      <span>${item.quantity}x ${item.name}</span>
                    </div>
                  `).join('') || ''}
               </div>
            </div>
            <script>window.print();</script>
          </body>
        </html>
      `;
      printWindow.document.write(html);
      printWindow.document.close();
    }
  };

  const pendingPayoutsCount = payouts.filter(p => p.status === 'Pending').length;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-gray-100 animate-fade-in-up">
           <div className="text-center mb-8">
             <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-primary shadow-inner">
               <Shield size={32} />
             </div>
             <h1 className="text-2xl font-bold text-gray-900">Admin Portal</h1>
             <p className="text-gray-500 mt-2">Enter your credentials to access.</p>
           </div>

           <form onSubmit={handleLogin} className="space-y-4">
              {authError && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl text-center flex items-center justify-center gap-2 animate-pulse">
                  <AlertCircle size={16} /> {authError}
                </div>
              )}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Username</label>
                <input 
                  type="text"
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  value={authForm.username}
                  onChange={e => setAuthForm({...authForm, username: e.target.value})}
                  placeholder="Enter username"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Password</label>
                <input 
                  type="password"
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  value={authForm.password}
                  onChange={e => setAuthForm({...authForm, password: e.target.value})}
                  placeholder="••••••••"
                />
              </div>
              <Button fullWidth className="py-4 shadow-lg shadow-red-900/20 text-lg mt-4">
                 <Lock size={18} className="mr-2"/> Secure Login
              </Button>
              <Link to="/" className="block text-center text-sm text-gray-400 hover:text-gray-600 mt-6">
                ← Back to Store
              </Link>
           </form>
        </div>
      </div>
    );
  }

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
    { icon: Boxes, label: 'Inventory' },
    { icon: ShoppingBag, label: 'Orders' },
    { icon: Truck, label: 'Shipping' },
    { icon: CreditCard, label: 'Payment Gateway' },
    { icon: Mail, label: 'SMTP Email' },
    { icon: Briefcase, label: 'Affiliates' },
    { icon: DollarSign, label: 'Payouts' },
    { icon: Users, label: 'Customers' },
    { icon: Settings, label: 'Settings' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'SMTP Email':
        const templateKeys = [
           { key: 'newOrder', label: 'New Order Confirmation', desc: 'Sent to customer when they place an order.', vars: '{order_id}, {customer_name}, {total}' },
           { key: 'orderShipped', label: 'Order Shipped', desc: 'Sent when status changes to Shipped.', vars: '{order_id}, {customer_name}, {courier}, {tracking_number}' },
           { key: 'orderDelivered', label: 'Order Delivered', desc: 'Sent when status changes to Delivered.', vars: '{order_id}, {customer_name}' },
           { key: 'affiliateSale', label: 'Affiliate Sale Notification', desc: 'Sent to affiliate when they earn a commission.', vars: '{order_id}, {commission}' },
           { key: 'affiliatePayout', label: 'Payout Processed', desc: 'Sent to affiliate when payout is approved.', vars: '{amount}' },
        ];

        return (
          <div className="max-w-4xl mx-auto space-y-8 pb-20">
             <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                   <div>
                      <h2 className="text-lg font-bold text-gray-900">SMTP Email Setup</h2>
                      <p className="text-gray-500 text-sm">Configure settings for sending system emails.</p>
                   </div>
                   <Button onClick={saveSmtpSettings} disabled={isSyncing} className="flex items-center gap-2">
                      <Save size={16} /> {isSyncing ? 'Saving...' : 'Save Configuration'}
                   </Button>
                </div>

                {/* Tabs */}
                <div className="bg-gray-50 px-6 py-2 border-b border-gray-100 flex gap-2">
                   <button onClick={() => setActiveSMTPTab('server')} className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors ${activeSMTPTab === 'server' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}>
                      <Settings size={16} /> Server Configuration
                   </button>
                   <button onClick={() => setActiveSMTPTab('templates')} className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors ${activeSMTPTab === 'templates' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}>
                      <MessageSquare size={16} /> Dynamic Messages
                   </button>
                </div>
                
                <div className="p-6 space-y-8">
                   {activeSMTPTab === 'server' && (
                     <div className="space-y-6 animate-fade-in">
                        <div className="p-4 border rounded-xl bg-blue-50 border-blue-100">
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="font-bold text-blue-900 flex items-center gap-2"><Mail size={18}/> SMTP Host Details</h3>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" checked={smtpSettingsForm.enabled} onChange={e => handleSmtpSettingsChange('enabled', e.target.checked)} />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-blue-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                              </label>
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                              <div><label className="text-xs font-bold text-blue-800 uppercase">SMTP Host</label><input className="w-full border border-blue-200 rounded-lg p-2 mt-1" value={smtpSettingsForm.host} onChange={e => handleSmtpSettingsChange('host', e.target.value)} placeholder="smtp.gmail.com" /></div>
                              <div><label className="text-xs font-bold text-blue-800 uppercase">SMTP Port</label><input type="number" className="w-full border border-blue-200 rounded-lg p-2 mt-1" value={smtpSettingsForm.port} onChange={e => handleSmtpSettingsChange('port', Number(e.target.value))} placeholder="587" /></div>
                              <div><label className="text-xs font-bold text-blue-800 uppercase">Username</label><input className="w-full border border-blue-200 rounded-lg p-2 mt-1" value={smtpSettingsForm.username} onChange={e => handleSmtpSettingsChange('username', e.target.value)} /></div>
                              <div><label className="text-xs font-bold text-blue-800 uppercase">Password</label><input type="password" className="w-full border border-blue-200 rounded-lg p-2 mt-1" value={smtpSettingsForm.password} onChange={e => handleSmtpSettingsChange('password', e.target.value)} /></div>
                              <div className="md:col-span-2"><label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={smtpSettingsForm.secure} onChange={e => handleSmtpSettingsChange('secure', e.target.checked)} className="w-4 h-4" /><span className="text-sm font-medium text-blue-900">Use Secure Connection (SSL/TLS)</span></label></div>
                            </div>
                        </div>
                        <div className="p-4 border rounded-xl bg-gray-50">
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><UserIcon size={18}/> Sender Information</h3>
                            <div className="grid md:grid-cols-2 gap-6">
                              <div><label className="text-xs font-bold text-gray-500 uppercase">From Email</label><input className="w-full border rounded-lg p-2 mt-1" value={smtpSettingsForm.fromEmail} onChange={e => handleSmtpSettingsChange('fromEmail', e.target.value)} /></div>
                              <div><label className="text-xs font-bold text-gray-500 uppercase">From Name</label><input className="w-full border rounded-lg p-2 mt-1" value={smtpSettingsForm.fromName} onChange={e => handleSmtpSettingsChange('fromName', e.target.value)} /></div>
                            </div>
                        </div>
                     </div>
                   )}

                   {activeSMTPTab === 'templates' && (
                     <div className="space-y-6 animate-fade-in">
                        {templateKeys.map((t) => (
                           <div key={t.key} className="border border-gray-200 rounded-xl bg-white overflow-hidden">
                              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                                 <div><h4 className="font-bold text-gray-800 text-sm">{t.label}</h4><p className="text-xs text-gray-500">{t.desc}</p></div>
                                 <label className="relative inline-flex items-center cursor-pointer">
                                   <input type="checkbox" className="sr-only peer" checked={smtpSettingsForm.templates[t.key]?.enabled ?? true} onChange={e => handleTemplateChange(t.key, 'enabled', e.target.checked)} />
                                   <div className="w-9 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-primary peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                                 </label>
                              </div>
                              {(!smtpSettingsForm.templates[t.key] || smtpSettingsForm.templates[t.key].enabled) && (
                                 <div className="p-4 space-y-3">
                                    <div><label className="text-xs font-bold text-gray-400 uppercase">Subject Line</label><input className="w-full border rounded-lg p-2 mt-1 text-sm" value={smtpSettingsForm.templates[t.key]?.subject || ''} onChange={e => handleTemplateChange(t.key, 'subject', e.target.value)} /></div>
                                    <div><label className="text-xs font-bold text-gray-400 uppercase">Email Body</label><textarea className="w-full border rounded-lg p-2 mt-1 text-sm h-24" value={smtpSettingsForm.templates[t.key]?.body || ''} onChange={e => handleTemplateChange(t.key, 'body', e.target.value)} /></div>
                                    <div className="bg-blue-50 p-2 rounded text-[10px] text-blue-600 flex gap-1"><span className="font-bold">Variables:</span> {t.vars}</div>
                                 </div>
                              )}
                           </div>
                        ))}
                     </div>
                   )}
                </div>
             </div>
          </div>
        );

      case 'Dashboard': 
        const pendingPayoutTotal = payouts.filter(p => p.status === 'Pending').reduce((acc, p) => acc + p.amount, 0);
        
        return (
          <div className="space-y-6">
             {/* KPI Cards */}
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Revenue */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-full relative overflow-hidden">
                   <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-gray-500 text-sm font-medium">Total Revenue</h3>
                        <p className="text-3xl font-bold text-gray-900 mt-2 tracking-tight">₱{stats.revenue.toLocaleString()}</p>
                      </div>
                      <div className="p-3 bg-red-50 text-primary rounded-2xl">
                        <TrendingUp size={24} />
                      </div>
                   </div>
                   <div className="mt-4 flex items-center gap-2 text-green-600 text-sm font-bold">
                     <ArrowUpRight size={16} /> +12.5%
                   </div>
                </div>

                {/* Net Profit */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-full">
                   <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-gray-500 text-sm font-medium">Net Profit</h3>
                        <p className="text-3xl font-bold text-gray-900 mt-2 tracking-tight">₱{stats.netProfit.toLocaleString()}</p>
                      </div>
                      <div className="p-3 bg-green-50 text-green-600 rounded-2xl">
                        <Coins size={24} />
                      </div>
                   </div>
                   <div className="mt-4 flex items-center gap-2 text-green-600 text-sm font-bold">
                      <ArrowUpRight size={16} /> Calculated
                   </div>
                </div>

                {/* Total Orders */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-full">
                   <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-gray-500 text-sm font-medium">Total Orders</h3>
                        <p className="text-3xl font-bold text-gray-900 mt-2 tracking-tight">{stats.totalOrders}</p>
                      </div>
                      <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                         <ShoppingBag size={24} />
                      </div>
                   </div>
                   <div className="mt-4 flex items-center gap-2 text-green-600 text-sm font-bold">
                     <ArrowUpRight size={16} /> +4.2%
                   </div>
                </div>

                {/* Customers */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-full">
                   <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-gray-500 text-sm font-medium">Customers</h3>
                        <p className="text-3xl font-bold text-gray-900 mt-2 tracking-tight">{stats.totalCustomers}</p>
                      </div>
                      <div className="p-3 bg-green-50 text-green-600 rounded-2xl">
                         <Users size={24} />
                      </div>
                   </div>
                   <div className="mt-4 flex items-center gap-2 text-red-500 text-sm font-bold">
                      <ArrowDownRight size={16} /> -2.1%
                   </div>
                </div>
                
                {/* Low Stock */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-full">
                   <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-gray-500 text-sm font-medium">Low Stock Items</h3>
                        <p className="text-3xl font-bold text-gray-900 mt-2 tracking-tight">{stats.lowStock}</p>
                      </div>
                      <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl">
                         <AlertCircle size={24} />
                      </div>
                   </div>
                   <div className="mt-4 flex items-center gap-2 text-red-500 text-sm font-bold">
                      <ArrowDownRight size={16} /> Needs Action
                   </div>
                </div>

                {/* Pending Payout */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-full">
                   <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-gray-500 text-sm font-medium">Pending Payout</h3>
                        <p className="text-3xl font-bold text-gray-900 mt-2 tracking-tight">₱{pendingPayoutTotal.toLocaleString()}</p>
                      </div>
                      <div className="p-3 bg-yellow-50 text-yellow-600 rounded-2xl">
                         <Clock size={24} />
                      </div>
                   </div>
                   <div className="mt-4 flex items-center gap-2 text-gray-400 text-sm font-medium">
                      Waiting approval
                   </div>
                </div>
             </div>

             {/* Charts */}
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                   <h3 className="font-bold text-gray-900 mb-6">Sales Analytics</h3>
                   <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                         <AreaChart data={SALES_DATA}>
                            <defs>
                               <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#C8102E" stopOpacity={0.1}/>
                                  <stop offset="95%" stopColor="#C8102E" stopOpacity={0}/>
                               </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
                            <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
                            <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                            <Area type="monotone" dataKey="sales" stroke="#C8102E" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                         </AreaChart>
                      </ResponsiveContainer>
                   </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                   <h3 className="font-bold text-gray-900 mb-6">Top Products</h3>
                   <div className="space-y-4">
                      {products.slice(0, 4).map((p, i) => (
                         <div key={p.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors">
                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                               <img src={p.image} alt="" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1">
                               <p className="text-sm font-bold text-gray-900 line-clamp-1">{p.name}</p>
                               <p className="text-xs text-gray-500">₱{p.price.toLocaleString()}</p>
                            </div>
                            <div className="font-bold text-gray-900">#{i+1}</div>
                         </div>
                      ))}
                   </div>
                </div>
             </div>
          </div>
      );

      case 'Products': return (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
             <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h2 className="font-bold text-gray-900">Product Catalog</h2>
                <Button onClick={handleNewProduct} className="py-2 text-sm"><Plus size={16}/> Add Product</Button>
             </div>
             <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                   <thead className="bg-gray-50 text-gray-500 font-medium">
                      <tr>
                         <th className="p-4">Product</th>
                         <th className="p-4">Category</th>
                         <th className="p-4">Price</th>
                         <th className="p-4">Inventory</th>
                         <th className="p-4 text-right">Actions</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-100">
                      {products.map(product => (
                         <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                            <td className="p-4">
                               <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden border border-gray-200">
                                     <img src={product.image} alt="" className="w-full h-full object-cover" />
                                  </div>
                                  <div>
                                     <div className="font-bold text-gray-900">{product.name}</div>
                                     <div className="text-xs text-gray-400">SKU: {product.sku || 'N/A'}</div>
                                  </div>
                                </div>
                            </td>
                            <td className="p-4"><Badge color="blue">{product.category}</Badge></td>
                            <td className="p-4 font-bold">₱{product.price.toLocaleString()}</td>
                            <td className="p-4">
                               <span className={`font-bold ${product.stock === 0 ? 'text-red-500' : (product.stock || 0) < 10 ? 'text-orange-500' : 'text-green-500'}`}>
                                  {product.stock} units
                               </span>
                            </td>
                            <td className="p-4 text-right">
                               <div className="flex justify-end gap-2">
                                  <button onClick={() => handleEditProduct(product)} className="p-2 hover:bg-gray-200 rounded-full text-gray-600"><Edit2 size={16}/></button>
                                  <button onClick={() => deleteProduct(product.id)} className="p-2 hover:bg-red-100 rounded-full text-red-500"><Trash2 size={16}/></button>
                               </div>
                            </td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>
      );

      case 'Inventory': return (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
             <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h2 className="font-bold text-gray-900">Inventory Management</h2>
                <Button onClick={forceInventorySync} disabled={isSyncing} variant="outline" className="py-2 text-sm flex items-center gap-2">
                  <RefreshCw size={16} className={isSyncing ? 'animate-spin' : ''}/> Sync Sheet
                </Button>
             </div>
             <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                   <thead className="bg-gray-50 text-gray-500 font-medium">
                      <tr>
                         <th className="p-4">SKU</th>
                         <th className="p-4">Product Name</th>
                         <th className="p-4 text-center">Current Stock</th>
                         <th className="p-4 text-center">Status</th>
                         <th className="p-4 text-center">Quick Adjust</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-100">
                      {products.map(p => (
                         <tr key={p.id} className="hover:bg-gray-50">
                            <td className="p-4 font-mono text-gray-500">{p.sku || 'N/A'}</td>
                            <td className="p-4 font-bold text-gray-900">{p.name}</td>
                            <td className="p-4 text-center font-bold text-lg">{p.stock || 0}</td>
                            <td className="p-4 text-center">
                               {(p.stock || 0) === 0 ? <Badge color="red">Out of Stock</Badge> : (p.stock || 0) <= (p.minStockLevel || 10) ? <Badge color="yellow">Low Stock</Badge> : <Badge color="green">In Stock</Badge>}
                            </td>
                            <td className="p-4">
                               <div className="flex items-center justify-center gap-2">
                                  <button onClick={() => handleStockChange(p.id, -1)} className="w-8 h-8 rounded-lg border hover:bg-red-50 hover:text-red-600 flex items-center justify-center transition-colors">-</button>
                                  <button onClick={() => handleStockChange(p.id, 1)} className="w-8 h-8 rounded-lg border hover:bg-green-50 hover:text-green-600 flex items-center justify-center transition-colors">+</button>
                               </div>
                            </td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>
      );

      case 'Orders': return (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
             <div className="p-6 border-b border-gray-100">
                <h2 className="font-bold text-gray-900">Order Management</h2>
             </div>
             <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                   <thead className="bg-gray-50 text-gray-500 font-medium">
                      <tr>
                         <th className="p-4">Order ID</th>
                         <th className="p-4">Customer</th>
                         <th className="p-4">Date</th>
                         <th className="p-4">Total</th>
                         <th className="p-4">Payment</th>
                         <th className="p-4">Status</th>
                         <th className="p-4 text-right">Actions</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-100">
                      {orders.map(order => (
                         <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                            <td className="p-4 font-mono text-xs font-bold">{order.id}</td>
                            <td className="p-4">
                               <div className="font-bold text-gray-900">{order.customer}</div>
                               <div className="text-xs text-gray-400">{order.shippingDetails?.city || 'N/A'}</div>
                            </td>
                            <td className="p-4 text-gray-500">{order.date}</td>
                            <td className="p-4 font-bold">₱{order.total.toLocaleString()}</td>
                            <td className="p-4 text-xs">{order.paymentMethod}</td>
                            <td className="p-4">
                               <select 
                                 value={order.status}
                                 onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                                 className={`text-xs font-bold px-2 py-1 rounded-full border-none outline-none cursor-pointer ${
                                    order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                                    order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                                    order.status === 'Processing' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-gray-100 text-gray-700'
                                 }`}
                               >
                                  <option value="Pending">Pending</option>
                                  <option value="Processing">Processing</option>
                                  <option value="Shipped">Shipped</option>
                                  <option value="Delivered">Delivered</option>
                               </select>
                            </td>
                            <td className="p-4 text-right">
                               <div className="flex justify-end gap-2">
                                  <button onClick={() => setViewingOrder(order)} className="p-2 hover:bg-blue-50 text-blue-600 rounded-full" title="View Details">
                                     <Eye size={16} />
                                  </button>
                                  <button onClick={() => handlePrintWaybill(order)} className="p-2 hover:bg-gray-100 text-gray-600 rounded-full" title="Print Waybill">
                                     <Printer size={16} />
                                  </button>
                                  <button onClick={() => deleteOrder(order.id)} className="p-2 hover:bg-red-50 text-red-500 rounded-full">
                                     <Trash2 size={16} />
                                  </button>
                               </div>
                            </td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>
      );

      case 'Affiliates': 
         const totalAffiliates = affiliates.length;
         const totalAffiliateSales = affiliates.reduce((acc, curr) => acc + curr.totalSales, 0);
         const totalPendingComm = orders
             .filter(o => o.referralId && o.status !== 'Delivered')
             .reduce((sum, o) => sum + (o.commission || (o.total * 0.05)), 0);
         const totalPayoutsPaid = payouts
             .filter(p => p.status === 'Approved')
             .reduce((sum, p) => sum + p.amount, 0);

         return (
          <div className="space-y-6">
             {/* Affiliate KPI Cards */}
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Card 1: Total Affiliates */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                      <div>
                          <p className="text-sm text-gray-500 font-medium">Total Affiliates</p>
                          <h3 className="text-2xl font-bold text-gray-900 mt-1">{totalAffiliates}</h3>
                      </div>
                      <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                          <Users size={24} />
                      </div>
                  </div>

                  {/* Card 2: Total Sales */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                      <div>
                          <p className="text-sm text-gray-500 font-medium">Total Sales</p>
                          <h3 className="text-2xl font-bold text-gray-900 mt-1">₱{totalAffiliateSales.toLocaleString()}</h3>
                      </div>
                      <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                          <ShoppingBag size={24} />
                      </div>
                  </div>

                  {/* Card 3: Total Pending Commission */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                      <div>
                          <p className="text-sm text-gray-500 font-medium">Total Pending Comm.</p>
                          <h3 className="text-2xl font-bold text-orange-600 mt-1">₱{totalPendingComm.toLocaleString()}</h3>
                      </div>
                      <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
                          <Clock size={24} />
                      </div>
                  </div>

                  {/* Card 4: Total Payouts */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                      <div>
                          <p className="text-sm text-gray-500 font-medium">Total Payouts</p>
                          <h3 className="text-2xl font-bold text-purple-600 mt-1">₱{totalPayoutsPaid.toLocaleString()}</h3>
                      </div>
                      <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                          <DollarSign size={24} />
                      </div>
                  </div>
             </div>

             {/* Affiliate Table */}
             <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
             <div className="p-6 border-b border-gray-100">
                <h2 className="font-bold text-gray-900">Partner Management</h2>
             </div>
             <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                   <thead className="bg-gray-50 text-gray-500 font-medium">
                      <tr>
                         <th className="p-4">Partner</th>
                         <th className="p-4">Pending Comm. <span className="text-xs bg-red-100 text-red-600 px-1 rounded ml-1">New</span></th>
                         <th className="p-4">Wallet</th>
                         <th className="p-4">Total Sales</th>
                         <th className="p-4">Status</th>
                         <th className="p-4 text-right">Actions</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-100">
                      {affiliates.map(aff => {
                         const pendingComm = orders
                            .filter(o => o.referralId === aff.id && o.status !== 'Delivered')
                            .reduce((sum, o) => sum + (o.commission || (o.total * 0.05)), 0);

                         return (
                         <tr key={aff.id} className="hover:bg-gray-50">
                            <td className="p-4">
                               <div className="font-bold text-gray-900">{aff.name}</div>
                               <div className="text-xs text-gray-400">{aff.email}</div>
                            </td>
                            <td className="p-4 font-bold text-orange-500">₱{pendingComm.toLocaleString()}</td>
                            <td className="p-4 font-bold text-primary">₱{aff.walletBalance.toLocaleString()}</td>
                            <td className="p-4">₱{aff.totalSales.toLocaleString()}</td>
                            <td className="p-4">
                               <button onClick={() => toggleAffiliateStatus(aff.id, aff.status || 'active')} className={`text-xs font-bold px-2 py-1 rounded-full capitalize ${aff.status === 'banned' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                  {aff.status || 'active'}
                               </button>
                            </td>
                            <td className="p-4 text-right">
                               <div className="flex justify-end gap-2">
                                  <button onClick={() => {
                                      setEditingAffiliate(aff);
                                      setActiveAffiliateTab('profile');
                                      setIsAffiliateModalOpen(true);
                                  }} className="p-2 hover:bg-blue-50 rounded-full text-blue-600" title="View Details">
                                      <Eye size={16}/>
                                  </button>
                                  <button onClick={() => handleEditAffiliate(aff)} className="p-2 hover:bg-gray-100 rounded-full text-gray-600" title="Edit Wallet">
                                      <Edit2 size={16}/>
                                  </button>
                               </div>
                            </td>
                         </tr>
                         );
                      })}
                   </tbody>
                </table>
             </div>
          </div>
          </div>
      );

      case 'Payouts': return (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                 <h2 className="font-bold text-gray-900">Payout Requests</h2>
              </div>
              <div className="overflow-x-auto">
                 <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 font-medium">
                       <tr>
                          <th className="p-4">Request ID</th>
                          <th className="p-4">Affiliate</th>
                          <th className="p-4">Amount</th>
                          <th className="p-4">Method</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 text-right">Action</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                       {payouts.map(p => (
                          <tr key={p.id} className="hover:bg-gray-50">
                             <td className="p-4 font-mono text-xs text-gray-500">{p.id}</td>
                             <td className="p-4 font-bold text-gray-900">{p.affiliateName}</td>
                             <td className="p-4 font-bold text-primary">₱{p.amount.toLocaleString()}</td>
                             <td className="p-4 text-xs">
                                <div className="font-bold">{p.method}</div>
                                <div className="text-gray-500">{p.accountNumber}</div>
                             </td>
                             <td className="p-4"><Badge color={p.status === 'Approved' ? 'green' : p.status === 'Rejected' ? 'red' : 'yellow'}>{p.status}</Badge></td>
                             <td className="p-4 text-right">
                                {p.status === 'Pending' && (
                                   <div className="flex justify-end gap-2">
                                      <button onClick={() => updatePayoutStatus(p.id, 'Approved')} className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100"><Check size={16}/></button>
                                      <button onClick={() => updatePayoutStatus(p.id, 'Rejected')} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"><X size={16}/></button>
                                   </div>
                                )}
                             </td>
                          </tr>
                       ))}
                       {payouts.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-gray-400">No payout requests found.</td></tr>}
                    </tbody>
                 </table>
              </div>
          </div>
      );

      case 'Customers': return (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
             <div className="p-6 border-b border-gray-100">
                <h2 className="font-bold text-gray-900">Customer Database</h2>
             </div>
             <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                   <thead className="bg-gray-50 text-gray-500 font-medium">
                      <tr>
                         <th className="p-4">Name</th>
                         <th className="p-4">Email</th>
                         <th className="p-4">Phone</th>
                         <th className="p-4 text-right">Action</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-100">
                      {customers.map((c, i) => (
                         <tr key={i} className="hover:bg-gray-50">
                            <td className="p-4 font-bold text-gray-900">{c.name}</td>
                            <td className="p-4 text-gray-600">{c.email}</td>
                            <td className="p-4 text-gray-600">{c.phone}</td>
                            <td className="p-4 text-right">
                               <button onClick={() => deleteCustomer(c.email)} className="text-red-500 hover:bg-red-50 p-2 rounded-full"><Trash2 size={16}/></button>
                            </td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>
      );

      case 'Settings': return (
          <div className="max-w-4xl mx-auto space-y-8 pb-20">
             <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                   <h2 className="text-lg font-bold text-gray-900">Landing Page Configuration</h2>
                   <Button onClick={saveSettings} disabled={isSyncing} className="flex items-center gap-2"><Save size={16} /> {isSyncing ? 'Saving...' : 'Save Changes'}</Button>
                </div>
                <div className="p-6 space-y-6">
                   <div className="p-4 border rounded-xl bg-gray-50">
                      <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><LayoutDashboard size={18}/> Hero Section</h3>
                      <div className="grid md:grid-cols-3 gap-4 mb-4">
                         <div><label className="text-xs font-bold text-gray-500 uppercase">Prefix</label><input className="w-full border rounded-lg p-2 mt-1" value={settingsForm.hero.titlePrefix} onChange={e => handleSettingsChange('hero', 'titlePrefix', e.target.value)} /></div>
                         <div><label className="text-xs font-bold text-gray-500 uppercase">Highlight</label><input className="w-full border rounded-lg p-2 mt-1 text-primary font-bold" value={settingsForm.hero.titleHighlight} onChange={e => handleSettingsChange('hero', 'titleHighlight', e.target.value)} /></div>
                         <div><label className="text-xs font-bold text-gray-500 uppercase">Suffix</label><input className="w-full border rounded-lg p-2 mt-1" value={settingsForm.hero.titleSuffix} onChange={e => handleSettingsChange('hero', 'titleSuffix', e.target.value)} /></div>
                      </div>
                      <div className="mb-4"><label className="text-xs font-bold text-gray-500 uppercase">Subtitle</label><textarea className="w-full border rounded-lg p-2 mt-1" rows={2} value={settingsForm.hero.subtitle} onChange={e => handleSettingsChange('hero', 'subtitle', e.target.value)} /></div>
                      <div><label className="text-xs font-bold text-gray-500 uppercase">Hero Image URL</label><input className="w-full border rounded-lg p-2 mt-1" value={settingsForm.hero.heroImage} onChange={e => handleSettingsChange('hero', 'heroImage', e.target.value)} /></div>
                   </div>
                   
                   <div className="p-4 border rounded-xl bg-gray-50">
                      <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><CheckCircle size={18}/> Features Section</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                         <div><label className="text-xs font-bold text-gray-500 uppercase">Section Title</label><input className="w-full border rounded-lg p-2 mt-1" value={settingsForm.features.title} onChange={e => handleSettingsChange('features', 'title', e.target.value)} /></div>
                         <div><label className="text-xs font-bold text-gray-500 uppercase">Subtitle</label><input className="w-full border rounded-lg p-2 mt-1" value={settingsForm.features.subtitle} onChange={e => handleSettingsChange('features', 'subtitle', e.target.value)} /></div>
                      </div>
                   </div>

                   <div className="p-4 border rounded-xl bg-gray-50">
                      <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><MessageSquare size={18}/> Testimonials Section</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                         <div><label className="text-xs font-bold text-gray-500 uppercase">Section Title</label><input className="w-full border rounded-lg p-2 mt-1" value={settingsForm.testimonials.title} onChange={e => handleSettingsChange('testimonials', 'title', e.target.value)} /></div>
                         <div><label className="text-xs font-bold text-gray-500 uppercase">Subtitle</label><input className="w-full border rounded-lg p-2 mt-1" value={settingsForm.testimonials.subtitle} onChange={e => handleSettingsChange('testimonials', 'subtitle', e.target.value)} /></div>
                      </div>
                   </div>

                   <div className="p-4 border rounded-xl bg-gray-50">
                      <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><MousePointer size={18}/> Call to Action (CTA)</h3>
                      <div className="grid md:grid-cols-3 gap-4">
                         <div><label className="text-xs font-bold text-gray-500 uppercase">Title</label><input className="w-full border rounded-lg p-2 mt-1" value={settingsForm.cta.title} onChange={e => handleSettingsChange('cta', 'title', e.target.value)} /></div>
                         <div><label className="text-xs font-bold text-gray-500 uppercase">Subtitle</label><input className="w-full border rounded-lg p-2 mt-1" value={settingsForm.cta.subtitle} onChange={e => handleSettingsChange('cta', 'subtitle', e.target.value)} /></div>
                         <div><label className="text-xs font-bold text-gray-500 uppercase">Button Text</label><input className="w-full border rounded-lg p-2 mt-1" value={settingsForm.cta.btnText} onChange={e => handleSettingsChange('cta', 'btnText', e.target.value)} /></div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
      );

      case 'Payment Gateway': return (
          <div className="max-w-4xl mx-auto space-y-8 pb-20">
             <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                   <h2 className="text-lg font-bold text-gray-900">Payment Configuration</h2>
                   <Button onClick={savePaymentSettings} disabled={isSyncing} className="flex items-center gap-2"><Save size={16} /> {isSyncing ? 'Saving...' : 'Save Settings'}</Button>
                </div>
                <div className="p-6 space-y-6">
                   {/* COD */}
                   <div className="flex items-center justify-between p-4 border rounded-xl bg-gray-50">
                      <div><h3 className="font-bold text-gray-900">Cash On Delivery (COD)</h3><p className="text-xs text-gray-500">Enable standard cash payment upon delivery.</p></div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" checked={paymentSettingsForm.cod.enabled} onChange={e => handlePaymentSettingsChange('cod', 'enabled', e.target.checked)} />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-primary peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                      </label>
                   </div>
                   {/* GCash */}
                   <div className="p-4 border rounded-xl bg-blue-50 border-blue-100">
                      <div className="flex items-center justify-between mb-4">
                         <h3 className="font-bold text-blue-900 flex items-center gap-2"><Smartphone size={18}/> GCash Payment</h3>
                         <label className="relative inline-flex items-center cursor-pointer">
                           <input type="checkbox" className="sr-only peer" checked={paymentSettingsForm.gcash.enabled} onChange={e => handlePaymentSettingsChange('gcash', 'enabled', e.target.checked)} />
                           <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-primary peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                         </label>
                      </div>
                      {paymentSettingsForm.gcash.enabled && (
                         <div className="grid md:grid-cols-2 gap-4 animate-fade-in">
                            <div><label className="text-xs font-bold text-blue-800 uppercase">Account Name</label><input className="w-full border border-blue-200 rounded-lg p-2 mt-1" value={paymentSettingsForm.gcash.accountName} onChange={e => handlePaymentSettingsChange('gcash', 'accountName', e.target.value)} /></div>
                            <div><label className="text-xs font-bold text-blue-800 uppercase">Account Number</label><input className="w-full border border-blue-200 rounded-lg p-2 mt-1" value={paymentSettingsForm.gcash.accountNumber} onChange={e => handlePaymentSettingsChange('gcash', 'accountNumber', e.target.value)} /></div>
                            <div className="md:col-span-2"><label className="text-xs font-bold text-blue-800 uppercase">QR Code Image URL</label><input className="w-full border border-blue-200 rounded-lg p-2 mt-1" value={paymentSettingsForm.gcash.qrImage} onChange={e => handlePaymentSettingsChange('gcash', 'qrImage', e.target.value)} /></div>
                         </div>
                      )}
                   </div>
                   {/* Bank */}
                   <div className="p-4 border rounded-xl bg-gray-50">
                      <div className="flex items-center justify-between mb-4">
                         <h3 className="font-bold text-gray-900 flex items-center gap-2"><Landmark size={18}/> Bank Transfer</h3>
                         <label className="relative inline-flex items-center cursor-pointer">
                           <input type="checkbox" className="sr-only peer" checked={paymentSettingsForm.bank.enabled} onChange={e => handlePaymentSettingsChange('bank', 'enabled', e.target.checked)} />
                           <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-primary peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                         </label>
                      </div>
                      {paymentSettingsForm.bank.enabled && (
                         <div className="grid md:grid-cols-3 gap-4 animate-fade-in">
                            <div><label className="text-xs font-bold text-gray-500 uppercase">Bank Name</label><input className="w-full border rounded-lg p-2 mt-1" value={paymentSettingsForm.bank.bankName} onChange={e => handlePaymentSettingsChange('bank', 'bankName', e.target.value)} /></div>
                            <div><label className="text-xs font-bold text-gray-500 uppercase">Account Name</label><input className="w-full border rounded-lg p-2 mt-1" value={paymentSettingsForm.bank.accountName} onChange={e => handlePaymentSettingsChange('bank', 'accountName', e.target.value)} /></div>
                            <div><label className="text-xs font-bold text-gray-500 uppercase">Account Number</label><input className="w-full border rounded-lg p-2 mt-1" value={paymentSettingsForm.bank.accountNumber} onChange={e => handlePaymentSettingsChange('bank', 'accountNumber', e.target.value)} /></div>
                         </div>
                      )}
                   </div>
                </div>
             </div>
          </div>
      );

      case 'Shipping': return (
          <div className="max-w-6xl mx-auto space-y-8 pb-20">
             <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                   <h2 className="text-lg font-bold text-gray-900">Shipping Fee Management</h2>
                   <Button onClick={saveSettings} disabled={isSyncing} className="flex items-center gap-2"><Save size={16} /> {isSyncing ? 'Saving...' : 'Save Changes'}</Button>
                </div>
                <div className="bg-gray-50 px-6 py-2 border-b border-gray-100 flex gap-2">
                   {['general', 'couriers', 'zones'].map((tab) => (
                     <button key={tab} onClick={() => setActiveShippingTab(tab as any)} className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-colors ${activeShippingTab === tab ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}>
                        {tab}
                     </button>
                   ))}
                </div>
                <div className="p-6">
                   {activeShippingTab === 'general' && (
                      <div className="grid md:grid-cols-3 gap-6">
                         <div className="p-4 border rounded-xl bg-gray-50">
                            <label className="text-xs font-bold text-gray-500 uppercase">Enable Shipping Module</label>
                            <div className="mt-2"><label className="relative inline-flex items-center cursor-pointer"><input type="checkbox" className="sr-only peer" checked={settingsForm.shipping.enabled} onChange={e => handleShippingChange('enabled', e.target.checked)} /><div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-primary peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div></label></div>
                         </div>
                         <div><label className="text-xs font-bold text-gray-500 uppercase">Default Base Fee (₱)</label><input type="number" className="w-full border rounded-lg p-2 mt-1" value={settingsForm.shipping.baseFee} onChange={e => handleShippingChange('baseFee', Number(e.target.value))} /></div>
                         <div><label className="text-xs font-bold text-gray-500 uppercase">Free Shipping Threshold (₱)</label><input type="number" className="w-full border rounded-lg p-2 mt-1" value={settingsForm.shipping.freeThreshold} onChange={e => handleShippingChange('freeThreshold', Number(e.target.value))} /><p className="text-[10px] text-gray-400 mt-1">Set to 0 to disable free shipping.</p></div>
                         <div><label className="text-xs font-bold text-gray-500 uppercase">Calculation Mode</label><select className="w-full border rounded-lg p-2 mt-1" value={settingsForm.shipping.calculationType} onChange={e => handleShippingChange('calculationType', e.target.value)}><option value="flat">Flat Rate (Base Fee Only)</option><option value="zone">Zone Based (Location Dependent)</option></select></div>
                      </div>
                   )}
                   {activeShippingTab === 'couriers' && (
                      <div className="space-y-6">
                         <div className="flex gap-4 items-end bg-gray-50 p-4 rounded-xl border border-gray-200">
                            <div className="flex-1"><label className="text-xs font-bold text-gray-500 uppercase">Courier Name</label><input className="w-full border rounded-lg p-2 mt-1" placeholder="Ex: J&T Express" value={newCourierName} onChange={e => setNewCourierName(e.target.value)} /></div>
                            <div className="flex-[2]"><label className="text-xs font-bold text-gray-500 uppercase">Tracking URL Pattern</label><input className="w-full border rounded-lg p-2 mt-1" placeholder="https://site.com?track={TRACKING}" value={newCourierUrl} onChange={e => setNewCourierUrl(e.target.value)} /></div>
                            <Button onClick={handleAddCourier} disabled={!newCourierName || !newCourierUrl} className="h-10">Add</Button>
                         </div>
                         <div className="space-y-2">{settingsForm.shipping.couriers.map(c => (<div key={c.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"><div><div className="font-bold text-gray-900">{c.name}</div><div className="text-xs text-gray-400 font-mono">{c.trackingUrl}</div></div><button onClick={() => handleDeleteCourier(c.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-full"><Trash2 size={16}/></button></div>))}</div>
                      </div>
                   )}
                   {activeShippingTab === 'zones' && (
                      <div className="space-y-4">
                         {settingsForm.shipping.zones.map((zone, idx) => (<div key={idx} className="flex gap-4 items-center p-4 border rounded-xl bg-gray-50"><div className="flex-1"><label className="text-xs font-bold text-gray-400 uppercase">Zone Name</label><input className="w-full border rounded-lg p-2 mt-1" value={zone.name} onChange={e => handleUpdateZone(idx, 'name', e.target.value)} /></div><div className="w-32"><label className="text-xs font-bold text-gray-400 uppercase">Fee (₱)</label><input type="number" className="w-full border rounded-lg p-2 mt-1" value={zone.fee} onChange={e => handleUpdateZone(idx, 'fee', Number(e.target.value))} /></div><div className="w-40"><label className="text-xs font-bold text-gray-400 uppercase">Est. Days</label><input className="w-full border rounded-lg p-2 mt-1" value={zone.days} onChange={e => handleUpdateZone(idx, 'days', e.target.value)} /></div></div>))}
                         <p className="text-xs text-gray-400 text-center pt-2">Note: Zone names (e.g. "Metro Manila", "Luzon") are matched against customer addresses.</p>
                      </div>
                   )}
                </div>
             </div>
          </div>
      );

      default: return <div className="p-10 text-center text-gray-500">Module {activeTab} loaded.</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 bg-white border-r flex-col fixed h-full z-10">
        <div className="p-6 border-b">
           <Link to="/" className="flex items-center gap-2 text-primary font-black text-xl tracking-tighter">
             <div className="bg-primary text-white p-1 rounded-lg"><Cloud size={16} strokeWidth={3} /></div> DITO Admin
           </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map(item => (
            <button key={item.label} onClick={() => setActiveTab(item.label)} className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === item.label ? 'bg-primary text-white shadow-lg shadow-red-500/20' : 'text-gray-600 hover:bg-gray-50'}`}>
              <div className="flex items-center gap-3"><item.icon size={18} />{item.label}</div>
              {item.label === 'Payouts' && pendingPayoutsCount > 0 && (<span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-sm ring-1 ring-white/20">{pendingPayoutsCount}</span>)}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t space-y-1">
           <Link to="/" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors text-sm font-medium"><LogOut size={18} /> Exit to Store</Link>
           <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors text-sm font-medium"><Lock size={18} /> Logout</button>
        </div>
      </aside>
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 w-full bg-white z-20 border-b px-4 py-3 flex justify-between items-center">
        <span className="font-bold text-gray-900">Admin Dashboard</span>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2">{isMobileMenuOpen ? <X /> : <Menu />}</button>
      </div>
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-white z-10 pt-20 px-4 space-y-2 overflow-y-auto">
           {menuItems.map(item => (
            <button key={item.label} onClick={() => { setActiveTab(item.label); setIsMobileMenuOpen(false); }} className={`w-full flex items-center justify-between px-4 py-4 rounded-xl text-lg font-medium ${activeTab === item.label ? 'bg-primary text-white' : 'text-gray-600'}`}>
              <div className="flex items-center gap-3"><item.icon size={20} />{item.label}</div>
            </button>
          ))}
        </div>
      )}
      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 pt-20 md:pt-8">
        <div className="flex justify-between items-center mb-8">
           <div><h1 className="text-2xl font-bold text-gray-900">{activeTab}</h1><p className="text-sm text-gray-500">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p></div>
           <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-gray-200">
                 {isSyncing ? <><Loader2 className="animate-spin text-primary" size={16} /><span className="text-xs font-medium text-gray-500">Syncing...</span></> : <><Cloud size={16} className="text-green-500" /><span className="text-xs font-medium text-gray-500">Saved</span></>}
              </div>
              <button onClick={() => refreshData()} className="p-2 bg-white border rounded-full text-gray-500 hover:bg-gray-50"><RefreshCw size={20} className={isRefreshing ? 'animate-spin' : ''} /></button>
              <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden border-2 border-white shadow-sm"><img src="https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff" alt="Admin" /></div>
           </div>
        </div>

        {renderContent()}

        {/* --- Full Featured Product Modal --- */}
        {isProductModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
             <div className="bg-white rounded-2xl w-full max-w-4xl p-0 shadow-2xl animate-fade-in-up max-h-[90vh] overflow-hidden flex flex-col">
                <div className="p-6 border-b flex justify-between items-center bg-white sticky top-0 z-10">
                   <h3 className="text-xl font-bold text-gray-900">{editingProduct ? 'Edit Product' : 'New Product'}</h3>
                   <button onClick={() => setIsProductModalOpen(false)} className="text-gray-400 hover:text-gray-600"><XCircle size={24} /></button>
                </div>
                
                {/* Product Tabs */}
                <div className="flex border-b bg-gray-50 px-6">
                   {['general', 'inventory', 'images', 'advanced'].map(tab => (
                      <button key={tab} onClick={() => setActiveProductTab(tab as any)} className={`px-6 py-3 text-sm font-bold capitalize border-b-2 transition-colors ${activeProductTab === tab ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                         {tab}
                      </button>
                   ))}
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                   {activeProductTab === 'general' && (
                      <div className="grid md:grid-cols-2 gap-6">
                         <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Product Name</label><input className="w-full border rounded-lg p-2" value={newProductForm.name} onChange={e => setNewProductForm({...newProductForm, name: e.target.value})} /></div>
                         <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Category</label><select className="w-full border rounded-lg p-2 bg-white" value={newProductForm.category} onChange={e => setNewProductForm({...newProductForm, category: e.target.value})}><option value="Modems">Modems</option><option value="Pocket WiFi">Pocket WiFi</option><option value="SIM Cards">SIM Cards</option><option value="Accessories">Accessories</option></select></div>
                         <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Selling Price (₱)</label><input type="number" className="w-full border rounded-lg p-2" value={newProductForm.price} onChange={e => setNewProductForm({...newProductForm, price: Number(e.target.value)})} /></div>
                         <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Cost Price (₱) <span className="text-gray-400 font-normal lowercase">(for profit calc)</span></label><input type="number" className="w-full border rounded-lg p-2" value={newProductForm.costPrice} onChange={e => setNewProductForm({...newProductForm, costPrice: Number(e.target.value)})} /></div>
                         <div className="md:col-span-2"><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label><textarea className="w-full border rounded-lg p-2 h-32" value={newProductForm.description} onChange={e => setNewProductForm({...newProductForm, description: e.target.value})} /></div>
                      </div>
                   )}

                   {activeProductTab === 'inventory' && (
                      <div className="grid md:grid-cols-3 gap-6">
                         <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">SKU Code</label><input className="w-full border rounded-lg p-2" value={newProductForm.sku} onChange={e => setNewProductForm({...newProductForm, sku: e.target.value})} /></div>
                         <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Current Stock</label><input type="number" className="w-full border rounded-lg p-2" value={newProductForm.stock} onChange={e => setNewProductForm({...newProductForm, stock: Number(e.target.value)})} /></div>
                         <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Low Stock Alert Level</label><input type="number" className="w-full border rounded-lg p-2" value={newProductForm.minStockLevel} onChange={e => setNewProductForm({...newProductForm, minStockLevel: Number(e.target.value)})} /></div>
                      </div>
                   )}

                   {activeProductTab === 'images' && (
                      <div className="space-y-6">
                         <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Main Image URL</label><input className="w-full border rounded-lg p-2" value={newProductForm.image} onChange={e => setNewProductForm({...newProductForm, image: e.target.value})} /></div>
                         <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Image Gallery</label>
                            <div className="flex gap-2 mb-3"><input className="flex-1 border rounded-lg p-2 text-sm" placeholder="https://..." value={galleryInput} onChange={e => setGalleryInput(e.target.value)} /><button onClick={addGalleryImage} className="bg-primary text-white p-2 rounded-lg"><Plus size={16}/></button></div>
                            <div className="grid grid-cols-5 gap-2">{newProductForm.gallery && newProductForm.gallery.map((img, i) => (<div key={i} className="relative aspect-square bg-white rounded border overflow-hidden group"><img src={img} alt="" className="w-full h-full object-cover" /><button onClick={() => removeGalleryImage(i)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><X size={12}/></button></div>))}</div>
                         </div>
                      </div>
                   )}

                   {activeProductTab === 'advanced' && (
                      <div className="space-y-6">
                         <div className="grid md:grid-cols-2 gap-6 p-4 border rounded-xl bg-blue-50 border-blue-100">
                            <div><label className="block text-xs font-bold text-blue-800 uppercase mb-1">Commission Type</label><select className="w-full border rounded-lg p-2 bg-white" value={newProductForm.commissionType} onChange={e => setNewProductForm({...newProductForm, commissionType: e.target.value as any})}><option value="percentage">Percentage (%)</option><option value="fixed">Fixed Amount (₱)</option></select></div>
                            <div><label className="block text-xs font-bold text-blue-800 uppercase mb-1">Commission Value</label><input type="number" className="w-full border rounded-lg p-2" value={newProductForm.commissionValue} onChange={e => setNewProductForm({...newProductForm, commissionValue: Number(e.target.value)})} /></div>
                         </div>
                         
                         <div className="p-4 border rounded-xl bg-green-50 border-green-100">
                            <label className="block text-xs font-bold text-green-800 uppercase mb-2">Bulk Discounts</label>
                            <div className="flex gap-2 mb-2"><input type="number" className="w-24 border rounded-lg p-2 text-sm" placeholder="Min Qty" value={bulkDiscountInput.minQty || ''} onChange={e => setBulkDiscountInput({...bulkDiscountInput, minQty: Number(e.target.value)})} /><input type="number" className="flex-1 border rounded-lg p-2 text-sm" placeholder="Discount %" value={bulkDiscountInput.percentage || ''} onChange={e => setBulkDiscountInput({...bulkDiscountInput, percentage: Number(e.target.value)})} /><button onClick={addBulkDiscount} className="bg-green-600 text-white p-2 rounded-lg"><Plus size={16}/></button></div>
                            <div className="space-y-1">{newProductForm.bulkDiscounts?.map((d, i) => (<div key={i} className="flex justify-between text-xs bg-white px-3 py-1.5 rounded border border-green-200 text-green-800"><span className="font-bold">Buy {d.minQty}+ items</span><span>Get {d.percentage}% Off</span><button onClick={() => removeBulkDiscount(i)} className="text-red-400"><X size={12}/></button></div>))}</div>
                         </div>

                         <div className="grid md:grid-cols-2 gap-6">
                            <div>
                               <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Specifications</label>
                               <div className="flex gap-2 mb-2"><input className="w-1/3 border rounded-lg p-2 text-xs" placeholder="Key" value={specInput.key} onChange={e => setSpecInput({...specInput, key: e.target.value})} /><input className="flex-1 border rounded-lg p-2 text-xs" placeholder="Value" value={specInput.value} onChange={e => setSpecInput({...specInput, value: e.target.value})} /><button onClick={addSpec} className="bg-gray-200 p-2 rounded text-gray-600"><Plus size={14}/></button></div>
                               <div className="space-y-1 h-32 overflow-y-auto">{newProductForm.specs && Object.entries(newProductForm.specs).map(([k, v]) => (<div key={k} className="flex justify-between text-xs bg-gray-50 px-2 py-1 rounded border border-gray-100"><span><span className="font-bold">{k}:</span> {v}</span><button onClick={() => removeSpec(k)} className="text-red-400"><X size={12}/></button></div>))}</div>
                            </div>
                            <div>
                               <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Inclusions</label>
                               <div className="flex gap-2 mb-2"><input className="flex-1 border rounded-lg p-2 text-xs" placeholder="Item Name" value={inclusionInput} onChange={e => setInclusionInput(e.target.value)} /><button onClick={addInclusion} className="bg-gray-200 p-2 rounded text-gray-600"><Plus size={14}/></button></div>
                               <div className="space-y-1 h-32 overflow-y-auto">{newProductForm.inclusions && newProductForm.inclusions.map((inc, i) => (<div key={i} className="flex justify-between text-xs bg-gray-50 px-2 py-1 rounded border border-gray-100"><span>{inc}</span><button onClick={() => removeInclusion(i)} className="text-red-400"><X size={12}/></button></div>))}</div>
                            </div>
                         </div>
                      </div>
                   )}
                </div>
                <div className="p-4 border-t flex justify-end gap-3 bg-gray-50">
                   <Button variant="ghost" onClick={() => setIsProductModalOpen(false)}>Cancel</Button>
                   <Button onClick={saveProduct}>Save Product</Button>
                </div>
             </div>
          </div>
        )}

        {/* --- Viewing Order Modal --- */}
        {viewingOrder && (
           <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
              <div className="bg-white rounded-2xl w-full max-w-3xl p-8 shadow-2xl animate-fade-in-up max-h-[90vh] overflow-y-auto relative">
                  <button onClick={() => setViewingOrder(null)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600"><XCircle size={24}/></button>
                  
                  <div className="flex items-center gap-4 mb-6 pb-6 border-b">
                     <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><ShoppingBag size={24}/></div>
                     <div>
                        <h3 className="text-2xl font-bold text-gray-900">Order {viewingOrder.id}</h3>
                        <p className="text-gray-500">{new Date(viewingOrder.date).toLocaleDateString()} • {viewingOrder.status}</p>
                     </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8 mb-8">
                     <div className="space-y-4">
                        <h4 className="font-bold text-gray-900 border-b pb-2">Customer Details</h4>
                        <div className="grid grid-cols-[100px_1fr] gap-y-2 text-sm">
                           <span className="text-gray-500">Name:</span> <span className="font-medium">{viewingOrder.customer}</span>
                           <span className="text-gray-500">Mobile:</span> <span className="font-medium">{viewingOrder.shippingDetails?.mobile || 'N/A'}</span>
                           <span className="text-gray-500">Email:</span> <span className="font-medium">N/A</span>
                        </div>
                        <h4 className="font-bold text-gray-900 border-b pb-2 mt-6">Shipping Address</h4>
                        <p className="text-sm text-gray-600 leading-relaxed">
                           {viewingOrder.shippingDetails?.street}, {viewingOrder.shippingDetails?.barangay}<br/>
                           {viewingOrder.shippingDetails?.city}, {viewingOrder.shippingDetails?.province}<br/>
                           {viewingOrder.shippingDetails?.zipCode}
                        </p>
                     </div>
                     <div className="space-y-4">
                        <h4 className="font-bold text-gray-900 border-b pb-2">Payment Info</h4>
                        <div className="grid grid-cols-[100px_1fr] gap-y-2 text-sm">
                           <span className="text-gray-500">Method:</span> <Badge color="blue">{viewingOrder.paymentMethod}</Badge>
                           <span className="text-gray-500">Status:</span> <Badge color={viewingOrder.status === 'Delivered' ? 'green' : 'yellow'}>{viewingOrder.status}</Badge>
                        </div>
                        {viewingOrder.proofOfPayment && (
                           <div className="mt-4">
                              <span className="text-xs font-bold text-gray-500 uppercase">Payment Proof</span>
                              <a href={viewingOrder.proofOfPayment} target="_blank" rel="noreferrer" className="block mt-2 relative group rounded-lg overflow-hidden border hover:border-primary">
                                 <img src={viewingOrder.proofOfPayment} alt="Proof" className="w-full h-32 object-cover" />
                                 <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white font-bold text-xs">View Full</div>
                              </a>
                           </div>
                        )}
                     </div>
                  </div>

                  <h4 className="font-bold text-gray-900 border-b pb-2 mb-4">Order Items</h4>
                  <table className="w-full text-sm text-left mb-6">
                     <thead className="bg-gray-50 text-gray-500"><tr><th className="p-3 rounded-l-lg">Item</th><th className="p-3">Qty</th><th className="p-3 text-right rounded-r-lg">Price</th></tr></thead>
                     <tbody>
                        {viewingOrder.orderItems?.map((item, i) => (
                           <tr key={i} className="border-b last:border-0">
                              <td className="p-3 font-medium text-gray-900">{item.name}</td>
                              <td className="p-3">{item.quantity}</td>
                              <td className="p-3 text-right">₱{(item.price * item.quantity).toLocaleString()}</td>
                           </tr>
                        ))}
                     </tbody>
                  </table>

                  <div className="bg-gray-50 p-4 rounded-xl space-y-2 text-sm">
                     <div className="flex justify-between"><span>Subtotal</span><span>₱{(viewingOrder.total - (viewingOrder.shippingFee || 0)).toLocaleString()}</span></div>
                     <div className="flex justify-between"><span>Shipping Fee</span><span>₱{(viewingOrder.shippingFee || 0).toLocaleString()}</span></div>
                     <div className="flex justify-between pt-2 border-t border-gray-200 font-bold text-lg"><span>Total</span><span className="text-primary">₱{viewingOrder.total.toLocaleString()}</span></div>
                  </div>
              </div>
           </div>
        )}

        {/* --- Expanded Affiliate Modal --- */}
        {isAffiliateModalOpen && editingAffiliate && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
             <div className="bg-white rounded-2xl w-full max-w-2xl p-8 shadow-2xl animate-fade-in-up">
                <div className="flex justify-between items-center mb-6">
                   <h3 className="text-xl font-bold text-gray-900">Manage Partner</h3>
                   <button onClick={() => setIsAffiliateModalOpen(false)} className="text-gray-400 hover:text-gray-600"><XCircle size={24} /></button>
                </div>
                
                <div className="flex gap-4 mb-6 border-b">
                   <button onClick={() => setActiveAffiliateTab('wallet')} className={`pb-2 px-2 text-sm font-bold border-b-2 transition-colors ${activeAffiliateTab === 'wallet' ? 'border-primary text-primary' : 'border-transparent text-gray-500'}`}>Wallet & Status</button>
                   <button onClick={() => setActiveAffiliateTab('profile')} className={`pb-2 px-2 text-sm font-bold border-b-2 transition-colors ${activeAffiliateTab === 'profile' ? 'border-primary text-primary' : 'border-transparent text-gray-500'}`}>Profile & Verification</button>
                </div>

                {activeAffiliateTab === 'wallet' && (
                   <div className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                         <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Partner Name</label><input disabled className="w-full border rounded-lg p-2 bg-gray-50" value={editingAffiliate.name} /></div>
                         <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Current Wallet</label><input disabled className="w-full border rounded-lg p-2 bg-gray-50 font-bold text-primary" value={`₱${editingAffiliate.walletBalance.toLocaleString()}`} /></div>
                      </div>
                      <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-100">
                         <label className="block text-xs font-bold text-yellow-700 uppercase mb-2">Manual Wallet Adjustment</label>
                         <div className="flex gap-2 items-center"><button onClick={() => setWalletAdjustment(prev => prev - 100)} className="p-2 bg-white border rounded-lg hover:bg-gray-50">-</button><input type="number" className="flex-1 border rounded-lg p-2 text-center font-bold" value={walletAdjustment} onChange={e => setWalletAdjustment(Number(e.target.value))} /><button onClick={() => setWalletAdjustment(prev => prev + 100)} className="p-2 bg-white border rounded-lg hover:bg-gray-50">+</button></div>
                         <p className="text-xs text-yellow-600 mt-2 text-center">New Balance: ₱{(editingAffiliate.walletBalance + walletAdjustment).toLocaleString()}</p>
                      </div>
                      <Button fullWidth onClick={saveAffiliate} disabled={walletAdjustment === 0}>Apply Adjustment</Button>
                   </div>
                )}

                {activeAffiliateTab === 'profile' && (
                   <div className="space-y-6 max-h-[60vh] overflow-y-auto">
                      <div className="grid md:grid-cols-2 gap-4">
                         <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Mobile</label><input disabled className="w-full border rounded-lg p-2 bg-gray-50" value={editingAffiliate.mobile || 'N/A'} /></div>
                         <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Address</label><input disabled className="w-full border rounded-lg p-2 bg-gray-50" value={editingAffiliate.address || 'N/A'} /></div>
                         <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Username</label><input disabled className="w-full border rounded-lg p-2 bg-gray-50" value={editingAffiliate.username || 'N/A'} /></div>
                         <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">GCash Name</label><input disabled className="w-full border rounded-lg p-2 bg-gray-50" value={editingAffiliate.gcashName || 'N/A'} /></div>
                      </div>
                      <div>
                         <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Government ID</label>
                         {editingAffiliate.govtId ? (
                            <img src={editingAffiliate.govtId} alt="ID" className="w-full h-48 object-contain bg-gray-100 rounded-lg border" />
                         ) : (
                            <div className="w-full h-32 bg-gray-50 rounded-lg border border-dashed flex items-center justify-center text-gray-400 text-sm">No ID Uploaded</div>
                         )}
                      </div>
                   </div>
                )}
             </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default AdminDashboard;
