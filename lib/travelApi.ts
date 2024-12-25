import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosRequestHeaders,
} from "axios";

const amadeusApiV2 = axios.create({
  baseURL: "https://test.api.amadeus.com/v2",
});

const amadeusApiV3 = axios.create({
  baseURL: "https://test.api.amadeus.com/v3",
  headers: {
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_AMADEUS_API_KEY}`,
  },
});

const getAmadeusToken = async () => {
  const tokenResponse = await axios.post(
    "https://test.api.amadeus.com/v1/security/oauth2/token",
    new URLSearchParams({
      grant_type: "client_credentials",
      client_id: process.env.NEXT_PUBLIC_AMADEUS_API_KEY!,
      client_secret: process.env.NEXT_PUBLIC_AMADEUS_API_SECRET!,
    }),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
  return tokenResponse.data.access_token;
};

const applyAmadeusInterceptor = (instance: AxiosInstance) => {
  instance.interceptors.request.use(async (config: AxiosRequestConfig) => {
    const token = await getAmadeusToken();
    if (config.headers) {
      (config.headers as AxiosRequestHeaders)[
        "Authorization"
      ] = `Bearer ${token}`;
    } else {
      config.headers = {
        Authorization: `Bearer ${token}`,
      };
    }
    return config;
  });
};

applyAmadeusInterceptor(amadeusApiV2);
applyAmadeusInterceptor(amadeusApiV3);

export interface HotelSearchParams {
  hotelIds: string;
  adults: number;
  checkInDate: string;
  roomQuantity: number;
  paymentPolicy: "NONE" | "GUARANTEE" | "DEPOSIT";
  bestRateOnly: boolean;
}

export interface HotelOffer {
  id: string;
  checkInDate: string;
  checkOutDate: string;
  roomQuantity: number;
  rateCode: string;
  rateFamilyEstimated: {
    code: string;
    type: string;
  };
  category: string;
  description: {
    text: string;
    lang: string;
  };
  room: {
    type: string;
    typeEstimated: {
      category: string;
      beds: number;
      bedType: string;
    };
    description: {
      text: string;
      lang: string;
    };
  };
  guests: {
    adults: number;
  };
  price: {
    currency: string;
    base: string;
    total: string;
    variations: {
      average: {
        base: string;
      };
      changes: Array<{
        startDate: string;
        endDate: string;
        total: string;
      }>;
    };
  };
  policies: {
    paymentType: string;
    cancellation: {
      description: {
        text: string;
        lang: string;
      };
      type: string;
    };
  };
}

export interface HotelOfferResponse {
  data: Array<{
    type: string;
    hotel: {
      type: string;
      hotelId: string;
      chainCode: string;
      dupeId: string;
      name: string;
      cityCode: string;
      latitude: number;
      longitude: number;
    };
    available: boolean;
    offers: HotelOffer[];
  }>;
}

export const searchHotelOffers = async (
  params: HotelSearchParams
): Promise<HotelOfferResponse> => {
  try {
    const response = await amadeusApiV3.get("/shopping/hotel-offers", {
      params,
    });
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.errors) {
      const apiError = error.response.data.errors[0];
      throw new Error(`${apiError.title}: ${apiError.detail}`);
    }
    console.error(
      "Error searching hotel offers:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const searchFlights = async (params: {
  originLocationCode: string;
  destinationLocationCode: string;
  departureDate: string;
  adults: number;
  returnDate?: string;
}) => {
  try {
    const response = await amadeusApiV2.get("/shopping/flight-offers", {
      params: {
        ...params,
        max: 20,
        currencyCode: "USD",
      },
    });
    return response.data;
  } catch (error: any) {
    console.error(
      "Error searching flights:",
      error.response?.data || error.message
    );
    throw error;
  }
};
