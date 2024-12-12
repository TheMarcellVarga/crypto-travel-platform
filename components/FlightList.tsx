// components/FlightList.tsx
"use client";

import { useEffect, useState } from "react";
import { searchFlights } from "@/lib/travelApi";
import { FlightSearchForm } from "./FlightSearchForm";

interface Flight {
  id: string;
  // Add other flight properties as needed
}

export const FlightList = () => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (searchParams: any) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await searchFlights(searchParams);
      setFlights(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch flights");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4 text-center">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <FlightSearchForm onSearch={handleSearch} />
      {flights.length > 0 ? (
        <div>
          <h2 className="text-2xl font-bold mb-4">Available Flights</h2>
          <div className="grid gap-4">
            {flights.map((flight) => (
              <div
                key={flight.id}
                className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">Flight ID: {flight.id}</p>
                    {/* Add more flight details */}
                  </div>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-gray-500 p-4 text-center">
          <p>Search for flights using the form above</p>
        </div>
      )}
    </div>
  );
};