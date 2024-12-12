import { AccommodationList } from "@/components/AccommodationList";
import { ExperienceList } from "@/components/ExperienceList";
import { FlightList } from "@/components/FlightList";
import { Layout } from "@/components/Layout";
import { SearchForm } from "@/components/SearchForm";

export default function Search() {
  const handleSearch = (query: string) => {
    // Perform search logic based on the query
    // Update the accommodation, flight, and experience lists
  };

  return (
    <Layout>
      <div className="container mx-auto px-6 py-4">
        <h1 className="text-4xl font-bold mb-4">Search</h1>
        <SearchForm onSearch={handleSearch} />
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Accommodations</h2>
          <AccommodationList />
        </div>
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Flights</h2>
          <FlightList />
        </div>
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Experiences</h2>
          <ExperienceList />
        </div>
      </div>
    </Layout>
  );
}
