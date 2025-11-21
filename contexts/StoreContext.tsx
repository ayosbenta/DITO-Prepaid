
import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { Product, Order, User, LandingPageSettings, Affiliate, PaymentSettings, PayoutRequest } from '../types';
import { DEFAULT_SETTINGS, DEFAULT_PAYMENT_SETTINGS, HERO_PRODUCT, RELATED_PRODUCTS, RECENT_ORDERS } from '../constants';
import { SheetsService, DEMO_AFFILIATE } from '../services/sheetsService';

interface StoreContextType {
  products: Product[];
  orders: Order[];
  customers: User[];
  affiliates: Affiliate[];
  payouts: PayoutRequest[];
  settings: LandingPageSettings;
  paymentSettings: PaymentSettings;
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updatedProduct: Product) => void;
  deleteProduct: (id: string) => void;
  addOrder: (order: Order) => void;
  updateOrderStatus: (id: string, status: Order['status']) => void;
  deleteOrder: (id: string) => void;
  deleteCustomer: (email: string) => void;
  registerAffiliate: (affiliate: Affiliate) => void;
  updateAffiliate: (id: string, data: Partial<Affiliate>) => void;
  trackAffiliateClick: (id: string) => void;
  requestPayout: (req: Omit<PayoutRequest, 'id' | 'status' | 'dateRequested'>) => void;
  updatePayoutStatus: (id: string, status: PayoutRequest['status']) => void;
  updateSettings: (settings: LandingPageSettings) => void;
  updatePaymentSettings: (settings: PaymentSettings) => void;
  stats: {
    revenue: number;
    totalOrders: number;
    totalCustomers: number;
    lowStock: number;
  };
  isSyncing: boolean;
  isLoading: boolean;
  isRefreshing: boolean;
  refreshData: () => void;
}

export const StoreContext = createContext<StoreContextType>({
  products: [],
  orders: [],
  customers: [],
  affiliates: [],
  payouts: [],
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
  requestPayout: () => {},
  updatePayoutStatus: () => {},
  updateSettings: () => {},
  updatePaymentSettings: () => {},
  stats: { revenue: 0, totalOrders: 0, totalCustomers: 0, lowStock: 0 },
  isSyncing: false,
  isLoading: true,
  isRefreshing: false,
  refreshData: () => {},
});

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<User[]>([]);
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [payouts, setPayouts] = useState<PayoutRequest[]>([]);
  const [settings, setSettings] = useState<LandingPageSettings>(DEFAULT_SETTINGS);
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>(DEFAULT_PAYMENT_SETTINGS);
  
  const [syncCount, setSyncCount] = useState(0);
  const isSyncing = syncCount > 0;
  
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadData = async (isBackground = false) => {
    const isInitial = !isBackground && products.length === 0;
    
    if (isInitial) setIsLoading(true);
    else setIsRefreshing(true);
    
    // Safety net: If fetching takes too long (>10s), force stop loading
    const safetyTimeout = setTimeout(() => {
       if(isInitial) setIsLoading(false);
       setIsRefreshing(false);
    }, 10000);

    try {
      const data = await SheetsService.getAllData();
      
      if (data) {
        // Success: Update State with Real Data
        setProducts(data.products || []);
        setOrders(data.orders || []);
        setCustomers(data.customers || []);
        setAffiliates(data.affiliates || []);
        setPayouts(data.payouts || []);
        if (data.settings) setSettings(data.settings);
        if (data.paymentSettings) setPaymentSettings(data.paymentSettings);
      } else {
        // Failure: Data is null (Network error or Timeout)
        console.warn("Background fetch failed. Preserving existing state.");
        
        // Only load fallback Mock Data if we have NO data at all (Initial Load Failed)
        if (products.length === 0) {
           console.log("Using Fallback/Demo Data");
           setProducts([HERO_PRODUCT, ...RELATED_PRODUCTS]);
           setOrders(RECENT_ORDERS);
           setAffiliates([DEMO_AFFILIATE]);
           setPayouts([]);
           // Settings remain default
        }
      }
    } catch (err) {
      console.error("Critical Error in loadData", err);
    } finally {
      clearTimeout(safetyTimeout);
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!isSyncing) loadData(true);
    }, 15000);
    return () => clearInterval(intervalId);
  }, [isSyncing]); 

  const triggerProductSync = (newProducts: Product[]) => {
    setSyncCount(c => c + 1);
    SheetsService.syncProducts(newProducts).finally(() => setSyncCount(c => c - 1));
  };

  const triggerOrderSync = (newOrders: Order[]) => {
    setSyncCount(c => c + 1);
    SheetsService.syncOrders(newOrders).finally(() => setSyncCount(c => c - 1));
  };

  const triggerAffiliateSync = (newAffiliates: Affiliate[]) => {
    setSyncCount(c => c + 1);
    SheetsService.syncAffiliates(newAffiliates).finally(() => setSyncCount(c => c - 1));
  };

  const triggerSettingsSync = (newSettings: LandingPageSettings) => {
    setSyncCount(c => c + 1);
    SheetsService.saveSettings(newSettings).finally(() => setSyncCount(c => c - 1));
  };

  const addProduct = (product: Product) => {
    const updated = [...products, product];
    setProducts(updated);
    triggerProductSync(updated);
  };

  const updateProduct = (id: string, updatedProduct: Product) => {
    const updated = products.map(p => p.id === id ? updatedProduct : p);
    setProducts(updated);
    triggerProductSync(updated);
  };

  const deleteProduct = (id: string) => {
    const updated = products.filter(p => p.id !== id);
    setProducts(updated);
    triggerProductSync(updated);
  };

  const addOrder = (order: Order) => {
    const updatedOrders = [order, ...orders];
    setOrders(updatedOrders);
    triggerOrderSync(updatedOrders);

    if (order.referralId) {
       const affiliate = affiliates.find(a => a.id === order.referralId);
       if (affiliate) {
         const updatedAffiliates = affiliates.map(a => {
            if (a.id === order.referralId) {
               return { ...a, totalSales: a.totalSales + order.total };
            }
            return a;
         });
         setAffiliates(updatedAffiliates);
         triggerAffiliateSync(updatedAffiliates);
       }
    }
  };

  const updateOrderStatus = (id: string, status: Order['status']) => {
    const oldOrder = orders.find(o => o.id === id);
    const updatedOrders = orders.map(o => o.id === id ? { ...o, status } : o);
    setOrders(updatedOrders);
    triggerOrderSync(updatedOrders);

    if (oldOrder && oldOrder.status !== 'Delivered' && status === 'Delivered' && oldOrder.referralId) {
       const updatedAffiliates = affiliates.map(a => {
          if (a.id === oldOrder.referralId) {
             const comm = oldOrder.commission || (oldOrder.total * 0.05);
             return {
               ...a,
               walletBalance: a.walletBalance + comm,
               lifetimeEarnings: (a.lifetimeEarnings || 0) + comm
             };
          }
          return a;
       });
       setAffiliates(updatedAffiliates);
       triggerAffiliateSync(updatedAffiliates);
    }
  };

  const deleteOrder = (id: string) => {
    const updated = orders.filter(o => o.id !== id);
    setOrders(updated);
    triggerOrderSync(updated);
  };

  const deleteCustomer = (email: string) => {
    setCustomers(customers.filter(c => c.email !== email));
  };

  const registerAffiliate = (affiliate: Affiliate) => {
    const updated = [...affiliates, affiliate];
    setAffiliates(updated);
    triggerAffiliateSync(updated);
  };

  const updateAffiliate = (id: string, data: Partial<Affiliate>) => {
    const updated = affiliates.map(a => a.id === id ? { ...a, ...data } : a);
    setAffiliates(updated);
    triggerAffiliateSync(updated);
  };

  const trackAffiliateClick = (id: string) => {
    const affiliate = affiliates.find(a => a.id === id);
    if (affiliate) {
      const updated = affiliates.map(a => a.id === id ? { ...a, clicks: (a.clicks || 0) + 1 } : a);
      setAffiliates(updated);
      triggerAffiliateSync(updated);
    }
  };

  const requestPayout = (req: Omit<PayoutRequest, 'id' | 'status' | 'dateRequested'>) => {
    const newPayout: PayoutRequest = {
      ...req,
      id: `PAY-${Date.now()}`,
      status: 'Pending',
      dateRequested: new Date().toISOString()
    };
    const updatedPayouts = [newPayout, ...payouts];
    setPayouts(updatedPayouts);

    const updatedAffiliates = affiliates.map(a => {
      if (a.id === req.affiliateId) {
        return { ...a, walletBalance: Math.max(0, a.walletBalance - req.amount) };
      }
      return a;
    });
    setAffiliates(updatedAffiliates);
    setSyncCount(c => c + 1);
    Promise.all([
      SheetsService.syncPayouts(updatedPayouts),
      SheetsService.syncAffiliates(updatedAffiliates)
    ]).finally(() => setSyncCount(c => c - 1));
  };

  const updatePayoutStatus = (id: string, status: PayoutRequest['status']) => {
    const payoutIndex = payouts.findIndex(p => p.id === id);
    if (payoutIndex === -1) return;
    const payout = payouts[payoutIndex];
    const dateProcessed = new Date().toISOString();
    const updatedPayouts = payouts.map(p => p.id === id ? { ...p, status, dateProcessed } : p);
    setPayouts(updatedPayouts);

    let updatedAffiliates = affiliates;
    if (status === 'Rejected' && payout.status === 'Pending') {
      updatedAffiliates = affiliates.map(a => {
        if (a.id === payout.affiliateId) {
          return { ...a, walletBalance: a.walletBalance + payout.amount };
        }
        return a;
      });
      setAffiliates(updatedAffiliates);
    }

    setSyncCount(c => c + 1);
    const promises = [SheetsService.syncPayouts(updatedPayouts)];
    if (status === 'Rejected') promises.push(SheetsService.syncAffiliates(updatedAffiliates));
    Promise.all(promises).finally(() => setSyncCount(c => c - 1));
  };

  const updateSettings = (newSettings: LandingPageSettings) => {
    setSettings(newSettings);
    triggerSettingsSync(newSettings);
  };

  const updatePaymentSettings = (newSettings: PaymentSettings) => {
    setPaymentSettings(newSettings);
    setSyncCount(c => c + 1);
    SheetsService.sendData('SAVE_PAYMENT_SETTINGS', newSettings).finally(() => setSyncCount(c => c - 1));
  };

  const stats = {
    revenue: orders.reduce((acc, o) => acc + o.total, 0),
    totalOrders: orders.length,
    totalCustomers: customers.length,
    lowStock: products.filter(p => Math.random() > 0.8).length
  };

  return (
    <StoreContext.Provider value={{
      products, orders, customers, affiliates, payouts, settings, paymentSettings,
      addProduct, updateProduct, deleteProduct,
      addOrder, updateOrderStatus, deleteOrder,
      deleteCustomer,
      registerAffiliate, updateAffiliate, trackAffiliateClick,
      requestPayout, updatePayoutStatus,
      updateSettings, updatePaymentSettings,
      stats,
      isSyncing, isLoading, isRefreshing, refreshData: () => loadData(false)
    }}>
      {children}
    </StoreContext.Provider>
  );
};
