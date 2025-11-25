
import { Product, Order, LandingPageSettings, PaymentSettings, SMTPSettings, BotBrainEntry, BotKeywordTrigger, BotPreset } from './types';

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
  ],
  sku: 'DITO-MOD-001',
  stock: 150,
  minStockLevel: 20,
  bulkDiscounts: [
    { minQty: 3, percentage: 5 }, // Buy 3 get 5% off
    { minQty: 10, percentage: 12 } // Buy 10 get 12% off
  ],
  seo: {
    metaTitle: 'DITO Home WoWFi Pro - Unlimited 4G/5G Home WiFi',
    metaDescription: 'Experience ultra-fast 4G/5G home internet up to 100Mbps with the DITO Home WoWFi Pro. No data caps, plug & play installation. Order now!',
    keywords: 'DITO, Home WiFi, 5G Internet, 4G Internet, Prepaid WiFi, DITO Home',
    slug: 'dito-home-wowfi-pro',
    ogTitle: 'DITO Home WoWFi Pro - Get Yours Today!',
    ogDescription: 'Unlimited 4G/5G Home WiFi for streaming, gaming, and working from home.',
    ogImage: 'https://picsum.photos/seed/routerblue/1200/630'
  }
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
    features: ['Pocket Sized', 'All-day Battery'],
    sku: 'DITO-PKT-002',
    stock: 45,
    minStockLevel: 10,
    seo: {
      metaTitle: 'DITO Flash 4G/5G Pocket WiFi',
      metaDescription: 'Get high-speed internet on the go with the DITO Flash 4G/5g Pocket WiFi. Compact and powerful.',
      keywords: 'DITO, Pocket WiFi, Portable WiFi',
      slug: 'dito-flash-5g-pocket',
      ogTitle: 'DITO Flash 4G/5G Pocket WiFi',
      ogDescription: 'Portable high-speed internet for your travels.',
      ogImage: ''
    }
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
    features: ['Triple Cut SIM', '4G/5G Ready'],
    sku: 'DITO-SIM-001',
    stock: 500,
    minStockLevel: 100,
    bulkDiscounts: [
      { minQty: 5, percentage: 10 }
    ],
    seo: {
      metaTitle: 'DITO 4G/5G SIM Starter Pack',
      metaDescription: 'Upgrade your phone to the DITO network with our 4G/5G SIM starter pack. Includes bonus data.',
      keywords: 'DITO, SIM Card, 5G SIM',
      slug: 'dito-sim-starter',
      ogTitle: 'DITO 4G/5G SIM Starter Pack',
      ogDescription: 'Get your DITO SIM today!',
      ogImage: ''
    }
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
    subtitle: 'Why thousands of Filipino households are switching to DITO Home.',
    items: [
      { icon: 'Zap', title: 'Fast 4G/5G Speeds', description: 'Ultra-low latency for gaming and streaming up to 500Mbps.' },
      { icon: 'CreditCard', title: 'No Hidden Fees', description: 'Transparent pricing. What you see is exactly what you pay.' },
      { icon: 'Wifi', title: 'Reliable Connectivity', description: 'Consistent signal strength covering every corner of your home.' },
      { icon: 'Shield', title: 'Secure Network', description: 'Enterprise-grade security features to keep your family safe.' },
    ]
  },
  testimonials: {
    title: 'Customer Stories',
    subtitle: 'See what our community has to say.',
    items: [
      { name: 'Sarah G.', role: 'Freelancer', quote: "Finally, an internet connection that keeps up with my work. The 5G speed is real!" },
      { name: 'Mark D.', role: 'Gamer', quote: "Low ping and stable connection. Best upgrade for my gaming setup this year." },
      { name: 'Jenny L.', role: 'Mom of 3', quote: "Easy to set up and connects all our devices without lagging. Highly recommended!" }
    ]
  },
  cta: {
    title: 'Ready to upgrade your home internet?',
    subtitle: 'Get the DITO Home WoWFi Pro today and experience the difference.',
    btnText: 'Get Started Now'
  },
  shipping: {
    enabled: true,
    baseFee: 150,
    freeThreshold: 2000,
    calculationType: 'zone',
    zones: [
      { name: 'Metro Manila', fee: 100, days: '1-3 Days' },
      { name: 'Luzon', fee: 150, days: '3-5 Days' },
      { name: 'Visayas', fee: 200, days: '5-7 Days' },
      { name: 'Mindanao', fee: 250, days: '7-10 Days' }
    ],
    couriers: [
      { id: 'jnt', name: 'J&T Express', trackingUrl: 'https://www.jtexpress.ph/index/query/gzquery.html?bills={TRACKING}', status: 'active' },
      { id: 'lbc', name: 'LBC Express', trackingUrl: 'https://www.lbcexpress.com/track/?tracking_no={TRACKING}', status: 'active' },
      { id: 'flash', name: 'Flash Express', trackingUrl: 'https://www.flashexpress.ph/tracking/?se={TRACKING}', status: 'inactive' }
    ]
  },
  seo: {
    metaTitle: 'DITO Home WoWFi Pro Store - Official Online Shop',
    metaDescription: 'Official online store for the DITO Home WoWFi Pro. Get unlimited 4G/5G home internet, prepaid with no monthly bills. Order yours now!',
    ogTitle: 'DITO Home WoWFi Pro Store',
    ogDescription: 'The future of home internet is here. Ultra-fast 4G/5G speeds up to 100Mbps.',
    ogImage: 'https://picsum.photos/seed/dito-og/1200/630'
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

export const DEFAULT_SMTP_SETTINGS: SMTPSettings = {
  enabled: false,
  host: 'smtp.gmail.com',
  port: 587,
  username: '',
  password: '',
  secure: false,
  fromEmail: 'noreply@dito.ph',
  fromName: 'DITO Home Store',
  templates: {
    newOrder: {
      subject: 'Order Confirmation #{order_id}',
      body: 'Hi {customer_name},\n\nThank you for your order! We have received your order #{order_id} amounting to ₱{total}.\n\nWe will notify you once it ships.',
      enabled: true
    },
    orderShipped: {
      subject: 'Your Order #{order_id} has Shipped!',
      body: 'Good news {customer_name}!\n\nYour order is on the way via {courier}. Tracking Number: {tracking_number}.',
      enabled: true
    },
    orderDelivered: {
      subject: 'Order Delivered - #{order_id}',
      body: 'Hello {customer_name},\n\nYour order #{order_id} has been successfully delivered. Enjoy your DITO Home WiFi!',
      enabled: true
    },
    affiliateSale: {
      subject: 'New Commission Earned! (Order #{order_id})',
      body: 'Congratulations!\n\nYou earned a commission of ₱{commission} for Order #{order_id}. Keep up the great work!',
      enabled: true
    },
    affiliatePayout: {
      subject: 'Payout Processed',
      body: 'Hello,\n\nYour payout request of ₱{amount} has been processed successfully to your account.',
      enabled: true
    }
  }
};

export const DEFAULT_BOT_BRAIN: BotBrainEntry[] = [
  { id: 'brain-1', topic: 'Product Price', response: 'The DITO Home WoWFi Pro is available for a one-time payment of ₱1,990.' },
  { id: 'brain-2', topic: 'Coverage Inquiry', response: 'You can check if your area is covered by our 5G network by visiting the official DITO website and using our coverage map tool.' },
  { id: 'brain-3', topic: 'What is DITO Home WoWFi?', response: 'It\'s our prepaid 5G/4G home internet solution. You get a modem, plug it in, and enjoy high-speed internet without monthly bills. You just load it up whenever you need to.' },
];

export const DEFAULT_BOT_KEYWORDS: BotKeywordTrigger[] = [
  { id: 'key-1', keywords: 'hello,hi,good day,hey', category: 'Greetings', response: 'Hello! I am the DITO AI Assistant. How can I help you today?' },
  { id: 'key-2', keywords: 'support,help,assistance,problem', category: 'Support', response: 'For support, you can reach our 24/7 customer service through the DITO app or by calling our hotline.' },
  { id: 'key-3', keywords: 'thank you,thanks', category: 'Closing', response: 'You\'re welcome! Is there anything else I can assist you with?' },
];

export const DEFAULT_BOT_PRESETS: BotPreset[] = [
  { id: 'preset-1', question: 'How much is the modem?', response: 'The DITO Home WoWFi Pro is available for a one-time payment of ₱1,990.' },
  { id: 'preset-2', question: 'What is the speed?', response: 'You can experience ultra-fast 4G/5G speeds up to 500+ Mbps, depending on your area\'s coverage.' },
  { id: 'preset-3', question: 'How to check coverage?', response: 'You can check if your area is covered by our 5G network by visiting the official DITO website and using our coverage map tool.' },
];
