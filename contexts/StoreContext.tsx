
import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { Product, Order, User, LandingPageSettings } from '../types';
import { DEFAULT_SETTINGS } from '../constants';
import { SheetsService } from '../services/sheetsService';

interface StoreContextType {
  products: Product[];
  orders: Order[];
  customers: User[];
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
  settings: DEFAULT_SETTINGS,
  addProduct: () => {},
  updateProduct: () => {},
  deleteProduct: () => {},
  addOrder: () => {},
  updateOrderStatus: () => {},
  deleteOrder: () => {},
  deleteCustomer: () => {},
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
  const [settings, setSettings] = useState<LandingPageSettings>(DEFAULT_SETTINGS);
  
  const [isSyncing, setIsSyncing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from Google Sheets on Mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const data = await SheetsService.getAllData();
      
      if (data) {
        // Update state with fetched data, allowing empty arrays (e.g. if all products deleted)
        setProducts(data.products || []);
        setOrders(data.orders || []);
        setCustomers(data.customers || []);
        if (data.settings) setSettings(data.settings);
      } else {
        console.log("Using default/fallback data due to fetch failure.");
      }
      
      setIsLoading(false);
    };

    loadData();
  }, []);

  // --- Helper to trigger sync ---
  const triggerProductSync = (newProducts: Product[]) => {
    setIsSyncing(true);
    SheetsService.syncProducts(newProducts).finally(() => setIsSyncing(false));
  };

  const triggerOrderSync = (newOrders: Order[]) => {
    setIsSyncing(true);
    SheetsService.syncOrders(newOrders).finally(() => setIsSyncing(false));
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

    // Check if customer exists, if not add them
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
    const newOrders = orders.map(o => o.id === id ? { ...o, status } : o);
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
      settings,
      addProduct,
      updateProduct,
      deleteProduct,
      addOrder,
      updateOrderStatus,
      deleteOrder,
      deleteCustomer,
      updateSettings,
      stats,
      isSyncing,
      isLoading
    }}>
      {children}
    </StoreContext.Provider>
  );
};
