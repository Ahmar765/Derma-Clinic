"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/context/auth-context"
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"
import { AuthGuard } from "@/lib/auth-guard"
import { Users, Calendar, ShoppingBag, DollarSign, FileText, HelpCircle } from "lucide-react"

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    users: 0,
    bookings: 0,
    services: 0,
    revenue: 0,
    blogs: 0,
    faqs: 0,
  })
  const [loading, setLoading] = useState(true)
  const { isAdmin } = useAuth()

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch users count
        const usersSnapshot = await getDocs(collection(db, "users"))
        const usersCount = usersSnapshot.size

        // Fetch bookings
        const bookingsSnapshot = await getDocs(collection(db, "bookings"))
        const bookings = bookingsSnapshot.docs.map((doc) => doc.data())
        const bookingsCount = bookingsSnapshot.size

        // Calculate revenue from paid bookings
        const revenue = bookings
          .filter((booking) => booking.paymentStatus === "paid")
          .reduce((total, booking) => total + (booking.servicePrice || 0), 0)

        // Fetch services count
        const servicesSnapshot = await getDocs(collection(db, "services"))
        const servicesCount = servicesSnapshot.size

        // Fetch blogs count
        const blogsSnapshot = await getDocs(collection(db, "blogs"))
        const blogsCount = blogsSnapshot.size

        // Fetch FAQs count
        const faqsSnapshot = await getDocs(collection(db, "faqs"))
        const faqsCount = faqsSnapshot.size

        setStats({
          users: usersCount,
          bookings: bookingsCount,
          services: servicesCount,
          revenue,
          blogs: blogsCount,
          faqs: faqsCount,
        })

        setLoading(false)
      } catch (error) {
        console.error("Error fetching stats:", error)
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return (
    <AuthGuard requireAdmin>
      <div className="flex min-h-screen flex-col">
        <header className="border-b">
          <div className="container flex h-16 items-center px-4">
            <MainNav />
          </div>
        </header>
        <main className="flex-1 container py-12">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{loading ? "..." : stats.users}</div>
                  <p className="text-xs text-muted-foreground">Registered users in the system</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{loading ? "..." : stats.bookings}</div>
                  <p className="text-xs text-muted-foreground">Appointments booked by users</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Services</CardTitle>
                  <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{loading ? "..." : stats.services}</div>
                  <p className="text-xs text-muted-foreground">Available skincare services</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${loading ? "..." : stats.revenue}</div>
                  <p className="text-xs text-muted-foreground">Revenue from paid bookings</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Blog Posts</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{loading ? "..." : stats.blogs}</div>
                  <p className="text-xs text-muted-foreground">Published blog articles</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total FAQs</CardTitle>
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{loading ? "..." : stats.faqs}</div>
                  <p className="text-xs text-muted-foreground">Frequently asked questions</p>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="management" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="management">Management</TabsTrigger>
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="users">Users</TabsTrigger>
              </TabsList>
              <TabsContent value="management" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Service Management</CardTitle>
                    <CardDescription>Manage the services offered by your clinic</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button asChild className="w-full">
                      <Link href="/admin/services">Manage Services</Link>
                    </Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Booking Management</CardTitle>
                    <CardDescription>View and manage all user bookings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button asChild className="w-full">
                      <Link href="/admin/bookings">Manage Bookings</Link>
                    </Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Management</CardTitle>
                    <CardDescription>Track and manage payments from users</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button asChild className="w-full">
                      <Link href="/admin/payments">Manage Payments</Link>
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="content" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Blog Management</CardTitle>
                    <CardDescription>Create and manage blog posts</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button asChild className="w-full">
                      <Link href="/admin/blogs">Manage Blogs</Link>
                    </Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>FAQ Management</CardTitle>
                    <CardDescription>Create and manage frequently asked questions</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button asChild className="w-full">
                      <Link href="/admin/faqs">Manage FAQs</Link>
                    </Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Management</CardTitle>
                    <CardDescription>View and respond to user inquiries</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button asChild className="w-full">
                      <Link href="/admin/contacts">Manage Contacts</Link>
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="users" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>View and manage user accounts</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button asChild className="w-full">
                      <Link href="/admin/users">Manage Users</Link>
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
        <Footer />
      </div>
    </AuthGuard>
  )
}

