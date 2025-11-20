import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { CartItem, Product } from './types';
import { Navbar, Footer, CartDrawer } from './components/Layout';
import AIChatBot from './components/AIChatBot';
import { CartContext } from './contexts/CartContext';

// Pages
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import AdminDashboard from './pages/AdminDashboard';

// Scroll To Top Wrapper
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, qty: number) => {
    if (qty < 1) return removeFromCart(id);
    setCartItems(prev => prev.map(item => item.id === id ? { ...item, quantity: qty } : item));
  };

  const clearCart = () => setCartItems([]);

  const cartTotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const itemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider value={{ 
      items: cartItems, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      cartTotal, 
      itemCount, 
      clearCart,
      isCartOpen,
      setIsCartOpen 
    }}>
      <Router>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col font-sans text-gray-900">
          <Routes>
            {/* Admin Route - No Navbar/Footer for cleaner dash */}
            <Route path="/admin" element={<AdminDashboard />} />
            
            {/* Public Routes */}
            <Route path="*" element={
              <>
                <Navbar />
                <main className="flex-grow">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/catalog" element={<CatalogPage />} />
                    <Route path="/product/:id" element={<ProductDetailPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                  </Routes>
                </main>
                <Footer />
                <CartDrawer />
                <AIChatBot />
              </>
            } />
          </Routes>
        </div>
      </Router>
    </CartContext.Provider>
  );
};

export default App;