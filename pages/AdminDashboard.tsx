
import React, { useState, useContext, useEffect } from 'react';
import { 
  LayoutDashboard, Package, ShoppingBag, Users, Settings, 
  TrendingUp, AlertCircle, Search, Bell, Cloud,
  MoreHorizontal, ArrowUpRight, ArrowDownRight, Filter, LogOut, Menu, X, Plus, Trash2, Edit2, Save, Loader2, Briefcase, Ban, CheckCircle, RotateCcw, CreditCard, ExternalLink, Image as ImageIcon, DollarSign, XCircle, RefreshCw,
  Clock, MousePointer, Lock, Shield, Printer, Boxes, AlertTriangle, Percent, FileSpreadsheet, List, AlignLeft, Box, Coins,
  ChevronDown, Check, Truck, Smartphone, Landmark, Map, MapPin, Mail, User as UserIcon, FileText, MessageSquare, Eye, Globe, Trophy, PenLine, Code, Share2, Bot, BrainCircuit, Key, Zap, Wifi
} from 'lucide-react';
import { SALES_DATA } from '../constants';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, BarChart, Bar, Cell 
} from 'recharts';
import { Badge, Button } from '../components/UI';
import { Link } from 'react-router-dom';
import { StoreContext } from '../contexts/StoreContext';
import { Product, Order, Affiliate, ShippingZone, Courier, EmailTemplate, LandingPageSettings, PaymentSettings, User, PageSeoData, SeoData, BotBrainEntry, BotKeywordTrigger, BotPreset, FeatureItem, TestimonialItem } from '../types';

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
    botBrain, botKeywords, botPresets,
    addProduct, updateProduct, deleteProduct,
    updateOrderStatus, deleteOrder,
    deleteCustomer, updateSettings, updatePaymentSettings, updateSMTPSettings, isSyncing, isLoading, isRefreshing, refreshData,
    updateAffiliate, updatePayoutStatus, forceInventorySync,
    updateBotBrain, updateBotKeywords, updateBotPresets,
  } = useContext(StoreContext);

  // --- Auto-refresh logic for Dashboard only ---
  useEffect(() => {
    let intervalId: number | undefined;
    if (activeTab === 'Dashboard') {
      intervalId = window.setInterval(() => {
        if (!isSyncing && !isRefreshing) {
          refreshData();
        }
      }, 15000);
    }
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [activeTab, isSyncing, isRefreshing, refreshData]);

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

  // --- Customer View Modal State ---
  const [viewingCustomer, setViewingCustomer] = useState<User | null>(null);

  // --- Affiliate Modal State ---
  const [isAffiliateModalOpen, setIsAffiliateModalOpen] = useState(false);
  const [editingAffiliate, setEditingAffiliate] = useState<Affiliate | null>(null);
  const [walletAdjustment, setWalletAdjustment] = useState(0);
  const [activeAffiliateTab, setActiveAffiliateTab] = useState<'wallet' | 'profile'>('wallet');

  // --- SEO State ---
  const [activeSeoTab, setActiveSeoTab] = useState<'products' | 'pages'>('products');
  const [isSeoModalOpen, setIsSeoModalOpen] = useState(false);
  const [editingSeoProduct, setEditingSeoProduct] = useState<Product | null>(null);
  const [seoForm, setSeoForm] = useState<Partial<SeoData>>({});
  const [pageSeoForm, setPageSeoForm] = useState<Partial<PageSeoData>>(settings.seo || {});

  // --- AI Chatbot State ---
  const [activeAiTab, setActiveAiTab] = useState<'brain' | 'keywords' | 'presets'>('brain');
  const [isBrainModalOpen, setIsBrainModalOpen] = useState(false);
  const [editingBrainEntry, setEditingBrainEntry] = useState<BotBrainEntry | null>(null);
  const [brainForm, setBrainForm] = useState<Partial<BotBrainEntry>>({});
  const [isKeywordModalOpen, setIsKeywordModalOpen] = useState(false);
  const [editingKeyword, setEditingKeyword] = useState<BotKeywordTrigger | null>(null);
  const [keywordForm, setKeywordForm] = useState<Partial<BotKeywordTrigger>>({});
  const [isPresetModalOpen, setIsPresetModalOpen] = useState(false);
  const [editingPreset, setEditingPreset] = useState<BotPreset | null>(null);
  const [presetForm, setPresetForm] = useState<Partial<BotPreset>>({});

  // --- Settings Forms ---
  const [activeSettingsTab, setActiveSettingsTab] = useState<'hero' | 'features' | 'testimonials' | 'cta'>('hero');
  const [settingsForm, setSettingsForm] = useState(settings);
  const [paymentSettingsForm, setPaymentSettingsForm] = useState(paymentSettings);
  const [smtpSettingsForm, setSmtpSettingsForm] = useState(smtpSettings);
  
  // Landing Page Lists State
  const [tempFeature, setTempFeature] = useState<FeatureItem>({ icon: 'Zap', title: '', description: '' });
  const [tempTestimonial, setTempTestimonial] = useState<TestimonialItem>({ name: '', role: '', quote: '' });

  // --- Sub-Tabs ---
  const [activeSMTPTab, setActiveSMTPTab] = useState<'server' | 'templates'>('server');
  const [activeShippingTab, setActiveShippingTab] = useState<'general' | 'couriers' | 'zones'>('general');
  const [newCourierName, setNewCourierName] = useState('');
  const [newCourierUrl, setNewCourierUrl] = useState('');

  // Sync Forms with Context
  useEffect(() => { setSettingsForm(settings); }, [settings]);
  useEffect(() => { setPaymentSettingsForm(paymentSettings); }, [paymentSettings]);
  useEffect(() => { setSmtpSettingsForm(smtpSettings); }, [smtpSettings]);
  useEffect(() => { setPageSeoForm(settings.seo || {}); }, [settings.seo]);


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

  // --- SEO Logic ---
  const handleEditSeo = (product: Product) => {
    setEditingSeoProduct(product);
    setSeoForm(product.seo || {
      metaTitle: product.name,
      metaDescription: product.description?.substring(0, 160) || '',
      keywords: product.category,
      slug: product.id,
      ogTitle: product.name,
      ogDescription: product.description?.substring(0, 160) || '',
      ogImage: product.image,
    });
    setIsSeoModalOpen(true);
  };
  
  const saveProductSeo = () => {
    if (editingSeoProduct) {
      updateProduct(editingSeoProduct.id, { ...editingSeoProduct, seo: seoForm as SeoData });
    }
    setIsSeoModalOpen(false);
  };

  const savePageSeo = () => {
    updateSettings({ ...settings, seo: pageSeoForm as PageSeoData });
    alert('Homepage SEO settings saved!');
  };

  // --- AI Chatbot Logic ---
  const handleNewBrainEntry = () => {
    setEditingBrainEntry(null);
    setBrainForm({ id: `brain-${Date.now()}` });
    setIsBrainModalOpen(true);
  };
  const handleEditBrainEntry = (entry: BotBrainEntry) => {
    setEditingBrainEntry(entry);
    setBrainForm({ ...entry });
    setIsBrainModalOpen(true);
  };
  const saveBrainEntry = () => {
    if (editingBrainEntry) {
      updateBotBrain(botBrain.map(b => b.id === editingBrainEntry.id ? brainForm as BotBrainEntry : b));
    } else {
      updateBotBrain([...botBrain, brainForm as BotBrainEntry]);
    }
    setIsBrainModalOpen(false);
  };
  const deleteBrainEntry = (id: string) => {
    if (window.confirm('Are you sure you want to delete this brain entry?')) {
      updateBotBrain(botBrain.filter(b => b.id !== id));
    }
  };

  const handleNewKeyword = () => {
    setEditingKeyword(null);
    setKeywordForm({ id: `key-${Date.now()}` });
    setIsKeywordModalOpen(true);
  };
  const handleEditKeyword = (keyword: BotKeywordTrigger) => {
    setEditingKeyword(keyword);
    setKeywordForm({ ...keyword });
    setIsKeywordModalOpen(true);
  };
  const saveKeyword = () => {
    if (editingKeyword) {
      updateBotKeywords(botKeywords.map(k => k.id === editingKeyword.id ? keywordForm as BotKeywordTrigger : k));
    } else {
      updateBotKeywords([...botKeywords, keywordForm as BotKeywordTrigger]);
    }
    setIsKeywordModalOpen(false);
  };
  const deleteKeyword = (id: string) => {
    if (window.confirm('Are you sure you want to delete this keyword trigger?')) {
      updateBotKeywords(botKeywords.filter(k => k.id !== id));
    }
  };

  const handleNewPreset = () => {
    setEditingPreset(null);
    setPresetForm({ id: `preset-${Date.now()}` });
    setIsPresetModalOpen(true);
  };
  const handleEditPreset = (preset: BotPreset) => {
    setEditingPreset(preset);
    setPresetForm({ ...preset });
    setIsPresetModalOpen(true);
  };
  const savePreset = () => {
    if (editingPreset) {
      updateBotPresets(botPresets.map(p => p.id === editingPreset.id ? presetForm as BotPreset : p));
    } else {
      updateBotPresets([...botPresets, presetForm as BotPreset]);
    }
    setIsPresetModalOpen(false);
  };
  const deletePreset = (id: string) => {
    if (window.confirm('Are you sure you want to delete this preset button?')) {
      updateBotPresets(botPresets.filter(p => p.id !== id));
    }
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
  
  // -- List Management for Settings --
  const addFeature = () => {
      if(tempFeature.title && tempFeature.description) {
          const newItems = [...(settingsForm.features.items || []), tempFeature];
          setSettingsForm(prev => ({ ...prev, features: { ...prev.features, items: newItems } }));
          setTempFeature({ icon: 'Zap', title: '', description: '' });
      }
  };
  const removeFeature = (index: number) => {
      const newItems = settingsForm.features.items.filter((_, i) => i !== index);
      setSettingsForm(prev => ({ ...prev, features: { ...prev.features, items: newItems } }));
  };
  
  const addTestimonial = () => {
      if(tempTestimonial.name && tempTestimonial.quote) {
          const newItems = [...(settingsForm.testimonials.items || []), tempTestimonial];
          setSettingsForm(prev => ({ ...prev, testimonials: { ...prev.testimonials, items: newItems } }));
          setTempTestimonial({ name: '', role: '', quote: '' });
      }
  };
  const removeTestimonial = (index: number) => {
      const newItems = settingsForm.testimonials.items.filter((_, i) => i !== index);
      setSettingsForm(prev => ({ ...prev, testimonials: { ...prev.testimonials, items: newItems } }));
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
     // Placeholder for print waybill
     alert("Printing waybill for " + order.id);
  };

  const pendingPayoutTotal = payouts.filter(p => p.status === 'Pending').reduce((acc, p) => acc + p.amount, 0);
  const totalPaidOut = payouts.filter(p => p.status === 'Approved').reduce((acc, p) => acc + p.amount, 0);

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
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Password</label>
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
    { icon: Bot, label: 'AI Chatbot' },
    { icon: Globe, label: 'SEO' },
    { icon: Settings, label: 'Settings' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard': 
        return (
          <div className="space-y-6">
             {/* Header Section */}
             <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-2">
                <div>
                   <h1 className="text-3xl font-black text-gray-900">Dashboard</h1>
                   <p className="text-gray-500 text-sm mt-1">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                <div className="flex items-center gap-3">
                   <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg shadow-sm">
                      <CheckCircle size={14} className="text-green-500" />
                      <span className="text-xs font-bold text-gray-600">Saved</span>
                   </div>
                   <button onClick={refreshData} disabled={isSyncing} className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 shadow-sm transition-all disabled:opacity-50">
                      <RefreshCw size={18} className={isSyncing ? "animate-spin" : ""} />
                   </button>
                   <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md ring-2 ring-white">AD</div>
                </div>
             </div>

             {/* 8-Card Grid Layout */}
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Row 1 */}
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                   <div className="flex justify-between items-start mb-4">
                      <div className="p-3 bg-red-50 text-primary rounded-xl"><TrendingUp size={24}/></div>
                   </div>
                   <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider">Total Revenue</h3>
                   <p className="text-2xl font-black text-gray-900 mt-1">₱{stats.revenue.toLocaleString()}</p>
                   <p className="text-[10px] text-gray-400 mt-1">Excl. Shipping</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                   <div className="flex justify-between items-start mb-4">
                      <div className="p-3 bg-green-50 text-green-600 rounded-xl"><DollarSign size={24}/></div>
                   </div>
                   <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider">Net Profit</h3>
                   <p className="text-2xl font-black text-green-600 mt-1">₱{stats.netProfit.toLocaleString()}</p>
                   <p className="text-[10px] text-gray-400 mt-1">Est. Earnings</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                   <div className="flex justify-between items-start mb-4">
                      <div className="p-3 bg-purple-50 text-purple-600 rounded-xl"><Box size={24}/></div>
                   </div>
                   <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider">Total Items Sold</h3>
                   <p className="text-2xl font-black text-gray-900 mt-1">{stats.totalItemsSold}</p>
                   <p className="text-[10px] text-gray-400 mt-1">Units moved</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                   <div className="flex justify-between items-start mb-4">
                      <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><ShoppingBag size={24}/></div>
                   </div>
                   <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider">Total Orders</h3>
                   <p className="text-2xl font-black text-gray-900 mt-1">{stats.totalOrders}</p>
                   <p className="text-[10px] text-gray-400 mt-1">Transactions</p>
                </div>

                {/* Row 2 */}
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                   <div className="flex justify-between items-start mb-4">
                      <div className="p-3 bg-cyan-50 text-cyan-600 rounded-xl"><Briefcase size={24}/></div>
                   </div>
                   <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider">Affiliates</h3>
                   <p className="text-2xl font-black text-gray-900 mt-1">{affiliates.length}</p>
                   <p className="text-[10px] text-gray-400 mt-1">Active Partners</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                   <div className="flex justify-between items-start mb-4">
                      <div className="p-3 bg-orange-50 text-orange-600 rounded-xl"><Users size={24}/></div>
                   </div>
                   <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider">Customers</h3>
                   <p className="text-2xl font-black text-gray-900 mt-1">{customers.length}</p>
                   <p className="text-[10px] text-gray-400 mt-1">Registered Users</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                   <div className="flex justify-between items-start mb-4">
                      <div className="p-3 bg-yellow-50 text-yellow-600 rounded-xl"><Clock size={24}/></div>
                   </div>
                   <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider">Pending Payout</h3>
                   <p className="text-2xl font-black text-gray-900 mt-1">₱{pendingPayoutTotal.toLocaleString()}</p>
                   <p className="text-[10px] text-gray-400 mt-1">Requests</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                   <div className="flex justify-between items-start mb-4">
                      <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><CheckCircle size={24}/></div>
                   </div>
                   <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider">Total Paid Out</h3>
                   <p className="text-2xl font-black text-gray-900 mt-1">₱{totalPaidOut.toLocaleString()}</p>
                   <p className="text-[10px] text-gray-400 mt-1">Completed</p>
                </div>
             </div>
             
             {/* Charts & Activity Grid */}
             <div className="grid lg:grid-cols-3 gap-6">
                 <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                       <h3 className="font-bold text-gray-900">Revenue Analytics</h3>
                       <p className="text-xs text-gray-400">Sales performance trends</p>
                    </div>
                    <div className="h-72 w-full">
                       <ResponsiveContainer width="100%" height="100%">
                         <AreaChart data={SALES_DATA}>
                           <defs>
                             <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                               <stop offset="5%" stopColor="#C8102E" stopOpacity={0.1}/>
                               <stop offset="95%" stopColor="#C8102E" stopOpacity={0}/>
                             </linearGradient>
                           </defs>
                           <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                           <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
                           <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
                           <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} />
                           <Area type="monotone" dataKey="sales" stroke="#C8102E" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                         </AreaChart>
                       </ResponsiveContainer>
                    </div>
                 </div>
                 
                 <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                       <h3 className="font-bold text-gray-900">Recent Activity</h3>
                       <Link to="#" onClick={() => setActiveTab('Orders')} className="text-xs font-bold text-primary hover:underline">View All</Link>
                    </div>
                    <div className="space-y-4">
                       {orders.slice(0, 5).map(order => (
                          <div key={order.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-gray-100" onClick={() => setViewingOrder(order)}>
                             <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-xs ${['bg-orange-500', 'bg-blue-500', 'bg-green-500', 'bg-purple-500'][Math.floor(Math.random()*4)]}`}>
                                   {order.customer.charAt(0)}
                                </div>
                                <div>
                                   <p className="font-bold text-gray-900 text-sm">{order.customer}</p>
                                   <p className="text-[10px] text-gray-400">{new Date(order.date).toLocaleDateString()}</p>
                                </div>
                             </div>
                             <div className="text-right">
                                <p className="font-bold text-gray-900 text-sm">₱{order.total.toLocaleString()}</p>
                                <span className={`text-[10px] font-bold uppercase ${order.status === 'Delivered' ? 'text-green-600' : order.status === 'Shipped' ? 'text-blue-600' : 'text-orange-600'}`}>
                                   {order.status}
                                </span>
                             </div>
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
                <Button variant="outline" onClick={forceInventorySync} disabled={isSyncing} className="py-2 text-sm">
                   {isSyncing ? <Loader2 className="animate-spin" size={16}/> : <RefreshCw size={16}/>} Sync Inventory
                </Button>
             </div>
             <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                   <thead className="bg-gray-50 text-gray-500 font-medium">
                      <tr>
                         <th className="p-4">SKU / Product</th>
                         <th className="p-4">Stock Level</th>
                         <th className="p-4">Min. Level</th>
                         <th className="p-4">Status</th>
                         <th className="p-4 text-right">Quick Update</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-100">
                      {products.map(product => {
                         const stock = product.stock || 0;
                         const min = product.minStockLevel || 10;
                         let statusColor: any = 'green';
                         let statusText = 'In Stock';
                         if(stock === 0) { statusColor = 'red'; statusText = 'Out of Stock'; }
                         else if(stock <= min) { statusColor = 'yellow'; statusText = 'Low Stock'; }

                         return (
                           <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                              <td className="p-4">
                                 <div className="font-bold text-gray-900">{product.name}</div>
                                 <div className="text-xs text-gray-400 font-mono">{product.sku || 'NO-SKU'}</div>
                              </td>
                              <td className="p-4 font-bold text-lg">{stock}</td>
                              <td className="p-4 text-gray-500">{min}</td>
                              <td className="p-4"><Badge color={statusColor}>{statusText}</Badge></td>
                              <td className="p-4 text-right">
                                 <div className="flex justify-end items-center gap-2">
                                    <button onClick={() => handleStockChange(product.id, -1)} className="p-1 rounded bg-gray-100 hover:bg-gray-200 font-bold w-8">-</button>
                                    <button onClick={() => handleStockChange(product.id, 1)} className="p-1 rounded bg-gray-100 hover:bg-gray-200 font-bold w-8">+</button>
                                 </div>
                              </td>
                           </tr>
                         );
                      })}
                   </tbody>
                </table>
             </div>
          </div>
      );

      case 'Orders': return (
         <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
             <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h2 className="font-bold text-gray-900">Order Management</h2>
                <div className="flex gap-2">
                   <input type="text" placeholder="Search orders..." className="border rounded-lg px-3 py-1.5 text-sm" />
                </div>
             </div>
             <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                   <thead className="bg-gray-50 text-gray-500 font-medium">
                      <tr>
                         <th className="p-4">Order ID</th>
                         <th className="p-4">Date</th>
                         <th className="p-4">Customer</th>
                         <th className="p-4">Total</th>
                         <th className="p-4">Status</th>
                         <th className="p-4 text-right">Actions</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-100">
                      {orders.map(order => (
                         <tr key={order.id} className="hover:bg-gray-50">
                            <td className="p-4 font-bold">{order.id}</td>
                            <td className="p-4">{new Date(order.date).toLocaleDateString()}</td>
                            <td className="p-4">
                               <div className="font-medium text-gray-900">{order.customer}</div>
                               <div className="text-xs text-gray-400">{order.paymentMethod}</div>
                            </td>
                            <td className="p-4 font-bold">₱{order.total.toLocaleString()}</td>
                            <td className="p-4">
                               <select 
                                 value={order.status}
                                 onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                                 className={`border rounded-lg px-2 py-1 text-xs font-bold ${
                                    order.status === 'Delivered' ? 'bg-green-100 text-green-700 border-green-200' :
                                    order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                                    'bg-blue-100 text-blue-700 border-blue-200'
                                 }`}
                               >
                                  <option>Pending</option>
                                  <option>Processing</option>
                                  <option>Shipped</option>
                                  <option>Delivered</option>
                               </select>
                            </td>
                            <td className="p-4 text-right">
                               <div className="flex justify-end gap-2">
                                  <button onClick={() => setViewingOrder(order)} className="p-2 hover:bg-gray-100 rounded-full text-blue-600"><Eye size={16}/></button>
                                  <button onClick={() => handlePrintWaybill(order)} className="p-2 hover:bg-gray-100 rounded-full text-gray-600"><Printer size={16}/></button>
                                  <button onClick={() => deleteOrder(order.id)} className="p-2 hover:bg-red-50 rounded-full text-red-500"><Trash2 size={16}/></button>
                               </div>
                            </td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             </div>
         </div>
      );
      
      case 'Shipping': return (
         <div className="space-y-6">
            <div className="flex gap-4 border-b">
               <button onClick={() => setActiveShippingTab('general')} className={`pb-2 px-4 font-bold border-b-2 ${activeShippingTab==='general' ? 'border-primary text-primary' : 'border-transparent text-gray-400'}`}>General</button>
               <button onClick={() => setActiveShippingTab('couriers')} className={`pb-2 px-4 font-bold border-b-2 ${activeShippingTab==='couriers' ? 'border-primary text-primary' : 'border-transparent text-gray-400'}`}>Couriers</button>
               <button onClick={() => setActiveShippingTab('zones')} className={`pb-2 px-4 font-bold border-b-2 ${activeShippingTab==='zones' ? 'border-primary text-primary' : 'border-transparent text-gray-400'}`}>Zones</button>
            </div>
            
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
               {activeShippingTab === 'general' && (
                  <div className="space-y-4 max-w-lg">
                     <div className="flex items-center justify-between">
                        <span className="font-bold">Enable Shipping</span>
                        <input type="checkbox" checked={settingsForm.shipping.enabled} onChange={e => handleShippingChange('enabled', e.target.checked)} className="toggle" />
                     </div>
                     <div><label className="text-xs font-bold uppercase text-gray-500">Base Shipping Fee</label><input type="number" className="w-full border rounded p-2" value={settingsForm.shipping.baseFee} onChange={e => handleShippingChange('baseFee', Number(e.target.value))} /></div>
                     <div><label className="text-xs font-bold uppercase text-gray-500">Free Shipping Threshold</label><input type="number" className="w-full border rounded p-2" value={settingsForm.shipping.freeThreshold} onChange={e => handleShippingChange('freeThreshold', Number(e.target.value))} /></div>
                     <div><label className="text-xs font-bold uppercase text-gray-500">Calculation Type</label>
                        <select className="w-full border rounded p-2" value={settingsForm.shipping.calculationType} onChange={e => handleShippingChange('calculationType', e.target.value)}>
                           <option value="flat">Flat Rate</option>
                           <option value="zone">Zone Based</option>
                        </select>
                     </div>
                     <Button onClick={saveSettings} disabled={isSyncing}>Save Settings</Button>
                  </div>
               )}
               {activeShippingTab === 'couriers' && (
                  <div>
                     <div className="flex gap-2 mb-4">
                        <input className="border rounded p-2 text-sm flex-1" placeholder="Courier Name" value={newCourierName} onChange={e => setNewCourierName(e.target.value)} />
                        <input className="border rounded p-2 text-sm flex-1" placeholder="Tracking URL Template" value={newCourierUrl} onChange={e => setNewCourierUrl(e.target.value)} />
                        <Button onClick={handleAddCourier} className="py-2 text-sm">Add</Button>
                     </div>
                     <div className="space-y-2">
                        {settingsForm.shipping.couriers.map(c => (
                           <div key={c.id} className="flex justify-between items-center p-3 bg-gray-50 rounded border">
                              <div><p className="font-bold">{c.name}</p><p className="text-xs text-gray-500 truncate">{c.trackingUrl}</p></div>
                              <button onClick={() => handleDeleteCourier(c.id)} className="text-red-500"><Trash2 size={16}/></button>
                           </div>
                        ))}
                     </div>
                     <Button onClick={saveSettings} className="mt-4" disabled={isSyncing}>Save Changes</Button>
                  </div>
               )}
               {activeShippingTab === 'zones' && (
                  <div>
                     <table className="w-full text-sm mb-4">
                        <thead>
                           <tr className="text-left text-gray-500"><th>Zone Name</th><th>Fee</th><th>Delivery Days</th></tr>
                        </thead>
                        <tbody>
                           {settingsForm.shipping.zones.map((z, idx) => (
                              <tr key={idx}>
                                 <td className="p-2"><input className="border rounded p-1 w-full" value={z.name} onChange={e => handleUpdateZone(idx, 'name', e.target.value)} /></td>
                                 <td className="p-2"><input type="number" className="border rounded p-1 w-20" value={z.fee} onChange={e => handleUpdateZone(idx, 'fee', Number(e.target.value))} /></td>
                                 <td className="p-2"><input className="border rounded p-1 w-full" value={z.days} onChange={e => handleUpdateZone(idx, 'days', e.target.value)} /></td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                     <Button onClick={saveSettings} disabled={isSyncing}>Save Zones</Button>
                  </div>
               )}
            </div>
         </div>
      );

      case 'Payment Gateway': return (
         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
               <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2"><DollarSign size={18}/> Cash on Delivery</h3>
                  <input type="checkbox" checked={paymentSettingsForm.cod.enabled} onChange={e => handlePaymentSettingsChange('cod', 'enabled', e.target.checked)} />
               </div>
               <p className="text-sm text-gray-500">Allow customers to pay upon delivery.</p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm md:col-span-2">
               <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2"><Smartphone size={18}/> GCash</h3>
                  <input type="checkbox" checked={paymentSettingsForm.gcash.enabled} onChange={e => handlePaymentSettingsChange('gcash', 'enabled', e.target.checked)} />
               </div>
               <div className="grid md:grid-cols-2 gap-4">
                  <div><label className="text-xs font-bold uppercase text-gray-500">Account Name</label><input className="w-full border rounded p-2 mt-1" value={paymentSettingsForm.gcash.accountName} onChange={e => handlePaymentSettingsChange('gcash', 'accountName', e.target.value)} /></div>
                  <div><label className="text-xs font-bold uppercase text-gray-500">Account Number</label><input className="w-full border rounded p-2 mt-1" value={paymentSettingsForm.gcash.accountNumber} onChange={e => handlePaymentSettingsChange('gcash', 'accountNumber', e.target.value)} /></div>
                  <div className="md:col-span-2"><label className="text-xs font-bold uppercase text-gray-500">QR Code Image URL</label><input className="w-full border rounded p-2 mt-1" value={paymentSettingsForm.gcash.qrImage} onChange={e => handlePaymentSettingsChange('gcash', 'qrImage', e.target.value)} /></div>
               </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm md:col-span-3">
               <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2"><Landmark size={18}/> Bank Transfer</h3>
                  <input type="checkbox" checked={paymentSettingsForm.bank.enabled} onChange={e => handlePaymentSettingsChange('bank', 'enabled', e.target.checked)} />
               </div>
               <div className="grid md:grid-cols-3 gap-4">
                  <div><label className="text-xs font-bold uppercase text-gray-500">Bank Name</label><input className="w-full border rounded p-2 mt-1" value={paymentSettingsForm.bank.bankName} onChange={e => handlePaymentSettingsChange('bank', 'bankName', e.target.value)} /></div>
                  <div><label className="text-xs font-bold uppercase text-gray-500">Account Name</label><input className="w-full border rounded p-2 mt-1" value={paymentSettingsForm.bank.accountName} onChange={e => handlePaymentSettingsChange('bank', 'accountName', e.target.value)} /></div>
                  <div><label className="text-xs font-bold uppercase text-gray-500">Account Number</label><input className="w-full border rounded p-2 mt-1" value={paymentSettingsForm.bank.accountNumber} onChange={e => handlePaymentSettingsChange('bank', 'accountNumber', e.target.value)} /></div>
               </div>
            </div>
            
            <div className="md:col-span-3 flex justify-end">
               <Button onClick={savePaymentSettings} disabled={isSyncing} className="w-full md:w-auto"><Save size={16} className="mr-2"/> Save Payment Settings</Button>
            </div>
         </div>
      );

      case 'SMTP Email': return (
         <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex gap-4 border-b mb-6">
               <button onClick={() => setActiveSMTPTab('server')} className={`pb-2 px-4 font-bold border-b-2 ${activeSMTPTab==='server' ? 'border-primary text-primary' : 'border-transparent text-gray-400'}`}>Server Config</button>
               <button onClick={() => setActiveSMTPTab('templates')} className={`pb-2 px-4 font-bold border-b-2 ${activeSMTPTab==='templates' ? 'border-primary text-primary' : 'border-transparent text-gray-400'}`}>Email Templates</button>
            </div>

            {activeSMTPTab === 'server' && (
               <div className="space-y-4 max-w-lg">
                  <div className="flex justify-between items-center"><span className="font-bold">Enable SMTP</span><input type="checkbox" checked={smtpSettingsForm.enabled} onChange={e => handleSmtpSettingsChange('enabled', e.target.checked)} /></div>
                  <div className="grid grid-cols-2 gap-4">
                     <div><label className="text-xs font-bold uppercase text-gray-500">Host</label><input className="w-full border rounded p-2 mt-1" value={smtpSettingsForm.host} onChange={e => handleSmtpSettingsChange('host', e.target.value)} /></div>
                     <div><label className="text-xs font-bold uppercase text-gray-500">Port</label><input type="number" className="w-full border rounded p-2 mt-1" value={smtpSettingsForm.port} onChange={e => handleSmtpSettingsChange('port', Number(e.target.value))} /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div><label className="text-xs font-bold uppercase text-gray-500">Username</label><input className="w-full border rounded p-2 mt-1" value={smtpSettingsForm.username} onChange={e => handleSmtpSettingsChange('username', e.target.value)} /></div>
                     <div><label className="text-xs font-bold uppercase text-gray-500">Password</label><input type="password" className="w-full border rounded p-2 mt-1" value={smtpSettingsForm.password} onChange={e => handleSmtpSettingsChange('password', e.target.value)} /></div>
                  </div>
                  <div><label className="text-xs font-bold uppercase text-gray-500">From Name</label><input className="w-full border rounded p-2 mt-1" value={smtpSettingsForm.fromName} onChange={e => handleSmtpSettingsChange('fromName', e.target.value)} /></div>
                  <div><label className="text-xs font-bold uppercase text-gray-500">From Email</label><input className="w-full border rounded p-2 mt-1" value={smtpSettingsForm.fromEmail} onChange={e => handleSmtpSettingsChange('fromEmail', e.target.value)} /></div>
                  <Button onClick={saveSmtpSettings} disabled={isSyncing}>Save Server Config</Button>
               </div>
            )}
            
            {activeSMTPTab === 'templates' && (
               <div className="space-y-6">
                  {Object.entries(smtpSettingsForm.templates).map(([key, value]) => {
                     const tpl = value as EmailTemplate;
                     return (
                        <div key={key} className="border rounded-xl p-4 bg-gray-50">
                           <div className="flex justify-between items-center mb-2">
                              <h4 className="font-bold capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</h4>
                              <input type="checkbox" checked={tpl.enabled} onChange={e => handleTemplateChange(key, 'enabled', e.target.checked)} />
                           </div>
                           <input className="w-full border rounded p-2 mb-2 text-sm" placeholder="Subject" value={tpl.subject} onChange={e => handleTemplateChange(key, 'subject', e.target.value)} />
                           <textarea className="w-full border rounded p-2 text-sm h-24" placeholder="Body Content" value={tpl.body} onChange={e => handleTemplateChange(key, 'body', e.target.value)} />
                        </div>
                     );
                  })}
                  <Button onClick={saveSmtpSettings} disabled={isSyncing}>Save All Templates</Button>
               </div>
            )}
         </div>
      );

      case 'Affiliates': return (
         <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
             <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h2 className="font-bold text-gray-900">Affiliate Partners</h2>
                <div className="text-sm text-gray-500">{affiliates.length} partners registered</div>
             </div>
             <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                   <thead className="bg-gray-50 text-gray-500 font-medium">
                      <tr>
                         <th className="p-4">Partner</th>
                         <th className="p-4">Wallet</th>
                         <th className="p-4">Sales</th>
                         <th className="p-4">Status</th>
                         <th className="p-4 text-right">Actions</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-100">
                      {affiliates.map(aff => (
                         <tr key={aff.id} className="hover:bg-gray-50">
                            <td className="p-4">
                               <div className="font-bold text-gray-900">{aff.name}</div>
                               <div className="text-xs text-gray-400">{aff.email}</div>
                            </td>
                            <td className="p-4 font-bold text-green-600">₱{aff.walletBalance.toLocaleString()}</td>
                            <td className="p-4">₱{aff.totalSales.toLocaleString()}</td>
                            <td className="p-4"><Badge color={aff.status === 'active' ? 'green' : 'red'}>{aff.status}</Badge></td>
                            <td className="p-4 text-right">
                               <button onClick={() => handleEditAffiliate(aff)} className="p-2 hover:bg-gray-100 rounded-full"><Edit2 size={16}/></button>
                            </td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             </div>
         </div>
      );

      case 'Payouts': return (
         <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
             <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h2 className="font-bold text-gray-900">Payout Requests</h2>
             </div>
             <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                   <thead className="bg-gray-50 text-gray-500 font-medium">
                      <tr>
                         <th className="p-4">Date</th>
                         <th className="p-4">Affiliate</th>
                         <th className="p-4">Amount</th>
                         <th className="p-4">Method / Account</th>
                         <th className="p-4">Status</th>
                         <th className="p-4 text-right">Actions</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-100">
                      {payouts.map(p => (
                         <tr key={p.id} className="hover:bg-gray-50">
                            <td className="p-4 text-gray-500">{new Date(p.dateRequested).toLocaleDateString()}</td>
                            <td className="p-4 font-bold">{p.affiliateName}</td>
                            <td className="p-4 font-bold text-lg">₱{p.amount.toLocaleString()}</td>
                            <td className="p-4">
                               <div className="font-bold">{p.method}</div>
                               <div className="text-xs text-gray-500">{p.accountNumber} ({p.accountName})</div>
                            </td>
                            <td className="p-4"><Badge color={p.status==='Approved' ? 'green' : p.status==='Rejected' ? 'red' : 'yellow'}>{p.status}</Badge></td>
                            <td className="p-4 text-right">
                               {p.status === 'Pending' && (
                                  <div className="flex justify-end gap-2">
                                     <button onClick={() => updatePayoutStatus(p.id, 'Approved')} className="p-2 bg-green-100 text-green-700 rounded hover:bg-green-200" title="Approve"><CheckCircle size={16}/></button>
                                     <button onClick={() => updatePayoutStatus(p.id, 'Rejected')} className="p-2 bg-red-100 text-red-700 rounded hover:bg-red-200" title="Reject"><XCircle size={16}/></button>
                                  </div>
                               )}
                            </td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             </div>
         </div>
      );

      case 'Customers': return (
         <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
             <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h2 className="font-bold text-gray-900">Customer Database</h2>
             </div>
             <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                   <thead className="bg-gray-50 text-gray-500 font-medium">
                      <tr>
                         <th className="p-4">Name</th>
                         <th className="p-4">Contact</th>
                         <th className="p-4">Username</th>
                         <th className="p-4">Actions</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-100">
                      {customers.map(c => (
                         <tr key={c.id} className="hover:bg-gray-50">
                            <td className="p-4 font-bold">{c.name}</td>
                            <td className="p-4">
                               <div>{c.email}</div>
                               <div className="text-xs text-gray-500">{c.mobile}</div>
                            </td>
                            <td className="p-4">{c.username}</td>
                            <td className="p-4">
                               <button onClick={() => setViewingCustomer(c)} className="text-blue-600 hover:underline">View Details</button>
                            </td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             </div>
         </div>
      );

      case 'AI Chatbot': return (
        <div className="space-y-6">
           <div className="flex gap-4 border-b">
              <button onClick={() => setActiveAiTab('brain')} className={`pb-2 px-4 font-bold border-b-2 ${activeAiTab==='brain' ? 'border-primary text-primary' : 'border-transparent text-gray-400'}`}>Knowledge Base</button>
              <button onClick={() => setActiveAiTab('keywords')} className={`pb-2 px-4 font-bold border-b-2 ${activeAiTab==='keywords' ? 'border-primary text-primary' : 'border-transparent text-gray-400'}`}>Keywords</button>
              <button onClick={() => setActiveAiTab('presets')} className={`pb-2 px-4 font-bold border-b-2 ${activeAiTab==='presets' ? 'border-primary text-primary' : 'border-transparent text-gray-400'}`}>Preset Buttons</button>
           </div>
           
           {activeAiTab === 'brain' && (
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                 <div className="p-4 border-b flex justify-between items-center">
                    <h3 className="font-bold">Bot Knowledge Base</h3>
                    <Button onClick={handleNewBrainEntry} className="py-2 text-xs"><Plus size={14} className="mr-1"/> Add Topic</Button>
                 </div>
                 <div className="p-4 space-y-4">
                    {botBrain.map(item => (
                       <div key={item.id} className="p-4 border rounded-xl bg-gray-50 hover:bg-white transition-colors">
                          <div className="flex justify-between items-start mb-2">
                             <h4 className="font-bold text-primary">{item.topic}</h4>
                             <div className="flex gap-2">
                                <button onClick={() => handleEditBrainEntry(item)} className="p-1 hover:bg-gray-200 rounded"><Edit2 size={14}/></button>
                                <button onClick={() => deleteBrainEntry(item.id)} className="p-1 hover:bg-red-100 text-red-500 rounded"><Trash2 size={14}/></button>
                             </div>
                          </div>
                          <p className="text-sm text-gray-600">{item.response}</p>
                       </div>
                    ))}
                 </div>
              </div>
           )}
           {activeAiTab === 'keywords' && (
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                 <div className="p-4 border-b flex justify-between items-center">
                    <h3 className="font-bold">Keyword Triggers</h3>
                    <Button onClick={handleNewKeyword} className="py-2 text-xs"><Plus size={14} className="mr-1"/> Add Trigger</Button>
                 </div>
                 <div className="p-4 grid gap-4">
                    {botKeywords.map(item => (
                       <div key={item.id} className="p-4 border rounded-xl bg-gray-50">
                          <div className="flex justify-between items-start mb-2">
                             <div>
                                <span className="text-xs font-bold text-gray-400 uppercase">{item.category}</span>
                                <h4 className="font-bold text-gray-900">{item.keywords}</h4>
                             </div>
                             <div className="flex gap-2">
                                <button onClick={() => handleEditKeyword(item)} className="p-1 hover:bg-gray-200 rounded"><Edit2 size={14}/></button>
                                <button onClick={() => deleteKeyword(item.id)} className="p-1 hover:bg-red-100 text-red-500 rounded"><Trash2 size={14}/></button>
                             </div>
                          </div>
                          <p className="text-sm text-gray-600 bg-white p-2 rounded border">{item.response}</p>
                       </div>
                    ))}
                 </div>
              </div>
           )}
           {activeAiTab === 'presets' && (
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                 <div className="p-4 border-b flex justify-between items-center">
                    <h3 className="font-bold">Preset Question Buttons</h3>
                    <Button onClick={handleNewPreset} className="py-2 text-xs"><Plus size={14} className="mr-1"/> Add Button</Button>
                 </div>
                 <div className="p-4 grid md:grid-cols-2 gap-4">
                    {botPresets.map(item => (
                       <div key={item.id} className="p-4 border rounded-xl bg-gray-50">
                          <div className="flex justify-between items-start mb-2">
                             <div className="bg-primary text-white px-3 py-1 rounded-full text-xs font-bold">{item.question}</div>
                             <div className="flex gap-2">
                                <button onClick={() => handleEditPreset(item)} className="p-1 hover:bg-gray-200 rounded"><Edit2 size={14}/></button>
                                <button onClick={() => deletePreset(item.id)} className="p-1 hover:bg-red-100 text-red-500 rounded"><Trash2 size={14}/></button>
                             </div>
                          </div>
                          <p className="text-sm text-gray-600 mt-2">{item.response}</p>
                       </div>
                    ))}
                 </div>
              </div>
           )}
        </div>
      );

      case 'SEO': return (
         <div className="space-y-6">
            <div className="flex gap-4 border-b">
               <button onClick={() => setActiveSeoTab('products')} className={`pb-2 px-4 font-bold border-b-2 ${activeSeoTab==='products' ? 'border-primary text-primary' : 'border-transparent text-gray-400'}`}>Product SEO</button>
               <button onClick={() => setActiveSeoTab('pages')} className={`pb-2 px-4 font-bold border-b-2 ${activeSeoTab==='pages' ? 'border-primary text-primary' : 'border-transparent text-gray-400'}`}>Page SEO</button>
            </div>
            
            {activeSeoTab === 'products' && (
               <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                  <div className="overflow-x-auto">
                     <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500">
                           <tr><th className="p-4">Product Name</th><th className="p-4">Meta Title</th><th className="p-4">Actions</th></tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                           {products.map(p => (
                              <tr key={p.id}>
                                 <td className="p-4 font-bold">{p.name}</td>
                                 <td className="p-4 text-gray-500 truncate max-w-xs">{p.seo?.metaTitle || 'Default'}</td>
                                 <td className="p-4"><button onClick={() => handleEditSeo(p)} className="text-blue-600 hover:underline">Edit SEO</button></td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </div>
            )}
            
            {activeSeoTab === 'pages' && (
               <div className="bg-white p-6 rounded-2xl border border-gray-100 max-w-lg">
                  <h3 className="font-bold mb-4">Homepage SEO Configuration</h3>
                  <div className="space-y-4">
                     <div><label className="text-xs font-bold uppercase text-gray-500">Meta Title</label><input className="w-full border rounded p-2" value={pageSeoForm.metaTitle || ''} onChange={e => setPageSeoForm({...pageSeoForm, metaTitle: e.target.value})} /></div>
                     <div><label className="text-xs font-bold uppercase text-gray-500">Meta Description</label><textarea className="w-full border rounded p-2 h-24" value={pageSeoForm.metaDescription || ''} onChange={e => setPageSeoForm({...pageSeoForm, metaDescription: e.target.value})} /></div>
                     <div><label className="text-xs font-bold uppercase text-gray-500">OG Image URL</label><input className="w-full border rounded p-2" value={pageSeoForm.ogImage || ''} onChange={e => setPageSeoForm({...pageSeoForm, ogImage: e.target.value})} /></div>
                     <Button onClick={savePageSeo} disabled={isSyncing}>Save Homepage SEO</Button>
                  </div>
               </div>
            )}
         </div>
      );

      case 'Settings': 
        return (
          <div className="max-w-4xl mx-auto space-y-8 pb-20">
             <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                   <h2 className="text-lg font-bold text-gray-900">Landing Page Configuration</h2>
                   <Button onClick={saveSettings} disabled={isSyncing} className="flex items-center gap-2"><Save size={16} /> {isSyncing ? 'Saving...' : 'Save Changes'}</Button>
                </div>

                <div className="flex border-b bg-gray-50 px-6">
                   {['hero', 'features', 'testimonials', 'cta'].map(tab => (
                     <button 
                       key={tab}
                       onClick={() => setActiveSettingsTab(tab as any)} 
                       className={`px-4 py-3 text-sm font-bold border-b-2 capitalize flex items-center gap-2 transition-colors ${activeSettingsTab === tab ? 'border-primary text-primary' : 'border-transparent text-gray-500'}`}
                     >
                       {tab}
                     </button>
                   ))}
                </div>

                <div className="p-6 space-y-6">
                   {activeSettingsTab === 'hero' && (
                     <div className="space-y-4">
                       <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><LayoutDashboard size={18}/> Hero Section</h3>
                       <div className="grid md:grid-cols-3 gap-4 mb-4">
                          <div><label className="text-xs font-bold text-gray-500 uppercase">Prefix</label><input className="w-full border rounded-lg p-2 mt-1" value={settingsForm.hero.titlePrefix} onChange={e => handleSettingsChange('hero', 'titlePrefix', e.target.value)} /></div>
                          <div><label className="text-xs font-bold text-gray-500 uppercase">Highlight</label><input className="w-full border rounded-lg p-2 mt-1 text-primary font-bold" value={settingsForm.hero.titleHighlight} onChange={e => handleSettingsChange('hero', 'titleHighlight', e.target.value)} /></div>
                          <div><label className="text-xs font-bold text-gray-500 uppercase">Suffix</label><input className="w-full border rounded-lg p-2 mt-1" value={settingsForm.hero.titleSuffix} onChange={e => handleSettingsChange('hero', 'titleSuffix', e.target.value)} /></div>
                       </div>
                       <div className="mb-4"><label className="text-xs font-bold text-gray-500 uppercase">Subtitle</label><textarea className="w-full border rounded-lg p-2 mt-1" rows={2} value={settingsForm.hero.subtitle} onChange={e => handleSettingsChange('hero', 'subtitle', e.target.value)} /></div>
                       <div><label className="text-xs font-bold text-gray-500 uppercase">Hero Image URL</label><input className="w-full border rounded-lg p-2 mt-1" value={settingsForm.hero.heroImage} onChange={e => handleSettingsChange('hero', 'heroImage', e.target.value)} /></div>
                       
                       <div className="grid md:grid-cols-2 gap-4">
                           <div><label className="text-xs font-bold text-gray-500 uppercase">Button 1 Text</label><input className="w-full border rounded-lg p-2 mt-1" value={settingsForm.hero.btnPrimary} onChange={e => handleSettingsChange('hero', 'btnPrimary', e.target.value)} /></div>
                           <div><label className="text-xs font-bold text-gray-500 uppercase">Button 2 Text</label><input className="w-full border rounded-lg p-2 mt-1" value={settingsForm.hero.btnSecondary} onChange={e => handleSettingsChange('hero', 'btnSecondary', e.target.value)} /></div>
                       </div>
                     </div>
                   )}

                   {activeSettingsTab === 'features' && (
                     <div className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-4">
                           <div><label className="text-xs font-bold text-gray-500 uppercase">Section Title</label><input className="w-full border rounded-lg p-2 mt-1" value={settingsForm.features.title} onChange={e => handleSettingsChange('features', 'title', e.target.value)} /></div>
                           <div><label className="text-xs font-bold text-gray-500 uppercase">Subtitle</label><input className="w-full border rounded-lg p-2 mt-1" value={settingsForm.features.subtitle} onChange={e => handleSettingsChange('features', 'subtitle', e.target.value)} /></div>
                        </div>

                        <div className="pt-4 border-t">
                           <h4 className="font-bold text-gray-900 mb-2">Feature Items</h4>
                           <p className="text-xs text-gray-500 mb-4">Icons: Zap, Shield, Wifi, CreditCard, Star, Check, Box, Truck</p>
                           
                           <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-4">
                              <div className="grid md:grid-cols-3 gap-3 mb-2">
                                 <input className="border rounded-lg p-2 text-sm" placeholder="Icon Name" value={tempFeature.icon} onChange={e => setTempFeature({...tempFeature, icon: e.target.value})} />
                                 <input className="border rounded-lg p-2 text-sm md:col-span-2" placeholder="Title" value={tempFeature.title} onChange={e => setTempFeature({...tempFeature, title: e.target.value})} />
                              </div>
                              <textarea className="w-full border rounded-lg p-2 text-sm h-16" placeholder="Description" value={tempFeature.description} onChange={e => setTempFeature({...tempFeature, description: e.target.value})} />
                              <Button onClick={addFeature} className="mt-2 py-1 px-3 text-xs w-full">Add Feature</Button>
                           </div>

                           <div className="space-y-3">
                              {settingsForm.features.items?.map((item, idx) => (
                                 <div key={idx} className="flex gap-4 p-3 border rounded-lg items-start bg-white shadow-sm">
                                    <div className="p-2 bg-gray-100 rounded-lg text-xs font-bold text-gray-600">{item.icon}</div>
                                    <div className="flex-1">
                                       <h5 className="font-bold text-gray-900 text-sm">{item.title}</h5>
                                       <p className="text-xs text-gray-500">{item.description}</p>
                                    </div>
                                    <button onClick={() => removeFeature(idx)} className="text-red-500 p-1 hover:bg-red-50 rounded"><Trash2 size={14}/></button>
                                 </div>
                              ))}
                           </div>
                        </div>
                     </div>
                   )}

                   {activeSettingsTab === 'testimonials' && (
                     <div className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-4">
                           <div><label className="text-xs font-bold text-gray-500 uppercase">Section Title</label><input className="w-full border rounded-lg p-2 mt-1" value={settingsForm.testimonials.title} onChange={e => handleSettingsChange('testimonials', 'title', e.target.value)} /></div>
                           <div><label className="text-xs font-bold text-gray-500 uppercase">Subtitle</label><input className="w-full border rounded-lg p-2 mt-1" value={settingsForm.testimonials.subtitle} onChange={e => handleSettingsChange('testimonials', 'subtitle', e.target.value)} /></div>
                        </div>

                        <div className="pt-4 border-t">
                           <h4 className="font-bold text-gray-900 mb-2">Testimonials</h4>
                           
                           <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-4">
                              <div className="grid md:grid-cols-2 gap-3 mb-2">
                                 <input className="border rounded-lg p-2 text-sm" placeholder="Customer Name" value={tempTestimonial.name} onChange={e => setTempTestimonial({...tempTestimonial, name: e.target.value})} />
                                 <input className="border rounded-lg p-2 text-sm" placeholder="Role (e.g. Gamer)" value={tempTestimonial.role} onChange={e => setTempTestimonial({...tempTestimonial, role: e.target.value})} />
                              </div>
                              <textarea className="w-full border rounded-lg p-2 text-sm h-16" placeholder="Quote" value={tempTestimonial.quote} onChange={e => setTempTestimonial({...tempTestimonial, quote: e.target.value})} />
                              <Button onClick={addTestimonial} className="mt-2 py-1 px-3 text-xs w-full">Add Testimonial</Button>
                           </div>

                           <div className="space-y-3">
                              {settingsForm.testimonials.items?.map((item, idx) => (
                                 <div key={idx} className="flex gap-4 p-3 border rounded-lg items-start bg-white shadow-sm">
                                    <div className="flex-1">
                                       <div className="flex justify-between items-center mb-1">
                                          <h5 className="font-bold text-gray-900 text-sm">{item.name}</h5>
                                          <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded text-gray-500">{item.role}</span>
                                       </div>
                                       <p className="text-xs text-gray-500 italic">"{item.quote}"</p>
                                    </div>
                                    <button onClick={() => removeTestimonial(idx)} className="text-red-500 p-1 hover:bg-red-50 rounded"><Trash2 size={14}/></button>
                                 </div>
                              ))}
                           </div>
                        </div>
                     </div>
                   )}
                   
                   {activeSettingsTab === 'cta' && (
                     <div className="space-y-4">
                       <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><MousePointer size={18}/> Call to Action Strip</h3>
                       <div className="mb-4"><label className="text-xs font-bold text-gray-500 uppercase">Title</label><input className="w-full border rounded-lg p-2 mt-1" value={settingsForm.cta.title} onChange={e => handleSettingsChange('cta', 'title', e.target.value)} /></div>
                       <div className="mb-4"><label className="text-xs font-bold text-gray-500 uppercase">Subtitle</label><textarea className="w-full border rounded-lg p-2 mt-1" rows={2} value={settingsForm.cta.subtitle} onChange={e => handleSettingsChange('cta', 'subtitle', e.target.value)} /></div>
                       <div><label className="text-xs font-bold text-gray-500 uppercase">Button Text</label><input className="w-full border rounded-lg p-2 mt-1" value={settingsForm.cta.btnText} onChange={e => handleSettingsChange('cta', 'btnText', e.target.value)} /></div>
                     </div>
                   )}
                </div>
             </div>
          </div>
        );

      default:
        return <div>Module not found.</div>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800">
      {/* Sidebar - Same as before */}
      <div className="w-64 bg-white border-r border-gray-200 flex-shrink-0 flex flex-col hidden md:flex">
        <div className="p-6 flex items-center gap-2 text-primary font-black text-xl tracking-tighter">
          <Wifi size={24} /> DITO Admin
        </div>
        <nav className="flex-1 overflow-y-auto px-4 space-y-1 pb-4">
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={() => setActiveTab(item.label)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                activeTab === item.label
                  ? 'bg-red-50 text-primary shadow-sm ring-1 ring-red-100'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon size={18} className={activeTab === item.label ? 'text-primary' : 'text-gray-400'} />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-100">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-all">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header - Same as before */}
        <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center md:hidden">
          <div className="flex items-center gap-2 text-primary font-black text-lg">
             <Wifi size={20} /> DITO Admin
          </div>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 bg-gray-100 rounded-lg">
             {isMobileMenuOpen ? <X size={20}/> : <Menu size={20}/>}
          </button>
        </header>

        {isMobileMenuOpen && (
           <div className="md:hidden bg-white border-b border-gray-200 p-4 absolute top-16 left-0 w-full z-50 shadow-xl">
              <nav className="space-y-1">
                {menuItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => { setActiveTab(item.label); setIsMobileMenuOpen(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl ${
                      activeTab === item.label ? 'bg-red-50 text-primary' : 'text-gray-500'
                    }`}
                  >
                    <item.icon size={18} /> {item.label}
                  </button>
                ))}
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600">
                   <LogOut size={18} /> Logout
                </button>
              </nav>
           </div>
        )}

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
             {renderContent()}
          </div>
        </main>
      </div>

      {/* --- MODALS --- */}
      {/* Existing Modals for Product, Affiliate, SEO, AI, Orders, Customers */}
      {/* Product Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                 <h3 className="font-bold text-xl text-gray-900">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                 <button onClick={() => setIsProductModalOpen(false)}><X size={24} className="text-gray-400 hover:text-gray-600"/></button>
              </div>
              <div className="p-6">
                 {/* ... Product Form Content ... */}
                 <div className="flex gap-4 border-b mb-6">
                    {['general', 'inventory', 'images', 'advanced'].map(tab => (
                       <button 
                         key={tab} 
                         onClick={() => setActiveProductTab(tab as any)}
                         className={`pb-2 px-4 text-sm font-bold capitalize border-b-2 transition-colors ${activeProductTab === tab ? 'border-primary text-primary' : 'border-transparent text-gray-400'}`}
                       >
                         {tab}
                       </button>
                    ))}
                 </div>
                 {/* ... (Existing Product Modal Tabs content) ... */}
                 {activeProductTab === 'general' && (
                    <div className="grid md:grid-cols-2 gap-6">
                       <div className="md:col-span-2"><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Product Name</label><input className="w-full border rounded-lg p-3" value={newProductForm.name} onChange={e => setNewProductForm({...newProductForm, name: e.target.value})} /></div>
                       <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Category</label>
                          <select className="w-full border rounded-lg p-3" value={newProductForm.category} onChange={e => setNewProductForm({...newProductForm, category: e.target.value})}>
                             <option>Modems</option><option>Pocket WiFi</option><option>SIM Cards</option><option>Accessories</option>
                          </select>
                       </div>
                       <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Price (₱)</label><input type="number" className="w-full border rounded-lg p-3" value={newProductForm.price} onChange={e => setNewProductForm({...newProductForm, price: Number(e.target.value)})} /></div>
                       <div className="md:col-span-2"><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Subtitle</label><input className="w-full border rounded-lg p-3" value={newProductForm.subtitle} onChange={e => setNewProductForm({...newProductForm, subtitle: e.target.value})} /></div>
                       <div className="md:col-span-2"><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label><textarea className="w-full border rounded-lg p-3 h-32" value={newProductForm.description} onChange={e => setNewProductForm({...newProductForm, description: e.target.value})} /></div>
                    </div>
                 )}
                 {activeProductTab === 'inventory' && (
                    <div className="space-y-6">
                       <div className="grid md:grid-cols-3 gap-6">
                          <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">SKU</label><input className="w-full border rounded-lg p-3" value={newProductForm.sku} onChange={e => setNewProductForm({...newProductForm, sku: e.target.value})} /></div>
                          <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Stock Level</label><input type="number" className="w-full border rounded-lg p-3" value={newProductForm.stock} onChange={e => setNewProductForm({...newProductForm, stock: Number(e.target.value)})} /></div>
                          <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Min. Stock Alert</label><input type="number" className="w-full border rounded-lg p-3" value={newProductForm.minStockLevel} onChange={e => setNewProductForm({...newProductForm, minStockLevel: Number(e.target.value)})} /></div>
                       </div>
                       <div className="pt-6 border-t">
                          <h4 className="font-bold text-gray-900 mb-4">Bulk Discounts</h4>
                          <div className="flex gap-2 mb-4 items-end">
                             <div><label className="text-xs">Min Qty</label><input type="number" className="border rounded p-2 w-24" value={bulkDiscountInput.minQty} onChange={e => setBulkDiscountInput({...bulkDiscountInput, minQty: Number(e.target.value)})} /></div>
                             <div><label className="text-xs">Discount %</label><input type="number" className="border rounded p-2 w-24" value={bulkDiscountInput.percentage} onChange={e => setBulkDiscountInput({...bulkDiscountInput, percentage: Number(e.target.value)})} /></div>
                             <Button onClick={addBulkDiscount} className="py-2 text-sm">Add</Button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                             {newProductForm.bulkDiscounts?.map((d, i) => (
                                <div key={i} className="bg-green-50 text-green-700 px-3 py-1 rounded-lg border border-green-200 text-sm flex items-center gap-2">
                                   Buy {d.minQty}+ Get {d.percentage}% Off <button onClick={() => removeBulkDiscount(i)} className="hover:text-red-500"><X size={14}/></button>
                                </div>
                             ))}
                          </div>
                       </div>
                    </div>
                 )}
                 {activeProductTab === 'images' && (
                    <div className="space-y-6">
                       <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Main Image URL</label><input className="w-full border rounded-lg p-3" value={newProductForm.image} onChange={e => setNewProductForm({...newProductForm, image: e.target.value})} /></div>
                       {newProductForm.image && <img src={newProductForm.image} className="w-32 h-32 object-contain border rounded-lg p-2 bg-gray-50" />}
                       <div className="pt-6 border-t">
                          <h4 className="font-bold text-gray-900 mb-4">Gallery Images</h4>
                          <div className="flex gap-2 mb-4">
                             <input className="flex-1 border rounded-lg p-2" placeholder="Image URL" value={galleryInput} onChange={e => setGalleryInput(e.target.value)} />
                             <Button onClick={addGalleryImage} className="py-2 text-sm">Add</Button>
                          </div>
                          <div className="grid grid-cols-4 gap-4">
                             {newProductForm.gallery?.map((img, i) => (
                                <div key={i} className="relative group border rounded-lg p-2 bg-gray-50 h-24">
                                   <img src={img} className="w-full h-full object-contain" />
                                   <button onClick={() => removeGalleryImage(i)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><X size={12}/></button>
                                </div>
                             ))}
                          </div>
                       </div>
                    </div>
                 )}
                 {activeProductTab === 'advanced' && (
                    <div className="space-y-6">
                       <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Cost Price (For Profit Calc)</label><input type="number" className="w-full border rounded-lg p-3" value={newProductForm.costPrice} onChange={e => setNewProductForm({...newProductForm, costPrice: Number(e.target.value)})} /></div>
                       <div className="pt-6 border-t">
                          <h4 className="font-bold text-gray-900 mb-4">Specifications</h4>
                          <div className="flex gap-2 mb-4">
                             <input className="flex-1 border rounded-lg p-2" placeholder="Spec Name (e.g. Battery)" value={specInput.key} onChange={e => setSpecInput({...specInput, key: e.target.value})} />
                             <input className="flex-1 border rounded-lg p-2" placeholder="Value (e.g. 5000mAh)" value={specInput.value} onChange={e => setSpecInput({...specInput, value: e.target.value})} />
                             <Button onClick={addSpec} className="py-2 text-sm">Add</Button>
                          </div>
                          <div className="space-y-2">
                             {Object.entries(newProductForm.specs || {}).map(([k, v]) => (
                                <div key={k} className="flex justify-between p-2 bg-gray-50 rounded text-sm">
                                   <span className="font-bold">{k}:</span> <span>{v}</span> <button onClick={() => removeSpec(k)} className="text-red-500"><X size={14}/></button>
                                </div>
                             ))}
                          </div>
                       </div>
                       <div className="pt-6 border-t">
                          <h4 className="font-bold text-gray-900 mb-4">Inclusions (Box Contents)</h4>
                          <div className="flex gap-2 mb-4">
                             <input className="flex-1 border rounded-lg p-2" placeholder="Item Name" value={inclusionInput} onChange={e => setInclusionInput(e.target.value)} />
                             <Button onClick={addInclusion} className="py-2 text-sm">Add</Button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                             {newProductForm.inclusions?.map((inc, i) => (
                                <div key={i} className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                                   {inc} <button onClick={() => removeInclusion(i)} className="hover:text-red-500"><X size={14}/></button>
                                </div>
                             ))}
                          </div>
                       </div>
                    </div>
                 )}
              </div>
              <div className="p-6 border-t bg-gray-50 flex justify-end gap-3 sticky bottom-0">
                 <Button variant="ghost" onClick={() => setIsProductModalOpen(false)}>Cancel</Button>
                 <Button onClick={saveProduct} disabled={isSyncing}>{isSyncing ? 'Saving...' : 'Save Product'}</Button>
              </div>
           </div>
        </div>
      )}

      {/* Affiliate Edit Modal */}
      {isAffiliateModalOpen && editingAffiliate && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           {/* ... Affiliate Edit Content ... */}
           <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl">
              <h3 className="font-bold text-xl mb-4">Edit Affiliate: {editingAffiliate.name}</h3>
              <div className="mb-4">
                 <div className="flex border-b mb-4">
                    <button onClick={() => setActiveAffiliateTab('wallet')} className={`px-4 py-2 border-b-2 font-bold ${activeAffiliateTab === 'wallet' ? 'border-primary text-primary' : 'border-transparent text-gray-400'}`}>Wallet & Status</button>
                    <button onClick={() => setActiveAffiliateTab('profile')} className={`px-4 py-2 border-b-2 font-bold ${activeAffiliateTab === 'profile' ? 'border-primary text-primary' : 'border-transparent text-gray-400'}`}>Profile Details</button>
                 </div>
                 {activeAffiliateTab === 'wallet' && (
                    <div className="space-y-4">
                       <div className="p-4 bg-gray-50 rounded-xl">
                          <p className="text-sm font-bold text-gray-500">Current Wallet Balance</p>
                          <p className="text-2xl font-black text-gray-900">₱{editingAffiliate.walletBalance.toLocaleString()}</p>
                       </div>
                       <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Adjust Wallet (+/- Amount)</label>
                          <input type="number" className="w-full border rounded-lg p-2" value={walletAdjustment} onChange={e => setWalletAdjustment(Number(e.target.value))} />
                          <p className="text-xs text-gray-400 mt-1">Use negative values to deduct.</p>
                       </div>
                       <div className="flex items-center justify-between p-4 border rounded-xl">
                          <span className="font-bold">Account Status</span>
                          <button 
                             onClick={() => toggleAffiliateStatus(editingAffiliate.id, editingAffiliate.status || 'active')}
                             className={`px-3 py-1 rounded-full text-xs font-bold ${editingAffiliate.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                          >
                             {editingAffiliate.status === 'active' ? 'Active' : 'Banned'}
                          </button>
                       </div>
                    </div>
                 )}
                 {activeAffiliateTab === 'profile' && (
                    <div className="space-y-4 max-h-80 overflow-y-auto">
                        <div className="grid grid-cols-2 gap-4">
                           <div><label className="text-xs font-bold">First Name</label><input className="w-full border rounded p-2" value={editingAffiliate.firstName} onChange={e => setEditingAffiliate({...editingAffiliate, firstName: e.target.value})} /></div>
                           <div><label className="text-xs font-bold">Last Name</label><input className="w-full border rounded p-2" value={editingAffiliate.lastName} onChange={e => setEditingAffiliate({...editingAffiliate, lastName: e.target.value})} /></div>
                           <div className="col-span-2"><label className="text-xs font-bold">Email</label><input className="w-full border rounded p-2" value={editingAffiliate.email} onChange={e => setEditingAffiliate({...editingAffiliate, email: e.target.value})} /></div>
                           <div className="col-span-2"><label className="text-xs font-bold">Mobile</label><input className="w-full border rounded p-2" value={editingAffiliate.mobile} onChange={e => setEditingAffiliate({...editingAffiliate, mobile: e.target.value})} /></div>
                        </div>
                    </div>
                 )}
              </div>
              <div className="flex justify-end gap-2">
                 <Button variant="ghost" onClick={() => setIsAffiliateModalOpen(false)}>Cancel</Button>
                 <Button onClick={saveAffiliate}>Save Changes</Button>
              </div>
           </div>
        </div>
      )}

      {/* SEO Modal */}
      {isSeoModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           {/* ... SEO Modal Content ... */}
           <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl">
              <h3 className="font-bold text-xl mb-4">Edit Product SEO</h3>
              <div className="space-y-4">
                 <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Meta Title</label><input className="w-full border rounded-lg p-2" value={seoForm.metaTitle} onChange={e => setSeoForm({...seoForm, metaTitle: e.target.value})} /></div>
                 <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Meta Description</label><textarea className="w-full border rounded-lg p-2 h-24" value={seoForm.metaDescription} onChange={e => setSeoForm({...seoForm, metaDescription: e.target.value})} /></div>
                 <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">OG Image URL</label><input className="w-full border rounded-lg p-2" value={seoForm.ogImage} onChange={e => setSeoForm({...seoForm, ogImage: e.target.value})} /></div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                 <Button variant="ghost" onClick={() => setIsSeoModalOpen(false)}>Cancel</Button>
                 <Button onClick={saveProductSeo}>Save SEO</Button>
              </div>
           </div>
        </div>
      )}

      {/* Bot Brain/Keyword/Preset Modals (Simple structure repeated) */}
      {isBrainModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl">
             <h3 className="font-bold text-lg mb-4">{editingBrainEntry ? 'Edit Brain Entry' : 'New Brain Entry'}</h3>
             <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Topic / User Intent</label>
                  <input className="w-full border rounded-lg p-2" value={brainForm.topic || ''} onChange={e => setBrainForm({...brainForm, topic: e.target.value})} placeholder="e.g., Return Policy" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Bot Response</label>
                  <textarea className="w-full border rounded-lg p-2 h-32" value={brainForm.response || ''} onChange={e => setBrainForm({...brainForm, response: e.target.value})} placeholder="Full detail response..." />
                </div>
             </div>
             <div className="flex justify-end gap-2 mt-6">
                <Button variant="ghost" onClick={() => setIsBrainModalOpen(false)}>Cancel</Button>
                <Button onClick={saveBrainEntry}>Save</Button>
             </div>
          </div>
        </div>
      )}
      {/* (Other AI modals follow same pattern - omitting for brevity as they were unchanged from previous full implementation) */}
      {/* Bot Keyword Modal */}
      {isKeywordModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl">
             <h3 className="font-bold text-lg mb-4">{editingKeyword ? 'Edit Keywords' : 'New Keyword Trigger'}</h3>
             <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Keywords (Comma separated)</label>
                  <input className="w-full border rounded-lg p-2" value={keywordForm.keywords || ''} onChange={e => setKeywordForm({...keywordForm, keywords: e.target.value})} placeholder="hello, hi, hey" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Category</label>
                  <input className="w-full border rounded-lg p-2" value={keywordForm.category || ''} onChange={e => setKeywordForm({...keywordForm, category: e.target.value})} placeholder="e.g., Greetings" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Response</label>
                  <textarea className="w-full border rounded-lg p-2 h-24" value={keywordForm.response || ''} onChange={e => setKeywordForm({...keywordForm, response: e.target.value})} />
                </div>
             </div>
             <div className="flex justify-end gap-2 mt-6">
                <Button variant="ghost" onClick={() => setIsKeywordModalOpen(false)}>Cancel</Button>
                <Button onClick={saveKeyword}>Save</Button>
             </div>
          </div>
        </div>
      )}

      {/* Bot Preset Modal */}
      {isPresetModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl">
             <h3 className="font-bold text-lg mb-4">{editingPreset ? 'Edit Preset' : 'New Preset'}</h3>
             <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Button Question</label>
                  <input className="w-full border rounded-lg p-2" value={presetForm.question || ''} onChange={e => setPresetForm({...presetForm, question: e.target.value})} placeholder="e.g., How much is it?" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Bot Response</label>
                  <textarea className="w-full border rounded-lg p-2 h-24" value={presetForm.response || ''} onChange={e => setPresetForm({...presetForm, response: e.target.value})} placeholder="The price is..." />
                </div>
             </div>
             <div className="flex justify-end gap-2 mt-6">
                <Button variant="ghost" onClick={() => setIsPresetModalOpen(false)}>Cancel</Button>
                <Button onClick={savePreset}>Save</Button>
             </div>
          </div>
        </div>
      )}

      {/* Order View Modal - (Existing) */}
      {viewingOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           {/* ... Order Detail Content ... */}
           <div className="bg-white rounded-2xl w-full max-w-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="font-bold text-xl">Order #{viewingOrder.id}</h3>
                 <button onClick={() => setViewingOrder(null)}><X size={24}/></button>
              </div>
              <div className="space-y-6">
                 <div className="grid grid-cols-2 gap-4 text-sm bg-gray-50 p-4 rounded-xl">
                    <div><p className="font-bold text-gray-500">Date</p><p>{new Date(viewingOrder.date).toLocaleDateString()}</p></div>
                    <div><p className="font-bold text-gray-500">Status</p><Badge color={viewingOrder.status === 'Delivered' ? 'green' : 'blue'}>{viewingOrder.status}</Badge></div>
                    <div><p className="font-bold text-gray-500">Payment</p><p>{viewingOrder.paymentMethod}</p></div>
                    <div><p className="font-bold text-gray-500">Total</p><p className="font-bold text-lg text-primary">₱{viewingOrder.total.toLocaleString()}</p></div>
                 </div>
                 {/* Order Items */}
                 <div>
                    <h4 className="font-bold mb-2">Items</h4>
                    <div className="border rounded-xl overflow-hidden">
                       {viewingOrder.orderItems?.map((item, i) => (
                          <div key={i} className="flex justify-between p-3 border-b last:border-0 hover:bg-gray-50">
                             <span>{item.quantity}x {item.name}</span>
                             <span>₱{(item.price * item.quantity).toLocaleString()}</span>
                          </div>
                       ))}
                       {!viewingOrder.orderItems && <div className="p-3">Item details not available for legacy orders.</div>}
                    </div>
                 </div>
                 {/* Shipping Details */}
                 <div>
                    <h4 className="font-bold mb-2">Shipping Address</h4>
                    <div className="p-4 border rounded-xl bg-gray-50 text-sm">
                       <p className="font-bold">{viewingOrder.shippingDetails?.firstName} {viewingOrder.shippingDetails?.lastName}</p>
                       <p>{viewingOrder.shippingDetails?.street}</p>
                       <p>{viewingOrder.shippingDetails?.barangay}, {viewingOrder.shippingDetails?.city}</p>
                       <p>{viewingOrder.shippingDetails?.province} {viewingOrder.shippingDetails?.zipCode}</p>
                       <p className="mt-2 font-mono">{viewingOrder.shippingDetails?.mobile}</p>
                    </div>
                 </div>
                 {/* Proof of Payment */}
                 {viewingOrder.proofOfPayment && (
                    <div>
                       <h4 className="font-bold mb-2">Proof of Payment</h4>
                       <div className="border rounded-xl p-2 bg-gray-50">
                          <img src={viewingOrder.proofOfPayment} className="max-w-full h-auto rounded-lg max-h-64 object-contain mx-auto" />
                          <div className="text-center mt-2">
                             <a href={viewingOrder.proofOfPayment} target="_blank" className="text-sm text-blue-600 hover:underline">View Full Size</a>
                          </div>
                       </div>
                    </div>
                 )}
              </div>
           </div>
        </div>
      )}

      {/* Customer View Modal - (Existing) */}
      {viewingCustomer && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           {/* ... Customer Detail Content ... */}
           <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="font-bold text-xl">Customer Details</h3>
                 <button onClick={() => setViewingCustomer(null)}><X size={24}/></button>
              </div>
              <div className="space-y-4">
                 <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-2xl">
                       {viewingCustomer.name.charAt(0)}
                    </div>
                    <div>
                       <h4 className="font-bold text-lg">{viewingCustomer.name}</h4>
                       <p className="text-sm text-gray-500">@{viewingCustomer.username}</p>
                    </div>
                 </div>
                 <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="p-3 border rounded-lg">
                       <p className="text-xs text-gray-400 font-bold uppercase">Email</p>
                       <p>{viewingCustomer.email}</p>
                    </div>
                    <div className="p-3 border rounded-lg">
                       <p className="text-xs text-gray-400 font-bold uppercase">Phone</p>
                       <p>{viewingCustomer.mobile}</p>
                    </div>
                    <div className="col-span-2 p-3 border rounded-lg">
                       <p className="text-xs text-gray-400 font-bold uppercase">Joined</p>
                       <p>{new Date(viewingCustomer.joinDate || '').toLocaleDateString()}</p>
                    </div>
                 </div>
                 {viewingCustomer.shippingDetails && (
                    <div>
                       <h4 className="font-bold text-sm mb-2 mt-4">Default Shipping Address</h4>
                       <div className="p-3 bg-gray-50 border rounded-lg text-sm">
                          <p>{viewingCustomer.shippingDetails.street}</p>
                          <p>{viewingCustomer.shippingDetails.barangay}, {viewingCustomer.shippingDetails.city}</p>
                          <p>{viewingCustomer.shippingDetails.province} {viewingCustomer.shippingDetails.zipCode}</p>
                       </div>
                    </div>
                 )}
              </div>
           </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
