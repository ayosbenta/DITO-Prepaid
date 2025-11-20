import React, { useState } from 'react';
import { 
  LayoutDashboard, Package, ShoppingBag, Users, Settings, 
  TrendingUp, AlertCircle, Search, Bell,
  MoreHorizontal, ArrowUpRight, ArrowDownRight, Filter, LogOut, Menu, X
} from 'lucide-react';
import { RECENT_ORDERS, SALES_DATA } from '../constants';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, BarChart, Bar, Cell 
} from 'recharts';
import { Badge } from '../components/UI';
import { Link } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard' },
    { icon: Package, label: 'Products' },
    { icon: ShoppingBag, label: 'Orders' },
    { icon: Users, label: 'Customers' },
    { icon: Settings, label: 'Settings' },
  ];

  // KPI Data with red theme where appropriate
  const kpis = [
    { 
      label: 'Total Revenue', 
      value: '₱124,500', 
      trend: '+12.5%', 
      trendUp: true,
      icon: TrendingUp, 
      color: 'text-primary', 
      bg: 'bg-red-50' 
    },
    { 
      label: 'Total Orders', 
      value: '1,240', 
      trend: '+4.2%', 
      trendUp: true,
      icon: ShoppingBag, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50' 
    },
    { 
      label: 'New Customers', 
      value: '340', 
      trend: '-2.1%', 
      trendUp: false,
      icon: Users, 
      color: 'text-emerald-600', 
      bg: 'bg-emerald-50' 
    },
    { 
      label: 'Low Stock', 
      value: '4 Items', 
      trend: 'Urgent', 
      trendUp: false, 
      icon: AlertCircle, 
      color: 'text-orange-600', 
      bg: 'bg-orange-50' 
    },
  ];

  const handleMenuClick = (label: string) => {
    setActiveTab(label);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-gray-900 relative overflow-x-hidden">
      
      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-20 xl:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        w-72 bg-white border-r border-gray-100 fixed inset-y-0 left-0 z-30 flex flex-col transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
        xl:translate-x-0 xl:shadow-none
      `}>
        <div className="p-6 sm:p-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-red-600/20 text-white font-black">
              D
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">DITO Admin</span>
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="xl:hidden p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 px-6 py-4 space-y-2 overflow-y-auto">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-4">Main Menu</div>
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleMenuClick(item.label)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                activeTab === item.label 
                  ? 'bg-red-50 text-primary shadow-sm' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon size={20} className={activeTab === item.label ? 'text-primary' : 'text-gray-400 group-hover:text-gray-600'} />
              {item.label}
            </button>
          ))}
        </div>

        <div className="p-6 border-t border-gray-50">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors">
            <img src="https://ui-avatars.com/api/?name=Admin+User&background=C8102E&color=fff" alt="Admin" className="w-10 h-10 rounded-full" />
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold text-gray-900 truncate">Admin User</p>
              <p className="text-xs text-gray-500 truncate">admin@dito.ph</p>
            </div>
            <LogOut size={16} className="text-gray-400" />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 xl:ml-72 p-4 sm:p-8 overflow-y-auto w-full">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-500 hover:bg-gray-50 xl:hidden shadow-sm active:scale-95 transition-transform"
            >
              <Menu size={20} />
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Dashboard Overview</h1>
              <p className="text-gray-500 text-xs sm:text-sm mt-0.5">Welcome back, Admin.</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-primary w-full sm:w-64 transition-all shadow-sm"
              />
            </div>
            <button className="relative p-2.5 bg-white border border-gray-200 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm flex-shrink-0">
              <Bell size={20} />
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-primary rounded-full border-2 border-white"></span>
            </button>
            <Link to="/" className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm whitespace-nowrap text-sm font-medium flex-shrink-0">
                View Site
            </Link>
          </div>
        </header>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {kpis.map((kpi, idx) => (
            <div key={idx} className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group">
              <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${kpi.bg} group-hover:scale-110 transition-transform duration-300`}>
                  <kpi.icon className={kpi.color} size={24} />
                </div>
                <span className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg ${kpi.trendUp ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50'}`}>
                  {kpi.trend}
                  {kpi.trendUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                </span>
              </div>
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">{kpi.label}</p>
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">{kpi.value}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8 mb-8">
          {/* Revenue Chart */}
          <div className="lg:col-span-2 bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-6 sm:mb-8">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Revenue Analytics</h3>
                <p className="text-gray-500 text-sm">Monthly revenue performance</p>
              </div>
            </div>
            <div className="h-[250px] sm:h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={SALES_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#C8102E" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#C8102E" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#64748B', fontSize: 12, fontWeight: 500}} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#64748B', fontSize: 12, fontWeight: 500}} 
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#fff', 
                      borderRadius: '12px', 
                      border: 'none', 
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                    }}
                    cursor={{ stroke: '#CBD5E1', strokeWidth: 1, strokeDasharray: '5 5' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="sales" 
                    stroke="#C8102E" 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill="url(#colorSales)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Orders Bar Chart */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-6 sm:mb-8">
               <div>
                <h3 className="text-lg font-bold text-gray-900">Daily Orders</h3>
                <p className="text-gray-500 text-sm">Last 7 days</p>
              </div>
            </div>
            <div className="h-[250px] sm:h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={SALES_DATA} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#64748B', fontSize: 11}} 
                    dy={10}
                  />
                  <Tooltip 
                     cursor={{fill: '#F8FAFC'}}
                     contentStyle={{
                      backgroundColor: '#1E293B', 
                      borderRadius: '8px', 
                      border: 'none', 
                      color: '#fff',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Bar dataKey="sales" radius={[6, 6, 0, 0]} barSize={24}>
                    {SALES_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === SALES_DATA.length - 1 ? '#C8102E' : '#E2E8F0'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Orders Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-5 sm:p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Recent Orders</h3>
              <p className="text-gray-500 text-sm">Manage and track your recent shipments.</p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
               <button className="flex-1 sm:flex-none justify-center px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 flex items-center gap-2 transition-colors">
                 <Filter size={16} /> Filter
               </button>
               <button className="flex-1 sm:flex-none justify-center px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-secondary transition-colors shadow-sm shadow-red-600/20">
                 Export
               </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {RECENT_ORDERS.map((order) => (
                  <tr key={order.id} className="hover:bg-red-50/30 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                      {order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center text-xs font-bold text-primary mr-3">
                          {order.customer.charAt(0)}
                        </div>
                        <div className="text-sm font-medium text-gray-900">{order.customer}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                       <Badge color={
                         order.status === 'Delivered' ? 'green' : 
                         order.status === 'Processing' ? 'blue' : 
                         order.status === 'Shipped' ? 'blue' :
                         order.status === 'Pending' ? 'yellow' : 'gray'
                       }>
                         {order.status}
                       </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 text-right">
                      ₱{order.total.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button className="text-gray-400 hover:text-primary transition-colors">
                        <MoreHorizontal size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex justify-center">
            <button className="text-sm text-primary font-medium hover:underline transition-colors">View All Orders</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;