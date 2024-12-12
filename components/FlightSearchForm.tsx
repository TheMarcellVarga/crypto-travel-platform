// components/FlightSearchForm.tsx
"use client";

import { useState } from "react";

interface SearchParams {
  originLocationCode: string;
  destinationLocationCode: string;
  departureDate: string;
  adults: number;
  returnDate?: string;
}

interface FlightSearchFormProps {
  onSearch: (params: SearchParams) => void;
}

export const FlightSearchForm = ({ onSearch }: FlightSearchFormProps) => {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    originLocationCode: "",
    destinationLocationCode: "",
    departureDate: "",
    adults: 1,
    returnDate: ""
  });

  // Convert YYYY-MM-DD to DD/MM/YYYY for display
  const formatDateForDisplay = (dateStr: string) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  // Convert DD/MM/YYYY to YYYY-MM-DD for API
  const formatDateForAPI = (dateStr: string) => {
    if (!dateStr) return "";
    const [day, month, year] = dateStr.split('/');
    // Ensure month and day are padded with leading zeros
    const paddedMonth = month.padStart(2, '0');
    const paddedDay = day.padStart(2, '0');
    return `${year}-${paddedMonth}-${paddedDay}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Format dates for API
    const formattedParams: {
      originLocationCode: string;
      destinationLocationCode: string;
      departureDate: string;
      adults: number;
      returnDate?: string;
    } = {
      originLocationCode: searchParams.originLocationCode,
      destinationLocationCode: searchParams.destinationLocationCode,
      departureDate: formatDateForAPI(searchParams.departureDate),
      adults: searchParams.adults
    };

    // Only add returnDate if it exists and is not empty
    if (searchParams.returnDate) {
      formattedParams.returnDate = formatDateForAPI(searchParams.returnDate);
    }

    console.log('Formatted params:', formattedParams); // For debugging
    onSearch(formattedParams);
  };

  // Get today's date in DD/MM/YYYY format
  const today = new Date().toLocaleDateString('en-GB'); // Returns DD/MM/YYYY

  return (
    <form onSubmit={handleSubmit} className="mb-6 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            From
            <input
              type="text"
              value={searchParams.originLocationCode}
              onChange={(e) =>
                setSearchParams((prev) => ({
                  ...prev,
                  originLocationCode: e.target.value.toUpperCase(),
                }))
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="e.g., LON"
              required
              maxLength={3}
            />
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            To
            <input
              type="text"
              value={searchParams.destinationLocationCode}
              onChange={(e) =>
                setSearchParams((prev) => ({
                  ...prev,
                  destinationLocationCode: e.target.value.toUpperCase(),
                }))
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="e.g., NYC"
              required
              maxLength={3}
            />
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Departure Date
            <input
              type="text"
              placeholder="DD/MM/YYYY"
              value={searchParams.departureDate}
              onChange={(e) =>
                setSearchParams((prev) => ({
                  ...prev,
                  departureDate: e.target.value,
                }))
              }
              pattern="\d{2}/\d{2}/\d{4}"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Return Date (Optional)
            <input
              type="text"
              placeholder="DD/MM/YYYY"
              value={searchParams.returnDate}
              onChange={(e) =>
                setSearchParams((prev) => ({
                  ...prev,
                  returnDate: e.target.value,
                }))
              }
              pattern="\d{2}/\d{2}/\d{4}"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Number of Adults
            <input
              type="number"
              min="1"
              max="9"
              value={searchParams.adults}
              onChange={(e) =>
                setSearchParams((prev) => ({
                  ...prev,
                  adults: parseInt(e.target.value),
                }))
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </label>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          Search Flights
        </button>
      </div>
    </form>
  );
};
