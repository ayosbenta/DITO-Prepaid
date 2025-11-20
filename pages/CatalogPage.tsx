import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { HERO_PRODUCT, RELATED_PRODUCTS } from '../constants';
import { ProductCard } from '../components/UI';

const CatalogPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const allProducts = [HERO_PRODUCT, ...RELATED_PRODUCTS];

  const filteredProducts = allProducts.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="pt-32 pb-20 min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500 mt-1">Browse our latest high-speed devices.</p>
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
           <div className="relative flex-1 md:w-80">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
             <input 
               type="text" 
               placeholder="Search devices..." 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
             />
           </div>
           <button className="p-3 border border-gray-200 rounded-xl hover:bg-gray-50">
             <Filter size={20} className="text-gray-600" />
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">No products found matching your search.</p>
        </div>
      )}
    </div>
  );
};

export default CatalogPage;
