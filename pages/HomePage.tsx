import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Zap, Shield, Wifi, CreditCard, Star, ArrowRight, Check } from 'lucide-react';
import { HERO_PRODUCT } from '../constants';
import { CartContext } from '../contexts/CartContext';
import { Button } from '../components/UI';

const HomePage: React.FC = () => {
  const { addToCart, setIsCartOpen } = useContext(CartContext);

  const handleShopNow = () => {
    addToCart(HERO_PRODUCT);
    setIsCartOpen(true);
  };

  return (
    <div className="overflow-hidden bg-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Decor */}
        <div className="absolute top-0 right-0 -z-10 w-[60%] h-full bg-red-50 rounded-l-[5rem] opacity-50"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Left: Content */}
            <div className="space-y-8 animate-fade-in-up order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-primary font-bold text-xs tracking-wider uppercase">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                New Arrival
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 leading-tight tracking-tight">
                Unlimited <span className="text-primary">4G/5G WiFi</span><br />at Home
              </h1>
              
              <p className="text-lg text-gray-600 max-w-lg leading-relaxed">
                Experience the future of home internet with the DITO Home WoWFi Pro. 
                Ultra-fast 4G/5G speeds for streaming, gaming, and working.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Button variant="primary" className="px-10 py-4 text-lg shadow-xl shadow-red-900/20" onClick={handleShopNow}>
                   Shop Now
                </Button>
                <Link to={`/product/${HERO_PRODUCT.id}`}>
                   <Button variant="outline" className="px-10 py-4 text-lg w-full sm:w-auto">
                     Learn More
                   </Button>
                </Link>
              </div>
              
              <div className="pt-6 flex items-center gap-8 text-sm font-medium text-gray-500">
                <div className="flex items-center gap-2">
                   <div className="bg-green-100 p-1 rounded-full"><Check size={14} className="text-green-600"/></div>
                   Plug & Play
                </div>
                <div className="flex items-center gap-2">
                   <div className="bg-green-100 p-1 rounded-full"><Check size={14} className="text-green-600"/></div>
                   Free 50GB Data
                </div>
              </div>
            </div>

            {/* Right: Image */}
            <div className="relative animate-fade-in order-1 lg:order-2 flex justify-center lg:justify-end">
              <div className="relative z-10 max-w-md lg:max-w-full">
                <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 transform hover:scale-[1.02] transition-transform duration-500">
                   <img 
                     src={HERO_PRODUCT.image} 
                     alt="DITO Home WoWFi Pro" 
                     className="w-full h-auto object-contain"
                   />
                   <div className="absolute bottom-8 right-8 bg-white/90 backdrop-blur-md border border-gray-200 px-4 py-2 rounded-xl shadow-lg">
                      <p className="text-xs text-gray-500 font-bold uppercase">Price</p>
                      <p className="text-2xl font-bold text-primary">₱{HERO_PRODUCT.price.toLocaleString()}</p>
                   </div>
                </div>
              </div>
              {/* Blobs */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-red-100/50 to-transparent rounded-full blur-3xl -z-10"></div>
            </div>
            
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">Experience the Advantage</h2>
            <p className="text-gray-500">Why thousands of Filipino households are switching to DITO Home.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Zap, title: 'Fast 4G/5G Speeds', desc: 'Ultra-low latency for gaming and streaming up to 500Mbps.' },
              { icon: CreditCard, title: 'No Hidden Fees', desc: 'Transparent pricing. What you see is exactly what you pay.' },
              { icon: Wifi, title: 'Reliable Connectivity', desc: 'Consistent signal strength covering every corner of your home.' },
              { icon: Shield, title: 'Secure Network', desc: 'Enterprise-grade security features to keep your family safe.' },
            ].map((feature, idx) => (
              <div key={idx} className="p-8 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-lg hover:border-red-100 transition-all group">
                <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="text-primary" size={24} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-[#F9FAFB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Customer Stories</h2>
              <p className="text-gray-500 mt-2">See what our community has to say.</p>
            </div>
            <div className="hidden sm:flex gap-2">
               <button className="p-2 rounded-full border bg-white hover:bg-gray-50"><ArrowRight className="rotate-180" size={20}/></button>
               <button className="p-2 rounded-full border bg-primary text-white hover:bg-secondary"><ArrowRight size={20}/></button>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Sarah G.', role: 'Freelancer', quote: "Finally, an internet connection that keeps up with my work. The 5G speed is real!" },
              { name: 'Mark D.', role: 'Gamer', quote: "Low ping and stable connection. Best upgrade for my gaming setup this year." },
              { name: 'Jenny L.', role: 'Mom of 3', quote: "Easy to set up and connects all our devices without lagging. Highly recommended!" }
            ].map((t, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex gap-1 text-primary mb-6">
                  {[...Array(5)].map((_, j) => <Star key={j} size={16} fill="currentColor" />)}
                </div>
                <p className="text-gray-700 mb-8 italic leading-relaxed">"{t.quote}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
                     <img src={`https://ui-avatars.com/api/?name=${t.name}&background=random`} alt={t.name} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">{t.name}</h4>
                    <p className="text-xs text-gray-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Strip */}
      <section className="py-20 bg-gray-900 text-white relative overflow-hidden">
         <div className="absolute top-0 right-0 w-1/2 h-full bg-gray-800 skew-x-12 translate-x-20 opacity-50"></div>
         <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to upgrade your home internet?</h2>
            <p className="text-gray-400 mb-8 text-lg">Get the DITO Home WoWFi Pro today and experience the difference.</p>
            <Button variant="primary" className="px-12 py-4 text-lg mx-auto" onClick={handleShopNow}>
               Get Started Now
            </Button>
         </div>
      </section>
    </div>
  );
};

export default HomePage;