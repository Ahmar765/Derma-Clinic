"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"
import { Skeleton } from "@/components/ui/skeleton"
import { Chatbot } from "@/components/chatbot"

interface Service {
  id: string
  name: string
  description: string
  price: number
  duration: number
  imageUrl: string
}

export default function ServicesPage() {
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

        setServices(servicesList)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching services:", error)
        setLoading(false)
      }
    }

    fetchServices()
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center px-4">
          <MainNav />
        </div>
      </header>
      <main className="flex-1">
        <section className="container py-12 md:py-24">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
            <h1 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-5xl">Our Services</h1>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              Discover our range of professional skincare treatments designed to help you achieve healthy, glowing skin.
            </p>
          </div>

          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-8">
              {Array(6)
                .fill(0)
                .map((_, index) => (
                  <Card key={index} className="overflow-hidden">
                    <Skeleton className="h-48 w-full bg-gray-300 dark:bg-gray-700" />
                    <CardHeader>
                      <Skeleton className="h-6 w-3/4 bg-gray-300 dark:bg-gray-700" />
                      <Skeleton className="h-4 w-full mt-2 bg-gray-300 dark:bg-gray-700" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-4 w-full bg-gray-300 dark:bg-gray-700" />
                      <Skeleton className="h-4 w-3/4 mt-2 bg-gray-300 dark:bg-gray-700" />
                    </CardContent>
                    <CardFooter>
                      <Skeleton className="h-10 w-full bg-gray-300 dark:bg-gray-700" />
                    </CardFooter>
                  </Card>
                ))}
            </div>
          ) : services.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-8">
              {services.map((service) => (
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
          ) : (
            <div className="text-center mt-12">
              <p className="text-muted-foreground">No services available at the moment.</p>
            </div>
          )}
        </section>
      </main>
      <Footer />
      <Chatbot />
    </div>
  )
}
