
import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { StoreContext } from '../contexts/StoreContext';
import { Button } from '../components/UI';
import { User, ArrowRight, ShoppingBag } from 'lucide-react';

const CustomerLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { customers } = useContext(StoreContext);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple check if email exists in previous orders/customers list
    const customer = customers.find(c => c.email.toLowerCase() === email.toLowerCase());
    
    if (customer) {
      // Simulate login session
      localStorage.setItem('dito_customer_email', email);
      navigate('/');
    } else {
      setError('We couldn\'t find an account with that email.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
       <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-gray-100 animate-fade-in-up">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <User size={32} className="text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Customer Login</h1>
            <p className="text-gray-500 mt-2">Track your orders and manage your account.</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-xl text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email Address</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                placeholder="you@example.com"
              />
            </div>

            <Button fullWidth className="py-3 bg-blue-600 hover:bg-blue-700 shadow-blue-900/10 text-white">
              Login to Account
            </Button>
          </form>
          
          <div className="my-6 flex items-center gap-4">
            <div className="h-px bg-gray-100 flex-1"></div>
            <span className="text-xs text-gray-400 font-medium uppercase">Or</span>
            <div className="h-px bg-gray-100 flex-1"></div>
          </div>

          <div className="text-center space-y-4">
             <Link to="/catalog">
               <Button variant="outline" fullWidth className="py-3 flex items-center justify-center gap-2">
                 <ShoppingBag size={18} /> Continue as Guest
               </Button>
             </Link>
             
             <button onClick={() => navigate('/')} className="text-xs text-gray-400 hover:text-gray-600 flex items-center justify-center gap-1 mx-auto">
               Back to Home <ArrowRight size={12} />
             </button>
          </div>
       </div>
    </div>
  );
};

export default CustomerLoginPage;
