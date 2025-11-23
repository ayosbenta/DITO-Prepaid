

import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { StoreContext } from '../contexts/StoreContext';
import { Button } from '../components/UI';
import { User, ArrowRight, ShoppingBag, Lock, Mail, Smartphone, UserPlus, AlertCircle, Eye, EyeOff, Loader2, MapPin } from 'lucide-react';
import { User as UserType } from '../types';
import { LocationService, LocationOption } from '../services/locationService';

const CustomerLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { customers, registerCustomer, isSyncing } = useContext(StoreContext);
  
  const [isRegistering, setIsRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Login State
  const [loginData, setLoginData] = useState({ username: '', password: '' });

  // Registration State
  const [regData, setRegData] = useState({
    firstName: '',
    lastName: '',
    mobile: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    street: '',
    province: '',
    city: '',
    barangay: '',
    zipCode: ''
  });

  // Location Data State for Registration
  const [provinces, setProvinces] = useState<LocationOption[]>([]);
  const [cities, setCities] = useState<LocationOption[]>([]);
  const [barangays, setBarangays] = useState<LocationOption[]>([]);
  
  const [selectedProvinceCode, setSelectedProvinceCode] = useState('');
  const [selectedCityCode, setSelectedCityCode] = useState('');
  const [isLoadingLocations, setIsLoadingLocations] = useState(false);

  // Fetch Provinces on Mount if registering
  useEffect(() => {
    if (isRegistering && provinces.length === 0) {
      const fetchProvinces = async () => {
        setIsLoadingLocations(true);
        const data = await LocationService.getProvinces();
        setProvinces(data);
        setIsLoadingLocations(false);
      };
      fetchProvinces();
    }
  }, [isRegistering, provinces.length]);

  // Fetch Cities when Province changes
  useEffect(() => {
    if (selectedProvinceCode) {
      const fetchCities = async () => {
        setIsLoadingLocations(true);
        const data = await LocationService.getCities(selectedProvinceCode);
        setCities(data);
        setBarangays([]);
        setRegData(prev => ({ ...prev, city: '', barangay: '', zipCode: '' }));
        setSelectedCityCode('');
        setIsLoadingLocations(false);
      };
      fetchCities();
    }
  }, [selectedProvinceCode]);

  // Fetch Barangays and Set Zip when City changes
  useEffect(() => {
    if (selectedCityCode) {
      const fetchBarangays = async () => {
        setIsLoadingLocations(true);
        const data = await LocationService.getBarangays(selectedCityCode);
        setBarangays(data);
        
        // Auto-fill Zip Code
        const zip = LocationService.getZipCode(regData.city, regData.province);
        setRegData(prev => ({ ...prev, zipCode: zip, barangay: '' }));
        
        setIsLoadingLocations(false);
      };
      fetchBarangays();
    }
  }, [selectedCityCode, regData.city, regData.province]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Find user
    const customer = customers.find(c => 
      c.username && c.username.toLowerCase() === loginData.username.trim().toLowerCase()
    );

    if (customer) {
      if (customer.password === loginData.password) {
        localStorage.setItem('dito_customer_user', JSON.stringify(customer));
        navigate('/customer/dashboard');
      } else {
        setError('Incorrect password.');
      }
    } else {
      setError('Username not found.');
    }
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setRegData(prev => ({ ...prev, [name]: value }));

    if (name === 'province') {
      const province = provinces.find(p => p.name === value);
      if (province) setSelectedProvinceCode(province.code);
    }
    if (name === 'city') {
      const city = cities.find(c => c.name === value);
      if (city) setSelectedCityCode(city.code);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    // Validate
    if (!regData.firstName || !regData.lastName) return setError('Name fields are required.');
    if (!regData.mobile) return setError('Mobile number is required.');
    if (!regData.email) return setError('Email is required.');
    if (!regData.username) return setError('Username is required.');
    if (!regData.password || regData.password.length < 6) return setError('Password must be at least 6 characters.');
    if (regData.password !== regData.confirmPassword) return setError('Passwords do not match.');
    
    // Address Validation
    if (!regData.street || !regData.province || !regData.city || !regData.barangay) return setError('Complete address details are required.');

    // Check duplicates
    const emailExists = customers.some(c => c.email.toLowerCase() === regData.email.toLowerCase());
    if (emailExists) return setError('Email is already registered.');

    const userExists = customers.some(c => c.username && c.username.toLowerCase() === regData.username.toLowerCase());
    if (userExists) return setError('Username is already taken.');

    const newCustomer: UserType = {
      id: `CUST-${Date.now()}`,
      name: `${regData.firstName} ${regData.lastName}`,
      firstName: regData.firstName,
      lastName: regData.lastName,
      mobile: regData.mobile,
      email: regData.email,
      username: regData.username,
      password: regData.password,
      joinDate: new Date().toISOString(),
      role: 'customer',
      shippingDetails: {
        firstName: regData.firstName,
        lastName: regData.lastName,
        mobile: regData.mobile,
        street: regData.street,
        province: regData.province,
        city: regData.city,
        barangay: regData.barangay,
        zipCode: regData.zipCode
      }
    };

    registerCustomer(newCustomer);
    
    // Auto-login
    localStorage.setItem('dito_customer_user', JSON.stringify(newCustomer));
    
    setSuccessMsg('Account created successfully! Redirecting...');
    setTimeout(() => navigate('/customer/dashboard'), 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-12">
       <div className={`w-full bg-white rounded-3xl shadow-xl p-8 border border-gray-100 transition-all duration-300 ${isRegistering ? 'max-w-2xl' : 'max-w-md'}`}>
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              {isRegistering ? <UserPlus size={32} className="text-primary" /> : <User size={32} className="text-blue-600" />}
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{isRegistering ? 'Create Account' : 'Customer Login'}</h1>
            <p className="text-gray-500 mt-2">{isRegistering ? 'Join DITO Home today.' : 'Track orders and manage profile.'}</p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm rounded-xl text-center flex items-center justify-center gap-2">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          {successMsg && (
            <div className="mb-6 p-3 bg-green-50 text-green-600 text-sm rounded-xl text-center font-bold">
              {successMsg}
            </div>
          )}

          {!isRegistering ? (
            /* LOGIN FORM */
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Username</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="text" 
                    required
                    value={loginData.username}
                    onChange={e => setLoginData({...loginData, username: e.target.value})}
                    className="w-full pl-10 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    placeholder="Enter username"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    required
                    value={loginData.password}
                    onChange={e => setLoginData({...loginData, password: e.target.value})}
                    className="w-full pl-10 pr-10 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    placeholder="••••••••"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                     {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <Button fullWidth className="py-3 bg-blue-600 hover:bg-blue-700 shadow-blue-900/10 text-white mt-4">
                Login to Account
              </Button>
            </form>
          ) : (
            /* REGISTRATION FORM */
            <form onSubmit={handleRegister} className="space-y-6 animate-fade-in relative">
               {isLoadingLocations && (
                 <div className="absolute top-0 right-0 p-2">
                   <Loader2 className="animate-spin text-primary" size={20} />
                 </div>
               )}
               
               <div className="space-y-4">
                 <h3 className="font-bold text-gray-900 border-b pb-2">Personal Information</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">First Name</label>
                      <input 
                        type="text" required
                        value={regData.firstName} onChange={e => setRegData({...regData, firstName: e.target.value})}
                        className="w-full p-2.5 border border-gray-200 rounded-xl text-sm focus:border-primary outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Last Name</label>
                      <input 
                        type="text" required
                        value={regData.lastName} onChange={e => setRegData({...regData, lastName: e.target.value})}
                        className="w-full p-2.5 border border-gray-200 rounded-xl text-sm focus:border-primary outline-none"
                      />
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Mobile Number</label>
                      <div className="relative">
                         <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                         <input 
                          type="tel" required
                          value={regData.mobile} onChange={e => setRegData({...regData, mobile: e.target.value})}
                          className="w-full pl-9 p-2.5 border border-gray-200 rounded-xl text-sm focus:border-primary outline-none"
                          placeholder="0917 123 4567"
                        />
                      </div>
                   </div>

                   <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email Address</label>
                      <div className="relative">
                         <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                         <input 
                          type="email" required
                          value={regData.email} onChange={e => setRegData({...regData, email: e.target.value})}
                          className="w-full pl-9 p-2.5 border border-gray-200 rounded-xl text-sm focus:border-primary outline-none"
                          placeholder="you@example.com"
                        />
                      </div>
                   </div>
                 </div>
               </div>
               
               <div className="space-y-4">
                  <h3 className="font-bold text-gray-900 border-b pb-2 flex items-center gap-2"><MapPin size={18} /> Delivery Address</h3>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Street Address</label>
                    <input 
                      type="text" required
                      name="street"
                      value={regData.street} onChange={e => setRegData({...regData, street: e.target.value})}
                      className="w-full p-2.5 border border-gray-200 rounded-xl text-sm focus:border-primary outline-none"
                      placeholder="House No., Street Name"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Province</label>
                      <select 
                        required 
                        name="province"
                        value={regData.province}
                        onChange={handleLocationChange}
                        className="w-full p-2.5 border border-gray-200 rounded-xl text-sm focus:border-primary outline-none bg-white"
                      >
                        <option value="">Select Province</option>
                        {provinces.map(p => (
                          <option key={p.code} value={p.name}>{p.name}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">City / Municipality</label>
                      <select 
                        required 
                        name="city"
                        value={regData.city}
                        onChange={handleLocationChange}
                        disabled={!regData.province}
                        className="w-full p-2.5 border border-gray-200 rounded-xl text-sm focus:border-primary outline-none bg-white disabled:bg-gray-50"
                      >
                        <option value="">Select City</option>
                        {cities.map(c => (
                          <option key={c.code} value={c.name}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Barangay</label>
                      <select 
                        required 
                        name="barangay"
                        value={regData.barangay}
                        onChange={handleLocationChange}
                        disabled={!regData.city}
                        className="w-full p-2.5 border border-gray-200 rounded-xl text-sm focus:border-primary outline-none bg-white disabled:bg-gray-50"
                      >
                        <option value="">Select Barangay</option>
                        {barangays.map(b => (
                          <option key={b.code} value={b.name}>{b.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Zip Code</label>
                      <input 
                        type="text" required
                        name="zipCode"
                        value={regData.zipCode} onChange={e => setRegData({...regData, zipCode: e.target.value})}
                        className="w-full p-2.5 border border-gray-200 rounded-xl text-sm focus:border-primary outline-none"
                      />
                    </div>
                  </div>
               </div>

               <div className="space-y-4">
                  <h3 className="font-bold text-gray-900 border-b pb-2 flex items-center gap-2"><Lock size={18} /> Account Security</h3>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Username</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input 
                        type="text" required
                        value={regData.username} onChange={e => setRegData({...regData, username: e.target.value})}
                        className="w-full pl-9 p-2.5 border border-gray-200 rounded-xl text-sm focus:border-primary outline-none"
                        placeholder="Choose a username"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input 
                          type={showPassword ? "text" : "password"} required
                          value={regData.password} onChange={e => setRegData({...regData, password: e.target.value})}
                          className="w-full pl-9 pr-9 p-2.5 border border-gray-200 rounded-xl text-sm focus:border-primary outline-none"
                          placeholder="Min 6 chars"
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                           {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Confirm Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input 
                          type={showPassword ? "text" : "password"} required
                          value={regData.confirmPassword} onChange={e => setRegData({...regData, confirmPassword: e.target.value})}
                          className="w-full pl-9 p-2.5 border border-gray-200 rounded-xl text-sm focus:border-primary outline-none"
                          placeholder="Re-enter password"
                        />
                      </div>
                    </div>
                  </div>
               </div>

               <Button fullWidth className="py-3 shadow-lg mt-4" disabled={isSyncing}>
                  {isSyncing ? <Loader2 className="animate-spin" size={18} /> : 'Register Account'}
               </Button>
            </form>
          )}
          
          <div className="my-6 flex items-center gap-4">
            <div className="h-px bg-gray-100 flex-1"></div>
            <span className="text-xs text-gray-400 font-medium uppercase">Or</span>
            <div className="h-px bg-gray-100 flex-1"></div>
          </div>

          <div className="text-center">
             <button 
               onClick={() => { setIsRegistering(!isRegistering); setError(''); setSuccessMsg(''); window.scrollTo(0,0); }}
               className="text-sm font-bold text-primary hover:underline"
             >
               {isRegistering ? 'Already have an account? Login' : 'Don\'t have an account? Create one'}
             </button>
             
             <div className="mt-6">
                <Link to="/" className="text-xs text-gray-400 hover:text-gray-600 flex items-center justify-center gap-1 mx-auto">
                   <ArrowRight className="rotate-180" size={12} /> Back to Home
                </Link>
             </div>
          </div>
       </div>
    </div>
  );
};

export default CustomerLoginPage;