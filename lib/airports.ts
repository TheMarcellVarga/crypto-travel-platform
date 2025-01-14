export interface Airport {
  code: string;
  name: string;
  city: string;
  country: string;
  countryCode: string;
}

const AIRPORTDB_API_BASE = "https://airportdb.io/api/v1/airport/";

export async function searchAirports(query: string): Promise<Airport[]> {
  try {
    // AirportDB requires the search query to be at least 3 characters
    if (query.length < 3) return [];

    const response = await fetch(
      `${AIRPORTDB_API_BASE}search?query=${encodeURIComponent(query)}`,
      {
        headers: {
          Accept: "application/json",
          "api-key": process.env.NEXT_PUBLIC_AIRPORTDB_API_KEY || "",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch airports");
    }

    const data = await response.json();

    return data
      .map((airport: any) => ({
        code: airport.iata_code || airport.icao_code,
        name: airport.name,
        city: airport.municipality || "",
        country: airport.country,
        countryCode: airport.country_code,
      }))
      .filter((airport: Airport) => airport.code); // Only return airports with codes
  } catch (error) {
    console.error("Error fetching airports:", error);
    return [];
  }
}
