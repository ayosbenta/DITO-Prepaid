
import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, Wifi, Facebook, Twitter, Instagram, Trash2, Plus, Minus, ArrowRight, Lock, User, Shield, Users, LogIn } from 'lucide-react';
import { CartContext } from '../contexts/CartContext';
import { CartItem } from '../types';
import { Button } from './UI';

export const Navbar: React.FC = () => {
  const { itemCount, setIsCartOpen } = useContext(CartContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/catalog' },
    { name: 'Support', path: '#' },
  ];

  return (
    <>
      <nav className={`fixed top-0 w-full z-40 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 text-primary font-black text-2xl tracking-tighter hover:scale-105 transition-transform">
            <div className="bg-primary text-white p-1.5 rounded-lg shadow-lg shadow-red-600/20">
              <Wifi size={20} strokeWidth={3} />
            </div>
            DITO Home
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8 bg-white/50 px-6 py-2 rounded-full backdrop-blur-sm border border-gray-100/50">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path} 
                className={`text-sm font-medium transition-colors ${location.pathname === link.path ? 'text-primary' : 'text-gray-600 hover:text-primary'}`}
              >
                {link.name}
              </Link>
            ))}
            
            {/* Login Button */}
            <button 
              onClick={() => setIsLoginModalOpen(true)}
              className="text-sm font-bold text-primary hover:text-secondary flex items-center gap-1 px-3 py-1 rounded-full hover:bg-red-50 transition-colors"
            >
              <LogIn size={16} /> Login
            </button>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 bg-white hover:bg-gray-100 rounded-full transition-colors border border-gray-100 shadow-sm group"
            >
              <ShoppingCart size={20} className="text-gray-700 group-hover:text-primary transition-colors" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">
                  {itemCount}
                </span>
              )}
            </button>
            <button 
              className="md:hidden p-2 hover:bg-gray-100 rounded-full"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t absolute w-full px-4 py-4 flex flex-col gap-4 shadow-xl animate-fade-in-up">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path} 
                className="text-gray-900 font-bold text-lg py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <button 
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsLoginModalOpen(true);
              }}
              className="text-left text-primary font-bold text-lg py-2 flex items-center gap-2"
            >
              <LogIn size={20} /> Login / Register
            </button>
          </div>
        )}
      </nav>

      {/* Login Selection Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div 
            className="absolute inset-0" 
            onClick={() => setIsLoginModalOpen(false)}
          />
          <div className="bg-white rounded-3xl w-full max-w-lg p-8 shadow-2xl relative animate-fade-in-up">
            <button 
              onClick={() => setIsLoginModalOpen(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Welcome to DITO Home</h2>
              <p className="text-gray-500 mt-2">Please select your account type to continue.</p>
            </div>

            <div className="grid gap-4">
              <Link 
                to="/admin" 
                onClick={() => setIsLoginModalOpen(false)}
                className="flex items-center p-4 rounded-2xl border border-gray-200 hover:border-primary hover:bg-red-50 transition-all group"
              >
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <Shield size={24} />
                </div>
                <div className="ml-4">
                  <h3 className="font-bold text-gray-900">Admin Portal</h3>
                  <p className="text-xs text-gray-500">Store management & analytics</p>
                </div>
                <ArrowRight className="ml-auto text-gray-300 group-hover:text-primary" size={20} />
              </Link>

              <Link 
                to="/affiliate/login" 
                onClick={() => setIsLoginModalOpen(false)}
                className="flex items-center p-4 rounded-2xl border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all group"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                  <Users size={24} />
                </div>
                <div className="ml-4">
                  <h3 className="font-bold text-gray-900">Affiliate Partner</h3>
                  <p className="text-xs text-gray-500">Track sales & commissions</p>
                </div>
                <ArrowRight className="ml-auto text-gray-300 group-hover:text-blue-600" size={20} />
              </Link>

              <Link 
                to="/customer/login" 
                onClick={() => setIsLoginModalOpen(false)}
                className="flex items-center p-4 rounded-2xl border border-gray-200 hover:border-green-500 hover:bg-green-50 transition-all group"
              >
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform">
                  <User size={24} />
                </div>
                <div className="ml-4">
                  <h3 className="font-bold text-gray-900">Customer Login</h3>
                  <p className="text-xs text-gray-500">Check orders & profile</p>
                </div>
                <ArrowRight className="ml-auto text-gray-300 group-hover:text-green-600" size={20} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-primary font-black text-xl tracking-tighter">
               <Wifi size={24} /> DITO Home
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              Empowering Filipino households with next-gen 4G/5G connectivity. Fast, affordable, and reliable.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-4">Shop</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link to="/catalog" className="hover:text-primary">All Products</Link></li>
              <li><Link to="#" className="hover:text-primary">Best Sellers</Link></li>
              <li><Link to="#" className="hover:text-primary">New Arrivals</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-4">Partners</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link to="/affiliate/login" className="hover:text-primary">Join Affiliate Program</Link></li>
              <li><Link to="/affiliate/login" className="hover:text-primary">Affiliate Login</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-4">Follow Us</h4>
            <div className="flex gap-4 mb-6">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-primary hover:text-white transition-all"><Facebook size={18} /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-primary hover:text-white transition-all"><Twitter size={18} /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-primary hover:text-white transition-all"><Instagram size={18} /></a>
            </div>
          </div>
        </div>
        <div className="border-t pt-8 text-center text-xs text-gray-400">
          &copy; {new Date().getFullYear()} DITO Telecommunity. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export const CartDrawer: React.FC = () => {
  const { isCartOpen, setIsCartOpen, items, removeFromCart, updateQuantity, cartTotal } = useContext(CartContext);

  if (!isCartOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 transition-opacity" 
        onClick={() => setIsCartOpen(false)}
      />
      
      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 flex flex-col animate-fade-in-left">
        <div className="p-6 border-b flex justify-between items-center bg-white">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            Your Cart <span className="text-sm font-normal text-gray-500">({items.length} items)</span>
          </h2>
          <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-900">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
                 <ShoppingCart size={32} className="opacity-20" />
              </div>
              <p>Your cart is empty.</p>
              <Button variant="outline" onClick={() => setIsCartOpen(false)}>Start Shopping</Button>
            </div>
          ) : (
            items.map((item: CartItem) => (
              <div key={item.id} className="flex gap-4 group">
                <div className="w-24 h-24 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden flex-shrink-0 p-2">
                  <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                </div>
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <div className="flex justify-between items-start">
                       <h3 className="font-bold text-gray-900 line-clamp-1">{item.name}</h3>
                       <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-300 hover:text-red-500 transition-colors p-1"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <p className="text-sm text-gray-500">Modem</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center border border-gray-200 rounded-lg bg-white h-8">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-full hover:bg-gray-50 rounded-l-lg flex items-center justify-center text-gray-500"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="text-sm w-8 text-center font-medium">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-full hover:bg-gray-50 rounded-r-lg flex items-center justify-center text-gray-500"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <p className="font-bold text-gray-900">₱{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 border-t bg-gray-50">
            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center text-gray-500 text-sm">
                <span>Subtotal</span>
                <span>₱{cartTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-gray-500 text-sm">
                <span>Shipping</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                <span className="font-bold text-gray-900 text-lg">Total</span>
                <span className="font-bold text-primary text-2xl">₱{cartTotal.toLocaleString()}</span>
              </div>
            </div>
            <Link to="/checkout" onClick={() => setIsCartOpen(false)}>
              <Button fullWidth className="py-4 shadow-red-900/20 shadow-lg flex items-center justify-center gap-2">
                 <Lock size={16} /> Checkout Securely
              </Button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
};
