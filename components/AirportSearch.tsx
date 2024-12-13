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
  iata_code: string;
  name: string;
  city: string;
  country: string;
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

      try {
        const response = await fetch(
          `https://airportdb.io/api/v1/airport/search?query=${encodeURIComponent(searchQuery)}&page=1&limit=10`,
          {
            headers: {
              'api-key': process.env.NEXT_PUBLIC_AIRPORTDB_API_KEY || '',
            },
          }
        );
        const data = await response.json();
        
        const formattedAirports: Airport[] = data.items
          .filter((airport: any) => airport.iata_code) // Only include airports with IATA codes
          .map((airport: any) => ({
            iata_code: airport.iata_code,
            name: airport.name,
            city: airport.city,
            country: airport.country
          }));

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

  const selectedAirport = airports.find((airport) => airport.iata_code === value);

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
            ? `${selectedAirport.city} - ${selectedAirport.name} (${selectedAirport.iata_code})`
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
                key={airport.iata_code}
                value={airport.iata_code}
                onSelect={(currentValue: string) => {
                  onChange(currentValue === value ? "" : currentValue);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === airport.iata_code ? "opacity-100" : "opacity-0"
                  )}
                />
                <div className="flex flex-col">
                  <span>{airport.city} - {airport.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {airport.country} ({airport.iata_code})
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