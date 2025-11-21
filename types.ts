

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
  commissionType?: 'fixed' | 'percentage';
  commissionValue?: number;
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
  status?: 'active' | 'inactive' | 'banned';
  clicks?: number;
  lifetimeEarnings?: number;
  // Extended Profile Fields
  username?: string;
  password?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  birthDate?: string;
  gender?: 'Male' | 'Female';
  mobile?: string;
  address?: string;
  agencyName?: string;
  govtId?: string;
  // Payment Settings
  gcashName?: string;
  gcashNumber?: string;
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
  paymentMethod?: string;
  proofOfPayment?: string; // Base64 string or URL of the receipt
}

export interface PayoutRequest {
  id: string;
  affiliateId: string;
  affiliateName: string;
  amount: number;
  method: 'GCash' | 'Bank Transfer';
  accountName: string;
  accountNumber: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  dateRequested: string;
  dateProcessed?: string;
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

export interface PaymentSettings {
  cod: {
    enabled: boolean;
  };
  gcash: {
    enabled: boolean;
    accountName: string;
    accountNumber: string;
    qrImage: string;
  };
  bank: {
    enabled: boolean;
    bankName: string;
    accountName: string;
    accountNumber: string;
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

// Declaration to fix module resolution errors
declare module 'react-router-dom';