
// Source: https://github.com/isaacdarcilla/philippine-addresses
const BASE_URL = 'https://isaacdarcilla.github.io/philippine-addresses';

export interface LocationOption {
  code: string;
  name: string;
}

export const LocationService = {
  getProvinces: async (): Promise<LocationOption[]> => {
    try {
      const response = await fetch(`${BASE_URL}/province.json`);
      const data = await response.json();
      return data.map((item: any) => ({
        code: item.province_code,
        name: item.province_name
      })).sort((a: LocationOption, b: LocationOption) => a.name.localeCompare(b.name));
    } catch (error) {
      console.error('Error fetching provinces:', error);
      return [];
    }
  },

  getCities: async (provinceCode: string): Promise<LocationOption[]> => {
    try {
      const response = await fetch(`${BASE_URL}/city-municipality.json`);
      const data = await response.json();
      return data
        .filter((item: any) => item.province_code === provinceCode)
        .map((item: any) => ({
          code: item.city_code,
          name: item.city_name
        })).sort((a: LocationOption, b: LocationOption) => a.name.localeCompare(b.name));
    } catch (error) {
      console.error('Error fetching cities:', error);
      return [];
    }
  },

  getBarangays: async (cityCode: string): Promise<LocationOption[]> => {
    try {
      const response = await fetch(`${BASE_URL}/barangay.json`);
      const data = await response.json();
      return data
        .filter((item: any) => item.city_code === cityCode)
        .map((item: any) => ({
          code: item.brgy_code,
          name: item.brgy_name
        })).sort((a: LocationOption, b: LocationOption) => a.name.localeCompare(b.name));
    } catch (error) {
      console.error('Error fetching barangays:', error);
      return [];
    }
  },

  getZipCode: (cityName: string, provinceName: string): string => {
    // Basic mapping for major cities/areas. 
    // In a full production app, this would need a comprehensive database.
    const normalizedCity = cityName.toUpperCase();
    const normalizedProvince = provinceName.toUpperCase();

    // Metro Manila
    if (normalizedCity.includes('MANILA')) return '1000';
    if (normalizedCity.includes('MAKATI')) return '1200';
    if (normalizedCity.includes('TAGUIG')) return '1630';
    if (normalizedCity.includes('QUEZON CITY')) return '1100';
    if (normalizedCity.includes('PASIG')) return '1600';
    if (normalizedCity.includes('MANDALUYONG')) return '1550';
    if (normalizedCity.includes('PASAY')) return '1300';
    if (normalizedCity.includes('CALOOCAN')) return '1400';
    if (normalizedCity.includes('LAS PINAS')) return '1740';
    if (normalizedCity.includes('MUNTINLUPA')) return '1770';
    if (normalizedCity.includes('PARANAQUE')) return '1700';
    if (normalizedCity.includes('SAN JUAN')) return '1500';
    if (normalizedCity.includes('VALENZUELA')) return '1440';
    if (normalizedCity.includes('MARIKINA')) return '1800';
    if (normalizedCity.includes('MALABON')) return '1470';
    if (normalizedCity.includes('NAVOTAS')) return '1485';
    if (normalizedCity.includes('PATEROS')) return '1620';

    // Cebu
    if (normalizedCity.includes('CEBU CITY')) return '6000';
    if (normalizedCity.includes('MANDAUE')) return '6014';
    if (normalizedCity.includes('LAPU-LAPU')) return '6015';

    // Davao
    if (normalizedCity.includes('DAVAO CITY')) return '8000';

    // Defaults for provinces if city not found in list
    if (normalizedProvince.includes('CAVITE')) return '4100';
    if (normalizedProvince.includes('LAGUNA')) return '4000';
    if (normalizedProvince.includes('BATANGAS')) return '4200';
    if (normalizedProvince.includes('RIZAL')) return '1850';
    if (normalizedProvince.includes('BULACAN')) return '3000';
    if (normalizedProvince.includes('PAMPANGA')) return '2000';
    if (normalizedProvince.includes('PANGASINAN')) return '2400';

    return '0000'; // Default fallback
  }
};