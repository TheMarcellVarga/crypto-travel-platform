// AirportSearch.tsx
"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command as CommandPrimitive,
  CommandEmpty as CommandEmptyPrimitive,
  CommandGroup as CommandGroupPrimitive,
  CommandInput as CommandInputPrimitive,
  CommandItem as CommandItemPrimitive,
} from "cmdk";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Airport {
  iataCode: string;
  name: string;
  cityName: string;
  countryCode: string;
}

interface AirportSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

export function AirportSearch({ value, onChange, placeholder }: AirportSearchProps) {
  const [open, setOpen] = React.useState(false);
  const [airports, setAirports] = React.useState<Airport[]>([]);
  const [searchQuery, setSearchQuery] = React.useState("");

  React.useEffect(() => {
    const fetchAirports = async () => {
      if (searchQuery.length < 2) {
        setAirports([]);
        return;
      }

      const apiKey = process.env.NEXT_PUBLIC_IATA_API_KEY;
      const apiSecret = process.env.NEXT_PUBLIC_IATA_API_SECRET;

      if (!apiKey || !apiSecret) {
        console.error("IATA API credentials are not set");
        return;
      }

      try {
        // First, get the access token
        const tokenResponse = await fetch(
          'https://api.iata.org/oauth/token',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `grant_type=client_credentials&client_id=${apiKey}&client_secret=${apiSecret}`
          }
        );

        const tokenData = await tokenResponse.json();
        const accessToken = tokenData.access_token;

        // Then, search for airports
        const response = await fetch(
          `https://api.iata.org/ndc/v21.3/airports?search=${encodeURIComponent(searchQuery)}`,
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Accept': 'application/json',
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        const formattedAirports: Airport[] = data.data
          .map((airport: any) => ({
            iataCode: airport.iataCode,
            name: airport.name,
            cityName: airport.cityName,
            countryCode: airport.countryCode
          }))
          .slice(0, 10); // Limit to 10 results

        setAirports(formattedAirports);
      } catch (error) {
        console.error("Error fetching airports:", error);
        setAirports([]);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchAirports();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const selectedAirport = airports.find((airport) => airport.iataCode === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedAirport 
            ? `${selectedAirport.cityName} - ${selectedAirport.name} (${selectedAirport.iataCode})`
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <CommandPrimitive>
          <CommandInputPrimitive 
            placeholder="Search airports..." 
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandEmptyPrimitive>No airports found.</CommandEmptyPrimitive>
          <CommandGroupPrimitive>
            {airports.map((airport) => (
              <CommandItemPrimitive
                key={airport.iataCode}
                value={airport.iataCode}
                onSelect={(currentValue: string) => {
                  onChange(currentValue === value ? "" : currentValue);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === airport.iataCode ? "opacity-100" : "opacity-0"
                  )}
                />
                <div className="flex flex-col">
                  <span>{airport.cityName} - {airport.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {airport.countryCode} ({airport.iataCode})
                  </span>
                </div>
              </CommandItemPrimitive>
            ))}
          </CommandGroupPrimitive>
        </CommandPrimitive>
      </PopoverContent>
    </Popover>
  );
}