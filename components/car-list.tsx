"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Heart, Fuel, Users, Zap } from "lucide-react"
import type { Car } from "@/types/car"
import { motion, AnimatePresence } from "framer-motion"

interface CarListProps {
  cars: Car[]
}

export default function CarList({ cars }: CarListProps) {
  const [wishlist, setWishlist] = useState<string[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Get wishlist from local storage
    const storedWishlist = JSON.parse(localStorage.getItem("wishlist") || "[]")
    setWishlist(storedWishlist)
  }, [])

  const toggleWishlist = (carId: string) => {
    let newWishlist: string[]

    if (wishlist.includes(carId)) {
      newWishlist = wishlist.filter((id) => id !== carId)
    } else {
      newWishlist = [...wishlist, carId]
    }

    setWishlist(newWishlist)
    localStorage.setItem("wishlist", JSON.stringify(newWishlist))

    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event("wishlistUpdated"))
    // Also dispatch storage event for cross-tab updates
    window.dispatchEvent(new StorageEvent("storage"))
  }

  if (!mounted) return null

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-6">
      <AnimatePresence>
        {cars.map((car, index) => (
          <motion.div
            key={car.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            whileHover={{ y: -5 }}
            className="custom-card h-full flex flex-col"
          >
            <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
              <Image
                src={car.image || "/placeholder.svg?height=400&width=600"}
                alt={car.name}
                fill
                className="object-cover transition-transform duration-500 hover:scale-110"
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => toggleWishlist(car.id)}
                className="absolute top-2 right-2 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/90 z-10 transition-colors"
                aria-label={wishlist.includes(car.id) ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart className={`h-5 w-5 ${wishlist.includes(car.id) ? "fill-red-500 text-red-500" : ""}`} />
              </motion.button>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <span className="secondary-badge">{car.year}</span>
              </div>
            </div>
            <div className="flex-1 p-4">
              <div className="mb-2">
                <h3 className="font-semibold text-lg">{car.name}</h3>
                <p className="text-muted-foreground text-sm">
                  {car.brand} {car.model}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="flex items-center gap-2">
                  <Fuel className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{car.fuelType}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{car.seatingCapacity} Seats</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{car.transmission}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-muted-foreground"
                  >
                    <path d="M12 12c-2-2.96-1.8-5.67-1.8-5.67a5.82 5.82 0 0 1 11.5 0S21.77 9.04 12 18c-9.78-8.96-9.68-11.67-9.68-11.67a5.82 5.82 0 0 1 11.5 0V6.3"></path>
                    <path d="M12 12v6"></path>
                  </svg>
                  <span className="text-sm">{car.mileage} km/l</span>
                </div>
              </div>
            </div>
            <div className="border-t p-4 flex justify-between items-center">
              <div>
                <p className="font-bold text-lg">${car.price.toLocaleString()}</p>
                <p className="text-muted-foreground text-xs">Ex-showroom price</p>
              </div>
              <Link href={`/car/${car.id}`}>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="outline-button">
                  View Details
                </motion.button>
              </Link>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
