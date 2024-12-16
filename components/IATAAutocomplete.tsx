// components/IATAAutocomplete.tsx
import React, { useState, useEffect, useRef, KeyboardEvent } from "react";
import { Input } from "@/components/ui/input";

// IATA/ICAO data source: https://github.com/ip2location/ip2location-iata-icao

interface IATACode {
  country_code: string;
  region_name: string;
  iata: string;
  icao: string;
  airport: string;
  latitude: string;
  longitude: string;
}

interface IATAAutocompleteProps {
  value: string;
  onChange: (value: string, iataCode: string) => void;
  placeholder: string;
  label: string;
}

const IATAAutocomplete: React.FC<IATAAutocompleteProps> = ({
  value,
  onChange,
  placeholder,
  label,
}) => {
  const [iataList, setIataList] = useState<IATACode[]>([]);
  const [filteredList, setFilteredList] = useState<IATACode[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [inputValue, setInputValue] = useState(value);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Data source: https://github.com/ip2location/ip2location-iata-icao
    fetch("/iata-icao.csv")
      .then((response) => response.text())
      .then((data) => {
        const lines = data.split("\n");
        const parsedData = lines
          .slice(1)
          .map((line) => {
            const [
              country_code,
              region_name,
              iata,
              icao,
              airport,
              latitude,
              longitude,
            ] = line.split(",").map((item) => item.replace(/"/g, "").trim());
            return {
              country_code,
              region_name,
              iata,
              icao,
              airport,
              latitude,
              longitude,
            };
          })
          .filter((item) => item.iata && item.airport && item.region_name);
        setIataList(parsedData);
      })
      .catch((error) => console.error("Error loading IATA codes:", error));
  }, []);

  useEffect(() => {
    const filtered = iataList.filter(
      (item) =>
        (item.airport &&
          item.airport.toLowerCase().includes(inputValue.toLowerCase())) ||
        (item.iata &&
          item.iata.toLowerCase().startsWith(inputValue.toLowerCase())) ||
        (item.region_name &&
          item.region_name.toLowerCase().includes(inputValue.toLowerCase()))
    );
    setFilteredList(filtered.slice(0, 10));
    setIsOpen(filtered.length > 0 && inputValue.length > 0);
    setSelectedIndex(-1);
  }, [inputValue, iataList]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (selected: IATACode) => {
    setInputValue(selected.airport);
    onChange(selected.airport, selected.iata);
    setIsOpen(false);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredList.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < filteredList.length) {
          handleSelect(filteredList[selectedIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue, ""); // Clear IATA code when input changes
  };

  return (
    <div ref={wrapperRef} className="relative">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        <Input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder={placeholder}
        />
      </label>
      {isOpen && (
        <ul className="absolute z-10 mt-1 w-[200%] bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
          {filteredList.map((item, index) => (
            <li
              key={item.iata}
              className={`cursor-pointer select-none relative py-2 px-3 ${
                index === selectedIndex ? "bg-blue-100" : "hover:bg-gray-100"
              }`}
              onClick={() => handleSelect(item)}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold flex-shrink-0 mr-2">
                  {item.airport}
                </span>
                <span className="text-sm text-gray-500 truncate flex-grow text-right">
                  {item.region_name}, {item.country_code}
                </span>
                <span className="text-sm font-mono ml-2 flex-shrink-0">
                  ({item.iata})
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default IATAAutocomplete;
