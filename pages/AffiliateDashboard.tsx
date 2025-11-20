import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { StoreContext } from '../contexts/StoreContext';
import { Copy, DollarSign, ShoppingBag, Users, ExternalLink, ArrowRight, CheckCircle, Wallet } from 'lucide-react';
import { Button, Badge } from '../components/UI';

const AffiliateDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { affiliates, orders } = useContext(StoreContext);
  
  // Simulation: In a real app, we'd get the logged-in ID from AuthContext
  const loggedInAffiliateId = localStorage.getItem('dito_affiliate_id');
  const currentAffiliate = affiliates.find(a => a.id === loggedInAffiliateId);

  const [copied, setCopied] = useState(false);

  if (!loggedInAffiliateId || !currentAffiliate) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="text-center max-w-md">
           <h2 className="text-2xl font-bold text-gray-900 mb-4">Affiliate Access Required</h2>
           <p className="text-gray-500 mb-8">You must log in to view this dashboard.</p>
           <Link to="/affiliate/login">
             <Button fullWidth>Login to Affiliate Portal</Button>
           </Link>
        </div>
      </div>
    );
  }

  // Calculate Stats
  const referredOrders = orders.filter(o => o.referralId === currentAffiliate.id);
  const pendingCommission = referredOrders
    .filter(o => o.status !== 'Delivered' && o.status !== 'Pending') // Assuming Pending means order just placed but not processed? Or if logic differs. Let's assume Processing/Shipped are "Pending payout"
    .filter(o => o.status !== 'Delivered')
    .reduce((acc, o) => acc + (o.total * 0.05), 0);
  
  const referralLink = `${window.location.origin}/?ref=${currentAffiliate.id}`;

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLogout = () => {
    localStorage.removeItem('dito_affiliate_id');
    navigate('/affiliate/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome, {currentAffiliate.name}</h1>
            <p className="text-gray-500">Affiliate Dashboard • ID: {currentAffiliate.id}</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>Logout</Button>
        </div>

        {/* Referral Link Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <ExternalLink size={20} className="text-primary" />
            Your Unique Referral Link
          </h3>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-600 font-mono text-sm truncate select-all">
              {referralLink}
            </div>
            <Button onClick={copyLink} className="shrink-0 w-full sm:w-auto">
              {copied ? <span className="flex items-center gap-2"><CheckCircle size={16} /> Copied</span> : <span className="flex items-center gap-2"><Copy size={16} /> Copy Link</span>}
            </Button>
          </div>
          <p className="text-sm text-gray-400 mt-3">
            Share this link to earn 5% commission on every successful delivery.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
           {/* Wallet */}
           <div className="bg-gradient-to-br from-primary to-secondary rounded-2xl p-6 text-white shadow-lg shadow-red-900/20 relative overflow-hidden">
              <div className="relative z-10">
                <p className="text-red-100 text-sm font-medium mb-1">Current Wallet Balance</p>
                <h3 className="text-4xl font-black">₱{currentAffiliate.walletBalance.toLocaleString()}</h3>
                <p className="text-red-100 text-xs mt-4 flex items-center gap-1">
                  <CheckCircle size={12} /> Auto-credited upon delivery
                </p>
              </div>
              <Wallet className="absolute right-4 bottom-4 text-white/10" size={80} />
           </div>

           {/* Total Sales */}
           <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                 <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                   <ShoppingBag size={24} />
                 </div>
                 <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold">+5% Rate</span>
              </div>
              <p className="text-gray-500 text-sm font-medium">Total Referred Sales</p>
              <h3 className="text-3xl font-bold text-gray-900">₱{currentAffiliate.totalSales.toLocaleString()}</h3>
           </div>

           {/* Pending */}
           <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                 <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
                   <DollarSign size={24} />
                 </div>
              </div>
              <p className="text-gray-500 text-sm font-medium">Pending Commissions</p>
              <h3 className="text-3xl font-bold text-gray-900">₱{pendingCommission.toLocaleString()}</h3>
              <p className="text-xs text-gray-400 mt-1">Processing Orders</p>
           </div>
        </div>

        {/* Referred Orders Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
           <div className="p-6 border-b border-gray-100">
              <h3 className="font-bold text-gray-900">Referral History</h3>
           </div>
           <div className="overflow-x-auto">
             <table className="w-full text-sm text-left">
               <thead className="bg-gray-50 text-gray-500 font-medium">
                 <tr>
                   <th className="p-4">Order Date</th>
                   <th className="p-4">Order ID</th>
                   <th className="p-4">Amount</th>
                   <th className="p-4">Commission (5%)</th>
                   <th className="p-4">Status</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-100">
                 {referredOrders.length > 0 ? referredOrders.map(o => (
                   <tr key={o.id} className="hover:bg-gray-50">
                     <td className="p-4 text-gray-500">{o.date}</td>
                     <td className="p-4 font-medium text-gray-900">{o.id}</td>
                     <td className="p-4">₱{o.total.toLocaleString()}</td>
                     <td className="p-4 font-bold text-primary">₱{(o.total * 0.05).toLocaleString()}</td>
                     <td className="p-4">
                        <Badge color={o.status === 'Delivered' ? 'green' : o.status === 'Processing' ? 'blue' : 'gray'}>
                          {o.status}
                        </Badge>
                     </td>
                   </tr>
                 )) : (
                   <tr>
                     <td colSpan={5} className="p-8 text-center text-gray-400">
                       No referrals yet. Share your link to start earning!
                     </td>
                   </tr>
                 )}
               </tbody>
             </table>
           </div>
        </div>

      </div>
    </div>
  );
};

export default AffiliateDashboard;