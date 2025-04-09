import { NextResponse } from "next/server"
import { cars } from "@/data/cars"

export async function GET() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  return NextResponse.json(cars)
}
