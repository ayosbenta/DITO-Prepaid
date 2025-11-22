
import { LandingPageSettings, Product, Order, User, Affiliate, PaymentSettings, PayoutRequest } from '../types';
import { DEFAULT_SETTINGS, HERO_PRODUCT, RELATED_PRODUCTS, RECENT_ORDERS, DEFAULT_PAYMENT_SETTINGS } from '../constants';

// Updated URL
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzNTTB_z9qMoE93XgJTGC11s-rbRvVV_ErfU_9CpzKFxnVsZhcDtE_lCHdKofO8tQ0LRg/exec"; 

interface ApiResponse {
  status: 'success' | 'error';
  message?: string;
}

interface DashboardData {
  products: Product[];
  orders: Order[];
  customers: User[];
  affiliates: Affiliate[];
  payouts: PayoutRequest[];
  settings: LandingPageSettings;
  paymentSettings: PaymentSettings;
}

export const DEMO_AFFILIATE: Affiliate = {
  id: 'AFF-DEMO',
  name: 'Demo Partner',
  email: 'demo@dito.ph',
  walletBalance: 2500,
  totalSales: 15000,
  joinDate: new Date().toISOString().split('T')[0],
  status: 'active',
  clicks: 42,
  lifetimeEarnings: 750,
  firstName: 'Demo',
  lastName: 'Partner',
  username: 'demouser',
  password: 'password123',
  mobile: '09171234567',
  address: 'Makati City',
  govtId: ''
};

export const SheetsService = {
  // Fetch all data from Sheets
  getAllData: async (): Promise<DashboardData | null> => {
    try {
      if (!GOOGLE_SCRIPT_URL) throw new Error("Google Script URL is not configured");

      // 10 Second Timeout to handle cold starts better
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      console.log("Fetching data from Sheets...");
      const response = await fetch(`${GOOGLE_SCRIPT_URL}?action=read&t=${Date.now()}`, {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) throw new Error(`Network response was not ok: ${response.statusText}`);
      
      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.warn("Invalid JSON from Sheets.", text.substring(0, 50));
        throw new Error("Invalid JSON response");
      }

      // 1. Parse Products
      let products: Product[] = (data.Products || []).map((p: any) => {
        let details: any = {};
        try {
          if (p.json_data) details = JSON.parse(p.json_data);
        } catch (e) { /* ignore */ }

        return {
          id: String(p.id),
          name: String(p.name),
          category: String(p.category),
          price: Number(p.price),
          image: String(p.image),
          
          // Explicitly read description and subtitle from columns, fallback to json_data
          description: String(p.description || details.description || ''),
          subtitle: String(p.subtitle || details.subtitle || ''),
          
          // Complex objects usually in json_data
          gallery: details.gallery || (p.image ? [p.image] : []), 
          specs: details.specs || {}, 
          features: details.features || [],
          inclusions: details.inclusions || [],
          
          rating: 5, 
          reviews: 0,
          ...details, // Spread details to catch anything else
          
          // Ensure core fields are typed correctly. 
          // Priority: Explicit Columns > json_data > default
          sku: p.sku ? String(p.sku) : (details.sku || ''),
          stock: (p.stock !== undefined && p.stock !== "") ? Number(p.stock) : (details.stock !== undefined ? Number(details.stock) : 0),
          minStockLevel: (p.min_stock_level !== undefined && p.min_stock_level !== "") ? Number(p.min_stock_level) : (details.minStockLevel !== undefined ? Number(details.minStockLevel) : 10),
          bulkDiscounts: details.bulkDiscounts || [],

          commissionType: p.commissionType,
          commissionValue: Number(p.commissionValue),
          
          // Cost Price for Net Profit Calc
          costPrice: details.costPrice ? Number(details.costPrice) : 0
        };
      });

      // Note: We keep the logic that if SHEET is empty but valid, we populate defaults.
      if (products.length === 0) {
        products = [HERO_PRODUCT, ...RELATED_PRODUCTS];
      }

      // 2. Parse Orders
      const orders: Order[] = (data.Orders || []).map((o: any) => {
        let details: any = {};
        try {
          if (o.json_data) details = JSON.parse(o.json_data);
        } catch (e) { /* ignore */ }

        return {
          id: String(o.id),
          customer: String(o.customer),
          date: o.date ? new Date(o.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          total: Number(o.total),
          status: o.status,
          items: Number(o.items_count || o.items || 1),
          referralId: o.referralId ? String(o.referralId) : undefined,
          commission: o.commission ? Number(o.commission) : 0,
          paymentMethod: o.paymentMethod || 'COD',
          proofOfPayment: o.proofOfPayment || '',
          shippingDetails: details.shippingDetails || undefined,
          orderItems: details.orderItems || undefined
        };
      });

      // 3. Parse Customers
      const customers: User[] = (data.Customers || []).map((c: any) => ({
        name: String(c.name),
        email: String(c.email),
        phone: String(c.phone)
      }));

      // 4. Parse Affiliates
      let affiliates: Affiliate[] = (data.Affiliates || []).map((a: any) => {
        // Try parsing json_data if it exists for extra fields
        let details: any = {};
        try {
          if (a.json_data) details = JSON.parse(a.json_data);
        } catch (e) { /* ignore */ }

        return {
          id: String(a.id),
          name: String(a.name),
          email: String(a.email),
          walletBalance: Number(a.walletBalance || 0),
          totalSales: Number(a.totalSales || 0),
          joinDate: a.joinDate ? new Date(a.joinDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          status: a.status || 'active',
          clicks: Number(a.clicks || 0),
          lifetimeEarnings: Number(a.lifetimeEarnings || 0),
          
          // Extended Profile Fields mapping - FORCE STRING CASTING
          username: String(a.username || details.username || ''),
          password: String(a.password || details.password || ''),
          firstName: String(a.firstName || details.firstName || ''),
          middleName: String(a.middleName || details.middleName || ''),
          lastName: String(a.lastName || details.lastName || ''),
          birthDate: String(a.birthDate || details.birthDate || ''),
          gender: (a.gender || details.gender || 'Male') as 'Male' | 'Female',
          mobile: String(a.mobile || details.mobile || ''),
          address: String(a.address || details.address || ''),
          agencyName: String(a.agencyName || details.agencyName || ''),
          govtId: String(a.govtId || details.govtId || ''),
          
          // Payment Settings
          gcashName: String(a.gcashName || details.gcashName || ''),
          gcashNumber: String(a.gcashNumber || details.gcashNumber || '')
        };
      });

      // Fallback: Add Demo Affiliate if list is empty so login works
      if (affiliates.length === 0) {
         affiliates = [DEMO_AFFILIATE];
      }

      // 5. Parse Payouts
      const payouts: PayoutRequest[] = (data.Payouts || []).map((p: any) => ({
        id: String(p.id),
        affiliateId: String(p.affiliateId),
        affiliateName: String(p.affiliateName),
        amount: Number(p.amount),
        method: p.method || 'GCash',
        accountName: String(p.accountName),
        accountNumber: String(p.accountNumber),
        status: p.status || 'Pending',
        dateRequested: p.dateRequested || new Date().toISOString(),
        dateProcessed: p.dateProcessed || ''
      }));

      // 6. Parse Settings
      const rawSettings: any = { ...DEFAULT_SETTINGS, payment: DEFAULT_PAYMENT_SETTINGS };
      if (data.Settings && Array.isArray(data.Settings)) {
        data.Settings.forEach((row: any) => {
          if (!row.Key || row.Value === undefined) return;
          const keys = row.Key.split('.');
          let current: any = rawSettings;
          for (let i = 0; i < keys.length - 1; i++) {
            if (!current[keys[i]]) current[keys[i]] = {};
            current = current[keys[i]];
          }
          let val = row.Value;
          if (val === 'true') val = true;
          if (val === 'false') val = false;
          current[keys[keys.length - 1]] = val;
        });
      }
      
      const payment = rawSettings.payment || DEFAULT_PAYMENT_SETTINGS;
      const { payment: _, ...landingSettings } = rawSettings;

      return { 
        products, orders, customers, affiliates, payouts,
        settings: landingSettings as LandingPageSettings, 
        paymentSettings: payment as PaymentSettings 
      };

    } catch (error) {
      console.warn("Sheets API Fetch Failed:", error);
      // CRITICAL: Return null so the app knows the fetch failed and doesn't overwrite state with mock data
      return null;
    }
  },

  sendData: async (action: string, payload: any): Promise<ApiResponse> => {
    if (!GOOGLE_SCRIPT_URL) return { status: 'error', message: 'No Script URL' };
    try {
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ action, payload })
      });
      const text = await response.text();
      try { return JSON.parse(text); } catch { return { status: 'error', message: 'Invalid JSON' }; }
    } catch (error) {
      return { status: 'error', message: 'Network Error' };
    }
  },

  saveSettings: async (settings: any): Promise<ApiResponse> => SheetsService.sendData('SAVE_SETTINGS', settings),
  
  syncProducts: async (products: Product[]): Promise<ApiResponse> => {
    const payload = products.map(p => {
      // Destructure to separate standard columns from detailed JSON data
      const { 
        id, name, category, price, image, description, subtitle,
        commissionType, commissionValue, 
        sku, stock, minStockLevel, bulkDiscounts,
        gallery, specs, features, inclusions, costPrice,
        ...rest 
      } = p;

      // Create a readable summary string for bulk discounts in the Sheet
      const discountSummary = bulkDiscounts 
        ? bulkDiscounts.map(d => `Buy ${d.minQty} Get ${d.percentage}% Off`).join('; ') 
        : '';

      return {
        // Explicit Columns for better Sheet readability
        id, 
        name, 
        subtitle: subtitle || '', 
        description: description || '',
        category, 
        price, 
        image, 
        commissionType, 
        commissionValue,
        sku: sku || '',
        stock: stock || 0,
        min_stock_level: minStockLevel || 10,
        bulk_discounts_summary: discountSummary,

        // Pack complex nested structures (specs, gallery, etc.) into json_data
        json_data: JSON.stringify({ 
          ...rest, 
          sku, 
          stock, 
          minStockLevel, 
          bulkDiscounts, 
          gallery, 
          specs, 
          features,
          inclusions,
          subtitle,
          description,
          costPrice // Save Purchase Price here
        })
      };
    });
    return SheetsService.sendData('SYNC_PRODUCTS', payload);
  },
  
  // Sync dedicated Inventory Sheet
  syncInventory: async (products: Product[]): Promise<ApiResponse> => {
    const payload = products.map(p => {
      const stock = p.stock || 0;
      const minStock = p.minStockLevel || 10;
      let status = 'In Stock';
      if (stock === 0) status = 'Out of Stock';
      else if (stock <= minStock) status = 'Low Stock';

      return {
        'Product ID': p.id,
        'Name': p.name,
        'SKU': p.sku || 'N/A',
        'Category': p.category,
        'Cost Price': p.costPrice || 0,
        'Selling Price': p.price,
        'Stock Level': stock,
        'Min Limit': minStock,
        'Status': status,
        'Last Updated': new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' })
      };
    });
    return SheetsService.sendData('SYNC_INVENTORY', payload);
  },

  syncOrders: async (orders: Order[]): Promise<ApiResponse> => {
    const payload = orders.map(o => {
      const shipping = o.shippingDetails;
      const address = shipping ? `${shipping.street}, ${shipping.barangay}, ${shipping.city}, ${shipping.province} ${shipping.zipCode}` : '';
      
      return {
        ...o,
        shipping_name: shipping ? `${shipping.firstName} ${shipping.lastName}` : '',
        shipping_phone: shipping ? shipping.mobile : '',
        shipping_address: address,
        json_data: JSON.stringify({ 
           shippingDetails: o.shippingDetails,
           orderItems: o.orderItems 
        })
      };
    });
    return SheetsService.sendData('SYNC_ORDERS', payload);
  },
  
  syncAffiliates: async (affiliates: Affiliate[]): Promise<ApiResponse> => {
    const payload = affiliates.map(aff => {
      const { 
        id, name, email, walletBalance, totalSales, joinDate, status, clicks, lifetimeEarnings,
        username, password, firstName, middleName, lastName, birthDate, gender, mobile, address, agencyName, govtId,
        gcashName, gcashNumber
      } = aff;

      const details = {
         username, password, firstName, middleName, lastName, birthDate, gender, mobile, address, agencyName, govtId,
         gcashName, gcashNumber
      };

      return {
        id, name, email, walletBalance, totalSales, joinDate, status, clicks, lifetimeEarnings,
        username, password, firstName, middleName, lastName, birthDate, gender, mobile, address, agencyName, govtId,
        gcashName, gcashNumber,
        json_data: JSON.stringify(details)
      };
    });
    return SheetsService.sendData('SYNC_AFFILIATES', payload);
  },

  syncPayouts: async (payouts: PayoutRequest[]): Promise<ApiResponse> => SheetsService.sendData('SYNC_PAYOUTS', payouts)
};
