export interface Product {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  price: number;
  category: string;
  image: string;
  gallery: string[];
  specs: Record<string, string>;
  rating: number;
  reviews: number;
  features: string[];
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  name: string;
  email: string;
  phone: string;
}

export interface Order {
  id: string;
  customer: string;
  date: string;
  total: number;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Pending';
  items: number;
}

export interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  cartTotal: number;
  itemCount: number;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
}

export enum PaymentMethod {
  COD = 'Cash on Delivery',
  GCASH = 'GCash',
  BANK = 'Bank Transfer',
}
