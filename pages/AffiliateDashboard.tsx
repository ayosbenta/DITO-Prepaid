
import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { StoreContext } from '../contexts/StoreContext';
import { Copy, DollarSign, ShoppingBag, Users, ExternalLink, CheckCircle, Wallet, Clock, XCircle, CreditCard, LayoutDashboard } from 'lucide-react';
import { Button, Badge } from '../components/UI';

const AffiliateDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { affiliates, orders, payouts, requestPayout } = useContext(StoreContext);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'payouts'>('dashboard');
  
  // Simulation: In a real app, we'd get the logged-in ID from AuthContext
  const loggedInAffiliateId = localStorage.getItem('dito_affiliate_id');
  const currentAffiliate = affiliates.find(a => a.id === loggedInAffiliateId);

  // Payout Form State
  const [payoutAmount, setPayoutAmount] = useState<number>(0);
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);

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
    .filter(o => o.status !== 'Delivered')
    .reduce((acc, o) => acc + (o.commission || (o.total * 0.05)), 0); 
  
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

  const handleRequestPayout = (e: React.FormEvent) => {
    e.preventDefault();
    if (payoutAmount > currentAffiliate.walletBalance) {
      alert("Insufficient balance.");
      return;
    }
    if (payoutAmount < 100) {
      alert("Minimum payout is ₱100");
      return;
    }
    
    requestPayout({
      affiliateId: currentAffiliate.id,
      affiliateName: currentAffiliate.name,
      amount: payoutAmount,
      method: 'GCash',
      accountName,
      accountNumber
    });

    setIsPayoutModalOpen(false);
    setPayoutAmount(0);
  };

  const affiliatePayouts = payouts.filter(p => p.affiliateId === currentAffiliate.id);

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome, {currentAffiliate.name}</h1>
            <p className="text-gray-500">Affiliate Dashboard • ID: {currentAffiliate.id}</p>
          </div>
          <div className="flex gap-2">
             <Button 
               variant={activeTab === 'dashboard' ? 'primary' : 'outline'} 
               onClick={() => setActiveTab('dashboard')}
               className="text-sm"
             >
               <LayoutDashboard size={16} /> Dashboard
             </Button>
             <Button 
               variant={activeTab === 'payouts' ? 'primary' : 'outline'} 
               onClick={() => setActiveTab('payouts')}
               className="text-sm"
             >
               <DollarSign size={16} /> Payouts
             </Button>
             <Button variant="ghost" onClick={handleLogout} className="text-sm">Logout</Button>
          </div>
        </div>

        {activeTab === 'dashboard' && (
          <>
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
                Share this link to earn commissions on every successful delivery. Rates vary by product.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Wallet */}
              <div className="bg-gradient-to-br from-primary to-secondary rounded-2xl p-6 text-white shadow-lg shadow-red-900/20 relative overflow-hidden">
                  <div className="relative z-10">
                    <p className="text-red-100 text-sm font-medium mb-1">Current Wallet Balance</p>
                    <h3 className="text-4xl font-black">₱{currentAffiliate.walletBalance.toLocaleString()}</h3>
                    <div className="mt-4 flex gap-2">
                      <button 
                        onClick={() => setActiveTab('payouts')}
                        className="bg-white/20 hover:bg-white/30 text-white text-xs font-bold px-3 py-1.5 rounded-lg backdrop-blur-sm transition-colors"
                      >
                        Request Payout
                      </button>
                    </div>
                  </div>
                  <Wallet className="absolute right-4 bottom-4 text-white/10" size={80} />
              </div>

              {/* Total Sales */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                      <ShoppingBag size={24} />
                    </div>
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold">+ Sales</span>
                  </div>
                  <p className="text-gray-500 text-sm font-medium">Total Referred Sales</p>
                  <h3 className="text-3xl font-bold text-gray-900">₱{currentAffiliate.totalSales.toLocaleString()}</h3>
              </div>

              {/* Pending */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
                      <Clock size={24} />
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
                      <th className="p-4">Commission</th>
                      <th className="p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {referredOrders.length > 0 ? referredOrders.map(o => (
                      <tr key={o.id} className="hover:bg-gray-50">
                        <td className="p-4 text-gray-500">{o.date}</td>
                        <td className="p-4 font-medium text-gray-900">{o.id}</td>
                        <td className="p-4">₱{o.total.toLocaleString()}</td>
                        <td className="p-4 font-bold text-primary">
                            ₱{(o.commission || (o.total * 0.05)).toLocaleString()}
                        </td>
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
          </>
        )}

        {activeTab === 'payouts' && (
          <div className="space-y-8">
             <div className="flex flex-col md:flex-row gap-8">
                {/* Wallet Card (Compact) */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm md:w-1/3">
                   <div className="flex items-center justify-between mb-4">
                     <h3 className="font-bold text-gray-900">Your Wallet</h3>
                     <Wallet className="text-primary" />
                   </div>
                   <p className="text-3xl font-black text-gray-900">₱{currentAffiliate.walletBalance.toLocaleString()}</p>
                   <p className="text-sm text-gray-500 mt-1">Available for payout</p>
                   <Button fullWidth className="mt-6" onClick={() => setIsPayoutModalOpen(true)}>
                     Request Payout
                   </Button>
                </div>

                {/* Payout Info */}
                <div className="flex-1 bg-blue-50 p-6 rounded-2xl border border-blue-100">
                   <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2"><CreditCard size={18}/> Payment Method</h3>
                   <p className="text-blue-800 text-sm mb-4">We currently process payouts exclusively via <strong>GCash</strong>. Requests are typically processed within 24-48 hours.</p>
                   <ul className="text-sm text-blue-700 space-y-2 list-disc list-inside">
                     <li>Minimum withdrawal amount is ₱100.</li>
                     <li>Ensure your GCash name matches your registered affiliate name.</li>
                     <li>Incorrect details may cause delays or rejection.</li>
                   </ul>
                </div>
             </div>

             <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h3 className="font-bold text-gray-900">Payout History</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 font-medium">
                      <tr>
                        <th className="p-4">Request ID</th>
                        <th className="p-4">Date</th>
                        <th className="p-4">Amount</th>
                        <th className="p-4">Details</th>
                        <th className="p-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {affiliatePayouts.length > 0 ? affiliatePayouts.map(p => (
                        <tr key={p.id} className="hover:bg-gray-50">
                          <td className="p-4 font-medium text-gray-900">{p.id}</td>
                          <td className="p-4 text-gray-500">
                            {new Date(p.dateRequested).toLocaleDateString()}
                          </td>
                          <td className="p-4 font-bold">₱{p.amount.toLocaleString()}</td>
                          <td className="p-4 text-xs text-gray-500">
                             <div className="font-bold text-gray-700">{p.method}</div>
                             {p.accountNumber} ({p.accountName})
                          </td>
                          <td className="p-4">
                            <Badge color={p.status === 'Approved' ? 'green' : p.status === 'Rejected' ? 'red' : 'yellow'}>
                               {p.status}
                            </Badge>
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-gray-400">
                            No payout history found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
             </div>
          </div>
        )}

        {/* Payout Request Modal */}
        {isPayoutModalOpen && (
           <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
             <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Request Payout via GCash</h3>
                  <button onClick={() => setIsPayoutModalOpen(false)} className="text-gray-400 hover:text-gray-600"><XCircle size={20} /></button>
                </div>

                <form onSubmit={handleRequestPayout} className="space-y-4">
                   <div>
                     <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Amount (₱)</label>
                     <input 
                        type="number" 
                        required
                        min="100"
                        max={currentAffiliate.walletBalance}
                        value={payoutAmount}
                        onChange={e => setPayoutAmount(Number(e.target.value))}
                        className="w-full p-3 border border-gray-200 rounded-xl text-lg font-bold text-primary focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                     />
                     <p className="text-xs text-gray-400 mt-1">Max available: ₱{currentAffiliate.walletBalance.toLocaleString()}</p>
                   </div>
                   
                   <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-blue-700 uppercase mb-1">GCash Account Name</label>
                        <input 
                           type="text" 
                           required
                           value={accountName}
                           onChange={e => setAccountName(e.target.value)}
                           placeholder="Ex: Juan Dela Cruz"
                           className="w-full p-2 border border-blue-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-blue-700 uppercase mb-1">GCash Number</label>
                        <input 
                           type="text" 
                           required
                           value={accountNumber}
                           onChange={e => setAccountNumber(e.target.value)}
                           placeholder="0917 123 4567"
                           className="w-full p-2 border border-blue-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                        />
                      </div>
                   </div>

                   <div className="pt-2">
                     <Button fullWidth disabled={payoutAmount > currentAffiliate.walletBalance || payoutAmount < 100}>
                       Submit Request
                     </Button>
                   </div>
                </form>
             </div>
           </div>
        )}

      </div>
    </div>
  );
};

export default AffiliateDashboard;