
// Source: https://github.com/isaacdarcilla/philippine-addresses
// Switched to raw content to prevent HTML 404 responses
const BASE_URL = 'https://raw.githubusercontent.com/isaacdarcilla/philippine-addresses/master';

export interface LocationOption {
  code: string;
  name: string;
}

// Comprehensive Zip Code Map for Major Cities & Municipalities
const CITY_ZIP_MAP: Record<string, string> = {
  // Metro Manila
  'MANILA': '1000', 'CITY OF MANILA': '1000',
  'QUEZON CITY': '1100',
  'CALOOCAN': '1400', 'CITY OF CALOOCAN': '1400',
  'LAS PINAS': '1740', 'CITY OF LAS PINAS': '1740',
  'MAKATI': '1200', 'CITY OF MAKATI': '1200',
  'MALABON': '1470', 'CITY OF MALABON': '1470',
  'MANDALUYONG': '1550', 'CITY OF MANDALUYONG': '1550',
  'MARIKINA': '1800', 'CITY OF MARIKINA': '1800',
  'MUNTINLUPA': '1770', 'CITY OF MUNTINLUPA': '1770',
  'NAVOTAS': '1485', 'CITY OF NAVOTAS': '1485',
  'PARANAQUE': '1700', 'CITY OF PARANAQUE': '1700',
  'PASAY': '1300', 'CITY OF PASAY': '1300',
  'PASIG': '1600', 'CITY OF PASIG': '1600',
  'PATEROS': '1620',
  'SAN JUAN': '1500', 'CITY OF SAN JUAN': '1500',
  'TAGUIG': '1630', 'CITY OF TAGUIG': '1630',
  'VALENZUELA': '1440', 'CITY OF VALENZUELA': '1440',

  // Cavite
  'BACOOR': '4102', 'CITY OF BACOOR': '4102',
  'CAVITE CITY': '4100', 'CITY OF CAVITE': '4100',
  'DASMARINAS': '4114', 'CITY OF DASMARINAS': '4114',
  'GENERAL TRIAS': '4107', 'CITY OF GENERAL TRIAS': '4107',
  'IMUS': '4103', 'CITY OF IMUS': '4103',
  'TAGAYTAY': '4120', 'CITY OF TAGAYTAY': '4120',
  'TRECE MARTIRES': '4109', 'CITY OF TRECE MARTIRES': '4109',
  'KAWIT': '4104',
  'NOVELETA': '4105',
  'ROSARIO': '4106',
  'TANZA': '4108',
  'SILANG': '4118',
  'CARMONA': '4116',

  // Laguna
  'BINAN': '4024', 'CITY OF BINAN': '4024',
  'CABUYAO': '4025', 'CITY OF CABUYAO': '4025',
  'CALAMBA': '4027', 'CITY OF CALAMBA': '4027',
  'SAN PABLO': '4000', 'CITY OF SAN PABLO': '4000',
  'SAN PEDRO': '4023', 'CITY OF SAN PEDRO': '4023',
  'STA ROSA': '4026', 'CITY OF STA ROSA': '4026', 'SANTA ROSA': '4026', 'CITY OF SANTA ROSA': '4026',
  'LOS BANOS': '4030',

  // Rizal
  'ANTIPOLO': '1870', 'CITY OF ANTIPOLO': '1870',
  'CAINTA': '1900',
  'TAYTAY': '1920',
  'BINANGONAN': '1940',
  'SAN MATEO': '1850',
  'RODRIGUEZ': '1860', 'MONTALBAN': '1860',
  'ANGONO': '1930',

  // Bulacan
  'MALOLOS': '3000', 'CITY OF MALOLOS': '3000',
  'MEYCAUAYAN': '3020', 'CITY OF MEYCAUAYAN': '3020',
  'SAN JOSE DEL MONTE': '3023', 'CITY OF SAN JOSE DEL MONTE': '3023',
  'BALIUAG': '3006',
  'MARILAO': '3019',
  'BOCAUE': '3018',

  // Pampanga
  'ANGELES': '2009', 'CITY OF ANGELES': '2009',
  'SAN FERNANDO': '2000', 'CITY OF SAN FERNANDO': '2000', // Pampanga default
  'MABALACAT': '2010', 'CITY OF MABALACAT': '2010',

  // Cebu
  'CEBU CITY': '6000', 'CITY OF CEBU': '6000',
  'LAPU-LAPU': '6015', 'CITY OF LAPU-LAPU': '6015',
  'MANDAUE': '6014', 'CITY OF MANDAUE': '6014',
  'TALISAY': '6045', 'CITY OF TALISAY': '6045', // Cebu default

  // Davao
  'DAVAO CITY': '8000', 'CITY OF DAVAO': '8000',
  'TAGUM': '8100', 'CITY OF TAGUM': '8100',
  'PANABO': '8105', 'CITY OF PANABO': '8105',
  'DIGOS': '8002', 'CITY OF DIGOS': '8002',

  // Other Major Cities
  'BAGUIO': '2600', 'CITY OF BAGUIO': '2600',
  'CAGAYAN DE ORO': '9000', 'CITY OF CAGAYAN DE ORO': '9000',
  'GENERAL SANTOS': '9500', 'CITY OF GENERAL SANTOS': '9500',
  'ILOILO CITY': '5000', 'CITY OF ILOILO': '5000',
  'BACOLOD': '6100', 'CITY OF BACOLOD': '6100',
  'ZAMBOANGA CITY': '7000', 'CITY OF ZAMBOANGA': '7000',
  'BUTUAN': '8600', 'CITY OF BUTUAN': '8600',
  'ILIGAN': '9200', 'CITY OF ILIGAN': '9200',
  'BATANGAS CITY': '4200', 'CITY OF BATANGAS': '4200',
  'LIPA': '4217', 'CITY OF LIPA': '4217',
  'LUCENA': '4301', 'CITY OF LUCENA': '4301',
  'NAGA': '4400', 'CITY OF NAGA': '4400',
  'OLONGAPO': '2200', 'CITY OF OLONGAPO': '2200',
  'PUERTO PRINCESA': '5300', 'CITY OF PUERTO PRINCESA': '5300',
  'TACLOBAN': '6500', 'CITY OF TACLOBAN': '6500',
  'DAGUPAN': '2400', 'CITY OF DAGUPAN': '2400',
  'LEGAZPI': '4500', 'CITY OF LEGAZPI': '4500',
};

// Fallback Zip Codes by Province (Capital or General)
const PROVINCE_ZIP_FALLBACK: Record<string, string> = {
  'ABRA': '2800',
  'AGUSAN DEL NORTE': '8600',
  'AGUSAN DEL SUR': '8500',
  'AKLAN': '5600',
  'ALBAY': '4500',
  'ANTIQUE': '5700',
  'APAYAO': '3800',
  'AURORA': '3200',
  'BASILAN': '7300',
  'BATAAN': '2100',
  'BATANES': '3900',
  'BATANGAS': '4200',
  'BENGUET': '2600',
  'BILIRAN': '6560',
  'BOHOL': '6300',
  'BUKIDNON': '8700',
  'BULACAN': '3000',
  'CAGAYAN': '3500',
  'CAMARINES NORTE': '4600',
  'CAMARINES SUR': '4400',
  'CAMIGUIN': '9100',
  'CAPIZ': '5800',
  'CATANDUANES': '4800',
  'CAVITE': '4100',
  'CEBU': '6000',
  'COMPOSTELA VALLEY': '8800',
  'COTABATO': '9400',
  'DAVAO DEL NORTE': '8100',
  'DAVAO DEL SUR': '8000',
  'DAVAO ORIENTAL': '8200',
  'DINAGAT ISLANDS': '8427',
  'EASTERN SAMAR': '6800',
  'GUIMARAS': '5044',
  'IFUGAO': '3600',
  'ILOCOS NORTE': '2900',
  'ILOCOS SUR': '2700',
  'ILOILO': '5000',
  'ISABELA': '3300',
  'KALINGA': '3800',
  'LA UNION': '2500',
  'LAGUNA': '4000',
  'LANAO DEL NORTE': '9200',
  'LANAO DEL SUR': '9700',
  'LEYTE': '6500',
  'MAGUINDANAO': '9600',
  'MARINDUQUE': '4900',
  'MASBATE': '5400',
  'MISAMIS OCCIDENTAL': '7200',
  'MISAMIS ORIENTAL': '9000',
  'MOUNTAIN PROVINCE': '2620',
  'NEGROS OCCIDENTAL': '6100',
  'NEGROS ORIENTAL': '6200',
  'NORTHERN SAMAR': '6400',
  'NUEVA ECIJA': '3100',
  'NUEVA VIZCAYA': '3700',
  'OCCIDENTAL MINDORO': '5100',
  'ORIENTAL MINDORO': '5200',
  'PALAWAN': '5300',
  'PAMPANGA': '2000',
  'PANGASINAN': '2400',
  'QUEZON': '4300',
  'QUIRINO': '3400',
  'RIZAL': '1850',
  'ROMBLON': '5500',
  'SAMAR': '6700',
  'SARANGANI': '8015',
  'SIQUIJOR': '6225',
  'SORSOGON': '4700',
  'SOUTH COTABATO': '9500',
  'SOUTHERN LEYTE': '6600',
  'SULTAN KUDARAT': '9800',
  'SULU': '7400',
  'SURIGAO DEL NORTE': '8400',
  'SURIGAO DEL SUR': '8300',
  'TARLAC': '2300',
  'TAWI-TAWI': '7500',
  'ZAMBALES': '2200',
  'ZAMBOANGA DEL NORTE': '7100',
  'ZAMBOANGA DEL SUR': '7000',
  'ZAMBOANGA SIBUGAY': '7001',
  'METRO MANILA': '1000', // General Fallback
};

export const LocationService = {
  getProvinces: async (): Promise<LocationOption[]> => {
    try {
      const response = await fetch(`${BASE_URL}/province.json`);
      if (!response.ok) throw new Error('Failed to fetch provinces');
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
      const response = await fetch(`${BASE_URL}/city.json`);
      if (!response.ok) throw new Error('Failed to fetch cities');
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
      if (!response.ok) throw new Error('Failed to fetch barangays');
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
    if (!cityName || !provinceName) return '';

    const cityUpper = cityName.toUpperCase();
    const provinceUpper = provinceName.toUpperCase();

    // 1. Exact City Match (Check full name first)
    if (CITY_ZIP_MAP[cityUpper]) {
      return CITY_ZIP_MAP[cityUpper];
    }

    // 2. Fuzzy City Match (Remove 'CITY OF' or 'MUNICIPALITY OF')
    const strippedCity = cityUpper.replace(/^(CITY OF |MUNICIPALITY OF )/, '').trim();
    if (CITY_ZIP_MAP[strippedCity]) {
      return CITY_ZIP_MAP[strippedCity];
    }

    // 3. Province Fallback
    if (PROVINCE_ZIP_FALLBACK[provinceUpper]) {
      return PROVINCE_ZIP_FALLBACK[provinceUpper];
    }

    // 4. Default Fallback
    return '0000';
  }
};
