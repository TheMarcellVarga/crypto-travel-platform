"use client";

import { useEffect, useState } from 'react';
import Moralis from 'moralis';
import { Cloud } from 'moralis/types';

interface Experience {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  location: string;
  // Add other relevant fields
}

export const ExperienceList = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        if (!process.env.NEXT_PUBLIC_MORALIS_API_KEY) {
          throw new Error('Missing Moralis API key');
        }

        // Ensure Moralis is initialized
        if (!Moralis.Core.isStarted) {
          await Moralis.start({
            apiKey: process.env.NEXT_PUBLIC_MORALIS_API_KEY,
          });
        }

        const response = await Cloud.run('getExperiences');
        
        setExperiences(response);

      } catch (error) {
        console.error('Failed to fetch experiences:', error);
      }
    };

    fetchExperiences();
  }, []);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">Crypto-Friendly Travel Experiences</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {experiences.map((experience) => (
          <div key={experience.id} className="bg-white shadow-md rounded-lg overflow-hidden">
            <img src={experience.image} alt={experience.title} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{experience.title}</h2>
              <p className="text-gray-600 mb-4">{experience.description}</p>
              <div className="flex justify-between items-center">
                <p className="text-lg font-semibold">{experience.price} ETH</p>
                <p className="text-gray-500">{experience.location}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
