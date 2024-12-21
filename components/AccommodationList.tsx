"use client";
import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useEffect, useState } from 'react';
import { searchAccommodations } from '@/lib/travelApi';
import type { AccommodationResponse } from '@/lib/travelApi';

export const AccommodationList = () => {
  const [accommodations, setAccommodations] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAccommodations = async () => {
      try {
        const params = {
          cityCode: 'LON',
          checkInDate: new Date().toISOString().split('T')[0], // Format: YYYY-MM-DD
          checkOutDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Format: YYYY-MM-DD
          adults: 2,
          roomQuantity: 1
        };
        
        const data = await searchAccommodations(params);
        setAccommodations(data);
      } catch (error) {
        console.error('Error fetching accommodations:', error);
        setError('Failed to fetch accommodations. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccommodations();
  }, []);

  if (isLoading) {
    return <div className="text-center p-4">Loading accommodations...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 p-4">{error}</div>;
  }

  if (accommodations.length === 0) {
    return <div className="text-center p-4">No accommodations found.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {accommodations.map((accommodation: { id: Key | null | undefined; photos: (string | undefined)[]; name: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; location: { address: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }; rating: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; price: { amount: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; currency: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }; contactInfo: { website: string | undefined; }; }) => (
        <div 
          key={accommodation.id}
          className="border rounded-lg shadow-lg p-4"
        >
          {/* Display accommodation image if available */}
          {accommodation.photos[0] && (
            <img 
              src={accommodation.photos[0]} 
              alt={accommodation.name}
              className="w-full h-48 object-cover rounded-t-lg"
            />
          )}
          
          <div className="p-4">
            <h3 className="text-xl font-bold">{accommodation.name}</h3>
            <p className="text-gray-600">{accommodation.location.address}</p>
            <div className="mt-2">
              <span className="text-yellow-500">
                Rating: {accommodation.rating} ★
              </span>
            </div>
            <div className="mt-2">
              <span className="text-green-600 font-bold">
                ${accommodation.price.amount} {accommodation.price.currency}
              </span>
            </div>
            {accommodation.contactInfo?.website && (
              <a 
                href={accommodation.contactInfo.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline mt-2 block"
              >
                Visit Website
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
