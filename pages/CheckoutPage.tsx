import React, { useContext, useState } from 'react';
import { CartContext } from '../contexts/CartContext';
import { PaymentMethod } from '../types';
import { CheckCircle, CreditCard, Truck, ChevronRight, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/UI';

const CheckoutPage: React.FC = () => {
  const { items, cartTotal, clearCart } = useContext(CartContext);
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.COD);

  if (items.length === 0 && step !== 3) {
    return (
      <div className="pt-40 pb-20 min-h-screen flex flex-col items-center justify-center text-center px-4">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <Truck size={40} className="text-gray-400" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
        <Link to="/catalog">
          <Button variant="outline">Go back shopping</Button>
        </Link>
      </div>
    );
  }

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    clearCart();
    setStep(3);
    window.scrollTo(0,0);
  };

  return (
    <div className="pt-32 pb-20 min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Step Indicator */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center gap-4">
            {['Shipping', 'Payment', 'Confirmation'].map((label, i) => {
              const stepNum = i + 1;
              const isActive = step >= stepNum;
              return (
                <div key={label} className="flex items-center">
                  <div className={`flex items-center gap-2 ${isActive ? 'text-primary' : 'text-gray-400'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${isActive ? 'bg-primary border-primary text-white' : 'border-gray-300'}`}>
                      {stepNum}
                    </div>
                    <span className="font-bold hidden sm:block">{label}</span>
                  </div>
                  {stepNum < 3 && (
                    <div className={`w-12 h-0.5 mx-4 ${step > stepNum ? 'bg-primary' : 'bg-gray-300'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {step === 3 ? (
          <div className="max-w-md mx-auto text-center bg-white p-12 rounded-3xl shadow-xl shadow-gray-200/50 animate-fade-in-up">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={48} className="text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
            <p className="text-gray-500 mb-8">Thank you for your purchase. Your order #ORD-3920 has been placed successfully.</p>
            <Link to="/">
              <Button fullWidth className="py-4">Return Home</Button>
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Left: Form */}
            <div className="lg:col-span-2">
              <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-8">
                {/* Section: Address */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <div className="bg-red-50 p-2 rounded-xl"><Truck size={20} className="text-primary" /></div>
                    Delivery Address
                  </h2>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-2">First Name</label>
                      <input required type="text" className="w-full border-gray-200 bg-gray-50 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary p-3 border transition-all outline-none" />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Last Name</label>
                      <input required type="text" className="w-full border-gray-200 bg-gray-50 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary p-3 border transition-all outline-none" />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Street Address</label>
                      <input required type="text" className="w-full border-gray-200 bg-gray-50 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary p-3 border transition-all outline-none" />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-2">City</label>
                      <input required type="text" className="w-full border-gray-200 bg-gray-50 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary p-3 border transition-all outline-none" />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Phone Number</label>
                      <input required type="tel" className="w-full border-gray-200 bg-gray-50 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary p-3 border transition-all outline-none" />
                    </div>
                  </div>
                </div>

                {/* Section: Payment */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <div className="bg-red-50 p-2 rounded-xl"><CreditCard size={20} className="text-primary" /></div>
                    Payment Method
                  </h2>
                  <div className="space-y-3">
                    {Object.values(PaymentMethod).map((method) => (
                      <label key={method} className={`flex items-center p-4 border rounded-2xl cursor-pointer transition-all ${paymentMethod === method ? 'border-primary bg-red-50/50 ring-1 ring-primary' : 'border-gray-200 hover:border-red-200 bg-gray-50'}`}>
                        <input 
                          type="radio" 
                          name="payment" 
                          value={method} 
                          checked={paymentMethod === method}
                          onChange={() => setPaymentMethod(method)}
                          className="w-5 h-5 text-primary border-gray-300 focus:ring-primary"
                        />
                        <span className="ml-4 font-bold text-gray-900">{method}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </form>
            </div>

            {/* Right: Summary */}
            <div className="lg:col-span-1">
               <div className="bg-white p-8 rounded-3xl shadow-lg shadow-gray-200 border border-gray-100 sticky top-32">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>
                  <div className="space-y-4 max-h-60 overflow-y-auto mb-8 pr-2 scrollbar-thin">
                     {items.map(item => (
                       <div key={item.id} className="flex gap-4">
                          <div className="w-14 h-14 rounded-lg bg-gray-50 border border-gray-100 p-1 flex-shrink-0">
                             <img src={item.image} alt="" className="w-full h-full object-contain" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-bold text-gray-900 line-clamp-1">{item.name}</p>
                            <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                          </div>
                          <div className="text-sm font-bold">₱{(item.price * item.quantity).toLocaleString()}</div>
                       </div>
                     ))}
                  </div>
                  
                  <div className="border-t border-gray-100 pt-6 space-y-3 text-sm">
                    <div className="flex justify-between text-gray-500"><span>Subtotal</span> <span>₱{cartTotal.toLocaleString()}</span></div>
                    <div className="flex justify-between text-gray-500"><span>Shipping</span> <span className="text-green-600 font-bold">Free</span></div>
                    <div className="flex justify-between text-gray-500"><span>Tax</span> <span>Included</span></div>
                  </div>
                  
                  <div className="border-t border-gray-100 mt-6 pt-6 flex justify-between items-center mb-8">
                     <span className="font-bold text-gray-900 text-lg">Total</span>
                     <span className="font-black text-primary text-2xl">₱{cartTotal.toLocaleString()}</span>
                  </div>

                  <Button 
                    onClick={() => (document.getElementById('checkout-form') as HTMLFormElement)?.requestSubmit()}
                    fullWidth 
                    className="py-4 shadow-red-500/20 shadow-lg text-lg"
                  >
                    Place Order
                  </Button>
                  
                  <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-400">
                    <Lock size={12} /> Secure SSL Encryption
                  </div>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;