import Link from "next/link"
import { Button } from "@/components/ui/button"
import { HeroSection } from "@/components/hero-section"
import { ServicesList } from "@/components/services-list"
import { BlogPreview } from "@/components/blog-preview"
import { FaqSection } from "@/components/faq-section"
import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col .container">
      <header className="border-b">
        <div className="container flex h-16 items-center px-4">
          <MainNav />
        </div>
      </header>
      <main className="flex-1">
        <HeroSection />
        <section className="container py-12 md:py-24 lg:py-32">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
            <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-5xl">Our Services</h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              Discover our range of professional skincare treatments designed to help you achieve healthy, glowing skin.
            </p>
          </div>
          <ServicesList />
          <div className="mx-auto mt-8 flex justify-center">
            <Button asChild>
              <Link href="/services">View All Services</Link>
            </Button>
          </div>
        </section>
        <section className="container py-12 md:py-24 lg:py-32 bg-muted/50">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
            <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-5xl">Latest Skincare Tips</h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              Stay updated with the latest skincare trends and expert advice.
            </p>
          </div>
          <BlogPreview />
          <div className="mx-auto mt-8 flex justify-center">
            <Button asChild variant="outline">
              <Link href="/blog">Read More Articles</Link>
            </Button>
          </div>
        </section>
        <section className="container py-12 md:py-24 lg:py-32">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
            <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-5xl">Frequently Asked Questions</h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              Find answers to common questions about our services and treatments.
            </p>
          </div>
          <FaqSection />
        </section>
      </main>
      <Footer />
    </div>
  )
}

