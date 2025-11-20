
import { Product, Order, LandingPageSettings, PaymentSettings } from './types';

export const HERO_PRODUCT: Product = {
  id: 'dito-wowfi-pro',
  name: 'DITO Home WoWFi Pro',
  subtitle: 'Unlimited 4G/5G Home WiFi',
  description: 'Experience the future of home internet with ultra-fast 4G/5G speeds up to 100Mbps. Perfect for streaming, gaming, and working from home. No data caps, just pure speed.',
  price: 1990,
  category: 'Modems',
  image: 'https://picsum.photos/seed/routerblue/600/600',
  gallery: [
    'https://picsum.photos/seed/routerblue/600/600',
    'https://picsum.photos/seed/routerback/600/600',
    'https://picsum.photos/seed/routerside/600/600',
    'https://picsum.photos/seed/routerdetail/600/600'
  ],
  specs: {
    'Connectivity': '5G / 4G LTE',
    'Speed': 'Up to 500+ Mbps (Area Dependent)',
    'WiFi': 'WiFi 6 (802.11ax)',
    'Coverage': 'Whole Home',
    'Devices': 'Connect up to 32 devices',
    'Warranty': '1 Year Official Warranty'
  },
  rating: 4.8,
  reviews: 1240,
  features: [
    'Plug & Play Installation',
    'No Monthly Bill (Prepaid)',
    'Load via DITO App',
    'Includes 50GB Bonus Data'
  ]
};

export const RELATED_PRODUCTS: Product[] = [
  {
    id: 'dito-flash-5g',
    name: 'DITO Flash 4G/5G Pocket',
    subtitle: 'Portable High-Speed Internet',
    description: 'Take 4G/5G wherever you go. Compact, powerful, and ready for travel.',
    price: 990,
    category: 'Pocket WiFi',
    image: 'https://picsum.photos/seed/pocketwifi/400/400',
    gallery: ['https://picsum.photos/seed/pocketwifi/400/400'],
    specs: { 'Speed': 'Up to 100 Mbps', 'Battery': '12 Hours' },
    rating: 4.5,
    reviews: 85,
    features: ['Pocket Sized', 'All-day Battery']
  },
  {
    id: 'dito-sim-starter',
    name: 'DITO 4G/5G SIM Starter',
    subtitle: 'SIM Only Pack',
    description: 'Upgrade your current phone to the DITO network.',
    price: 49,
    category: 'SIM Cards',
    image: 'https://picsum.photos/seed/simcard/400/400',
    gallery: ['https://picsum.photos/seed/simcard/400/400'],
    specs: { 'Data': '3GB Included', 'Calls': 'Unlimited DITO-to-DITO' },
    rating: 4.9,
    reviews: 3000,
    features: ['Triple Cut SIM', '4G/5G Ready']
  }
];

export const RECENT_ORDERS: Order[] = [
  { id: '#ORD-001', customer: 'Maria Clara', date: '2023-10-25', total: 1990, status: 'Delivered', items: 1 },
  { id: '#ORD-002', customer: 'Jose Rizal', date: '2023-10-26', total: 3980, status: 'Processing', items: 2 },
  { id: '#ORD-003', customer: 'Andres B.', date: '2023-10-26', total: 990, status: 'Shipped', items: 1 },
  { id: '#ORD-004', customer: 'Apolinario M.', date: '2023-10-27', total: 49, status: 'Pending', items: 1 },
];

export const SALES_DATA = [
  { name: 'Mon', sales: 4000 },
  { name: 'Tue', sales: 3000 },
  { name: 'Wed', sales: 2000 },
  { name: 'Thu', sales: 2780 },
  { name: 'Fri', sales: 1890 },
  { name: 'Sat', sales: 2390 },
  { name: 'Sun', sales: 3490 },
];

export const DEFAULT_SETTINGS: LandingPageSettings = {
  hero: {
    titlePrefix: 'Unlimited',
    titleHighlight: '4G/5G WiFi',
    titleSuffix: 'at Home',
    subtitle: 'Experience ultra-fast 4G/5G speeds with DITO Home WiFi.',
    btnPrimary: 'Shop Now',
    btnSecondary: 'Learn More',
    heroImage: 'https://picsum.photos/seed/routerblue/600/600'
  },
  features: {
    title: 'Experience the Advantage',
    subtitle: 'Why thousands of Filipino households are switching to DITO Home.'
  },
  testimonials: {
    title: 'Customer Stories',
    subtitle: 'See what our community has to say.'
  },
  cta: {
    title: 'Ready to upgrade your home internet?',
    subtitle: 'Get the DITO Home WoWFi Pro today and experience the difference.',
    btnText: 'Get Started Now'
  }
};

export const DEFAULT_PAYMENT_SETTINGS: PaymentSettings = {
  cod: {
    enabled: true
  },
  gcash: {
    enabled: false,
    accountName: '',
    accountNumber: '',
    qrImage: ''
  },
  bank: {
    enabled: false,
    bankName: '',
    accountName: '',
    accountNumber: ''
  }
};
