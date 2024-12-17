"use client";

import { useState, useEffect } from "react";
import { searchFlights } from "@/lib/travelApi";
import { getCookie, setCookie } from "cookies-next";
import { FlightSearchForm } from "./FlightSearchForm";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Clock,
  Plane,
  Calendar,
  DollarSign,
  Users,
  AlertCircle,
  ArrowRight,
  Info,
  Luggage,
} from "lucide-react";

interface FlightSegment {
  departure: {
    iataCode: string;
    terminal?: string;
    at: string;
  };
  arrival: {
    iataCode: string;
    terminal?: string;
    at: string;
  };
  carrierCode: string;
  number: string;
  duration?: string;
  aircraft?: {
    code: string;
  };
}

interface Itinerary {
  duration: string;
  segments: FlightSegment[];
}

interface Flight {
  id: string;
  itineraries: Itinerary[];
  price: {
    total: string;
    currency: string;
  };
  numberOfBookableSeats: number;
}

export const FlightList = () => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedFlights = getCookie("flightSearchResults");

    if (savedFlights) {
      try {
        const parsedResults = JSON.parse(savedFlights as string);
        setFlights(parsedResults.data || parsedResults);
      } catch (e) {
        console.error("Error parsing saved flights:", e);
      }
    }
  }, []);

  const handleSearch = async (searchParams: any) => {
    setLoading(true);
    setError(null);
    try {
      const data = await searchFlights(searchParams);
      const resultsWithTimestamp = {
        timestamp: new Date().toISOString(),
        data: data.data || [],
      };

      setFlights(resultsWithTimestamp.data);

      setCookie("flightSearchResults", JSON.stringify(resultsWithTimestamp), {
        maxAge: 3600,
        path: "/",
      });

      setCookie("lastSearchParams", JSON.stringify(searchParams), {
        maxAge: 3600,
        path: "/",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch flights");
    } finally {
      setLoading(false);
    }
  };

  const clearSavedResults = () => {
    setCookie("flightSearchResults", "", { maxAge: 0, path: "/" });
    setCookie("lastSearchParams", "", { maxAge: 0, path: "/" });
    setFlights([]);
  };

  const formatDateTime = (dateTimeString: string) => {
    return new Date(dateTimeString).toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatTime = (dateTimeString: string) => {
    return new Date(dateTimeString).toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDuration = (duration: string) => {
    return duration.replace("PT", "").toLowerCase();
  };

  const formatPrice = (price: string, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(Number(price));
  };

  type FlightProvider = "skyscanner" | "google" | "kayak";

  const generateFlightLink = (
    flight: Flight,
    itinerary: Itinerary,
    provider: FlightProvider
  ) => {
    const firstSegment = itinerary.segments[0];
    const lastSegment = itinerary.segments[itinerary.segments.length - 1];

    const departureDate = new Date(firstSegment.departure.at)
      .toISOString()
      .split("T")[0];

    switch (provider) {
      case "google":
        const googleFlightsUrl = new URL(
          "https://www.google.com/travel/flights"
        );
        googleFlightsUrl.searchParams.append(
          "q",
          `flights from ${firstSegment.departure.iataCode} to ${lastSegment.arrival.iataCode}`
        );
        return googleFlightsUrl.toString();

      case "kayak":
        return `https://www.kayak.com/flights/${firstSegment.departure.iataCode}-${lastSegment.arrival.iataCode}/${departureDate}`;

      case "skyscanner":
      default:
        return `https://www.skyscanner.com/transport/flights/${firstSegment.departure.iataCode.toLowerCase()}/${lastSegment.arrival.iataCode.toLowerCase()}/${departureDate}/${
          itinerary.segments.length === 1 ? "direct" : "indirect"
        }`;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 space-y-4">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="w-full">
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div className="space-y-2">
                    <Skeleton className="h-8 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                  <Skeleton className="h-12 w-[120px]" />
                </div>
                <Separator className="my-4" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-[80%]" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <FlightSearchForm onSearch={handleSearch} />

      {flights.length > 0 ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-3xl font-bold">
                Available Flights
              </CardTitle>
              {getCookie("flightSearchResults") && (
                <CardDescription className="text-sm text-muted-foreground">
                  Results from{" "}
                  {new Date(
                    JSON.parse(
                      getCookie("flightSearchResults") as string
                    ).timestamp
                  ).toLocaleString()}{" "}
                  <Button
                    variant="link"
                    className="p-0 h-auto"
                    onClick={() =>
                      handleSearch(
                        JSON.parse(getCookie("lastSearchParams") as string)
                      )
                    }
                  >
                    Refresh
                  </Button>
                </CardDescription>
              )}
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="text-lg">
                {flights.length} flights found
              </Badge>
              <Button variant="outline" size="sm" onClick={clearSavedResults}>
                Clear Results
              </Button>
            </div>
          </div>

          <ScrollArea className="h-[calc(100vh-300px)]">
            <div className="space-y-4 pr-4">
              {flights.map((flight) => (
                <Card
                  key={flight.id}
                  className="hover:shadow-lg transition-all duration-300"
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          <Users className="h-3 w-3" />
                          {flight.numberOfBookableSeats} seats left
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-green-600">
                          {formatPrice(
                            flight.price.total,
                            flight.price.currency
                          )}
                        </span>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    {flight.itineraries.map((itinerary, idx) => (
                      <div key={idx} className="space-y-4">
                        <div className="flex items-center justify-between">
                          <TooltipProvider>
                            <div className="flex items-center gap-12">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="text-center cursor-help">
                                    <div className="text-2xl font-bold">
                                      {itinerary.segments[0].departure.iataCode}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                      {formatTime(
                                        itinerary.segments[0].departure.at
                                      )}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      {new Date(
                                        itinerary.segments[0].departure.at
                                      ).toLocaleDateString()}
                                    </div>
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Departure Airport</p>
                                </TooltipContent>
                              </Tooltip>

                              <div className="flex flex-col items-center min-w-[150px]">
                                <div className="relative w-full">
                                  <Separator className="my-4" />
                                  <Plane className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-90 text-primary" />
                                </div>
                                <div className="flex flex-col items-center gap-1">
                                  <span className="text-sm font-medium">
                                    {formatDuration(itinerary.duration)}
                                  </span>
                                  <Badge variant="outline">
                                    {itinerary.segments.length === 1
                                      ? "Direct"
                                      : `${
                                          itinerary.segments.length - 1
                                        } stops`}
                                  </Badge>
                                </div>
                              </div>

                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="text-center cursor-help">
                                    <div className="text-2xl font-bold">
                                      {
                                        itinerary.segments[
                                          itinerary.segments.length - 1
                                        ].arrival.iataCode
                                      }
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                      {formatTime(
                                        itinerary.segments[
                                          itinerary.segments.length - 1
                                        ].arrival.at
                                      )}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      {new Date(
                                        itinerary.segments[
                                          itinerary.segments.length - 1
                                        ].arrival.at
                                      ).toLocaleDateString()}
                                    </div>
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Arrival Airport</p>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                          </TooltipProvider>
                        </div>

                        <div className="space-y-2">
                          {itinerary.segments.map((segment, segIdx) => (
                            <div
                              key={segIdx}
                              className="flex items-center gap-2 text-sm text-muted-foreground"
                            >
                              <Badge variant="outline" className="text-xs">
                                Flight {segment.carrierCode}
                                {segment.number}
                              </Badge>
                              {segment.aircraft && (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div className="flex items-center gap-1 cursor-help">
                                        <Luggage className="h-4 w-4" />
                                        <span>{segment.aircraft.code}</span>
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Aircraft Type</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              )}
                              {segment.duration && (
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {formatDuration(segment.duration)}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>

                        <div className="flex justify-end">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button className="gap-2">
                                Book Flight <ArrowRight className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem
                                onClick={() => {
                                  const url = generateFlightLink(
                                    flight,
                                    itinerary,
                                    "skyscanner"
                                  );
                                  window.open(
                                    url,
                                    "_blank",
                                    "noopener,noreferrer"
                                  );
                                }}
                              >
                                Book on Skyscanner
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  const url = generateFlightLink(
                                    flight,
                                    itinerary,
                                    "google"
                                  );
                                  window.open(
                                    url,
                                    "_blank",
                                    "noopener,noreferrer"
                                  );
                                }}
                              >
                                Book on Google Flights
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  const url = generateFlightLink(
                                    flight,
                                    itinerary,
                                    "kayak"
                                  );
                                  window.open(
                                    url,
                                    "_blank",
                                    "noopener,noreferrer"
                                  );
                                }}
                              >
                                Book on Kayak
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>
      ) : (
        <Card>
          <CardContent className="py-8">
            <div className="text-center space-y-4">
              <Plane className="h-12 w-12 mx-auto text-muted-foreground" />
              <div className="space-y-2">
                <CardTitle>No Flights Found</CardTitle>
                <CardDescription>
                  Search for flights using the form above to see available
                  options
                </CardDescription>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
