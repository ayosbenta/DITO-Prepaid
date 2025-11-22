


import React, { useState, useEffect, useContext, useRef } from 'react';
import { HashRouter as Router, Routes, Route, useLocation, useSearchParams } from 'react-router-dom';
import { CartItem, Product } from './types';
import { Navbar, Footer, CartDrawer } from './components/Layout';
import AIChatBot from './components/AIChatBot';
import { CartContext, CartProvider } from './contexts/CartContext';
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
  const { trackAffiliateClick, isLoading, affiliates } = useContext(StoreContext);
  const processedRef = useRef<string | null>(null);

  useEffect(() => {
    // 1. Don't track until data is fully loaded, otherwise affiliate.find() fails
    if (isLoading) return;

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

    // 2. Only process if ID exists and hasn't been processed in this session
    if (refId && refId !== processedRef.current) {
      localStorage.setItem('dito_referral_id', refId);
      
      // 3. Check if this is a valid affiliate ID in our database
      const isValidAffiliate = affiliates.some(a => a.id === refId);

      if (isValidAffiliate) {
          console.log('Referral Click Tracked:', refId);
          trackAffiliateClick(refId);
          processedRef.current = refId;
      } else if (affiliates.length > 0) {
          // If affiliates are loaded but ID is not found, it's invalid. 
          // Mark as processed so we don't keep retrying.
          console.warn('Invalid Affiliate ID:', refId);
          processedRef.current = refId;
      }
    }
  }, [searchParams, trackAffiliateClick, isLoading, affiliates]);

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
  return (
      <CartProvider>
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
      </CartProvider>
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
