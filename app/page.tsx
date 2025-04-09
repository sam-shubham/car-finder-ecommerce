import CarSearch from "@/components/car-search";
import { Suspense } from "react";

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Car Finder</h1>
      <Suspense
        fallback={
          <div className="flex justify-center items-center py-12">
            <div className="relative">
              <div className="h-24 w-24 rounded-full border-t-4 border-b-4 border-blue-500 animate-spin"></div>
              <div className="absolute top-0 left-0 h-24 w-24 rounded-full border-t-4 border-l-4 border-blue-300 animate-ping opacity-60"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-600 font-medium">
                Loading
              </div>
            </div>
          </div>
        }
      >
        <CarSearch />
      </Suspense>
    </main>
  );
}
