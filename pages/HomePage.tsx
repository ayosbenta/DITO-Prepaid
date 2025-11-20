import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Zap, Shield, Wifi, CreditCard, Star, ArrowRight, Check } from 'lucide-react';
import { StoreContext } from '../contexts/StoreContext';
import { CartContext } from '../contexts/CartContext';
import { Button } from '../components/UI';

const HomePage: React.FC = () => {
  const { addToCart, setIsCartOpen } = useContext(CartContext);
  const { products } = useContext(StoreContext);

  // Dynamic Hero Product (Fallback to first product if specific ID missing)
  const heroProduct = products.find(p => p.id === 'dito-wowfi-pro') || products[0];

  const handleShopNow = () => {
    if (heroProduct) {
      addToCart(heroProduct);
      setIsCartOpen(true);
    }
  };

  if (!heroProduct) return <div>Loading...</div>;

  return (
    <div className="overflow-hidden bg-white font-sans">
      {/* Hero Section */}
      <section className="relative pt-28 pb-16 lg:pt-40 lg:pb-24 overflow-hidden">
        {/* Background Decor */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
           <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-red-50 rounded-full blur-3xl opacity-60"></div>
           <div className="absolute bottom-[10%] left-[-10%] w-[400px] h-[400px] bg-gray-50 rounded-full blur-3xl opacity-60"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Content - Top on Mobile */}
            <div className="space-y-8 text-center lg:text-left animate-fade-in-up order-1 w-full">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-50 border border-red-100 text-primary font-bold text-xs tracking-widest uppercase mx-auto lg:mx-0">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                Best Seller
              </div>
              
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-gray-900 leading-[1.1] tracking-tight">
                Unlimited <span className="text-primary block sm:inline">4G/5G WiFi</span><br className="hidden sm:block" /> at Home
              </h1>
              
              <p className="text-lg sm:text-xl text-gray-500 max-w-lg mx-auto lg:mx-0 leading-relaxed font-medium">
                Experience ultra-fast 4G/5G speeds with DITO Home WiFi.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-2 justify-center lg:justify-start">
                <Button variant="primary" className="px-12 py-4 text-lg shadow-xl shadow-red-600/20 rounded-full w-full sm:w-auto transition-transform hover:-translate-y-1" onClick={handleShopNow}>
                   Shop Now
                </Button>
                <Link to={`/product/${heroProduct.id}`} className="w-full sm:w-auto">
                   <Button variant="outline" className="px-12 py-4 text-lg w-full rounded-full border-2 border-gray-200 text-gray-700 hover:border-primary hover:text-primary hover:bg-white transition-all">
                     Learn More
                   </Button>
                </Link>
              </div>
              
              {/* Trust Indicators */}
              <div className="pt-4 flex items-center justify-center lg:justify-start gap-6 text-sm font-bold text-gray-500">
                <div className="flex items-center gap-2">
                   <Check size={18} className="text-primary"/>
                   Plug & Play
                </div>
                <div className="flex items-center gap-2">
                   <Check size={18} className="text-primary"/>
                   Free 50GB Data
                </div>
              </div>
            </div>

            {/* Image - Bottom on Mobile */}
            <div className="relative w-full order-2 mt-6 lg:mt-0 flex justify-center lg:justify-end">
              <div className="relative z-10 w-full max-w-md">
                <div className="relative bg-white rounded-[3rem] shadow-2xl shadow-gray-200/80 border border-gray-100 p-8 aspect-[4/5] sm:aspect-square flex items-center justify-center overflow-hidden group">
                   
                   {/* Scenic Background Gradient Simulation */}
                   <div className="absolute inset-0 bg-gradient-to-b from-[#F0F4FF] to-white opacity-80"></div>
                   <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-white to-transparent opacity-100"></div>
                   
                   <img 
                     src={heroProduct.image} 
                     alt="DITO Home WoWFi Pro" 
                     className="relative z-10 w-[110%] h-auto object-contain transform group-hover:scale-105 transition-transform duration-700 ease-out drop-shadow-xl"
                   />

                   {/* Floating Price Tag */}
                   <div className="absolute bottom-8 bg-white/95 backdrop-blur-md border border-gray-100 pl-6 pr-8 py-4 rounded-2xl shadow-xl flex items-center gap-4 animate-fade-in-up">
                      <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-primary">
                        <Wifi size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Start Today</p>
                        <p className="text-2xl font-black text-gray-900">₱{heroProduct.price.toLocaleString()}</p>
                      </div>
                   </div>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-dashed border-gray-200 rounded-full -z-10 animate-[spin_60s_linear_infinite]"></div>
              </div>
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
            <Button variant="primary" className="px-12 py-4 text-lg mx-auto rounded-full" onClick={handleShopNow}>
               Get Started Now
            </Button>
         </div>
      </section>
    </div>
  );
};

export default HomePage;