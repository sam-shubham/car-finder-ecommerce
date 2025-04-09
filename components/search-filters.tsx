"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { Search, SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SearchFiltersProps {
  brands: string[];
  fuelTypes: string[];
  updateSearchParams: (params: Record<string, string>) => void;
  currentFilters: {
    brand: string;
    minPrice: string;
    maxPrice: string;
    fuelType: string;
    seatingCapacity: string;
    searchQuery: string;
    sortBy: string;
  };
}

export default function SearchFilters({
  brands,
  fuelTypes,
  updateSearchParams,
  currentFilters,
}: SearchFiltersProps) {
  const [isClient, setIsClient] = useState(false);
  const [searchQuery, setSearchQuery] = useState(currentFilters.searchQuery);
  const [brand, setBrand] = useState(currentFilters.brand);
  const [minPrice, setMinPrice] = useState(currentFilters.minPrice);
  const [maxPrice, setMaxPrice] = useState(currentFilters.maxPrice);
  const [fuelType, setFuelType] = useState(currentFilters.fuelType);
  const [seatingCapacity, setSeatingCapacity] = useState(
    currentFilters.seatingCapacity
  );
  const [sortBy, setSortBy] = useState(currentFilters.sortBy);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  const filterRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  // Set initial state after component mounts
  useEffect(() => {
    setIsClient(true);
    setSearchQuery(currentFilters.searchQuery);
    setBrand(currentFilters.brand);
    setMinPrice(currentFilters.minPrice);
    setMaxPrice(currentFilters.maxPrice);
    setFuelType(currentFilters.fuelType);
    setSeatingCapacity(currentFilters.seatingCapacity);
    setSortBy(currentFilters.sortBy);
  }, [currentFilters]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setIsFilterOpen(false);
      }
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle search input
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateSearchParams({ search: searchQuery, page: "1" });
  };

  // Apply filters
  const applyFilters = () => {
    updateSearchParams({
      brand,
      minPrice,
      maxPrice,
      fuelType,
      seatingCapacity,
      page: "1",
    });
    setIsFilterOpen(false);
  };

  // Reset filters
  const resetFilters = () => {
    setBrand("all");
    setMinPrice("");
    setMaxPrice("");
    setFuelType("all");
    setSeatingCapacity("any");
    setSortBy("default");

    updateSearchParams({
      brand: "all",
      minPrice: "",
      maxPrice: "",
      fuelType: "all",
      seatingCapacity: "any",
      sortBy: "default",
      page: "1",
    });
  };

  // Handle sort change
  const handleSortChange = (value: string) => {
    setSortBy(value);
    updateSearchParams({ sortBy: value, page: "1" });
    setIsSortOpen(false);
  };

  // Get sort label
  const getSortLabel = () => {
    switch (sortBy) {
      case "price-asc":
        return "Price: Low to High";
      case "price-desc":
        return "Price: High to Low";
      default:
        return "Sort by";
    }
  };

  if (!isClient) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <div className="flex flex-col sm:flex-row gap-4">
        <form onSubmit={handleSearch} className="flex-1 relative group">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <input
            type="search"
            placeholder="Search cars by name, brand or model..."
            style={{
              paddingLeft: "40px",
            }}
            className="custom-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        <div className="flex gap-2">
          <div className="relative" ref={sortRef}>
            <button
              type="button"
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="outline-button flex items-center gap-2 min-w-[140px] justify-between"
            >
              <span>{getSortLabel()}</span>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  isSortOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            <AnimatePresence>
              {isSortOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-card border border-border overflow-hidden z-10"
                >
                  <div className="py-1">
                    <button
                      type="button"
                      onClick={() => handleSortChange("default")}
                      className={`flex items-center w-full px-4 py-2 text-sm hover:bg-secondary transition-colors ${
                        sortBy === "default" ? "bg-secondary" : ""
                      }`}
                    >
                      Default
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSortChange("price-asc")}
                      className={`flex items-center w-full px-4 py-2 text-sm hover:bg-secondary transition-colors ${
                        sortBy === "price-asc" ? "bg-secondary" : ""
                      }`}
                    >
                      Price: Low to High
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSortChange("price-desc")}
                      className={`flex items-center w-full px-4 py-2 text-sm hover:bg-secondary transition-colors ${
                        sortBy === "price-desc" ? "bg-secondary" : ""
                      }`}
                    >
                      Price: High to Low
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="relative" ref={filterRef}>
            <button
              type="button"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="outline-button flex items-center gap-2"
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span>Filters</span>
            </button>

            <AnimatePresence>
              {isFilterOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-72 rounded-md shadow-lg bg-card border border-border overflow-hidden z-10"
                >
                  <div className="p-4 space-y-4">
                    <h3 className="font-medium">Filters</h3>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Brand</label>
                      <select
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                        className="custom-select"
                      >
                        <option value="all">All Brands</option>
                        {brands.map((b) => (
                          <option key={b} value={b}>
                            {b}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Price Range</label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="number"
                          placeholder="Min"
                          value={minPrice}
                          onChange={(e) => setMinPrice(e.target.value)}
                          className="custom-input"
                        />
                        <input
                          type="number"
                          placeholder="Max"
                          value={maxPrice}
                          onChange={(e) => setMaxPrice(e.target.value)}
                          className="custom-input"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Fuel Type</label>
                      <select
                        value={fuelType}
                        onChange={(e) => setFuelType(e.target.value)}
                        className="custom-select"
                      >
                        <option value="all">All Fuel Types</option>
                        {fuelTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Seating Capacity
                      </label>
                      <select
                        value={seatingCapacity}
                        onChange={(e) => setSeatingCapacity(e.target.value)}
                        className="custom-select"
                      >
                        <option value="any">Any</option>
                        <option value="2">2 Seats</option>
                        <option value="4">4 Seats</option>
                        <option value="5">5 Seats</option>
                        <option value="7">7 Seats</option>
                        <option value="8">8+ Seats</option>
                      </select>
                    </div>

                    <div className="flex justify-between pt-2">
                      <button
                        type="button"
                        onClick={resetFilters}
                        className="outline-button"
                      >
                        Reset
                      </button>
                      <button
                        type="button"
                        onClick={applyFilters}
                        className="primary-button"
                      >
                        Apply Filters
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Active filters display */}
      <AnimatePresence>
        {(brand !== "all" ||
          minPrice ||
          maxPrice ||
          fuelType !== "all" ||
          seatingCapacity !== "any" ||
          sortBy !== "default") && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap gap-2 overflow-hidden"
          >
            {brand !== "all" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="filter-chip"
              >
                <span>Brand: {brand}</span>
                <button
                  onClick={() => {
                    setBrand("all");
                    updateSearchParams({ brand: "all", page: "1" });
                  }}
                >
                  <X className="h-3 w-3" />
                </button>
              </motion.div>
            )}

            {minPrice && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="filter-chip"
              >
                <span>Min Price: ${minPrice}</span>
                <button
                  onClick={() => {
                    setMinPrice("");
                    updateSearchParams({ minPrice: "", page: "1" });
                  }}
                >
                  <X className="h-3 w-3" />
                </button>
              </motion.div>
            )}

            {maxPrice && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="filter-chip"
              >
                <span>Max Price: ${maxPrice}</span>
                <button
                  onClick={() => {
                    setMaxPrice("");
                    updateSearchParams({ maxPrice: "", page: "1" });
                  }}
                >
                  <X className="h-3 w-3" />
                </button>
              </motion.div>
            )}

            {fuelType !== "all" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="filter-chip"
              >
                <span>Fuel: {fuelType}</span>
                <button
                  onClick={() => {
                    setFuelType("all");
                    updateSearchParams({ fuelType: "all", page: "1" });
                  }}
                >
                  <X className="h-3 w-3" />
                </button>
              </motion.div>
            )}

            {seatingCapacity !== "any" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="filter-chip"
              >
                <span>Seats: {seatingCapacity}</span>
                <button
                  onClick={() => {
                    setSeatingCapacity("any");
                    updateSearchParams({ seatingCapacity: "any", page: "1" });
                  }}
                >
                  <X className="h-3 w-3" />
                </button>
              </motion.div>
            )}

            {sortBy !== "default" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="filter-chip"
              >
                <span>
                  Sort:{" "}
                  {sortBy === "price-asc"
                    ? "Price (Low to High)"
                    : "Price (High to Low)"}
                </span>
                <button
                  onClick={() => {
                    setSortBy("default");
                    updateSearchParams({ sortBy: "default", page: "1" });
                  }}
                >
                  <X className="h-3 w-3" />
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
