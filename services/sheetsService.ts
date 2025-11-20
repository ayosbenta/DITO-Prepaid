
import { LandingPageSettings, Product, Order, User } from '../types';
import { DEFAULT_SETTINGS } from '../constants';

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
  settings: LandingPageSettings;
}

export const SheetsService = {
  // Fetch all data from Sheets
  getAllData: async (): Promise<DashboardData | null> => {
    if (!GOOGLE_SCRIPT_URL) return null;

    try {
      // Use standard GET request (CORS handled by Google Apps Script if deployed correctly)
      const response = await fetch(GOOGLE_SCRIPT_URL);
      const data = await response.json();

      // 1. Parse Products
      const products: Product[] = (data.Products || []).map((p: any) => {
        let details = {};
        try {
          // The json_data column contains gallery, specs, features, etc.
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
          ...details // Overwrite defaults with parsed JSON data
        };
      });

      // 2. Parse Orders
      const orders: Order[] = (data.Orders || []).map((o: any) => ({
        id: String(o.id),
        customer: String(o.customer),
        date: o.date ? new Date(o.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        total: Number(o.total),
        status: o.status,
        items: Number(o.items_count || o.items || 1)
      }));

      // 3. Parse Customers
      const customers: User[] = (data.Customers || []).map((c: any) => ({
        name: String(c.name),
        email: String(c.email),
        phone: String(c.phone)
      }));

      // 4. Parse Settings
      // Start with defaults to ensure structure exists
      const settings: LandingPageSettings = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
      
      if (data.Settings && Array.isArray(data.Settings)) {
        data.Settings.forEach((row: any) => {
          if (!row.Key || row.Value === undefined) return;
          
          const keys = row.Key.split('.');
          let current: any = settings;
          
          // Navigate to the nested property (e.g., hero.titlePrefix)
          for (let i = 0; i < keys.length - 1; i++) {
            if (!current[keys[i]]) current[keys[i]] = {};
            current = current[keys[i]];
          }
          // Set value
          current[keys[keys.length - 1]] = String(row.Value);
        });
      }

      return { products, orders, customers, settings };

    } catch (error) {
      console.error("Failed to fetch data from Sheets:", error);
      return null;
    }
  },

  saveSettings: async (settings: LandingPageSettings): Promise<ApiResponse> => {
    if (!GOOGLE_SCRIPT_URL) return { status: 'error', message: 'No Script URL' };
    
    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'SAVE_SETTINGS', payload: settings })
      });
      return { status: 'success' };
    } catch (error) {
      return { status: 'error', message: 'Network Error' };
    }
  },

  syncProducts: async (products: Product[]): Promise<ApiResponse> => {
    if (!GOOGLE_SCRIPT_URL) return { status: 'error', message: 'No Script URL' };

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'SYNC_PRODUCTS', payload: products })
      });
      return { status: 'success' };
    } catch (error) {
      return { status: 'error', message: 'Network Error' };
    }
  },

  syncOrders: async (orders: Order[]): Promise<ApiResponse> => {
    if (!GOOGLE_SCRIPT_URL) return { status: 'error', message: 'No Script URL' };

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'SYNC_ORDERS', payload: orders })
      });
      return { status: 'success' };
    } catch (error) {
      return { status: 'error', message: 'Network Error' };
    }
  }
};
