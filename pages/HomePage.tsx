import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Zap, ShieldCheck, Home, Banknote, Star, ArrowRight, CheckCircle } from 'lucide-react';
import { HERO_PRODUCT } from '../constants';
import { CartContext } from '../App';

const HomePage: React.FC = () => {
  const { addToCart, setIsCartOpen } = useContext(CartContext);

  const handleBuyNow = () => {
    addToCart(HERO_PRODUCT);
    setIsCartOpen(true);
  };

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
        <div className="absolute top-0 right-0 -z-10 w-1/2 h-full bg-blue-50/50 rounded-l-full blur-3xl opacity-60 translate-x-1/4"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in-up">
              <span className="inline-block px-4 py-1 rounded-full bg-blue-100 text-primary font-bold text-sm tracking-wide">
                NEW RELEASE
              </span>
              <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 leading-tight">
                Unlimited <span className="text-primary">5G WiFi</span> <br/>at Home
              </h1>
              <p className="text-xl text-gray-600 max-w-lg">
                Fast, affordable, and reliable internet for every Filipino household. Stream, game, and work without limits.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={handleBuyNow}
                  className="bg-primary text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-blue-900/20 hover:bg-blue-800 hover:scale-105 transition-all"
                >
                  Shop Now
                </button>
                <Link 
                  to={`/product/${HERO_PRODUCT.id}`}
                  className="bg-white text-gray-900 border border-gray-200 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                >
                  Learn More <ArrowRight size={20} />
                </Link>
              </div>
              <div className="flex items-center gap-6 pt-4 text-sm font-medium text-gray-500">
                <div className="flex items-center gap-2">
                  <CheckCircle size={18} className="text-green-500" /> No Hidden Fees
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={18} className="text-green-500" /> Plug & Play
                </div>
              </div>
            </div>

            <div className="relative animate-fade-in-left">
              <div className="relative z-10 bg-white rounded-3xl shadow-2xl p-8 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                <img 
                  src={HERO_PRODUCT.image} 
                  alt="DITO Home WiFi" 
                  className="w-full h-auto rounded-xl"
                />
                <div className="mt-6 flex justify-between items-end">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{HERO_PRODUCT.name}</h3>
                    <p className="text-gray-500">{HERO_PRODUCT.subtitle}</p>
                  </div>
                  <div className="text-3xl font-bold text-primary">₱{HERO_PRODUCT.price.toLocaleString()}</div>
                </div>
              </div>
              {/* Decorative background blobs */}
              <div className="absolute -top-10 -right-10 w-64 h-64 bg-yellow-200 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob"></div>
              <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob animation-delay-2000"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Why Choose DITO Home?</h2>
            <p className="mt-4 text-lg text-gray-600">Experience the difference of next-generation connectivity.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Zap, title: 'Fast 5G Speeds', desc: 'Experience download speeds up to 500 Mbps.', color: 'text-yellow-500', bg: 'bg-yellow-50' },
              { icon: Banknote, title: 'No Hidden Fees', desc: 'Transparent pricing. What you see is what you pay.', color: 'text-green-500', bg: 'bg-green-50' },
              { icon: Home, title: 'Perfect for Home', desc: 'Connect up to 32 devices simultaneously.', color: 'text-blue-500', bg: 'bg-blue-50' },
              { icon: ShieldCheck, title: 'Secure & Reliable', desc: 'Enterprise-grade security for your family.', color: 'text-indigo-500', bg: 'bg-indigo-50' },
            ].map((feature, idx) => (
              <div key={idx} className="p-8 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-shadow group">
                <div className={`w-14 h-14 ${feature.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`${feature.color}`} size={28} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">Loved by Filipinos 🇵🇭</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-8 rounded-3xl shadow-sm">
                <div className="flex text-yellow-400 mb-4">
                  {[...Array(5)].map((_, j) => <Star key={j} size={20} fill="currentColor" />)}
                </div>
                <p className="text-gray-600 mb-6 italic">"Ang bilis ng internet! Sobrang sulit for online classes and work from home. Best purchase this year!"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                     <img src={`https://picsum.photos/seed/user${i}/100/100`} alt="User" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Juan Dela Cruz</h4>
                    <p className="text-xs text-gray-500">Verified Buyer</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
