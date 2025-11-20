import { createContext } from 'react';
import { CartContextType } from '../types';

export const CartContext = createContext<CartContextType>({
  items: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  cartTotal: 0,
  itemCount: 0,
  clearCart: () => {},
  isCartOpen: false,
  setIsCartOpen: () => {},
});