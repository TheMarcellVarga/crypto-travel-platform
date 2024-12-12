"use client";

import { useState } from "react";
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
import { AirportSearch } from "./AirportSearch";

interface SearchParams {
  originLocationCode: string;
  destinationLocationCode: string;
  departureDate: string;
  adults: number;
  returnDate?: string;
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
    destinationLocationCode: "",
    departureDate: "",
    adults: 1,
    returnDate: "",
  });

  const formatDateForAPI = (date: Date | undefined) => {
    if (!date) return "";
    return format(date, "dd/MM/yyyy");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formattedParams = {
      originLocationCode: searchParams.originLocationCode,
      destinationLocationCode: searchParams.destinationLocationCode,
      departureDate: formatDateForAPI(departureDate),
      adults: searchParams.adults,
      ...(returnDate && { returnDate: formatDateForAPI(returnDate) }),
    };

    console.log("Formatted params:", formattedParams);
    onSearch(formattedParams);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div>
          <Label className="block text-sm font-medium text-gray-700">
            From
            <AirportSearch
              value={searchParams.originLocationCode}
              onChange={(value) =>
                setSearchParams((prev) => ({
                  ...prev,
                  originLocationCode: value,
                }))
              }
              placeholder="Search departure airport..."
            />
          </Label>
        </div>

        <div>
          <Label className="block text-sm font-medium text-gray-700">
            To
            <AirportSearch
              value={searchParams.destinationLocationCode}
              onChange={(value) =>
                setSearchParams((prev) => ({
                  ...prev,
                  destinationLocationCode: value,
                }))
              }
              placeholder="Search arrival airport..."
            />
          </Label>
        </div>

        <div>
          <Label className="block text-sm font-medium text-gray-700">
            Departure Date
            <Popover open={departureDateOpen} onOpenChange={setDepartureDateOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={`w-full justify-start text-left font-normal mt-1 ${
                    !departureDate && "text-muted-foreground"
                  }`}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {departureDate
                    ? format(departureDate, "dd/MM/yyyy")
                    : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={departureDate}
                  onSelect={(date) => {
                    setDepartureDate(date);
                    setDepartureDateOpen(false);
                    setSearchParams((prev) => ({
                      ...prev,
                      departureDate: date ? formatDateForAPI(date) : "",
                    }));
                  }}
                  disabled={(date) => {
                    const isPastDate = date < new Date();
                    const isAfterReturn = returnDate ? date > returnDate : false;
                    return isPastDate || isAfterReturn;
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </Label>
        </div>

        <div>
          <Label className="block text-sm font-medium text-gray-700">
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
                    ? format(returnDate, "dd/MM/yyyy")
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
                      returnDate: date ? formatDateForAPI(date) : "",
                    }));
                  }}
                  disabled={(date) => {
                    const isPastDate = date < new Date();
                    const isBeforeDeparture = departureDate ? date < departureDate : false;
                    return isPastDate || isBeforeDeparture;
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </Label>
        </div>

        <div>
          <Label className="block text-sm font-medium text-gray-700">
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </Label>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          Search Flights
        </Button>
      </div>
    </form>
  );
};
