import Link from "next/link"
import { Button } from "@/components/ui/button"
import bannerImage from '@/public/home_screen_design.jpg'
export function HeroSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Your Journey to Healthy, Radiant Skin
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Professional skincare treatments tailored to your unique needs. Book your appointment today and
                experience the difference.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button asChild size="lg" className="bg-black text-white hover:bg-gray-900">
                <Link href="/services">Explore Services</Link>
              </Button>
              <Button asChild size="lg" className="bg-white text-black border border-black hover:bg-gray-100">
                <Link href="/bookings/new">Book Appointment</Link>
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <img
              alt="Skincare Treatment"
              className="aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
              height="550"
              src={bannerImage.src}
              width="800"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
