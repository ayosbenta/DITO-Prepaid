import React from 'react';
import { LayoutDashboard, Package, Users, Settings, TrendingUp, AlertCircle } from 'lucide-react';
import { RECENT_ORDERS, SALES_DATA } from '../constants';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Badge } from '../components/UI';

const AdminDashboard: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-gray-50 pt-20">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r fixed h-full hidden lg:block">
        <div className="p-6">
           <h2 className="text-2xl font-bold text-gray-900">Admin</h2>
        </div>
        <nav className="px-4 space-y-2">
          {[
            { icon: LayoutDashboard, label: 'Dashboard', active: true },
            { icon: Package, label: 'Products', active: false },
            { icon: Users, label: 'Customers', active: false },
            { icon: Settings, label: 'Settings', active: false },
          ].map((item) => (
            <button 
              key={item.label}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${item.active ? 'bg-primary text-white shadow-md shadow-blue-900/20' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <item.icon size={18} /> {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-500">Welcome back, Admin.</p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
             { label: 'Total Sales', value: '₱124,500', icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-50' },
             { label: 'Total Orders', value: '1,240', icon: Package, color: 'text-blue-500', bg: 'bg-blue-50' },
             { label: 'New Customers', value: '340', icon: Users, color: 'text-purple-500', bg: 'bg-purple-50' },
             { label: 'Low Stock', value: '2 Items', icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50' },
          ].map((kpi, i) => (
             <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                <div>
                   <p className="text-sm text-gray-500 font-medium mb-1">{kpi.label}</p>
                   <h3 className="text-2xl font-bold text-gray-900">{kpi.value}</h3>
                </div>
                <div className={`w-12 h-12 ${kpi.bg} rounded-full flex items-center justify-center`}>
                   <kpi.icon className={kpi.color} size={24} />
                </div>
             </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
             <h3 className="text-lg font-bold text-gray-900 mb-6">Weekly Revenue</h3>
             <div className="h-64 w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={SALES_DATA}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                   <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                   <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                   <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                   <Line type="monotone" dataKey="sales" stroke="#1E40AF" strokeWidth={3} dot={{r: 4, fill: '#1E40AF', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 6}} />
                 </LineChart>
               </ResponsiveContainer>
             </div>
           </div>
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
             <h3 className="text-lg font-bold text-gray-900 mb-6">Orders Activity</h3>
             <div className="h-64 w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={SALES_DATA}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                   <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                   <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                   <Bar dataKey="sales" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={30} />
                 </BarChart>
               </ResponsiveContainer>
             </div>
           </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
           <div className="p-6 border-b border-gray-100">
             <h3 className="text-lg font-bold text-gray-900">Recent Orders</h3>
           </div>
           <div className="overflow-x-auto">
             <table className="w-full">
               <thead className="bg-gray-50">
                 <tr>
                   <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Order ID</th>
                   <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Customer</th>
                   <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                   <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                   <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-100">
                 {RECENT_ORDERS.map((order) => (
                   <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">{order.id}</td>
                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.customer}</td>
                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
                     <td className="px-6 py-4 whitespace-nowrap">
                        <Badge color={
                          order.status === 'Delivered' ? 'green' : 
                          order.status === 'Processing' ? 'blue' : 
                          order.status === 'Pending' ? 'yellow' : 'gray'
                        }>
                          {order.status}
                        </Badge>
                     </td>
                     <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 text-right">₱{order.total.toLocaleString()}</td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
