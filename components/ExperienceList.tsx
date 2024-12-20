// File: components/ExperienceList.tsx

"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { FaBitcoin, FaEthereum } from 'react-icons/fa';
import { SiLitecoin } from 'react-icons/si';

interface Experience {
  id: string;
  title: string;
  description: string;
  price: number;
  cryptoCurrency: 'BTC' | 'ETH' | 'LTC';
  image: string;
  location: string;
  duration: string;
  cryptoFriendlinessScore: number;
  acceptedCryptos: string[];
}

const fetchCryptoFriendlyExperiences = async (): Promise<Experience[]> => {
  // Simulating API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return [
    {
      id: '1',
      title: 'El Salvador Bitcoin Beach Retreat',
      description: 'Immerse yourself in the world\'s first Bitcoin economy. Learn, surf, and transact entirely in BTC.',
      price: 0.1,
      cryptoCurrency: 'BTC',
      image: '/images/el-salvador-bitcoin-beach.jpg',
      location: 'El Zonte, El Salvador',
      duration: '7 days',
      cryptoFriendlinessScore: 5,
      acceptedCryptos: ['BTC', 'LTC']
    },
    {
      id: '2',
      title: 'Miami Crypto Conference & City Tour',
      description: 'Attend a major crypto conference and explore Miami\'s burgeoning crypto scene and Bitcoin-friendly businesses.',
      price: 0.5,
      cryptoCurrency: 'ETH',
      image: '/images/miami-crypto.jpg',
      location: 'Miami, USA',
      duration: '5 days',
      cryptoFriendlinessScore: 4,
      acceptedCryptos: ['BTC', 'ETH', 'LTC']
    },
    {
      id: '3',
      title: 'Swiss Crypto Valley Expedition',
      description: 'Visit Zug, the heart of Crypto Valley. Tour blockchain startups and enjoy the crypto-friendly atmosphere.',
      price: 2,
      cryptoCurrency: 'ETH',
      image: '/images/swiss-crypto-valley.jpg',
      location: 'Zug, Switzerland',
      duration: '6 days',
      cryptoFriendlinessScore: 5,
      acceptedCryptos: ['BTC', 'ETH']
    },
  ];
};

const getCryptoIcon = (crypto: string) => {
  switch (crypto) {
    case 'BTC': return <FaBitcoin className="text-orange-500" />;
    case 'ETH': return <FaEthereum className="text-blue-500" />;
    case 'LTC': return <SiLitecoin className="text-gray-500" />;
    default: return null;
  }
};

export const ExperienceList = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadExperiences = async () => {
      try {
        const data = await fetchCryptoFriendlyExperiences();
        setExperiences(data);
      } catch (error) {
        console.error('Failed to fetch experiences:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadExperiences();
  }, []);

  if (isLoading) {
    return <div className="text-center py-10">Loading crypto-friendly experiences...</div>;
  }

  return (
    <>
      <h2 className="text-3xl font-bold mb-6">Crypto-Friendly Travel Experiences</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {experiences.map((experience) => (
          <div key={experience.id} className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105">
            <div className="relative h-48">
              <Image
                src={experience.image}
                alt={experience.title}
                layout="fill"
                objectFit="cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{experience.title}</h3>
              <p className="text-gray-600 mb-4 h-20 overflow-hidden">{experience.description}</p>
              <div className="flex justify-between items-center mb-2">
                <p className="text-lg font-semibold flex items-center">
                  {experience.price} {getCryptoIcon(experience.cryptoCurrency)}
                </p>
                <p className="text-gray-500">{experience.location}</p>
              </div>
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm text-gray-500">{experience.duration}</p>
                <div className="flex items-center">
                  <span className="text-sm mr-2">Crypto-friendly:</span>
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={`text-yellow-500 ${i < experience.cryptoFriendlinessScore ? 'opacity-100' : 'opacity-30'}`}>★</span>
                  ))}
                </div>
              </div>
              <div className="flex items-center mt-2">
                <span className="text-sm mr-2">Accepted:</span>
                {experience.acceptedCryptos.map(crypto => (
                  <span key={crypto} className="mr-1">{getCryptoIcon(crypto)}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};