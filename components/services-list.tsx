"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

interface Service {
  id: string
  name: string
  description: string
  price: number
  duration: number
  imageUrl: string
}

export function ServicesList({ limit = 3 }: { limit?: number }) {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const servicesCollection = collection(db, "services")
        const servicesSnapshot = await getDocs(servicesCollection)
        const servicesList = servicesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Service[]

        setServices(servicesList.slice(0, limit))
        setLoading(false)
      } catch (error) {
        console.error("Error fetching services:", error)
        setLoading(false)
      }
    }

    fetchServices()
  }, [limit])

  if (loading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-8">
        {Array(limit)
          .fill(0)
          .map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <Skeleton className="h-48 w-full bg-gray-200 dark:bg-gray-700" />
              <CardHeader>
                <Skeleton className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700" />
                <Skeleton className="h-4 w-full mt-2 bg-gray-200 dark:bg-gray-700" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full bg-gray-200 dark:bg-gray-700" />
                <Skeleton className="h-4 w-3/4 mt-2 bg-gray-200 dark:bg-gray-700" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full bg-gray-200 dark:bg-gray-700" />
              </CardFooter>
            </Card>

          ))}
      </div>
    )
  }

  // If no services are available yet, show placeholder services
  const displayServices =
    services.length > 0
      ? services
      : [
        {
          id: "1",
          name: "Skin Consultation",
          description: "Comprehensive skin analysis and personalized treatment plan.",
          price: 75,
          duration: 45,
          imageUrl: "/placeholder.svg?height=300&width=400",
        },
        {
          id: "2",
          name: "Acne Treatment",
          description: "Targeted treatment for acne-prone skin with extraction and medication.",
          price: 120,
          duration: 60,
          imageUrl: "/placeholder.svg?height=300&width=400",
        },
        {
          id: "3",
          name: "Anti-Aging Facial",
          description: "Rejuvenating treatment to reduce fine lines and improve skin elasticity.",
          price: 150,
          duration: 75,
          imageUrl: "/placeholder.svg?height=300&width=400",
        },
      ]

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-8">
      {displayServices.map((service) => (
        <Card key={service.id} className="overflow-hidden">
          <img
            src={service.imageUrl || "/placeholder.svg?height=300&width=400"}
            alt={service.name}
            className="h-48 w-full object-cover"
          />
          <CardHeader>
            <CardTitle>{service.name}</CardTitle>
            <CardDescription>
              {service.duration} minutes | ${service.price}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{service.description}</p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full bg-black text-white hover:bg-gray-900">
              <Link href={`/bookings/new?service=${service.id}`}>Book Now</Link>
            </Button>

          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

