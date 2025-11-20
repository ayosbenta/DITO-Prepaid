
import React, { useState, useEffect, useContext, useRef } from 'react';
import { HashRouter as Router, Routes, Route, useLocation, useSearchParams } from 'react-router-dom';
import { CartItem, Product } from './types';
import { Navbar, Footer, CartDrawer } from './components/Layout';
import AIChatBot from './components/AIChatBot';
import { CartContext } from './contexts/CartContext';
import { StoreProvider, StoreContext } from './contexts/StoreContext';

// Pages
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import AdminDashboard from './pages/AdminDashboard';
import AffiliateLoginPage from './pages/AffiliateLoginPage';
import AffiliateDashboard from './pages/AffiliateDashboard';
import CustomerLoginPage from './pages/CustomerLoginPage';

// Helper to capture ?ref=ID
const ReferralHandler = () => {
  const [searchParams] = useSearchParams();
  const { trackAffiliateClick } = useContext(StoreContext);
  const processedRef = useRef<string | null>(null);

  useEffect(() => {
    let refId = searchParams.get('ref');

    // Fallback 1: Check query params before the hash (common in some server configs /?ref=123#/)
    if (!refId) {
      const params = new URLSearchParams(window.location.search);
      refId = params.get('ref');
    }
    
    // Fallback 2: Manually parse hash string if Router misses it (e.g. /#/?ref=123)
    if (!refId && window.location.hash.includes('ref=')) {
         const match = window.location.hash.match(/[?&]ref=([^&]+)/);
         if (match) refId = match[1];
    }

    if (refId && refId !== processedRef.current) {
      localStorage.setItem('dito_referral_id', refId);
      console.log('Referral tracked:', refId);
      trackAffiliateClick(refId);
      processedRef.current = refId;
    }
  }, [searchParams, trackAffiliateClick]);

  return null;
};

// Scroll To Top Wrapper
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const AppContent: React.FC = () => {
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
          <ReferralHandler />
          <div className="min-h-screen flex flex-col font-sans text-gray-900">
            <Routes>
              {/* Admin Route */}
              <Route path="/admin" element={<AdminDashboard />} />
              
              {/* Affiliate Routes */}
              <Route path="/affiliate/login" element={<AffiliateLoginPage />} />
              <Route path="/affiliate/dashboard" element={
                <>
                  <Navbar />
                  <AffiliateDashboard />
                </>
              } />

              {/* Customer Route */}
              <Route path="/customer/login" element={<CustomerLoginPage />} />

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

const App: React.FC = () => {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
};

export default App;
