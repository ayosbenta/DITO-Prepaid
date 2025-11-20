import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { Product, Order, User, LandingPageSettings, Affiliate } from '../types';
import { DEFAULT_SETTINGS } from '../constants';
import { SheetsService } from '../services/sheetsService';

interface StoreContextType {
  products: Product[];
  orders: Order[];
  customers: User[];
  affiliates: Affiliate[];
  settings: LandingPageSettings;
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
  // Settings Actions
  updateSettings: (settings: LandingPageSettings) => void;
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
  addProduct: () => {},
  updateProduct: () => {},
  deleteProduct: () => {},
  addOrder: () => {},
  updateOrderStatus: () => {},
  deleteOrder: () => {},
  deleteCustomer: () => {},
  registerAffiliate: () => {},
  updateAffiliate: () => {},
  updateSettings: () => {},
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
  
  const [isSyncing, setIsSyncing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from Google Sheets on Mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const data = await SheetsService.getAllData();
      
      if (data) {
        setProducts(data.products || []);
        setOrders(data.orders || []);
        setCustomers(data.customers || []);
        setAffiliates(data.affiliates || []);
        if (data.settings) setSettings(data.settings);
      }
      
      setIsLoading(false);
    };

    loadData();
  }, []);

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
      const commissionAmount = updatedOrder.total * 0.05; // 5% Commission

      // Update local affiliates state
      setAffiliates(prevAffiliates => {
        const updatedAffiliates = prevAffiliates.map(aff => {
          if (aff.id === affiliateId) {
            return {
              ...aff,
              walletBalance: aff.walletBalance + commissionAmount,
              totalSales: aff.totalSales + updatedOrder.total
            };
          }
          return aff;
        });
        
        // Sync new balances to Sheets
        triggerAffiliateSync(updatedAffiliates);
        return updatedAffiliates;
      });

      // We should also update the order to record the commission amount officially
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

    setOrders(newOrders);
    triggerOrderSync(newOrders);

    // Trigger Commission Check
    if (targetOrder) {
      handleCommissionLogic(targetOrder, prevStatus);
    }
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
    const newAffiliates = [...affiliates, affiliate];
    setAffiliates(newAffiliates);
    triggerAffiliateSync(newAffiliates);
  };

  const updateAffiliate = (id: string, data: Partial<Affiliate>) => {
    const newAffiliates = affiliates.map(a => a.id === id ? { ...a, ...data } : a);
    setAffiliates(newAffiliates);
    triggerAffiliateSync(newAffiliates);
  };

  // Settings Update
  const updateSettings = (newSettings: LandingPageSettings) => {
    setSettings(newSettings);
    setIsSyncing(true);
    SheetsService.saveSettings(newSettings).finally(() => setIsSyncing(false));
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
      addProduct,
      updateProduct,
      deleteProduct,
      addOrder,
      updateOrderStatus,
      deleteOrder,
      deleteCustomer,
      registerAffiliate,
      updateAffiliate,
      updateSettings,
      stats,
      isSyncing,
      isLoading
    }}>
      {children}
    </StoreContext.Provider>
  );
};