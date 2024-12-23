import axios, { InternalAxiosRequestConfig, AxiosHeaders } from 'axios';

const amadeusAuth = axios.create({
  baseURL: 'https://test.api.amadeus.com/v1',
});

async function getAmadeusToken() {
  try {
    console.log('Attempting to get token...');
    const tokenResponse = await amadeusAuth.post('/security/oauth2/token', 
      new URLSearchParams({
        'grant_type': 'client_credentials',
        'client_id': process.env.NEXT_PUBLIC_AMADEUS_API_KEY!,
        'client_secret': process.env.NEXT_PUBLIC_AMADEUS_API_SECRET!
      }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    console.log('Token obtained successfully');
    return tokenResponse.data.access_token;
  } catch (error: any) {
    console.error('Error getting token:', error.response?.data || error.message);
    throw error;
  }
}

const amadeusApi = axios.create({
  baseURL: 'https://test.api.amadeus.com/v2',
});

amadeusApi.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const token = await getAmadeusToken();
  if (!config.headers) {
    config.headers = new AxiosHeaders();
  }
  config.headers.set('Authorization', `Bearer ${token}`);
  return config;
});

export const searchFlights = async (params: {
  originLocationCode: string;
  destinationLocationCode: string;
  departureDate: string;
  adults: number;
  returnDate?: string;
}) => {
  try {
    const response = await amadeusApi.get('/shopping/flight-offers', { 
      params: {
        ...params,
        max: 20,
        currencyCode: 'USD'
      }
    });
    return response.data;
  } catch (error: any) {
    console.error('Error searching flights:', error.response?.data || error.message);
    throw error;
  }
};


export const searchAccommodations = async (params: {
  cityCode: string;
  checkInDate: string;
  checkOutDate: string;
  adults: number;
  roomQuantity?: number;
}) => {
  try {
    const response = await amadeusApi.get('/shopping/hotel-offers', {
      params: {
        ...params,
        roomQuantity: params.roomQuantity || 1,
        currency: 'USD',
        bestRateOnly: true
      }
    });
    return response.data;
  } catch (error: any) {
    console.error('Error searching accommodations:', error.response?.data || error.message);
    throw error;
  }
};

export interface AccommodationResponse {
  id: string;
  name: string;
  photos?: string[];
  location?: {
    address?: string;
  };
  rating?: string;
  price?: {
    amount: number;
    currency: string;
  };
  contactInfo?: {
    website?: string;
  };
}
