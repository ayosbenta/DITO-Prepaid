
import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { Product, Order, User, LandingPageSettings, Affiliate, PaymentSettings } from '../types';
import { DEFAULT_SETTINGS, DEFAULT_PAYMENT_SETTINGS } from '../constants';
import { SheetsService } from '../services/sheetsService';

interface StoreContextType {
  products: Product[];
  orders: Order[];
  customers: User[];
  affiliates: Affiliate[];
  settings: LandingPageSettings;
  paymentSettings: PaymentSettings;
  // Product Actions
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updatedProduct: Product) => void;
  deleteProduct: (id: string) => void;
  // Order Actions
  addOrder: (order: Order) => void;
  updateOrderStatus: (id: string, status: Order['status']) => void;
  deleteOrder: (id: string) => void;
  // Customer Actions
  deleteCustomer: (email: string) => void;
  // Affiliate Actions
  registerAffiliate: (affiliate: Affiliate) => void;
  updateAffiliate: (id: string, data: Partial<Affiliate>) => void;
  trackAffiliateClick: (id: string) => void;
  // Settings Actions
  updateSettings: (settings: LandingPageSettings) => void;
  updatePaymentSettings: (settings: PaymentSettings) => void;
  // Dashboard Stats
  stats: {
    revenue: number;
    totalOrders: number;
    totalCustomers: number;
    lowStock: number;
  };
  isSyncing: boolean;
  isLoading: boolean;
}

export const StoreContext = createContext<StoreContextType>({
  products: [],
  orders: [],
  customers: [],
  affiliates: [],
  settings: DEFAULT_SETTINGS,
  paymentSettings: DEFAULT_PAYMENT_SETTINGS,
  addProduct: () => {},
  updateProduct: () => {},
  deleteProduct: () => {},
  addOrder: () => {},
  updateOrderStatus: () => {},
  deleteOrder: () => {},
  deleteCustomer: () => {},
  registerAffiliate: () => {},
  updateAffiliate: () => {},
  trackAffiliateClick: () => {},
  updateSettings: () => {},
  updatePaymentSettings: () => {},
  stats: { revenue: 0, totalOrders: 0, totalCustomers: 0, lowStock: 0 },
  isSyncing: false,
  isLoading: true,
});

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Start with empty/default data while loading
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<User[]>([]);
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [settings, setSettings] = useState<LandingPageSettings>(DEFAULT_SETTINGS);
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>(DEFAULT_PAYMENT_SETTINGS);
  
  const [isSyncing, setIsSyncing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async (isBackground = false) => {
    if (!isBackground) setIsLoading(true);
    
    const data = await SheetsService.getAllData();
    
    if (data) {
      setProducts(data.products || []);
      setOrders(data.orders || []);
      setCustomers(data.customers || []);
      setAffiliates(data.affiliates || []);
      if (data.settings) setSettings(data.settings);
      if (data.paymentSettings) setPaymentSettings(data.paymentSettings);
    }
    
    if (!isBackground) setIsLoading(false);
  };

  // Initial Load
  useEffect(() => {
    loadData();
  }, []);

  // Auto-Refresh / Polling Logic
  // This ensures "All dashboards... auto-refresh" requirements are met
  useEffect(() => {
    const intervalId = setInterval(() => {
      // Do not refresh if we are currently syncing changes to avoid overwriting optimistic updates
      if (!isSyncing) {
        loadData(true); // true = background refresh (no spinner)
      }
    }, 15000); // Refresh every 15 seconds

    return () => clearInterval(intervalId);
  }, [isSyncing]);

  // --- Sync Helpers ---
  const triggerProductSync = (newProducts: Product[]) => {
    setIsSyncing(true);
    SheetsService.syncProducts(newProducts).finally(() => setIsSyncing(false));
  };

  const triggerOrderSync = (newOrders: Order[]) => {
    setIsSyncing(true);
    SheetsService.syncOrders(newOrders).finally(() => setIsSyncing(false));
  };

  const triggerAffiliateSync = (newAffiliates: Affiliate[]) => {
    setIsSyncing(true);
    SheetsService.syncAffiliates(newAffiliates).finally(() => setIsSyncing(false));
  };

  // --- Logic: Auto-Credit Affiliate Commission ---
  const handleCommissionLogic = (updatedOrder: Order, prevStatus: string) => {
    // Only proceed if there is a referrer and status changed TO Delivered
    if (updatedOrder.referralId && updatedOrder.status === 'Delivered' && prevStatus !== 'Delivered') {
      
      const affiliateId = updatedOrder.referralId;
      
      // Use the calculated commission from the order, or fallback to 5% default for old orders
      const commissionAmount = updatedOrder.commission ?? (updatedOrder.total * 0.05);

      // Update local affiliates state
      setAffiliates(prevAffiliates => {
        const updatedAffiliates = prevAffiliates.map(aff => {
          if (aff.id === affiliateId) {
            return {
              ...aff,
              walletBalance: (aff.walletBalance || 0) + commissionAmount,
              totalSales: (aff.totalSales || 0) + updatedOrder.total,
              lifetimeEarnings: (aff.lifetimeEarnings || 0) + commissionAmount
            };
          }
          return aff;
        });
        
        // Sync new balances to Sheets
        triggerAffiliateSync(updatedAffiliates);
        return updatedAffiliates;
      });
      
      // Ensure commission is stamped on the order if it wasn't already
      updatedOrder.commission = commissionAmount;
    }
  };

  // Product CRUD
  const addProduct = (product: Product) => {
    const newProducts = [...products, product];
    setProducts(newProducts);
    triggerProductSync(newProducts);
  };

  const updateProduct = (id: string, updatedProduct: Product) => {
    const newProducts = products.map(p => p.id === id ? updatedProduct : p);
    setProducts(newProducts);
    triggerProductSync(newProducts);
  };

  const deleteProduct = (id: string) => {
    const newProducts = products.filter(p => p.id !== id);
    setProducts(newProducts);
    triggerProductSync(newProducts);
  };

  // Order CRUD
  const addOrder = (order: Order) => {
    const newOrders = [order, ...orders];
    setOrders(newOrders);
    triggerOrderSync(newOrders);

    const customerExists = customers.some(c => c.name === order.customer);
    if (!customerExists) {
      setCustomers(prev => [...prev, { 
        name: order.customer, 
        email: `${order.customer.toLowerCase().replace(/\s/g, '')}@example.com`, 
        phone: 'N/A' 
      }]);
    }
  };

  const updateOrderStatus = (id: string, status: Order['status']) => {
    let targetOrder: Order | undefined;
    let prevStatus = '';

    const newOrders = orders.map(o => {
      if (o.id === id) {
        prevStatus = o.status;
        targetOrder = { ...o, status };
        return targetOrder;
      }
      return o;
    });

    // Trigger Commission Check before syncing
    if (targetOrder) {
      handleCommissionLogic(targetOrder, prevStatus);
    }

    setOrders(newOrders);
    triggerOrderSync(newOrders);
  };

  const deleteOrder = (id: string) => {
    const newOrders = orders.filter(o => o.id !== id);
    setOrders(newOrders);
    triggerOrderSync(newOrders);
  };

  // Customer CRUD
  const deleteCustomer = (email: string) => {
    setCustomers(prev => prev.filter(c => c.email !== email));
  };

  // Affiliate CRUD
  const registerAffiliate = (affiliate: Affiliate) => {
    // Ensure defaults
    const newAffiliate = {
      ...affiliate,
      status: affiliate.status || 'active',
      clicks: 0,
      lifetimeEarnings: 0,
      walletBalance: 0,
      totalSales: 0
    };
    const newAffiliates = [...affiliates, newAffiliate];
    setAffiliates(newAffiliates);
    triggerAffiliateSync(newAffiliates);
  };

  const updateAffiliate = (id: string, data: Partial<Affiliate>) => {
    const newAffiliates = affiliates.map(a => a.id === id ? { ...a, ...data } : a);
    setAffiliates(newAffiliates);
    triggerAffiliateSync(newAffiliates);
  };

  const trackAffiliateClick = (id: string) => {
    setAffiliates(prev => {
      const target = prev.find(a => a.id === id);
      // Only track if affiliate exists
      if (!target) return prev;

      const newAffiliates = prev.map(a => a.id === id ? { ...a, clicks: (a.clicks || 0) + 1 } : a);
      
      // Debouncing syncing could be good, but keeping it simple for now
      triggerAffiliateSync(newAffiliates);
      return newAffiliates;
    });
  };

  // Settings Update
  const updateSettings = (newSettings: LandingPageSettings) => {
    setSettings(newSettings);
    setIsSyncing(true);
    // We need to pass payment settings too so they don't get overwritten in the key-value store
    const mergedSettings = { ...newSettings, payment: paymentSettings };
    SheetsService.saveSettings(mergedSettings).finally(() => setIsSyncing(false));
  };

  const updatePaymentSettings = (newPaymentSettings: PaymentSettings) => {
    setPaymentSettings(newPaymentSettings);
    setIsSyncing(true);
    const mergedSettings = { ...settings, payment: newPaymentSettings };
    SheetsService.saveSettings(mergedSettings).finally(() => setIsSyncing(false));
  };

  // Derived Stats
  const stats = {
    revenue: orders.reduce((acc, curr) => acc + curr.total, 0),
    totalOrders: orders.length,
    totalCustomers: customers.length,
    lowStock: products.length < 3 ? 1 : 0, 
  };

  return (
    <StoreContext.Provider value={{
      products,
      orders,
      customers,
      affiliates,
      settings,
      paymentSettings,
      addProduct,
      updateProduct,
      deleteProduct,
      addOrder,
      updateOrderStatus,
      deleteOrder,
      deleteCustomer,
      registerAffiliate,
      updateAffiliate,
      trackAffiliateClick,
      updateSettings,
      updatePaymentSettings,
      stats,
      isSyncing,
      isLoading
    }}>
      {children}
    </StoreContext.Provider>
  );
};
