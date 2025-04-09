import { NextResponse } from "next/server"
import { cars } from "@/data/cars"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const id = params.id
  const car = cars.find((car) => car.id === id)

  if (!car) {
    return new NextResponse(JSON.stringify({ error: "Car not found" }), {
      status: 404,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }

  return NextResponse.json(car)
}
