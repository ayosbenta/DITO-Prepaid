
import { LandingPageSettings, Product, Order, User, Affiliate } from '../types';
import { DEFAULT_SETTINGS, HERO_PRODUCT, RELATED_PRODUCTS, RECENT_ORDERS } from '../constants';

// PASTE YOUR GOOGLE APPS SCRIPT WEB APP URL HERE
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz7VQb56S2UWSMk0IAIS0MWB84R_ODwCwO_aeSC443Jr2VFP4VpFxJRqjANKm6p5jAhkQ/exec"; 

interface ApiResponse {
  status: 'success' | 'error';
  message?: string;
}

interface DashboardData {
  products: Product[];
  orders: Order[];
  customers: User[];
  affiliates: Affiliate[];
  settings: LandingPageSettings;
}

export const SheetsService = {
  // Fetch all data from Sheets
  getAllData: async (): Promise<DashboardData | null> => {
    try {
      if (!GOOGLE_SCRIPT_URL) throw new Error("Google Script URL is not configured");

      const response = await fetch(GOOGLE_SCRIPT_URL);
      if (!response.ok) throw new Error(`Network response was not ok: ${response.statusText}`);
      
      const data = await response.json();

      // 1. Parse Products
      const products: Product[] = (data.Products || []).map((p: any) => {
        let details = {};
        try {
          if (p.json_data) details = JSON.parse(p.json_data);
        } catch (e) {
          console.warn("Failed to parse product json_data", p.name);
        }

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
          ...details
        };
      });

      // 2. Parse Orders
      const orders: Order[] = (data.Orders || []).map((o: any) => ({
        id: String(o.id),
        customer: String(o.customer),
        date: o.date ? new Date(o.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        total: Number(o.total),
        status: o.status,
        items: Number(o.items_count || o.items || 1),
        referralId: o.referralId ? String(o.referralId) : undefined,
        commission: o.commission ? Number(o.commission) : 0
      }));

      // 3. Parse Customers
      const customers: User[] = (data.Customers || []).map((c: any) => ({
        name: String(c.name),
        email: String(c.email),
        phone: String(c.phone)
      }));

      // 4. Parse Affiliates
      const affiliates: Affiliate[] = (data.Affiliates || []).map((a: any) => ({
        id: String(a.id),
        name: String(a.name),
        email: String(a.email),
        walletBalance: Number(a.walletBalance || 0),
        totalSales: Number(a.totalSales || 0),
        joinDate: a.joinDate ? new Date(a.joinDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        status: (a.status === 'active' || a.status === 'inactive' || a.status === 'banned') ? a.status : 'active',
        clicks: Number(a.clicks || 0),
        lifetimeEarnings: Number(a.lifetimeEarnings || a.walletBalance || 0)
      }));

      // 5. Parse Settings
      const settings: LandingPageSettings = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
      
      if (data.Settings && Array.isArray(data.Settings)) {
        data.Settings.forEach((row: any) => {
          if (!row.Key || row.Value === undefined) return;
          
          const keys = row.Key.split('.');
          let current: any = settings;
          
          for (let i = 0; i < keys.length - 1; i++) {
            if (!current[keys[i]]) current[keys[i]] = {};
            current = current[keys[i]];
          }
          current[keys[keys.length - 1]] = String(row.Value);
        });
      }

      return { products, orders, customers, affiliates, settings };

    } catch (error) {
      console.warn("Sheets API Unavailable or Failed. Loading fallback mock data.", error);
      // Return Mock Data if API fails
      return {
        products: [HERO_PRODUCT, ...RELATED_PRODUCTS],
        orders: RECENT_ORDERS,
        customers: [],
        affiliates: [],
        settings: DEFAULT_SETTINGS
      };
    }
  },

  sendData: async (action: string, payload: any): Promise<ApiResponse> => {
    if (!GOOGLE_SCRIPT_URL) return { status: 'error', message: 'No Script URL' };
    
    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        redirect: "follow", 
        headers: { 
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify({ action, payload })
      });
      
      return { status: 'success' };
    } catch (error) {
      console.error(`Sync error [${action}]:`, error);
      return { status: 'error', message: 'Network Error' };
    }
  },

  saveSettings: async (settings: LandingPageSettings): Promise<ApiResponse> => {
    return SheetsService.sendData('SAVE_SETTINGS', settings);
  },

  syncProducts: async (products: Product[]): Promise<ApiResponse> => {
    return SheetsService.sendData('SYNC_PRODUCTS', products);
  },

  syncOrders: async (orders: Order[]): Promise<ApiResponse> => {
    return SheetsService.sendData('SYNC_ORDERS', orders);
  },

  syncAffiliates: async (affiliates: Affiliate[]): Promise<ApiResponse> => {
    return SheetsService.sendData('SYNC_AFFILIATES', affiliates);
  }
};
