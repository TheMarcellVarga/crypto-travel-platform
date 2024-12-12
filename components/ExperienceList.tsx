"use client";

import { useEffect, useState } from 'react';
import Moralis from 'moralis';

interface Experience {
  id: string;
  title: string;
  description: string;
  price: number;
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

        // Here you would fetch experiences using Moralis API
        // Example (adjust according to your actual data structure):
        // const response = await Moralis.EvmApi.query({
        //   // Your query parameters
        // });
        
        // setExperiences(response.data);

      } catch (error) {
        console.error('Failed to fetch experiences:', error);
      }
    };

    fetchExperiences();
  }, []);

  return (
    <div>
      <h2>Experiences</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {experiences.map((experience) => (
          <div key={experience.id} className="border p-4 rounded-lg">
            <h3>{experience.title}</h3>
            <p>{experience.description}</p>
            <p>Price: {experience.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};