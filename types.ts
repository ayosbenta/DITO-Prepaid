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

export interface Affiliate {
  id: string;
  name: string;
  email: string;
  walletBalance: number;
  totalSales: number;
  joinDate: string;
}

export interface Order {
  id: string;
  customer: string;
  date: string;
  total: number;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Pending';
  items: number;
  referralId?: string; // The affiliate ID who referred this order
  commission?: number; // The amount earned by the affiliate
}

export interface LandingPageSettings {
  hero: {
    titlePrefix: string;
    titleHighlight: string;
    titleSuffix: string;
    subtitle: string;
    btnPrimary: string;
    btnSecondary: string;
    heroImage: string;
  };
  features: {
    title: string;
    subtitle: string;
  };
  testimonials: {
    title: string;
    subtitle: string;
  };
  cta: {
    title: string;
    subtitle: string;
    btnText: string;
  };
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