
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
        let details = {};
        try {
          if (p.json_data) details = JSON.parse(p.json_data);
        } catch (e) { /* ignore */ }

        return {
          id: String(p.id),
          name: String(p.name),
          category: String(p.category),
          price: Number(p.price),
          image: String(p.image),
          description: String(p.description),
          gallery: [], 
          specs: {}, 
          features: [],
          subtitle: '', 
          rating: 5, 
          reviews: 0,
          ...details,
          commissionType: p.commissionType,
          commissionValue: Number(p.commissionValue)
        };
      });

      // Note: We keep the logic that if SHEET is empty but valid, we populate defaults.
      if (products.length === 0) {
        products = [HERO_PRODUCT, ...RELATED_PRODUCTS];
      }

      // 2. Parse Orders
      const orders: Order[] = (data.Orders || []).map((o: any) => ({
        id: String(o.id),
        customer: String(o.customer),
        date: o.date ? new Date(o.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        total: Number(o.total),
        status: o.status,
        items: Number(o.items_count || o.items || 1),
        referralId: o.referralId ? String(o.referralId) : undefined,
        commission: o.commission ? Number(o.commission) : 0,
        paymentMethod: o.paymentMethod || 'COD',
        proofOfPayment: o.proofOfPayment || ''
      }));

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
          // Extended Profile Fields mapping
          username: a.username || details.username,
          password: a.password || details.password,
          firstName: a.firstName || details.firstName,
          middleName: a.middleName || details.middleName,
          lastName: a.lastName || details.lastName,
          birthDate: a.birthDate || details.birthDate,
          gender: a.gender || details.gender,
          mobile: a.mobile || details.mobile,
          address: a.address || details.address,
          agencyName: a.agencyName || details.agencyName,
          govtId: a.govtId || details.govtId,
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
  syncProducts: async (products: Product[]): Promise<ApiResponse> => SheetsService.sendData('SYNC_PRODUCTS', products),
  syncOrders: async (orders: Order[]): Promise<ApiResponse> => SheetsService.sendData('SYNC_ORDERS', orders),
  
  // Updated syncAffiliates to pack extended fields into json_data
  syncAffiliates: async (affiliates: Affiliate[]): Promise<ApiResponse> => {
    const payload = affiliates.map(aff => {
      // Extract standard fields
      const { 
        id, name, email, walletBalance, totalSales, joinDate, status, clicks, lifetimeEarnings,
        // Extract extended fields to put in json_data
        username, password, firstName, middleName, lastName, birthDate, gender, mobile, address, agencyName, govtId
      } = aff;

      // Create details object for json_data
      const details = {
         username, password, firstName, middleName, lastName, birthDate, gender, mobile, address, agencyName, govtId
      };

      return {
        id, name, email, walletBalance, totalSales, joinDate, status, clicks, lifetimeEarnings,
        json_data: JSON.stringify(details)
      };
    });
    return SheetsService.sendData('SYNC_AFFILIATES', payload);
  },

  syncPayouts: async (payouts: PayoutRequest[]): Promise<ApiResponse> => SheetsService.sendData('SYNC_PAYOUTS', payouts)
};
