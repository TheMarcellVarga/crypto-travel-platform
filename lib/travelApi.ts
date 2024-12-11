// lib/travelApi.ts
import axios from 'axios';
// First, import the necessary types from the Google Maps Services package
import { Client, PlaceType1 } from '@googlemaps/google-maps-services-js';

// Keep your existing Amadeus setup for flights
const amadeusApi = axios.create({
  baseURL: 'https://api.amadeus.com/v1',
  headers: {
    'Authorization': `Bearer ${process.env.AMADEUS_API_KEY}`,
  },
});

// Replace bookingApi with Google Maps client
const googleMapsClient = new Client({});
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY!;

// Define better types
interface AccommodationSearchParams {
  location: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
}

export interface AccommodationResponse {
  id: string;
  name: string;
  location: {
    address: string;
    city: string;
    coordinates: {
      lat: number;
      lng: number;
    }
  };
  photos: string[];
  rating: number;
  priceLevel: number;
  price: {
    amount: number;
    currency: string;
  };
  contactInfo?: {
    phone?: string;
    website?: string;
  };
}

// Replace searchAccommodations function
export const searchAccommodations = async (params: AccommodationSearchParams): Promise<AccommodationResponse[]> => {
  try {
    // Search for hotels in the specified location
    const searchResponse = await googleMapsClient.textSearch({
      params: {
        query: `hotels in ${params.location}`,
        key: GOOGLE_MAPS_API_KEY,
        type: 'lodging' as PlaceType1  // Type assertion to PlaceType1
      }
    });

    // Get detailed information for each hotel
    const accommodations: AccommodationResponse[] = await Promise.all(
      searchResponse.data.results.map(async (place) => {
        // Ensure place_id exists
        if (!place.place_id || !place.geometry?.location) {
          throw new Error('Invalid place data received');
        }

        const details = await googleMapsClient.placeDetails({
          params: {
            place_id: place.place_id, // Now TypeScript knows this is defined
            key: GOOGLE_MAPS_API_KEY,
            fields: [
              'name',
              'formatted_address',
              'geometry',
              'photos',
              'rating',
              'price_level',
              'formatted_phone_number',
              'website'
            ]
          }
        });

        // Ensure geometry exists
        if (!place.geometry || !place.geometry.location) {
          throw new Error('Missing geometry data');
        }

        const photoUrls = details.data.result.photos?.map(photo => 
          `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${photo.photo_reference}&key=${GOOGLE_MAPS_API_KEY}`
        ) || [];

        // Calculate price based on price_level
        const price = calculatePrice(
          details.data.result.price_level || 2,
          params.checkIn,
          params.checkOut,
          params.guests
        );

        const accommodation: AccommodationResponse = {
          id: place.place_id,
          name: place.name || 'Unknown',
          location: {
            address: details.data.result.formatted_address || '',
            city: params.location,
            coordinates: {
              lat: place.geometry.location.lat,
              lng: place.geometry.location.lng
            }
          },
          photos: photoUrls,
          rating: place.rating || 0,
          priceLevel: details.data.result.price_level || 2,
          price,
          contactInfo: {
            phone: details.data.result.formatted_phone_number,
            website: details.data.result.website
          }
        };

        return accommodation;
      })
    );

    return accommodations;
  } catch (error) {
    console.error('Error searching accommodations:', error);
    throw error;
  }
};

// Keep your existing flight search function
export const searchFlights = async (params: any) => {
  const response = await amadeusApi.get('/shopping/flight-offers', { params });
  return response.data;
};

// Add helper functions
const calculatePrice = (
  priceLevel: number,
  checkIn?: string,
  checkOut?: string,
  guests: number = 1
) => {
  // Base prices per night based on price_level (0-4)
  const basePrices = {
    0: 50,   // Budget
    1: 100,  // Economy
    2: 200,  // Mid-range
    3: 400,  // Luxury
    4: 800   // Premium luxury
  };

  const basePrice = basePrices[priceLevel as keyof typeof basePrices] || basePrices[2];

  // Calculate number of nights
  let numberOfNights = 1;
  if (checkIn && checkOut) {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    numberOfNights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  }

  // Apply guest multiplier (50% increase per additional guest)
  const guestMultiplier = 1 + (guests - 1) * 0.5;

  return {
    amount: Math.round(basePrice * numberOfNights * guestMultiplier),
    currency: 'USD'
  };
};

// Add utility function to get more details about a specific hotel
export const getAccommodationDetails = async (placeId: string) => {
  try {
    const response = await googleMapsClient.placeDetails({
      params: {
        place_id: placeId,
        key: GOOGLE_MAPS_API_KEY,
        fields: [
          'name',
          'formatted_address',
          'geometry',
          'photos',
          'rating',
          'price_level',
          'formatted_phone_number',
          'website',
          'reviews',
          'amenities',
          'business_status',
          'opening_hours'
        ]
      }
    });

    return response.data.result;
  } catch (error) {
    console.error('Error getting accommodation details:', error);
    throw error;
  }
};
