import React, { useContext, useState } from 'react';
import { CartContext } from '../App';
import { PaymentMethod } from '../types';
import { CheckCircle, CreditCard, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';

const CheckoutPage: React.FC = () => {
  const { items, cartTotal } = useContext(CartContext);
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.COD);

  if (items.length === 0 && step !== 3) {
    return (
      <div className="pt-40 pb-20 min-h-screen flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
        <Link to="/" className="text-primary hover:underline">Go back shopping</Link>
      </div>
    );
  }

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(3);
  };

  return (
    <div className="pt-32 pb-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Steps */}
      <div className="flex justify-center mb-12">
        <div className="flex items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>1</div>
          <div className={`w-16 h-1 bg-gray-200 ${step > 1 ? 'bg-primary' : ''}`} />
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 2 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>2</div>
          <div className={`w-16 h-1 bg-gray-200 ${step > 2 ? 'bg-primary' : ''}`} />
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 3 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>3</div>
        </div>
      </div>

      {step === 3 ? (
        <div className="text-center animate-fade-in">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={48} className="text-green-500" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Order Placed!</h1>
          <p className="text-xl text-gray-600 mb-8">Thank you for your purchase. Your order #ORD-3920 is being processed.</p>
          <Link to="/" className="inline-block bg-primary text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-blue-800 transition-colors">
            Back to Home
          </Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Form */}
          <div className="lg:col-span-2 space-y-8">
            <form id="checkout-form" onSubmit={handlePlaceOrder}>
              {/* Section 1: Info */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <div className="bg-blue-100 p-2 rounded-lg"><Truck size={20} className="text-primary" /></div>
                  Shipping Information
                </h2>
                <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input required type="text" className="w-full border-gray-200 rounded-lg focus:ring-primary focus:border-primary p-3 border" />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input required type="text" className="w-full border-gray-200 rounded-lg focus:ring-primary focus:border-primary p-3 border" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <input required type="text" className="w-full border-gray-200 rounded-lg focus:ring-primary focus:border-primary p-3 border" />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input required type="text" className="w-full border-gray-200 rounded-lg focus:ring-primary focus:border-primary p-3 border" />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input required type="tel" className="w-full border-gray-200 rounded-lg focus:ring-primary focus:border-primary p-3 border" />
                  </div>
                </div>
              </div>

              {/* Section 2: Payment */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mt-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <div className="bg-blue-100 p-2 rounded-lg"><CreditCard size={20} className="text-primary" /></div>
                  Payment Method
                </h2>
                <div className="space-y-4">
                  {Object.values(PaymentMethod).map((method) => (
                    <label key={method} className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === method ? 'border-primary bg-blue-50' : 'border-gray-200 hover:border-blue-200'}`}>
                      <input 
                        type="radio" 
                        name="payment" 
                        value={method} 
                        checked={paymentMethod === method}
                        onChange={() => setPaymentMethod(method)}
                        className="w-5 h-5 text-primary border-gray-300 focus:ring-primary"
                      />
                      <span className="ml-3 font-medium text-gray-900">{method}</span>
                    </label>
                  ))}
                </div>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
             <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 sticky top-32">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h3>
                <div className="space-y-4 max-h-60 overflow-y-auto mb-6 pr-2">
                   {items.map(item => (
                     <div key={item.id} className="flex gap-3">
                        <img src={item.image} alt="" className="w-12 h-12 rounded-lg object-cover bg-gray-100" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 line-clamp-1">{item.name}</p>
                          <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                        </div>
                        <div className="text-sm font-bold">₱{(item.price * item.quantity).toLocaleString()}</div>
                     </div>
                   ))}
                </div>
                
                <div className="border-t pt-4 space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600"><span>Subtotal</span> <span>₱{cartTotal.toLocaleString()}</span></div>
                  <div className="flex justify-between text-gray-600"><span>Shipping</span> <span>Free</span></div>
                </div>
                <div className="border-t mt-4 pt-4 flex justify-between items-center mb-6">
                   <span className="font-bold text-gray-900 text-lg">Total</span>
                   <span className="font-bold text-primary text-xl">₱{cartTotal.toLocaleString()}</span>
                </div>

                <button 
                  type="submit" 
                  form="checkout-form"
                  className="w-full bg-primary text-white py-4 rounded-xl font-bold shadow-lg hover:bg-blue-800 transition-transform active:scale-95"
                >
                  Place Order
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
