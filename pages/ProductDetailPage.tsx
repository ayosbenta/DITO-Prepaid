import React, { useContext, useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Truck, Shield, Wifi, ChevronRight, Info, Minus, Plus } from 'lucide-react';
import { StoreContext } from '../contexts/StoreContext';
import { CartContext } from '../contexts/CartContext';
import { Button } from '../components/UI';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart, setIsCartOpen } = useContext(CartContext);
  const { products } = useContext(StoreContext);
  const [quantity, setQuantity] = useState(1);
  
  const product = products.find(p => p.id === id);
  const [activeImage, setActiveImage] = useState<string>('');

  useEffect(() => {
    if (product) {
      setActiveImage(product.image);
    }
  }, [product]);

  if (!product) {
    return <div className="pt-40 text-center">Product not found</div>;
  }

  const handleAddToCart = () => {
    for(let i=0; i<quantity; i++) addToCart(product);
    setIsCartOpen(true);
  };

  return (
    <div className="pt-28 pb-20 min-h-screen bg-white">
       {/* Breadcrumbs */}
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
         <nav className="flex text-sm text-gray-500 items-center gap-2">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight size={14} />
          <Link to="/catalog" className="hover:text-primary transition-colors">Catalog</Link>
          <ChevronRight size={14} />
          <span className="text-gray-900 font-medium truncate">{product.name}</span>
        </nav>
       </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Left: Images */}
          <div className="space-y-6">
            <div className="aspect-square bg-[#F9FAFB] rounded-3xl overflow-hidden border border-gray-100 shadow-sm flex items-center justify-center p-8 relative group">
              <img 
                src={activeImage} 
                alt={product.name} 
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" 
              />
              <div className="absolute top-6 left-6 bg-white/80 backdrop-blur px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm text-gray-900 border border-gray-100">
                In Stock
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {product.gallery.map((img, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setActiveImage(img)}
                  className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all p-2 bg-gray-50 ${activeImage === img ? 'border-primary ring-2 ring-primary/20' : 'border-transparent hover:border-gray-200'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="flex flex-col pt-4">
            <div className="mb-6">
              <span className="text-primary font-bold tracking-wider text-xs uppercase bg-red-50 px-3 py-1 rounded-full">{product.category}</span>
              <h1 className="text-4xl font-extrabold text-gray-900 mt-4 mb-2 leading-tight">{product.name}</h1>
              <p className="text-lg text-gray-500 font-light">{product.subtitle}</p>
            </div>

            <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-100">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={20} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} />
                ))}
              </div>
              <span className="text-sm text-gray-400">|</span>
              <span className="text-sm text-gray-600 font-medium hover:text-primary cursor-pointer underline-offset-2 hover:underline">{product.reviews} Verified Reviews</span>
            </div>

            <div className="mb-8">
               <div className="flex items-baseline gap-2">
                 <span className="text-5xl font-bold text-primary tracking-tight">₱{product.price.toLocaleString()}</span>
                 <span className="text-gray-400 text-lg line-through">₱{(product.price * 1.2).toFixed(0).toLocaleString()}</span>
               </div>
               <p className="text-sm text-gray-500 mt-2">Inclusive of VAT. Free shipping nationwide.</p>
            </div>

            <div className="mb-8">
               <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-4 mb-10">
               <div className="flex gap-4">
                  <div className="flex items-center border border-gray-200 rounded-xl w-32">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-full flex items-center justify-center hover:bg-gray-50 text-gray-500"><Minus size={16}/></button>
                    <div className="flex-1 text-center font-bold text-gray-900">{quantity}</div>
                    <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-full flex items-center justify-center hover:bg-gray-50 text-gray-500"><Plus size={16}/></button>
                  </div>
                  <Button onClick={handleAddToCart} className="flex-1 py-4 text-lg shadow-red-500/20 shadow-lg">
                    Add to Cart
                  </Button>
               </div>
               <Button variant="outline" className="w-full py-4">
                  Buy Now
               </Button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 text-center text-sm text-gray-500 bg-gray-50 p-4 rounded-2xl">
               <div className="flex flex-col items-center gap-2">
                 <Truck className="text-gray-900" size={20} />
                 <span>Free Shipping</span>
               </div>
               <div className="flex flex-col items-center gap-2">
                 <Shield className="text-gray-900" size={20} />
                 <span>1 Year Warranty</span>
               </div>
               <div className="flex flex-col items-center gap-2">
                 <Wifi className="text-gray-900" size={20} />
                 <span>4G/5G Enabled</span>
               </div>
            </div>
          </div>
        </div>

        {/* Specifications Section */}
        <div className="mt-24 max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900">Technical Specifications</h2>
            <div className="w-12 h-1 bg-primary mx-auto mt-4 rounded-full"></div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm">
             <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x border-gray-200">
                <div className="p-8 space-y-6">
                   <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                     <Wifi size={20} className="text-primary" /> Connectivity
                   </h3>
                   <ul className="space-y-4">
                      {product.specs && Object.entries(product.specs).slice(0, 3).map(([key, value]) => (
                         <li key={key} className="flex justify-between text-sm"><span className="text-gray-500">{key}</span> <span className="font-medium text-gray-900">{value}</span></li>
                      ))}
                   </ul>
                </div>
                <div className="p-8 space-y-6">
                   <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                     <Info size={20} className="text-primary" /> Hardware
                   </h3>
                   <ul className="space-y-4">
                      {product.specs && Object.entries(product.specs).slice(3).map(([key, value]) => (
                         <li key={key} className="flex justify-between text-sm"><span className="text-gray-500">{key}</span> <span className="font-medium text-gray-900">{value}</span></li>
                      ))}
                   </ul>
                </div>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetailPage;