import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { Product, Order, User } from '../types';
import { HERO_PRODUCT, RELATED_PRODUCTS, RECENT_ORDERS } from '../constants';

// Initial Mock Data for Customers based on orders
const INITIAL_CUSTOMERS: User[] = [
  { name: 'Maria Clara', email: 'maria@example.com', phone: '09171234567' },
  { name: 'Jose Rizal', email: 'jose@example.com', phone: '09181234567' },
  { name: 'Andres B.', email: 'andres@example.com', phone: '09191234567' },
];

interface StoreContextType {
  products: Product[];
  orders: Order[];
  customers: User[];
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
  // Dashboard Stats
  stats: {
    revenue: number;
    totalOrders: number;
    totalCustomers: number;
    lowStock: number;
  };
}

export const StoreContext = createContext<StoreContextType>({
  products: [],
  orders: [],
  customers: [],
  addProduct: () => {},
  updateProduct: () => {},
  deleteProduct: () => {},
  addOrder: () => {},
  updateOrderStatus: () => {},
  deleteOrder: () => {},
  deleteCustomer: () => {},
  stats: { revenue: 0, totalOrders: 0, totalCustomers: 0, lowStock: 0 },
});

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize with constant data
  const [products, setProducts] = useState<Product[]>([HERO_PRODUCT, ...RELATED_PRODUCTS]);
  const [orders, setOrders] = useState<Order[]>(RECENT_ORDERS);
  const [customers, setCustomers] = useState<User[]>(INITIAL_CUSTOMERS);

  // Product CRUD
  const addProduct = (product: Product) => {
    setProducts(prev => [...prev, product]);
  };

  const updateProduct = (id: string, updatedProduct: Product) => {
    setProducts(prev => prev.map(p => p.id === id ? updatedProduct : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  // Order CRUD
  const addOrder = (order: Order) => {
    setOrders(prev => [order, ...prev]);
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
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  const deleteOrder = (id: string) => {
    setOrders(prev => prev.filter(o => o.id !== id));
  };

  // Customer CRUD
  const deleteCustomer = (email: string) => {
    setCustomers(prev => prev.filter(c => c.email !== email));
  };

  // Derived Stats
  const stats = {
    revenue: orders.reduce((acc, curr) => acc + curr.total, 0),
    totalOrders: orders.length,
    totalCustomers: customers.length,
    lowStock: products.length < 3 ? 1 : 0, // Mock logic
  };

  return (
    <StoreContext.Provider value={{
      products,
      orders,
      customers,
      addProduct,
      updateProduct,
      deleteProduct,
      addOrder,
      updateOrderStatus,
      deleteOrder,
      deleteCustomer,
      stats
    }}>
      {children}
    </StoreContext.Provider>
  );
};