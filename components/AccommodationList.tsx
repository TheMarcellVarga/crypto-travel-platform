"use client";
import { useEffect, useState } from "react";
import {
  searchHotelOffers,
  HotelSearchParams,
  HotelOfferResponse,
} from "@/lib/travelApi";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const AccommodationList = () => {
  const [hotelOffers, setHotelOffers] = useState<HotelOfferResponse["data"]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkInDate, setCheckInDate] = useState<Date>();
  const [adults, setAdults] = useState(1);
  const [roomQuantity, setRoomQuantity] = useState(1);
  const [hotelId, setHotelId] = useState("MCLONGHM"); // Default hotel ID

  const handleSearch = async () => {
    if (!checkInDate) {
      setError("Please select a check-in date");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const searchParams: HotelSearchParams = {
        hotelIds: hotelId,
        adults: adults,
        checkInDate: format(checkInDate, "yyyy-MM-dd"),
        roomQuantity: roomQuantity,
        paymentPolicy: "NONE",
        bestRateOnly: true,
      };

      const data = await searchHotelOffers(searchParams);
      if (data && data.data) {
        setHotelOffers(data.data);
      } else {
        setHotelOffers([]);
      }
    } catch (error) {
      console.error("Error fetching hotel offers:", error);
      if (error instanceof Error) {
        if (error.message.includes("NO ROOMS AVAILABLE")) {
          setError(
            "No rooms are available for the selected dates and criteria. Please try different dates or hotel."
          );
        } else {
          setError(
            "An error occurred while searching for hotel offers. Please try again later."
          );
        }
        console.error("Detailed error:", error.message);
      } else {
        setError("An unknown error occurred while fetching hotel offers.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Hotel Search</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div>
          <Label htmlFor="hotelId">Hotel ID</Label>
          <Input
            id="hotelId"
            value={hotelId}
            onChange={(e) => setHotelId(e.target.value)}
            placeholder="Enter Hotel ID"
          />
        </div>
        <div>
          <Label>Check-in Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`w-full justify-start text-left font-normal ${
                  !checkInDate && "text-muted-foreground"
                }`}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {checkInDate ? format(checkInDate, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={checkInDate}
                onSelect={setCheckInDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div>
          <Label htmlFor="adults">Adults</Label>
          <Select
            value={adults.toString()}
            onValueChange={(value) => setAdults(parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select number of adults" />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4].map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  {num}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="roomQuantity">Rooms</Label>
          <Select
            value={roomQuantity.toString()}
            onValueChange={(value) => setRoomQuantity(parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select number of rooms" />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4].map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  {num}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button onClick={handleSearch} disabled={isLoading}>
        {isLoading ? "Searching..." : "Search Hotels"}
      </Button>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {hotelOffers.length > 0 && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotelOffers.map((hotelOffer) => (
            <div
              key={hotelOffer.hotel.hotelId}
              className="border rounded-lg shadow-lg p-4"
            >
              <h3 className="text-xl font-bold">{hotelOffer.hotel.name}</h3>
              <p className="text-gray-600">{hotelOffer.hotel.cityCode}</p>
              {hotelOffer.offers[0] && (
                <>
                  <div className="mt-2">
                    <span className="text-green-600 font-bold">
                      {hotelOffer.offers[0].price.total}{" "}
                      {hotelOffer.offers[0].price.currency}
                    </span>
                  </div>
                  <div className="mt-2">
                    <span className="text-blue-500">
                      {hotelOffer.offers[0].room.type}
                    </span>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {hotelOffers.length === 0 && !isLoading && (
        <p className="mt-4">No hotel offers found.</p>
      )}
    </div>
  );
};
