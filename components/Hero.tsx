"use client";

import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export const Hero = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Background Image with Parallax Effect */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage: "url('/images/adventureHero.jpg')", // TODO: Add a high-quality travel image
          transform: `translateY(${scrollY * 0.5}px)`,
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-50 z-10" />

      {/* Content */}
      <div className="relative z-20 h-full flex flex-col items-center justify-center text-white px-4">
        <h1 className="text-6xl md:text-8xl font-extrabold mb-4 text-center animate-fade-in-down">
          CryptoVoyage
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-center max-w-2xl animate-fade-in-up">
          Embark on a journey where crypto meets wanderlust. Explore the world,
          one block(chain) at a time.
        </p>
        <div className="flex space-x-4 animate-fade-in">
          <Button
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full transition duration-300 transform hover:scale-105"
          >
            Start Your Adventure
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="bg-transparent text-white border-white hover:bg-white hover:text-black font-bold py-3 px-6 rounded-full transition duration-300"
          >
            Learn More
          </Button>
        </div>
      </div>

      {/* Animated Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
      </div>
    </section>
  );
};
