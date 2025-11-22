
import React, { useState, useContext, useEffect } from 'react';
import { 
  LayoutDashboard, Package, ShoppingBag, Users, Settings, 
  TrendingUp, AlertCircle, Search, Bell, Cloud,
  MoreHorizontal, ArrowUpRight, ArrowDownRight, Filter, LogOut, Menu, X, Plus, Trash2, Edit2, Save, Loader2, Briefcase, Ban, CheckCircle, RotateCcw, CreditCard, ExternalLink, Image as ImageIcon, DollarSign, XCircle, RefreshCw,
  Clock, MousePointer, Lock, Shield, Printer, Boxes, AlertTriangle, Percent, FileSpreadsheet, List, AlignLeft
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
    products, orders, customers, affiliates, stats, settings, paymentSettings, payouts,
    addProduct, updateProduct, deleteProduct,
    updateOrderStatus, deleteOrder,
    deleteCustomer, updateSettings, updatePaymentSettings, isSyncing, isLoading, isRefreshing, refreshData,
    updateAffiliate, updatePayoutStatus, forceInventorySync
  } = useContext(StoreContext);

  // Local state for Forms/Modals
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProductForm, setNewProductForm] = useState<Partial<Product>>({});
  
  // Spec Input State
  const [specInput, setSpecInput] = useState({ key: '', value: '' });

  // Affiliate Modals
  const [isAffiliateModalOpen, setIsAffiliateModalOpen] = useState(false);
  const [editingAffiliate, setEditingAffiliate] = useState<Affiliate | null>(null);
  const [walletAdjustment, setWalletAdjustment] = useState(0);

  // Local state for Settings Form
  const [settingsForm, setSettingsForm] = useState(settings);
  const [paymentSettingsForm, setPaymentSettingsForm] = useState(paymentSettings);

  useEffect(() => {
    setSettingsForm(settings);
  }, [settings]);

  useEffect(() => {
    setPaymentSettingsForm(paymentSettings);
  }, [paymentSettings]);

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

  // --- Waybill Printer ---
  const printWaybill = (order: Order) => {
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    if (!printWindow) return;

    const shipping = order.shippingDetails || {
      firstName: order.customer.split(' ')[0] || 'Customer',
      lastName: order.customer.split(' ').slice(1).join(' ') || '',
      mobile: 'N/A',
      street: 'No street provided',
      barangay: '',
      city: '',
      province: '',
      zipCode: ''
    };

    const fullAddress = [
        shipping.street,
        shipping.barangay,
        shipping.city,
        shipping.province,
        shipping.zipCode
    ].filter(Boolean).join(', ');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Waybill - ${order.id}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
          body { font-family: 'Inter', sans-serif; padding: 40px; color: #111; background: #fff; }
          .waybill { border: 2px solid #000; max-width: 800px; margin: 0 auto; }
          .header { background: #000; color: #fff; padding: 15px 20px; display: flex; justify-content: space-between; align-items: center; -webkit-print-color-adjust: exact; }
          .logo { font-weight: 900; font-size: 24px; letter-spacing: -1px; }
          .logo span { color: #C8102E; }
          .grid { display: flex; border-bottom: 2px solid #000; }
          .col { flex: 1; padding: 20px; border-right: 2px solid #000; }
          .col:last-child { border-right: none; }
          .label { font-size: 10px; font-weight: 700; color: #666; text-transform: uppercase; margin-bottom: 8px; }
          .value { font-size: 16px; font-weight: 700; line-height: 1.4; }
          .address { font-size: 14px; font-weight: 400; margin-top: 5px; color: #333; }
          .payment-section { padding: 20px; border-bottom: 2px solid #000; display: flex; justify-content: space-between; align-items: center; background: #f9fafb; -webkit-print-color-adjust: exact; }
          .amount-box { text-align: right; }
          .amount-label { font-size: 12px; font-weight: bold; color: #666; }
          .amount-value { font-size: 32px; font-weight: 900; color: #000; }
          .details-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; border-bottom: 2px solid #000; }
          .detail-box { padding: 15px; border-right: 1px solid #eee; }
          .detail-box:last-child { border-right: none; }
          .footer { padding: 30px; text-align: center; }
          .barcode { height: 50px; background: repeating-linear-gradient(to right, #000, #000 3px, #fff 3px, #fff 6px); width: 300px; margin: 0 auto 10px auto; -webkit-print-color-adjust: exact; }
          .id-text { font-family: monospace; letter-spacing: 5px; font-size: 14px; }
          
          @media print {
            body { padding: 0; }
            .waybill { border: 2px solid #000; margin: 0; width: 100%; max-width: 100%; }
            button { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="waybill">
          <div class="header">
            <div class="logo">DITO <span>Home</span></div>
            <div style="text-align: right;">
              <div style="font-size: 10px; opacity: 0.8;">ORDER DATE</div>
              <div style="font-weight: bold;">${new Date(order.date).toLocaleDateString()}</div>
            </div>
          </div>
          
          <div class="grid">
            <div class="col">
              <div class="label">Sender</div>
              <div class="value">DITO Home Store</div>
              <div class="address">
                Warehouse 42, Logistics Hub<br>
                Taguig City, Metro Manila<br>
                1630 Philippines
              </div>
            </div>
            <div class="col">
              <div class="label">Recipient</div>
              <div class="value">${shipping.firstName} ${shipping.lastName}</div>
              <div class="value" style="font-size: 14px; margin-top: 4px;">${shipping.mobile}</div>
              <div class="address">
                ${fullAddress || 'No Address Details'}
              </div>
            </div>
          </div>

          <div class="payment-section">
             <div>
               <div class="label">Payment Method</div>
               <div class="value" style="font-size: 20px;">${order.paymentMethod === 'COD' ? 'Cash On Delivery' : order.paymentMethod}</div>
             </div>
             <div class="amount-box">
               <div class="amount-label">AMOUNT TO COLLECT</div>
               <div class="amount-value">${order.paymentMethod === 'COD' ? '₱' + order.total.toLocaleString() : '₱0.00'}</div>
             </div>
          </div>

          <div class="details-grid">
            <div class="detail-box">
               <div class="label">Order ID</div>
               <div class="value">${order.id}</div>
            </div>
            <div class="detail-box">
               <div class="label">Items Count</div>
               <div class="value">${order.items} Item(s)</div>
            </div>
            <div class="detail-box">
               <div class="label">Declared Value</div>
               <div class="value">₱${order.total.toLocaleString()}</div>
            </div>
          </div>
          
          <!-- Items Table -->
          <div style="padding: 20px; border-bottom: 2px solid #000;">
             <div class="label" style="margin-bottom: 10px;">Detailed Order Items</div>
             <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
               <thead>
                 <tr style="border-bottom: 1px solid #000; background: #f9fafb;">
                   <th style="text-align: left; padding: 8px;">Product Name</th>
                   <th style="text-align: center; padding: 8px;">Qty</th>
                   <th style="text-align: right; padding: 8px;">Unit Price</th>
                   <th style="text-align: right; padding: 8px;">Subtotal</th>
                 </tr>
               </thead>
               <tbody>
                 ${order.orderItems && order.orderItems.length > 0 ? order.orderItems.map(item => `
                   <tr>
                     <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.name}</td>
                     <td style="text-align: center; padding: 8px; border-bottom: 1px solid #eee;">${item.quantity}</td>
                     <td style="text-align: right; padding: 8px; border-bottom: 1px solid #eee;">₱${item.price.toLocaleString()}</td>
                     <td style="text-align: right; padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">₱${(item.price * item.quantity).toLocaleString()}</td>
                   </tr>
                 `).join('') : `
                   <tr>
                     <td colspan="4" style="padding: 15px; text-align: center; color: #666;">
                       Detailed item list not available for this order.<br/>
                       <span style="font-size: 10px;">(Total Items Count: ${order.items})</span>
                     </td>
                   </tr>
                 `}
               </tbody>
             </table>
          </div>
          
          <div style="padding: 20px; border-bottom: 2px solid #000;">
             <div class="label">Instructions</div>
             <div class="address" style="font-style: italic;">
               Handle with care. Verify identity before release. Call customer before delivery.
             </div>
          </div>

          <div class="footer">
            <div class="barcode"></div>
            <div class="id-text">${order.id.replace('#','')}</div>
            <div style="margin-top: 20px; font-size: 10px; color: #666;">
               Generated via DITO Home Admin Portal
            </div>
          </div>
        </div>
        <script>
           window.onload = () => { setTimeout(() => window.print(), 500); }
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  // --- Render Logic ---

  // 1. Authentication Check
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

  // 2. Loading Check (Only show if authenticated)
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-primary mb-4" size={48} />
        <h2 className="text-xl font-bold text-gray-900">Loading Dashboard...</h2>
        <p className="text-gray-500">Fetching data from Google Sheets</p>
      </div>
    );
  }

  const pendingPayoutsCount = payouts.filter(p => p.status === 'Pending').length;

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard' },
    { icon: Package, label: 'Products' },
    { icon: Boxes, label: 'Inventory' },
    { icon: ShoppingBag, label: 'Orders' },
    { icon: CreditCard, label: 'Payment Gateway' },
    { icon: Briefcase, label: 'Affiliates' },
    { icon: DollarSign, label: 'Payouts' },
    { icon: Users, label: 'Customers' },
    { icon: Settings, label: 'Settings' },
  ];

  // --- Helper Functions ---

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setNewProductForm({
      ...product,
      description: product.description || '',
      subtitle: product.subtitle || '',
      // Ensure defaults for inventory fields
      bulkDiscounts: product.bulkDiscounts || [],
      // Initialize gallery: use existing gallery OR fallback to single image in array OR empty array with one empty string for UI
      gallery: (product.gallery && product.gallery.length > 0) ? product.gallery : (product.image ? [product.image] : []),
      specs: product.specs || {}
    });
    setSpecInput({ key: '', value: '' });
    setIsProductModalOpen(true);
  };

  const handleNewProduct = () => {
    setEditingProduct(null);
    setNewProductForm({
      id: `prod-${Date.now()}`,
      category: 'Modems',
      rating: 5,
      reviews: 0,
      gallery: [''], // Start with one empty input
      specs: {},
      features: [],
      commissionType: 'percentage',
      commissionValue: 5,
      sku: '', 
      stock: 0,
      minStockLevel: 10,
      bulkDiscounts: [],
      description: '',
      subtitle: ''
    });
    setSpecInput({ key: '', value: '' });
    setIsProductModalOpen(true);
  };

  const saveProduct = () => {
    if (!newProductForm.name || !newProductForm.price) return alert("Name and Price required");

    // Filter empty strings from gallery
    const cleanGallery = (newProductForm.gallery || []).filter(url => url && url.trim() !== '');
    
    // Determine main image: First item in gallery, or image field, or placeholder
    const mainImage = cleanGallery.length > 0 
      ? cleanGallery[0] 
      : (newProductForm.image || 'https://picsum.photos/200');

    const productToSave = {
      ...newProductForm,
      image: mainImage,
      gallery: cleanGallery.length > 0 ? cleanGallery : [mainImage],
      description: newProductForm.description || '',
      subtitle: newProductForm.subtitle || 'New Product',
      specs: newProductForm.specs || {}
    } as Product;

    if (editingProduct) {
      updateProduct(editingProduct.id, productToSave);
    } else {
      addProduct(productToSave);
    }
    setIsProductModalOpen(false);
  };
  
  const addDiscountTier = () => {
    const currentDiscounts = newProductForm.bulkDiscounts || [];
    setNewProductForm({
      ...newProductForm,
      bulkDiscounts: [...currentDiscounts, { minQty: 3, percentage: 5 }]
    });
  };

  const removeDiscountTier = (index: number) => {
    const currentDiscounts = [...(newProductForm.bulkDiscounts || [])];
    currentDiscounts.splice(index, 1);
    setNewProductForm({ ...newProductForm, bulkDiscounts: currentDiscounts });
  };

  const updateDiscountTier = (index: number, field: 'minQty' | 'percentage', value: number) => {
    const currentDiscounts = [...(newProductForm.bulkDiscounts || [])];
    currentDiscounts[index] = { ...currentDiscounts[index], [field]: value };
    setNewProductForm({ ...newProductForm, bulkDiscounts: currentDiscounts });
  };
  
  // Spec Helpers
  const handleAddSpec = () => {
    if (specInput.key && specInput.value) {
      setNewProductForm(prev => ({
        ...prev,
        specs: { ...prev.specs, [specInput.key]: specInput.value }
      }));
      setSpecInput({ key: '', value: '' });
    }
  };

  const handleRemoveSpec = (keyToRemove: string) => {
     const newSpecs = { ...newProductForm.specs };
     delete newSpecs[keyToRemove];
     setNewProductForm(prev => ({ ...prev, specs: newSpecs }));
  };

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

  const handlePaymentSettingsChange = (method: 'cod' | 'gcash' | 'bank', key: string, value: any) => {
    setPaymentSettingsForm(prev => ({
      ...prev,
      [method]: {
        ...prev[method],
        [key]: value
      }
    }));
  };
  
  const handleQRUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handlePaymentSettingsChange('gcash', 'qrImage', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveSettings = () => {
    updateSettings(settingsForm);
  };
  
  const savePaymentSettings = () => {
    updatePaymentSettings(paymentSettingsForm);
  };

  const handleStockChange = (id: string, change: number) => {
    const product = products.find(p => p.id === id);
    if (product) {
       const newStock = Math.max(0, (product.stock || 0) + change);
       updateProduct(id, { ...product, stock: newStock });
    }
  };

  // Calculations for new cards
  const totalClicks = affiliates.reduce((acc, a) => acc + (a.clicks || 0), 0);
  const totalPendingPayout = payouts.filter(p => p.status === 'Pending').reduce((acc, p) => acc + p.amount, 0);
  const totalPaidOut = payouts.filter(p => p.status === 'Approved').reduce((acc, p) => acc + p.amount, 0);

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
      label: 'Low Stock Items', 
      value: products.filter(p => (p.stock || 0) <= (p.minStockLevel || 10)).length.toString(), 
      trend: 'Needs Action', 
      trendUp: false, 
      icon: AlertCircle, 
      color: 'text-orange-600', 
      bg: 'bg-orange-50' 
    },
    // New Affiliate KPIs
    {
      label: 'Total Affiliates',
      value: affiliates.length.toString(),
      description: 'Registered Partners',
      icon: Briefcase,
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    },
    {
      label: 'Total Clicks',
      value: totalClicks.toLocaleString(),
      description: 'All-time link clicks',
      icon: MousePointer,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50'
    },
    {
      label: 'Pending Payout',
      value: `₱${totalPendingPayout.toLocaleString()}`,
      description: 'Waiting approval',
      icon: Clock,
      color: 'text-amber-600',
      bg: 'bg-amber-50'
    },
    {
      label: 'Total Paid Outs',
      value: `₱${totalPaidOut.toLocaleString()}`,
      description: 'Successfully processed',
      icon: CheckCircle,
      color: 'text-teal-600',
      bg: 'bg-teal-50'
    }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'Inventory':
        return (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <div>
                 <h2 className="text-lg font-bold text-gray-900">Inventory Management</h2>
                 <p className="text-sm text-gray-500">Track stock levels and SKUs.</p>
              </div>
              <div className="flex gap-2">
                <div className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg flex items-center gap-2">
                  <Cloud size={14} className="text-green-500"/> Auto-Sync Active
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 font-medium">
                  <tr>
                    <th className="p-4">Product</th>
                    <th className="p-4">SKU</th>
                    <th className="p-4">Stock</th>
                    <th className="p-4">Min Limit</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Quick Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map(p => {
                    const stock = p.stock || 0;
                    const minStock = p.minStockLevel || 10;
                    const isLowStock = stock <= minStock;
                    const isOutOfStock = stock === 0;

                    return (
                      <tr key={p.id} className="hover:bg-gray-50">
                        <td className="p-4 flex items-center gap-3">
                          <img src={p.image} alt="" className="w-10 h-10 rounded-lg bg-gray-100 object-contain" />
                          <div>
                            <p className="font-bold text-gray-900">{p.name}</p>
                            <p className="text-xs text-gray-500">Price: ₱{p.price.toLocaleString()}</p>
                          </div>
                        </td>
                        <td className="p-4 font-mono text-gray-600">{p.sku || '-'}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                             <span className="font-bold text-lg">{stock}</span>
                             {isLowStock && !isOutOfStock && <AlertTriangle size={16} className="text-orange-500" />}
                          </div>
                        </td>
                        <td className="p-4 text-gray-500 font-medium">{minStock}</td>
                        <td className="p-4">
                          {isOutOfStock ? (
                            <Badge color="red">Out of Stock</Badge>
                          ) : isLowStock ? (
                            <Badge color="yellow">Low Stock</Badge>
                          ) : (
                            <Badge color="green">In Stock</Badge>
                          )}
                        </td>
                        <td className="p-4 flex justify-end gap-2">
                          <button 
                            onClick={() => handleStockChange(p.id, -1)}
                            className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100"
                          >
                            <div className="w-3 h-0.5 bg-current"></div>
                          </button>
                          <button 
                             onClick={() => handleEditProduct(p)}
                             className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100"
                             title="Edit Details"
                          >
                             <Edit2 size={14} />
                          </button>
                          <button 
                            onClick={() => handleStockChange(p.id, 1)}
                            className="w-8 h-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center hover:bg-green-100"
                          >
                            <Plus size={16} />
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

      case 'Payouts':
        const totalPending = payouts.filter(p => p.status === 'Pending').reduce((acc, curr) => acc + curr.amount, 0);
        const totalPaid = payouts.filter(p => p.status === 'Approved').reduce((acc, curr) => acc + curr.amount, 0);

        return (
          <div className="space-y-6">
             {/* Payout Stats */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <p className="text-sm text-gray-500 font-medium">Pending Requests</p>
                  <h3 className="text-3xl font-black text-orange-500">{pendingPayoutsCount}</h3>
                  <p className="text-xs text-gray-400 mt-1">Needs approval</p>
               </div>
               <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <p className="text-sm text-gray-500 font-medium">Total Pending Amount</p>
                  <h3 className="text-3xl font-black text-gray-900">₱{totalPending.toLocaleString()}</h3>
                  <p className="text-xs text-gray-400 mt-1">To be disbursed</p>
               </div>
               <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <p className="text-sm text-gray-500 font-medium">Total Paid Out</p>
                  <h3 className="text-3xl font-black text-green-600">₱{totalPaid.toLocaleString()}</h3>
                  <p className="text-xs text-gray-400 mt-1">Lifetime approved payouts</p>
               </div>
             </div>

             <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Payout Requests</h2>
                  <p className="text-sm text-gray-500">Manage affiliate withdrawal requests.</p>
                </div>
                <Button 
                  onClick={() => refreshData()} 
                  variant="outline" 
                  className="text-xs py-2 px-3"
                  disabled={isRefreshing || isSyncing}
                >
                   <RefreshCw size={14} className={isRefreshing || isSyncing ? 'animate-spin' : ''} />
                </Button>
              </div>
              <div className="overflow-x-auto">
                 <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 font-medium">
                      <tr>
                        <th className="p-4">Date</th>
                        <th className="p-4">Affiliate</th>
                        <th className="p-4">Amount</th>
                        <th className="p-4">Method / Details</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                       {payouts.length === 0 ? (
                         <tr><td colSpan={6} className="p-8 text-center text-gray-400">No payout requests found.</td></tr>
                       ) : payouts.map(p => (
                          <tr key={p.id} className="hover:bg-gray-50">
                             <td className="p-4 text-gray-500 text-xs">{new Date(p.dateRequested).toLocaleDateString()}</td>
                             <td className="p-4">
                                <p className="font-bold text-gray-900">{p.affiliateName}</p>
                                <p className="text-[10px] text-gray-400 font-mono">ID: {p.affiliateId}</p>
                             </td>
                             <td className="p-4 font-bold text-primary">₱{p.amount.toLocaleString()}</td>
                             <td className="p-4 text-xs">
                                <p className="font-bold text-gray-700">{p.method}</p>
                                <p className="text-gray-500">{p.accountNumber} ({p.accountName})</p>
                             </td>
                             <td className="p-4">
                               <Badge color={p.status === 'Approved' ? 'green' : p.status === 'Rejected' ? 'red' : 'yellow'}>
                                 {p.status}
                               </Badge>
                             </td>
                             <td className="p-4 flex justify-end gap-2">
                                {p.status === 'Pending' && (
                                  <>
                                    <Button 
                                      onClick={() => updatePayoutStatus(p.id, 'Approved')} 
                                      className="bg-green-50 hover:bg-green-100 text-green-700 px-3 py-1 text-xs rounded-lg shadow-none"
                                    >
                                       Approve
                                    </Button>
                                    <Button 
                                      onClick={() => updatePayoutStatus(p.id, 'Rejected')} 
                                      className="bg-red-50 hover:bg-red-100 text-red-700 px-3 py-1 text-xs rounded-lg shadow-none"
                                    >
                                       Reject
                                    </Button>
                                  </>
                                )}
                                {p.status === 'Approved' && <span className="text-xs text-gray-400 flex items-center gap-1"><CheckCircle size={12}/> Processed</span>}
                                {p.status === 'Rejected' && <span className="text-xs text-gray-400 flex items-center gap-1"><RotateCcw size={12}/> Refunded</span>}
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
            </div>
          </div>
        );

      case 'Payment Gateway':
        return (
          <div className="max-w-4xl mx-auto space-y-8 pb-20">
             <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
               <div className="p-6 border-b border-gray-100">
                 <h2 className="text-lg font-bold text-gray-900">Payment Methods Configuration</h2>
                 <p className="text-sm text-gray-500">Configure how customers pay at checkout.</p>
               </div>

               <div className="divide-y divide-gray-100">
                  {/* COD Section */}
                  <div className="p-6">
                     <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                           <div className="p-3 bg-green-50 text-green-600 rounded-xl"><CreditCard size={24}/></div>
                           <div>
                              <h3 className="font-bold text-gray-900">Cash on Delivery (COD)</h3>
                              <p className="text-sm text-gray-500">Enable or disable cash payment upon delivery.</p>
                           </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer"
                            checked={paymentSettingsForm.cod.enabled}
                            onChange={e => handlePaymentSettingsChange('cod', 'enabled', e.target.checked)}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                     </div>
                  </div>

                  {/* GCash Section */}
                  <div className="p-6">
                     <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                           <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><CreditCard size={24}/></div>
                           <div>
                              <h3 className="font-bold text-gray-900">GCash Payment</h3>
                              <p className="text-sm text-gray-500">Accept payments via GCash QR or Transfer.</p>
                           </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer"
                            checked={paymentSettingsForm.gcash.enabled}
                            onChange={e => handlePaymentSettingsChange('gcash', 'enabled', e.target.checked)}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                     </div>
                     
                     {paymentSettingsForm.gcash.enabled && (
                        <div className="bg-gray-50 rounded-xl p-6 space-y-4 border border-gray-200 animate-fade-in">
                           <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Account Name</label>
                                <input 
                                   className="w-full border rounded-lg p-2 bg-white"
                                   value={paymentSettingsForm.gcash.accountName}
                                   onChange={e => handlePaymentSettingsChange('gcash', 'accountName', e.target.value)}
                                   placeholder="e.g. Juan Dela Cruz"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Account Number</label>
                                <input 
                                   className="w-full border rounded-lg p-2 bg-white"
                                   value={paymentSettingsForm.gcash.accountNumber}
                                   onChange={e => handlePaymentSettingsChange('gcash', 'accountNumber', e.target.value)}
                                   placeholder="0917 123 4567"
                                />
                              </div>
                           </div>
                           <div>
                              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">QR Code Image</label>
                              <div className="flex gap-4 items-start">
                                <div className="flex-1 space-y-2">
                                  <div className="relative">
                                    <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <input 
                                      className="w-full border rounded-lg p-2 pl-9 bg-white"
                                      value={paymentSettingsForm.gcash.qrImage}
                                      onChange={e => handlePaymentSettingsChange('gcash', 'qrImage', e.target.value)}
                                      placeholder="Paste Image URL here"
                                    />
                                  </div>
                                  <div className="text-xs text-gray-500 text-center">- OR -</div>
                                  <input 
                                    type="file"
                                    accept="image/*"
                                    onChange={handleQRUpload}
                                    className="block w-full text-sm text-gray-500
                                      file:mr-4 file:py-2 file:px-4
                                      file:rounded-full file:border-0
                                      file:text-xs file:font-semibold
                                      file:bg-blue-50 file:text-blue-700
                                      hover:file:bg-blue-100
                                    "
                                  />
                                </div>
                                {paymentSettingsForm.gcash.qrImage && (
                                   <div className="w-24 h-24 border rounded-lg p-1 bg-white shrink-0">
                                     <img src={paymentSettingsForm.gcash.qrImage} alt="Preview" className="w-full h-full object-contain" />
                                   </div>
                                )}
                              </div>
                           </div>
                        </div>
                     )}
                  </div>

                  {/* Bank Transfer Section */}
                  <div className="p-6">
                     <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                           <div className="p-3 bg-purple-50 text-purple-600 rounded-xl"><CreditCard size={24}/></div>
                           <div>
                              <h3 className="font-bold text-gray-900">Bank Transfer</h3>
                              <p className="text-sm text-gray-500">Direct bank deposit instructions.</p>
                           </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer"
                            checked={paymentSettingsForm.bank.enabled}
                            onChange={e => handlePaymentSettingsChange('bank', 'enabled', e.target.checked)}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                     </div>

                     {paymentSettingsForm.bank.enabled && (
                        <div className="bg-gray-50 rounded-xl p-6 space-y-4 border border-gray-200 animate-fade-in">
                           <div>
                             <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Bank Name</label>
                             <input 
                                className="w-full border rounded-lg p-2 bg-white"
                                value={paymentSettingsForm.bank.bankName}
                                onChange={e => handlePaymentSettingsChange('bank', 'bankName', e.target.value)}
                                placeholder="e.g. BDO / BPI / Metrobank"
                             />
                           </div>
                           <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Account Name</label>
                                <input 
                                   className="w-full border rounded-lg p-2 bg-white"
                                   value={paymentSettingsForm.bank.accountName}
                                   onChange={e => handlePaymentSettingsChange('bank', 'accountName', e.target.value)}
                                   placeholder="e.g. DITO Telecom Inc."
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Account Number</label>
                                <input 
                                   className="w-full border rounded-lg p-2 bg-white"
                                   value={paymentSettingsForm.bank.accountNumber}
                                   onChange={e => handlePaymentSettingsChange('bank', 'accountNumber', e.target.value)}
                                   placeholder="0000 1234 5678"
                                />
                              </div>
                           </div>
                        </div>
                     )}
                  </div>
               </div>
               
               <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end">
                  <Button 
                    onClick={savePaymentSettings} 
                    className="shadow-lg flex items-center gap-2"
                    disabled={isSyncing}
                  >
                    {isSyncing ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                    {isSyncing ? 'Saving...' : 'Save Payment Settings'}
                  </Button>
               </div>
             </div>
          </div>
        );

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
                    <th className="p-4">Payment</th>
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
                      <td className="p-4 text-xs">
                        <div className="font-bold">{order.paymentMethod || 'COD'}</div>
                        {order.proofOfPayment && (
                           <a href={order.proofOfPayment} target="_blank" rel="noreferrer" className="text-blue-600 underline hover:text-blue-800 mt-1 block">View Receipt</a>
                        )}
                      </td>
                      <td className="p-4 flex justify-end gap-2">
                        {/* Print Waybill Button */}
                        <button 
                          onClick={() => printWaybill(order)} 
                          className="p-2 hover:bg-gray-100 text-gray-600 rounded-lg"
                          title="Print Waybill"
                        >
                          <Printer size={16}/>
                        </button>
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
                    {'trend' in kpi ? (
                       <div className={`flex items-center gap-1 mt-2 text-xs font-bold ${kpi.trendUp ? 'text-green-600' : 'text-red-500'}`}>
                         {kpi.trendUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                         {kpi.trend}
                       </div>
                    ) : (
                       <p className="text-xs text-gray-400 mt-2 font-medium">{(kpi as any).description}</p>
                    )}
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
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                activeTab === item.label 
                  ? 'bg-primary text-white shadow-lg shadow-red-500/20' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3 flex-1">
                <item.icon size={18} />
                {item.label}
              </div>
              {item.label === 'Payouts' && pendingPayoutsCount > 0 && (
                 <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-sm ring-1 ring-white/20">{pendingPayoutsCount}</span>
              )}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t space-y-1">
           <Link to="/" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors text-sm font-medium">
             <LogOut size={18} /> Exit to Store
           </Link>
            <button 
             onClick={handleLogout}
             className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors text-sm font-medium"
           >
             <Lock size={18} /> Logout
           </button>
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
              className={`w-full flex items-center justify-between px-4 py-4 rounded-xl text-lg font-medium ${
                activeTab === item.label ? 'bg-primary text-white' : 'text-gray-600'
              }`}
            >
              <div className="flex items-center gap-3">
                 <item.icon size={20} />
                 {item.label}
              </div>
              {item.label === 'Payouts' && pendingPayoutsCount > 0 && (
                 <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">{pendingPayoutsCount}</span>
              )}
            </button>
          ))}
           <div className="border-t pt-4 mt-4">
             <button 
               onClick={handleLogout}
               className="w-full flex items-center gap-3 px-4 py-4 text-red-600 rounded-xl text-lg font-medium"
             >
               <Lock size={20} /> Logout
             </button>
           </div>
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
              
              {/* Refresh Button */}
              <button 
                onClick={() => refreshData()} 
                disabled={isSyncing || isRefreshing}
                className="p-2 bg-white border rounded-full text-gray-500 hover:bg-gray-50 hover:text-primary disabled:opacity-50 transition-all"
                title="Refresh Data"
              >
                 <RefreshCw size={20} className={isSyncing || isRefreshing ? 'animate-spin' : ''} />
              </button>

              <button className="p-2 bg-white border rounded-full text-gray-500 relative">
                 <Bell size={20} />
                 {pendingPayoutsCount > 0 && <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-primary rounded-full border-2 border-white"></span>}
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
                   
                   <div>
                      <label className="text-xs font-bold text-gray-500 uppercase">Subtitle</label>
                      <input 
                        className="w-full border rounded-lg p-2 mt-1" 
                        value={newProductForm.subtitle || ''} 
                        onChange={e => setNewProductForm({...newProductForm, subtitle: e.target.value})}
                        placeholder="e.g. Limited Edition"
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

                   {/* Description Field */}
                   <div>
                      <label className="text-xs font-bold text-gray-500 uppercase">Description</label>
                      <textarea
                        className="w-full border rounded-lg p-2 mt-1 min-h-[100px] text-sm"
                        value={newProductForm.description || ''}
                        onChange={e => setNewProductForm({...newProductForm, description: e.target.value})}
                        placeholder="Enter detailed product description..."
                      />
                   </div>
                   
                   {/* Dynamic Image Gallery Inputs */}
                   <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">Product Images</label>
                        <button 
                          type="button"
                          onClick={() => setNewProductForm({
                            ...newProductForm, 
                            gallery: [...(newProductForm.gallery || []), '']
                          })}
                          className="text-xs text-primary font-bold flex items-center gap-1 hover:underline"
                        >
                          <Plus size={14} /> Add URL
                        </button>
                      </div>
                      <div className="space-y-2">
                        {(newProductForm.gallery && newProductForm.gallery.length > 0 ? newProductForm.gallery : ['']).map((url, idx) => (
                          <div key={idx} className="flex gap-2 items-center">
                             <span className="text-xs text-gray-400 w-4">{idx + 1}.</span>
                             <input 
                               className="w-full border rounded-lg p-2 text-sm" 
                               value={url} 
                               onChange={e => {
                                 const newGallery = [...(newProductForm.gallery || [''])];
                                 newGallery[idx] = e.target.value;
                                 setNewProductForm({...newProductForm, gallery: newGallery});
                               }}
                               placeholder="https://example.com/image.jpg"
                             />
                             <button 
                               onClick={() => {
                                 const newGallery = [...(newProductForm.gallery || [])];
                                 newGallery.splice(idx, 1);
                                 setNewProductForm({...newProductForm, gallery: newGallery});
                               }}
                               className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                               disabled={(newProductForm.gallery || []).length <= 1 && idx === 0 && !url}
                               title="Remove Image"
                             >
                               <Trash2 size={16} />
                             </button>
                          </div>
                        ))}
                      </div>
                      <p className="text-[10px] text-gray-400 mt-1">The first image will be used as the main product thumbnail.</p>
                   </div>

                   {/* Specs Section */}
                   <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <h4 className="font-bold text-gray-900 mb-3 text-sm flex items-center gap-2">
                        <Settings size={16} /> Technical Specifications
                      </h4>
                      <div className="space-y-2 mb-3">
                         {Object.entries(newProductForm.specs || {}).map(([key, val]) => (
                            <div key={key} className="flex gap-2 items-center">
                               <div className="w-1/3 bg-white border rounded px-2 py-1.5 text-xs font-bold text-gray-600 truncate">{key}</div>
                               <div className="flex-1 bg-white border rounded px-2 py-1.5 text-xs text-gray-800">{val as string}</div>
                               <button onClick={() => handleRemoveSpec(key)} className="text-red-400 hover:text-red-600 p-1">
                                  <XCircle size={14} />
                               </button>
                            </div>
                         ))}
                         {Object.keys(newProductForm.specs || {}).length === 0 && (
                            <p className="text-xs text-gray-400 italic text-center py-2">No specifications added.</p>
                         )}
                      </div>
                      
                      <div className="flex gap-2 pt-2 border-t border-gray-200">
                         <input 
                           value={specInput.key}
                           onChange={(e) => setSpecInput({...specInput, key: e.target.value})}
                           placeholder="Spec Name (e.g. Battery)" 
                           className="w-1/3 border rounded p-1.5 text-xs" 
                         />
                         <input 
                           value={specInput.value}
                           onChange={(e) => setSpecInput({...specInput, value: e.target.value})}
                           placeholder="Value (e.g. 5000mAh)" 
                           className="flex-1 border rounded p-1.5 text-xs" 
                         />
                         <button onClick={handleAddSpec} className="bg-gray-900 text-white px-3 rounded text-xs font-bold hover:bg-black">
                            Add
                         </button>
                      </div>
                   </div>

                   {/* Inventory Management Section */}
                   <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <h4 className="font-bold text-gray-900 mb-3 text-sm flex items-center gap-2">
                        <Boxes size={16} /> Inventory & Stock
                      </h4>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="text-xs font-bold text-gray-500 uppercase">SKU</label>
                          <input 
                            className="w-full border rounded-lg p-2 mt-1 bg-white" 
                            value={newProductForm.sku || ''} 
                            onChange={e => setNewProductForm({...newProductForm, sku: e.target.value})}
                            placeholder="e.g. ITEM-001"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-gray-500 uppercase">Stock</label>
                          <input 
                            type="number"
                            className="w-full border rounded-lg p-2 mt-1 bg-white" 
                            value={newProductForm.stock || 0} 
                            onChange={e => setNewProductForm({...newProductForm, stock: Number(e.target.value)})}
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-gray-500 uppercase">Low Alert</label>
                          <input 
                            type="number"
                            className="w-full border rounded-lg p-2 mt-1 bg-white" 
                            value={newProductForm.minStockLevel || 10} 
                            onChange={e => setNewProductForm({...newProductForm, minStockLevel: Number(e.target.value)})}
                          />
                        </div>
                      </div>
                   </div>

                   {/* Bulk Discount Section */}
                   <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-bold text-green-900 text-sm flex items-center gap-2">
                          <Percent size={16} /> Bulk Discounts
                        </h4>
                        <button onClick={addDiscountTier} className="text-xs bg-white border border-green-200 text-green-700 px-2 py-1 rounded hover:bg-green-100">
                          + Add Tier
                        </button>
                      </div>
                      
                      {newProductForm.bulkDiscounts && newProductForm.bulkDiscounts.length > 0 ? (
                        <div className="space-y-2">
                          {newProductForm.bulkDiscounts.map((d, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <span className="text-xs text-green-800">Buy</span>
                              <input 
                                type="number"
                                className="w-16 border border-green-200 rounded p-1 text-xs text-center"
                                value={d.minQty}
                                onChange={e => updateDiscountTier(idx, 'minQty', Number(e.target.value))}
                              />
                              <span className="text-xs text-green-800">Get</span>
                              <input 
                                type="number"
                                className="w-16 border border-green-200 rounded p-1 text-xs text-center"
                                value={d.percentage}
                                onChange={e => updateDiscountTier(idx, 'percentage', Number(e.target.value))}
                              />
                              <span className="text-xs text-green-800">% Off</span>
                              <button onClick={() => removeDiscountTier(idx)} className="ml-auto text-red-500 hover:text-red-700">
                                <X size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-green-600/60 italic">No discount rules set.</p>
                      )}
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
