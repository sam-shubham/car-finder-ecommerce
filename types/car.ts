export interface Car {
  id: string
  name: string
  brand: string
  model: string
  year: number
  price: number
  fuelType: string
  transmission: string
  seatingCapacity: number
  mileage: number
  image?: string
  description?: string
  engineType?: string
  displacement?: number
  maxPower?: number
  maxTorque?: number
  drivetrain?: string
  length?: number
  width?: number
  height?: number
  wheelbase?: number
  groundClearance?: number
  kerbWeight?: number
  safetyFeatures?: string[]
  comfortFeatures?: string[]
  entertainmentFeatures?: string[]
}
