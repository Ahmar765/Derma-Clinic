"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/context/auth-context"
import { collection, query, where, getDocs, orderBy, doc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"
import { AuthGuard } from "@/lib/auth-guard"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, DollarSign, AlertCircle } from "lucide-react"

interface Booking {
  id: string
  userId: string
  userName: string
  userEmail: string
  serviceId: string
  serviceName: string
  servicePrice: number
  date: any
  time: string
  status: string
  paymentStatus: string
  createdAt: any
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const { user } = useAuth()

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return

      try {
        const q = query(collection(db, "bookings"), where("userId", "==", user.uid), orderBy("createdAt", "desc"))

        const bookingsSnapshot = await getDocs(q)
        const bookingsList = bookingsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Booking[]

        setBookings(bookingsList)
        setLoading(false)
      } catch (error: any) {
        setError(error.message || "Failed to fetch bookings")
        setLoading(false)
      }
    }

    fetchBookings()
  }, [user])

  const handleCancelBooking = async (bookingId: string) => {
    try {
      await updateDoc(doc(db, "bookings", bookingId), {
        status: "cancelled",
      })

      // Update local state
      setBookings((prevBookings) =>
        prevBookings.map((booking) => (booking.id === bookingId ? { ...booking, status: "cancelled" } : booking)),
      )

      setMessage("Booking cancelled successfully")

      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage("")
      }, 3000)
    } catch (error: any) {
      setError(error.message || "Failed to cancel booking")

      // Clear error after 3 seconds
      setTimeout(() => {
        setError("")
      }, 3000)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
            Pending
          </Badge>
        )
      case "confirmed":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
            Confirmed
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
            Cancelled
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
            Completed
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
            Paid
          </Badge>
        )
      case "unpaid":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
            Unpaid
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const upcomingBookings = bookings.filter(
    (booking) =>
      booking.status !== "cancelled" &&
      booking.status !== "completed" &&
      new Date(booking.date.seconds * 1000) >= new Date(),
  )

  const pastBookings = bookings.filter(
    (booking) =>
      booking.status === "cancelled" ||
      booking.status === "completed" ||
      new Date(booking.date.seconds * 1000) < new Date(),
  )

  return (
    <AuthGuard>
      <div className="flex min-h-screen flex-col">
        <header className="border-b">
          <div className="container flex h-16 items-center px-4">
            <MainNav />
          </div>
        </header>
        <main className="flex-1 container py-12">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold">My Bookings</h1>
              <Button asChild>
                <Link href="/bookings/new">New Booking</Link>
              </Button>
            </div>

            {message && (
              <Alert className="mb-4">
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Tabs defaultValue="upcoming" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="past">Past</TabsTrigger>
              </TabsList>
              <TabsContent value="upcoming">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : upcomingBookings.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingBookings.map((booking) => (
                      <Card key={booking.id}>
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle>{booking.serviceName}</CardTitle>
                              <CardDescription>Booking ID: {booking.id}</CardDescription>
                            </div>
                            <div className="flex space-x-2">
                              {getStatusBadge(booking.status)}
                              {getPaymentStatusBadge(booking.paymentStatus)}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>{new Date(booking.date.seconds * 1000).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>{booking.time}</span>
                            </div>
                            <div className="flex items-center">
                              <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>${booking.servicePrice}</span>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                          {booking.paymentStatus === "unpaid" && (
                            <Button asChild variant="outline">
                              <Link href={`/bookings/${booking.id}/payment`}>Pay Now</Link>
                            </Button>
                          )}
                          {booking.status !== "cancelled" && (
                            <Button variant="destructive" onClick={() => handleCancelBooking(booking.id)}>
                              Cancel Booking
                            </Button>
                          )}
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">No upcoming bookings</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      You don&apos;t have any upcoming appointments scheduled.
                    </p>
                    <Button asChild className="mt-4">
                      <Link href="/bookings/new">Book an Appointment</Link>
                    </Button>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="past">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : pastBookings.length > 0 ? (
                  <div className="space-y-4">
                    {pastBookings.map((booking) => (
                      <Card key={booking.id}>
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle>{booking.serviceName}</CardTitle>
                              <CardDescription>Booking ID: {booking.id}</CardDescription>
                            </div>
                            <div className="flex space-x-2">
                              {getStatusBadge(booking.status)}
                              {getPaymentStatusBadge(booking.paymentStatus)}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>{new Date(booking.date.seconds * 1000).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>{booking.time}</span>
                            </div>
                            <div className="flex items-center">
                              <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>${booking.servicePrice}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">No past bookings</h3>
                    <p className="mt-2 text-sm text-muted-foreground">You don&apos;t have any past appointments.</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </main>
        <Footer />
      </div>
    </AuthGuard>
  )
}

