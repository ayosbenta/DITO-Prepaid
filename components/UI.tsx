import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Eye } from 'lucide-react';
import { Product } from '../types';
import { CartContext } from '../contexts/CartContext';

export const Button: React.FC<{
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  fullWidth?: boolean;
}> = ({ children, variant = 'primary', className = '', onClick, disabled, fullWidth }) => {
  const baseStyles = "px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed tracking-wide";
  
  const variants = {
    primary: "bg-primary text-white hover:bg-secondary shadow-lg shadow-red-900/10",
    secondary: "bg-gray-900 text-white hover:bg-gray-800",
    outline: "border-2 border-primary text-primary hover:bg-red-50",
    ghost: "text-gray-600 hover:text-primary hover:bg-red-50"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { addToCart, setIsCartOpen } = useContext(CartContext);
  const navigate = useNavigate();

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent link navigation if wrapped
    addToCart(product);
    setIsCartOpen(true);
  };

  return (
    <div className="group block bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:-translate-y-1">
      <Link to={`/product/${product.id}`}>
        <div className="relative aspect-square bg-gray-50 overflow-hidden flex items-center justify-center p-6">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
          />
          {/* Optional Badge */}
          {product.category === 'Modems' && (
            <div className="absolute top-3 left-3 bg-primary text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">
              Best Seller
            </div>
          )}
        </div>
      </Link>
      
      <div className="p-5">
        <p className="text-xs text-gray-400 font-bold uppercase tracking-wide mb-1">{product.category}</p>
        <Link to={`/product/${product.id}`}>
           <h3 className="text-lg font-bold text-gray-900 mb-1 hover:text-primary transition-colors line-clamp-1">{product.name}</h3>
        </Link>
        <p className="text-gray-500 text-sm line-clamp-2 mb-4 h-10">{product.description}</p>
        
        <div className="flex items-center justify-between mb-4">
          <span className="text-xl font-bold text-primary">₱{product.price.toLocaleString()}</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button variant="primary" className="py-2 text-sm px-2" onClick={handleBuyNow}>
            Buy Now
          </Button>
          <Link to={`/product/${product.id}`} className="w-full">
             <Button variant="outline" fullWidth className="py-2 text-sm px-2">
               Details
             </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export const Badge: React.FC<{ children: React.ReactNode; color?: 'green' | 'red' | 'yellow' | 'gray' | 'blue' }> = ({ children, color = 'gray' }) => {
  const colors = {
    green: "bg-green-100 text-green-700",
    red: "bg-red-100 text-red-700",
    blue: "bg-blue-100 text-blue-700",
    yellow: "bg-yellow-100 text-yellow-700",
    gray: "bg-gray-100 text-gray-700"
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[color]}`}>
      {children}
    </span>
  );
};