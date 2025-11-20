
import { LandingPageSettings, Product, Order, User } from '../types';

// PASTE YOUR GOOGLE APPS SCRIPT WEB APP URL HERE
// Example: "https://script.google.com/macros/s/AKfycbx.../exec"
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz7VQb56S2UWSMk0IAIS0MWB84R_ODwCwO_aeSC443Jr2VFP4VpFxJRqjANKm6p5jAhkQ/exec"; 

interface ApiResponse {
  status: 'success' | 'error';
  message?: string;
}

export const SheetsService = {
  saveSettings: async (settings: LandingPageSettings): Promise<ApiResponse> => {
    if (!GOOGLE_SCRIPT_URL) return { status: 'error', message: 'No Script URL' };
    
    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', // 'no-cors' is required for Google Scripts
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'SAVE_SETTINGS', payload: settings })
      });
      return { status: 'success' };
    } catch (error) {
      console.error("Sheet Sync Error", error);
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
