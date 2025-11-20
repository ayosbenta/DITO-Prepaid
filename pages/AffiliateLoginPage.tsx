
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../contexts/StoreContext';
import { Affiliate } from '../types';
import { Button } from '../components/UI';
import { Users, ArrowRight, Loader2 } from 'lucide-react';

const AffiliateLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { affiliates, registerAffiliate, isSyncing } = useContext(StoreContext);
  
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const affiliate = affiliates.find(a => a.email.toLowerCase() === email.toLowerCase());
    
    if (affiliate) {
      localStorage.setItem('dito_affiliate_id', affiliate.id);
      navigate('/affiliate/dashboard');
    } else {
      setError('Account not found. Please register.');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const exists = affiliates.some(a => a.email.toLowerCase() === email.toLowerCase());
    
    if (exists) {
      setError('Email already registered. Please login.');
      return;
    }

    const newAffiliate: Affiliate = {
      id: `AFF-${Math.floor(Math.random() * 100000)}`,
      name,
      email,
      walletBalance: 0,
      totalSales: 0,
      joinDate: new Date().toISOString().split('T')[0],
      status: 'active',
      clicks: 0,
      lifetimeEarnings: 0
    };

    registerAffiliate(newAffiliate);
    
    // Auto login after register logic is async, so we set localstorage immediately for UX
    localStorage.setItem('dito_affiliate_id', newAffiliate.id);
    
    // Wait a bit for sync visually
    setTimeout(() => navigate('/affiliate/dashboard'), 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
       <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users size={32} className="text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Affiliate Partner Program</h1>
            <p className="text-gray-500 mt-2">Earn 5% commission on every WoWFi Pro sale.</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-xl text-center">
              {error}
            </div>
          )}

          <form onSubmit={isRegistering ? handleRegister : handleLogin} className="space-y-4">
            {isRegistering && (
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  placeholder="Juan Dela Cruz"
                />
              </div>
            )}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email Address</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                placeholder="you@example.com"
              />
            </div>

            <Button fullWidth className="py-3 mt-2" disabled={isSyncing}>
              {isSyncing ? <Loader2 className="animate-spin" /> : (isRegistering ? 'Create Account' : 'Login to Dashboard')}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button 
              onClick={() => { setIsRegistering(!isRegistering); setError(''); }}
              className="text-sm text-gray-500 hover:text-primary font-medium transition-colors"
            >
              {isRegistering ? 'Already have an account? Login' : 'New partner? Create an account'}
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
             <button onClick={() => navigate('/')} className="text-xs text-gray-400 hover:text-gray-600 flex items-center justify-center gap-1 mx-auto">
               Back to Store <ArrowRight size={12} />
             </button>
          </div>
       </div>
    </div>
  );
};

export default AffiliateLoginPage;
