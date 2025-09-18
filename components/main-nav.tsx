"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAuth } from "@/context/auth-context"
import { Menu } from "lucide-react"

export function MainNav() {
  const pathname = usePathname()
  const { user, logout, isAdmin } = useAuth()

  const routes = [
    {
      href: "/",
      label: "Home",
      active: pathname === "/",
    },
    {
      href: "/services",
      label: "Services",
      active: pathname === "/services",
    },
    {
      href: "/blog",
      label: "Blog",
      active: pathname === "/blog",
    },
    {
      href: "/contact",
      label: "Contact",
      active: pathname === "/contact",
    },
  ]

  const userRoutes = user
    ? [
        {
          href: "/profile",
          label: "Profile",
          active: pathname === "/profile",
        },
        {
          href: "/bookings",
          label: "My Bookings",
          active: pathname === "/bookings",
        },
      ]
    : []

  const adminRoutes = isAdmin
    ? [
        {
          href: "/admin",
          label: "Admin Dashboard",
          active: pathname === "/admin",
        },
      ]
    : []

  const allRoutes = [...routes, ...userRoutes, ...adminRoutes]

  return (
    <div className="flex items-center justify-between w-full">
      <Link href="/" className="flex items-center space-x-2">
        <span className="font-bold text-xl">Derma Clinic</span>
      </Link>
      <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "transition-colors hover:text-primary",
              route.active ? "text-primary font-bold" : "text-muted-foreground",
            )}
          >
            {route.label}
          </Link>
        ))}
      </nav>
      <div className="flex items-center space-x-4">
        {user ? (
          <div className="hidden md:flex items-center space-x-4">
            {userRoutes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "transition-colors hover:text-primary",
                  route.active ? "text-primary font-bold" : "text-muted-foreground",
                )}
              >
                {route.label}
              </Link>
            ))}
            {adminRoutes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "transition-colors hover:text-primary",
                  route.active ? "text-primary font-bold" : "text-muted-foreground",
                )}
              >
                {route.label}
              </Link>
            ))}
            <Button onClick={() => logout()} variant="outline">
              Logout
            </Button>
          </div>
        ) : (
          <div className="hidden md:flex items-center space-x-4">
            <Button asChild variant="outline" className="border border-gray-200 cursor-pointer">
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild className="bg-black text-white hover:bg-gray-900">
              <Link href="/register">Register</Link>
            </Button>
          </div>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="md:hidden">
            <Button variant="outline" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-gray-50 border border-gray-200 text-black">
            {allRoutes.map((route) => (
              <DropdownMenuItem key={route.href} asChild>
                <Link href={route.href}>{route.label}</Link>
              </DropdownMenuItem>
            ))}
            {user ? (
              <DropdownMenuItem onClick={() => logout()}>Logout</DropdownMenuItem>
            ) : (
              <>
                <DropdownMenuItem asChild>
                  <Link href="/login">Login</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/register">Register</Link>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
