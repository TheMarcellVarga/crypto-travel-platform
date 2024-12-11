// lib/types/accommodation.ts
export interface SearchParams {
    location: string;
    checkIn: string;
    checkOut: string;
    guests: number;
    priceRange?: {
      min: number;
      max: number;
    };
  }
  
  export interface Accommodation {
    id: string;
    name: string;
    location: {
      address: string;
      city: string;
      country: string;
      coordinates: {
        lat: number;
        lng: number;
      };
    };
    photos: string[];
    rating: number;
    priceLevel: number;
    price?: {
      amount: number;
      currency: string;
    };
    amenities: string[];
    contactInfo: {
      phone?: string;
      website?: string;
    };
    reviews: Review[];
    nearbyAttractions: Attraction[];
  }
  
  export interface Review {
    author: string;
    rating: number;
    text: string;
    time: number;
  }
  
  export interface Attraction {
    id: string;
    name: string;
    distance: number;
    rating?: number;
    category: string;
    description?: string;
  }