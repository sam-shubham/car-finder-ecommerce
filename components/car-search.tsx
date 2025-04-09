"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import CarList from "@/components/car-list";
import SearchFilters from "@/components/search-filters";
import Pagination from "@/components/pagination";
import type { Car } from "@/types/car";
import { useDebounce } from "@/hooks/use-debounce";
import { motion } from "framer-motion";

export default function CarSearch() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [cars, setCars] = useState<Car[]>([]);
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [brands, setBrands] = useState<string[]>([]);
  const [fuelTypes, setFuelTypes] = useState<string[]>([]);

  // Get search params
  const brand = searchParams.get("brand") || "all";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const fuelType = searchParams.get("fuelType") || "all";
  const seatingCapacity = searchParams.get("seatingCapacity") || "any";
  const searchQuery = searchParams.get("search") || "";
  const sortBy = searchParams.get("sortBy") || "default";
  const page = searchParams.get("page") || "1";

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Fetch cars data
  useEffect(() => {
    const fetchCars = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/cars");
        if (!response.ok) {
          throw new Error("Failed to fetch cars");
        }
        const data = await response.json();
        setCars(data);

        // Extract unique brands and fuel types for filters
        const uniqueBrands = [
          ...new Set(data.map((car: Car) => car.brand)),
        ] as string[];
        const uniqueFuelTypes = [
          ...new Set(data.map((car: Car) => car.fuelType)),
        ] as string[];

        setBrands(uniqueBrands);
        setFuelTypes(uniqueFuelTypes);

        setError(null);
      } catch (err) {
        setError("Failed to load cars. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  // Apply filters and search
  useEffect(() => {
    if (cars.length === 0) return;

    let filtered = [...cars];

    // Apply brand filter
    if (brand && brand !== "all") {
      filtered = filtered.filter((car) => car.brand === brand);
    }

    // Apply price range filter
    if (minPrice) {
      filtered = filtered.filter(
        (car) => car.price >= Number.parseInt(minPrice)
      );
    }
    if (maxPrice) {
      filtered = filtered.filter(
        (car) => car.price <= Number.parseInt(maxPrice)
      );
    }

    // Apply fuel type filter
    if (fuelType && fuelType !== "all") {
      filtered = filtered.filter((car) => car.fuelType === fuelType);
    }

    // Apply seating capacity filter
    if (seatingCapacity && seatingCapacity !== "any") {
      filtered = filtered.filter(
        (car) => car.seatingCapacity === Number.parseInt(seatingCapacity)
      );
    }

    // Apply search query
    if (debouncedSearchQuery) {
      const query = debouncedSearchQuery.toLowerCase();
      filtered = filtered.filter(
        (car) =>
          car.name.toLowerCase().includes(query) ||
          car.brand.toLowerCase().includes(query) ||
          car.model.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    if (sortBy && sortBy !== "default") {
      if (sortBy === "price-asc") {
        filtered.sort((a, b) => a.price - b.price);
      } else if (sortBy === "price-desc") {
        filtered.sort((a, b) => b.price - a.price);
      }
    }

    setFilteredCars(filtered);

    // Calculate total pages
    const totalPages = Math.ceil(filtered.length / 10);
    setTotalPages(totalPages > 0 ? totalPages : 1);

    // Reset to page 1 if current page is out of bounds
    if (currentPage > totalPages) {
      setCurrentPage(1);
      updateSearchParams({ page: "1" });
    }
  }, [
    cars,
    brand,
    minPrice,
    maxPrice,
    fuelType,
    seatingCapacity,
    debouncedSearchQuery,
    sortBy,
    currentPage,
  ]);

  // Update current page when page param changes
  useEffect(() => {
    setCurrentPage(Number.parseInt(page));
  }, [page]);

  // Update search params
  const updateSearchParams = (params: Record<string, string>) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());

    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        newSearchParams.set(key, value);
      } else {
        newSearchParams.delete(key);
      }
    });

    router.push(`/?${newSearchParams.toString()}`);
  };

  // Get current page of cars
  const getCurrentPageCars = () => {
    const startIndex = (currentPage - 1) * 10;
    const endIndex = startIndex + 10;
    return filteredCars.slice(startIndex, endIndex);
  };

  return (
    <div className="space-y-6">
      <SearchFilters
        brands={brands}
        fuelTypes={fuelTypes}
        updateSearchParams={updateSearchParams}
        currentFilters={{
          brand,
          minPrice,
          maxPrice,
          fuelType,
          seatingCapacity,
          searchQuery,
          sortBy,
        }}
      />

      {loading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-10"
        >
          <div className="spinner" />
          <p className="mt-4">Loading cars...</p>
        </motion.div>
      ) : error ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-10 text-destructive"
        >
          <p>{error}</p>
        </motion.div>
      ) : filteredCars.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-10"
        >
          <p>
            No cars found matching your criteria. Try adjusting your filters.
          </p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-sm text-muted-foreground">
            Found {filteredCars.length} cars matching your criteria
          </p>
          <CarList cars={getCurrentPageCars()} />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) =>
              updateSearchParams({ page: page.toString() })
            }
          />
        </motion.div>
      )}
    </div>
  );
}
