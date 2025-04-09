"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { Heart, ArrowLeft, Check, Fuel, Users, Gauge, Zap } from "lucide-react"
import type { Car } from "@/types/car"
import { motion, AnimatePresence } from "framer-motion"

export default function CarDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { id } = params

  const [car, setCar] = useState<Car | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [inWishlist, setInWishlist] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    const fetchCarDetails = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/cars/${id}`)
        if (!response.ok) {
          throw new Error("Failed to fetch car details")
        }
        const data = await response.json()
        setCar(data)

        // Check if car is in wishlist
        const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]")
        setInWishlist(wishlist.includes(id))

        setError(null)
      } catch (err) {
        setError("Failed to load car details. Please try again later.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchCarDetails()
    }
  }, [id])

  const toggleWishlist = () => {
    if (!car) return

    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]")
    let newWishlist: string[]

    if (inWishlist) {
      newWishlist = wishlist.filter((carId: string) => carId !== id)
    } else {
      newWishlist = [...wishlist, id]
    }

    localStorage.setItem("wishlist", JSON.stringify(newWishlist))
    setInWishlist(!inWishlist)

    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event("wishlistUpdated"))
    // Also dispatch storage event for cross-tab updates
    window.dispatchEvent(new StorageEvent("storage"))
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="spinner" />
          <p className="mt-4">Loading car details...</p>
        </div>
      </div>
    )
  }

  if (error || !car) {
    return (
      <div className="container mx-auto px-4 py-8">
        <button onClick={() => router.back()} className="outline-button flex items-center gap-2 mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <div className="text-center py-10 text-destructive">
          <p>{error || "Car not found"}</p>
        </div>
      </div>
    )
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden"
        >
          <Image
            src={car.image || "/placeholder.svg?height=800&width=1200"}
            alt={car.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold">{car.name}</h1>
              <p className="text-xl text-muted-foreground">
                {car.brand} {car.model} {car.year}
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleWishlist}
              className={`p-2 rounded-full ${
                inWishlist ? "bg-red-500 text-white hover:bg-red-600" : "bg-secondary hover:bg-secondary/80"
              } transition-colors`}
            >
              <Heart className={`h-5 w-5 ${inWishlist ? "fill-white" : ""}`} />
            </motion.button>
          </div>

          <div className="mt-6">
            <h2 className="text-2xl font-bold">${car.price.toLocaleString()}</h2>
            <p className="text-muted-foreground">Ex-showroom price</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-8">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50"
            >
              <Fuel className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Fuel Type</p>
                <p className="font-medium">{car.fuelType}</p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50"
            >
              <Users className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Seating Capacity</p>
                <p className="font-medium">{car.seatingCapacity} Seats</p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50"
            >
              <Zap className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Transmission</p>
                <p className="font-medium">{car.transmission}</p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50"
            >
              <Gauge className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Mileage</p>
                <p className="font-medium">{car.mileage} km/l</p>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-8"
          >
            <button className="primary-button w-full">Contact Dealer</button>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="mt-12"
      >
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === "overview"
                ? "border-b-2 border-primary text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("specifications")}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === "specifications"
                ? "border-b-2 border-primary text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Specifications
          </button>
          <button
            onClick={() => setActiveTab("features")}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === "features"
                ? "border-b-2 border-primary text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Features
          </button>
        </div>

        <div className="py-6">
          <AnimatePresence mode="wait">
            {activeTab === "overview" && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="prose max-w-none dark:prose-invert"
              >
                <p>{car.description || "No description available for this car."}</p>
              </motion.div>
            )}

            {activeTab === "specifications" && (
              <motion.div
                key="specifications"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Engine & Transmission</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-3 rounded-lg bg-secondary/50">
                      <p className="text-sm text-muted-foreground">Engine Type</p>
                      <p className="font-medium">{car.engineType || "N/A"}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-secondary/50">
                      <p className="text-sm text-muted-foreground">Displacement</p>
                      <p className="font-medium">{car.displacement || "N/A"} cc</p>
                    </div>
                    <div className="p-3 rounded-lg bg-secondary/50">
                      <p className="text-sm text-muted-foreground">Max Power</p>
                      <p className="font-medium">{car.maxPower || "N/A"} bhp</p>
                    </div>
                    <div className="p-3 rounded-lg bg-secondary/50">
                      <p className="text-sm text-muted-foreground">Max Torque</p>
                      <p className="font-medium">{car.maxTorque || "N/A"} Nm</p>
                    </div>
                    <div className="p-3 rounded-lg bg-secondary/50">
                      <p className="text-sm text-muted-foreground">Transmission</p>
                      <p className="font-medium">{car.transmission || "N/A"}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-secondary/50">
                      <p className="text-sm text-muted-foreground">Drivetrain</p>
                      <p className="font-medium">{car.drivetrain || "N/A"}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Dimensions & Weight</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-3 rounded-lg bg-secondary/50">
                      <p className="text-sm text-muted-foreground">Length</p>
                      <p className="font-medium">{car.length || "N/A"} mm</p>
                    </div>
                    <div className="p-3 rounded-lg bg-secondary/50">
                      <p className="text-sm text-muted-foreground">Width</p>
                      <p className="font-medium">{car.width || "N/A"} mm</p>
                    </div>
                    <div className="p-3 rounded-lg bg-secondary/50">
                      <p className="text-sm text-muted-foreground">Height</p>
                      <p className="font-medium">{car.height || "N/A"} mm</p>
                    </div>
                    <div className="p-3 rounded-lg bg-secondary/50">
                      <p className="text-sm text-muted-foreground">Wheelbase</p>
                      <p className="font-medium">{car.wheelbase || "N/A"} mm</p>
                    </div>
                    <div className="p-3 rounded-lg bg-secondary/50">
                      <p className="text-sm text-muted-foreground">Ground Clearance</p>
                      <p className="font-medium">{car.groundClearance || "N/A"} mm</p>
                    </div>
                    <div className="p-3 rounded-lg bg-secondary/50">
                      <p className="text-sm text-muted-foreground">Kerb Weight</p>
                      <p className="font-medium">{car.kerbWeight || "N/A"} kg</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "features" && (
              <motion.div
                key="features"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Safety</h3>
                  <ul className="space-y-2">
                    {(car.safetyFeatures || ["ABS", "Airbags", "Parking Sensors"]).map((feature, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center gap-2 p-2 rounded-md hover:bg-secondary/50 transition-colors"
                      >
                        <Check className="h-4 w-4 text-green-500" />
                        <span>{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Comfort</h3>
                  <ul className="space-y-2">
                    {(car.comfortFeatures || ["Air Conditioning", "Power Steering", "Power Windows"]).map(
                      (feature, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex items-center gap-2 p-2 rounded-md hover:bg-secondary/50 transition-colors"
                        >
                          <Check className="h-4 w-4 text-green-500" />
                          <span>{feature}</span>
                        </motion.li>
                      ),
                    )}
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Entertainment</h3>
                  <ul className="space-y-2">
                    {(car.entertainmentFeatures || ["Touchscreen", "Bluetooth", "USB Connectivity"]).map(
                      (feature, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex items-center gap-2 p-2 rounded-md hover:bg-secondary/50 transition-colors"
                        >
                          <Check className="h-4 w-4 text-green-500" />
                          <span>{feature}</span>
                        </motion.li>
                      ),
                    )}
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  )
}
