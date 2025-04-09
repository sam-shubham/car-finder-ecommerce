"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Heart, Trash2 } from "lucide-react"
import type { Car } from "@/types/car"
import CarList from "@/components/car-list"
import { motion } from "framer-motion"

export default function WishlistPage() {
  const router = useRouter()
  const [wishlistCars, setWishlistCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchWishlistCars = async () => {
      setLoading(true)
      try {
        // Get wishlist IDs from local storage
        const wishlistIds = JSON.parse(localStorage.getItem("wishlist") || "[]")

        if (wishlistIds.length === 0) {
          setWishlistCars([])
          setLoading(false)
          return
        }

        // Fetch all cars
        const response = await fetch("/api/cars")
        if (!response.ok) {
          throw new Error("Failed to fetch cars")
        }

        const allCars = await response.json()

        // Filter cars that are in the wishlist
        const wishlistCars = allCars.filter((car: Car) => wishlistIds.includes(car.id))
        setWishlistCars(wishlistCars)

        setError(null)
      } catch (err) {
        setError("Failed to load wishlist. Please try again later.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchWishlistCars()

    // Listen for wishlist updates
    const handleWishlistUpdate = () => {
      fetchWishlistCars()
    }

    window.addEventListener("wishlistUpdated", handleWishlistUpdate)
    window.addEventListener("storage", handleWishlistUpdate)

    return () => {
      window.removeEventListener("wishlistUpdated", handleWishlistUpdate)
      window.removeEventListener("storage", handleWishlistUpdate)
    }
  }, [])

  const clearWishlist = () => {
    localStorage.setItem("wishlist", "[]")
    setWishlistCars([])

    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event("wishlistUpdated"))
    // Also dispatch storage event for cross-tab updates
    window.dispatchEvent(new StorageEvent("storage"))
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      <motion.button
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        whileHover={{ x: -5 }}
        onClick={() => router.back()}
        className="outline-button flex items-center gap-2 mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </motion.button>

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Wishlist</h1>
          <p className="text-muted-foreground">
            {wishlistCars.length} {wishlistCars.length === 1 ? "car" : "cars"} in your wishlist
          </p>
        </div>

        {wishlistCars.length > 0 && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={clearWishlist}
            className="outline-button flex items-center gap-2 text-destructive border-destructive/20 hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
            Clear Wishlist
          </motion.button>
        )}
      </div>

      {loading ? (
        <div className="text-center py-10">
          <div className="spinner" />
          <p className="mt-4">Loading wishlist...</p>
        </div>
      ) : error ? (
        <div className="text-center py-10 text-destructive">
          <p>{error}</p>
        </div>
      ) : wishlistCars.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center py-16 space-y-4"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Heart className="h-16 w-16 mx-auto text-muted-foreground" />
          </motion.div>
          <h2 className="text-2xl font-semibold">Your wishlist is empty</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Start adding cars to your wishlist by clicking the heart icon on any car you like.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/")}
            className="primary-button mt-4"
          >
            Browse Cars
          </motion.button>
        </motion.div>
      ) : (
        <CarList cars={wishlistCars} />
      )}
    </motion.div>
  )
}
