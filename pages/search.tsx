import { useState } from "react";
import { AccommodationList } from "@/components/AccommodationList";
import { ExperienceList } from "@/components/ExperienceList";
import { FlightList } from "@/components/FlightList";
import { Layout } from "@/components/Layout";
import { SearchForm } from "@/components/SearchForm";

export default function Search() {
  const [searchResults, setSearchResults] = useState({
    accommodations: [],
    flights: [],
    experiences: [],
  });

  const handleSearch = async (query: string) => {
    try {
      // You can replace these with actual API calls to your backend
      const accommodationsResponse = await fetch(
        `/api/accommodations/search?q=${encodeURIComponent(query)}`
      );
      const flightsResponse = await fetch(
        `/api/flights/search?q=${encodeURIComponent(query)}`
      );
      const experiencesResponse = await fetch(
        `/api/experiences/search?q=${encodeURIComponent(query)}`
      );

      const [accommodations, flights, experiences] = await Promise.all([
        accommodationsResponse.json(),
        flightsResponse.json(),
        experiencesResponse.json(),
      ]);

      setSearchResults({
        accommodations,
        flights,
        experiences,
      });
    } catch (error) {
      console.error("Error performing search:", error);
      // You might want to add error handling UI here
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-6 py-4">
        <h1 className="text-4xl font-bold mb-4">Search</h1>
        <SearchForm onSearch={handleSearch} />
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Accommodations</h2>
          <AccommodationList items={searchResults.accommodations} />
        </div>
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Flights</h2>
          <FlightList items={searchResults.flights} />
        </div>
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Experiences</h2>
          <ExperienceList items={searchResults.experiences} />
        </div>
      </div>
    </Layout>
  );
}
