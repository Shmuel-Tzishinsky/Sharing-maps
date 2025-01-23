import React, { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";

const SearchAutocomplete = ({ onSelect, data }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef(null);

  // Simulated API call - replace with your actual API endpoint
  const filterMarkers = (searchQuery) => {
    if (!searchQuery) return data;
    const lowerCaseQuery = searchQuery.toLowerCase();

    return data.filter(
      (marker) =>
        (marker.title && marker.title.toLowerCase().includes(lowerCaseQuery)) ||
        (marker.description && marker.description.toLowerCase().includes(lowerCaseQuery))
    );
  };
  //  const filterMarkers = (searchQuery) => {
  //   if (!searchQuery) return data;
  //   const lowerCaseQuery = searchQuery.toLowerCase();
  //   // שינוי רק למארקרס ולתת ID ספציפי לכל אחד
  //   return data
  //     .map((item) => ({
  //       ...item,
  //       markers: item.markers.filter(
  //         (marker) =>
  //           marker.title.toLowerCase().includes(lowerCaseQuery) ||
  //           (marker.description && marker.description.toLowerCase().includes(lowerCaseQuery))
  //       ),
  //     }))
  //     .filter((item) => item.markers.length > 0); // מסירים קטגוריות שאין להן התאמות
  // };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.length >= 2) {
      const searchResults = filterMarkers(query);
      setResults(searchResults);
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [query]);

  const handleKeyDown = (e) => {
    if (!isOpen) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleSelect(results[selectedIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        break;
    }
  };

  const handleSelect = (item) => {
    onSelect(item);
    setQuery(item.title);
    setTimeout(() => {
      setIsOpen(false);
    }, 0);
    setSelectedIndex(-1);
  };

  return (
    <div className="relative w-full" ref={searchRef}>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            onSelect(null);
            setQuery(e.target.value);
          }}
          onKeyDown={handleKeyDown}
          placeholder="חפש..."
          className="w-full p-2 pr-10 border rounded-lg shadow-sm px-4 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
          dir="rtl"
        />
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
      </div>

      {isOpen && (
        <div className="absolute mt-1 w-full bg-white rounded-lg border border-gray-300 shadow-lg max-h-60 overflow-auto z-50">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500" dir="rtl">
              טוען תוצאות...
            </div>
          ) : results.length > 0 ? (
            <ul className="py-2">
              {results.map((item, index) => (
                <li
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`px-4 py-2 cursor-pointer text-right ${
                    selectedIndex === index ? "bg-blue-50 text-blue-700" : "hover:bg-gray-50"
                  }`}
                  dir="rtl"
                >
                  <div className="font-medium">{item.title}</div>
                  {item.description && (
                    <div className="text-sm text-gray-500">{item.description}</div>
                  )}
                </li>
              ))}
            </ul>
          ) : query.length >= 2 ? (
            <div className="p-4 text-center text-gray-500" dir="rtl">
              לא נמצאו תוצאות
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default SearchAutocomplete;
