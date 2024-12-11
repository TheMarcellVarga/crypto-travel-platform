import { useEffect, useState } from 'react';
import { searchAccommodations } from '@/lib/travelApi';
import type { AccommodationResponse } from '@/lib/travelApi';

export const AccommodationList = () => {
  const [accommodations, setAccommodations] = useState<AccommodationResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAccommodations = async () => {
      try {
        const params = {
          location: 'London',
          checkIn: new Date().toISOString(),
          checkOut: new Date(Date.now() + 86400000).toISOString(),
          guests: 2
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
      {accommodations.map((accommodation) => (
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
