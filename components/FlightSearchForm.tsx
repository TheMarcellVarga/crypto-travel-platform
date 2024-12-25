"use client";

import React, { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { getCookie } from "cookies-next";
import IATAAutocomplete from "./IATAAutocomplete";

interface SearchParams {
  originLocationCode: string;
  originAirportName: string;
  destinationLocationCode: string;
  destinationAirportName: string;
  departureDate: string | undefined;
  adults: number;
  returnDate?: string | undefined;
}

interface FlightSearchFormProps {
  onSearch: (params: SearchParams) => void;
}

export const FlightSearchForm = ({ onSearch }: FlightSearchFormProps) => {
  const [departureDate, setDepartureDate] = useState<Date>();
  const [returnDate, setReturnDate] = useState<Date>();
  const [departureDateOpen, setDepartureDateOpen] = useState(false);
  const [returnDateOpen, setReturnDateOpen] = useState(false);

  const [searchParams, setSearchParams] = useState<SearchParams>({
    originLocationCode: "",
    originAirportName: "",
    destinationLocationCode: "",
    destinationAirportName: "",
    departureDate: "",
    adults: 1,
    returnDate: "",
  });

  useEffect(() => {
    const savedSearchParams = getCookie("lastSearchParams");
    if (savedSearchParams) {
      try {
        const parsedParams = JSON.parse(savedSearchParams as string);
        setSearchParams(parsedParams);

        if (parsedParams.departureDate) {
          setDepartureDate(new Date(parsedParams.departureDate));
        }

        if (parsedParams.returnDate) {
          setReturnDate(new Date(parsedParams.returnDate));
        }
      } catch (e) {
        console.error("Error parsing saved search parameters:", e);
      }
    }
  }, []);

  const formatDateForAPI = (date: Date | undefined) => {
    if (!date) return undefined;
    return format(date, "yyyy-MM-dd");
  };

  const [errors, setErrors] = useState<{
    from?: string;
    to?: string;
    departureDate?: string;
  }>({});

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!searchParams.originLocationCode) {
      newErrors.from = "Please select a departure airport";
    }

    if (!searchParams.destinationLocationCode) {
      newErrors.to = "Please select an arrival airport";
    }

    if (!searchParams.departureDate) {
      newErrors.departureDate = "Please select a departure date";
    }

    if (searchParams.returnDate && !searchParams.departureDate) {
      newErrors.departureDate =
        "Departure date is required when return date is set";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const formattedParams: SearchParams = {
      ...searchParams,
      departureDate: formatDateForAPI(departureDate),
      returnDate: formatDateForAPI(returnDate),
    };

    console.log("Formatted params:", formattedParams);
    onSearch(formattedParams);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 space-y-4 bg-background text-foreground"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div>
          <IATAAutocomplete
            value={searchParams.originAirportName}
            onChange={(airportName, iataCode) =>
              setSearchParams((prev) => ({
                ...prev,
                originAirportName: airportName,
                originLocationCode: iataCode,
              }))
            }
            placeholder="e.g., London Heathrow"
            label="From"
          />
          {errors.from && (
            <p className="text-destructive text-sm mt-1">{errors.from}</p>
          )}
        </div>

        <div>
          <IATAAutocomplete
            value={searchParams.destinationAirportName}
            onChange={(airportName, iataCode) =>
              setSearchParams((prev) => ({
                ...prev,
                destinationAirportName: airportName,
                destinationLocationCode: iataCode,
              }))
            }
            placeholder="e.g., New York JFK"
            label="To"
          />
          {errors.to && (
            <p className="text-red-500 text-sm mt-1">{errors.to}</p>
          )}
        </div>

        <div>
          <Label className="block text-sm font-medium text-foreground">
            Departure Date
            <Popover
              open={departureDateOpen}
              onOpenChange={setDepartureDateOpen}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={`w-full justify-start text-left font-normal mt-1 ${
                    !departureDate && "text-muted-foreground"
                  }`}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {departureDate
                    ? format(departureDate, "yyyy-MM-dd")
                    : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-popover" align="start">
                <Calendar
                  mode="single"
                  selected={departureDate}
                  onSelect={(date) => {
                    setDepartureDate(date);
                    setDepartureDateOpen(false);
                    setSearchParams((prev) => ({
                      ...prev,
                      departureDate: date ? format(date, "yyyy-MM-dd") : "",
                    }));
                    if (returnDate && date && returnDate < date) {
                      setReturnDate(undefined);
                      setSearchParams((prev) => ({ ...prev, returnDate: "" }));
                    }
                  }}
                  disabled={(date) =>
                    date < new Date() ||
                    (returnDate ? date > returnDate : false)
                  }
                  initialFocus
                  className="bg-background border border-border rounded-md"
                />
              </PopoverContent>
            </Popover>
          </Label>
          {errors.departureDate && (
            <p className="text-destructive text-sm mt-1">
              {errors.departureDate}
            </p>
          )}
        </div>

        <div>
          <Label className="block text-sm font-medium text-foreground">
            Return Date (Optional)
            <Popover open={returnDateOpen} onOpenChange={setReturnDateOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={`w-full justify-start text-left font-normal mt-1 ${
                    !returnDate && "text-muted-foreground"
                  }`}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {returnDate
                    ? format(returnDate, "yyyy-MM-dd")
                    : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={returnDate}
                  onSelect={(date) => {
                    setReturnDate(date);
                    setReturnDateOpen(false);
                    setSearchParams((prev) => ({
                      ...prev,
                      returnDate: date ? format(date, "yyyy-MM-dd") : "",
                    }));
                    if (!departureDate) {
                      setReturnDate(undefined);
                      setSearchParams((prev) => ({ ...prev, returnDate: "" }));
                    }
                  }}
                  disabled={(date) => {
                    const isPastDate = date < new Date();
                    const isBeforeDeparture = departureDate
                      ? date < departureDate
                      : false;
                    return isPastDate || isBeforeDeparture || !departureDate;
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </Label>
        </div>

        <div>
          <Label className="block text-sm font-medium text-foreground">
            Number of Adults
            <Input
              type="number"
              min="1"
              max="9"
              value={searchParams.adults}
              onChange={(e) =>
                setSearchParams((prev) => ({
                  ...prev,
                  adults: parseInt(e.target.value),
                }))
              }
              className="mt-1 block w-full rounded-md border-input bg-background text-foreground shadow-sm focus:border-ring focus:ring-ring"
              required
            />
          </Label>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Search Flights
        </Button>
      </div>
    </form>
  );
};
