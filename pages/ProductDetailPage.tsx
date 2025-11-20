import React, { useContext, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Truck, Shield, Wifi, Check } from 'lucide-react';
import { HERO_PRODUCT, RELATED_PRODUCTS } from '../constants';
import { CartContext } from '../App';
import { Button } from '../components/UI';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart, setIsCartOpen } = useContext(CartContext);
  const [activeTab, setActiveTab] = useState<'desc' | 'reviews'>('desc');
  
  // Determine product (mock logic)
  const product = id === HERO_PRODUCT.id ? HERO_PRODUCT : RELATED_PRODUCTS.find(p => p.id === id) || HERO_PRODUCT;
  const [activeImage, setActiveImage] = useState(product.image);

  const handleAddToCart = () => {
    addToCart(product);
    setIsCartOpen(true);
  };

  return (
    <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
       {/* Breadcrumbs */}
       <nav className="flex text-sm text-gray-500 mb-8">
        <Link to="/" className="hover:text-primary">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/catalog" className="hover:text-primary">Products</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 font-medium">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-12 mb-20">
        {/* Left: Gallery */}
        <div className="space-y-4">
          <div className="aspect-square bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
            <img src={activeImage} alt={product.name} className="w-full h-full object-cover" />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {product.gallery.map((img, idx) => (
              <button 
                key={idx} 
                onClick={() => setActiveImage(img)}
                className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${activeImage === img ? 'border-primary ring-2 ring-primary/20' : 'border-transparent hover:border-gray-200'}`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Info */}
        <div className="flex flex-col">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{product.name}</h1>
          <p className="text-xl text-gray-500 mb-4">{product.subtitle}</p>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={20} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} />
              ))}
            </div>
            <span className="text-sm text-gray-500 font-medium">({product.reviews} reviews)</span>
          </div>

          <div className="text-4xl font-bold text-primary mb-8">₱{product.price.toLocaleString()}</div>

          <div className="prose prose-gray mb-8">
            <p>{product.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
             {Object.entries(product.specs).slice(0, 4).map(([key, value]) => (
               <div key={key} className="bg-gray-50 p-3 rounded-xl">
                 <span className="block text-xs text-gray-500 uppercase font-bold">{key}</span>
                 <span className="font-medium text-gray-900">{value}</span>
               </div>
             ))}
          </div>

          <div className="flex gap-4 mt-auto pt-8 border-t">
             <Button onClick={handleAddToCart} fullWidth className="py-4 text-lg">
                Add to Cart
             </Button>
             <Button variant="outline" fullWidth className="py-4 text-lg">
                Buy Now
             </Button>
          </div>
          
          <div className="flex gap-6 mt-6 text-sm text-gray-500 justify-center">
             <span className="flex items-center gap-2"><Truck size={16} /> Free Shipping</span>
             <span className="flex items-center gap-2"><Shield size={16} /> 1 Year Warranty</span>
             <span className="flex items-center gap-2"><Wifi size={16} /> 5G Ready</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-t pt-10">
        <div className="flex gap-8 border-b mb-8">
          <button 
            onClick={() => setActiveTab('desc')}
            className={`pb-4 text-lg font-medium transition-colors border-b-2 -mb-px ${activeTab === 'desc' ? 'border-primary text-primary' : 'border-transparent text-gray-500'}`}
          >
            Description & Specs
          </button>
          <button 
            onClick={() => setActiveTab('reviews')}
            className={`pb-4 text-lg font-medium transition-colors border-b-2 -mb-px ${activeTab === 'reviews' ? 'border-primary text-primary' : 'border-transparent text-gray-500'}`}
          >
            Reviews
          </button>
        </div>

        {activeTab === 'desc' ? (
          <div className="grid md:grid-cols-2 gap-12 animate-fade-in">
            <div>
              <h3 className="text-2xl font-bold mb-6">Product Specifications</h3>
              <table className="w-full">
                <tbody>
                  {Object.entries(product.specs).map(([key, value], i) => (
                    <tr key={key} className={i % 2 === 0 ? 'bg-gray-50' : ''}>
                      <td className="py-3 px-4 font-medium text-gray-900">{key}</td>
                      <td className="py-3 px-4 text-gray-600">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-6">Features</h3>
              <ul className="space-y-4">
                {product.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="bg-green-100 p-1 rounded-full mt-0.5">
                      <Check size={14} className="text-green-600" />
                    </div>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="animate-fade-in text-center py-10 bg-gray-50 rounded-2xl">
            <Star size={48} className="text-yellow-400 mx-auto mb-4" fill="currentColor" />
            <h3 className="text-2xl font-bold text-gray-900">4.8 out of 5</h3>
            <p className="text-gray-500 mb-6">Based on 1,240 reviews</p>
            <p className="text-gray-400">Reviews content placeholder...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
