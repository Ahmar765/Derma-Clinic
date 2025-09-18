"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { collection, getDocs, orderBy, query } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"
import { Skeleton } from "@/components/ui/skeleton"
import { Chatbot } from "@/components/chatbot"
import { CalendarIcon, Clock, User } from "lucide-react"

interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  author: string
  imageUrl: string
  createdAt: any
  readTime?: number
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsQuery = query(collection(db, "blogs"), orderBy("createdAt", "desc"))
        const postsSnapshot = await getDocs(postsQuery)
        const postsList = postsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          // Calculate estimated read time based on content length
          readTime: Math.max(1, Math.ceil(doc.data().content?.length / 1000)) || 3,
        })) as BlogPost[]

        setPosts(postsList)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching blog posts:", error)
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  // Format date
  const formatDate = (timestamp: any) => {
    if (!timestamp) return "N/A"

    if (timestamp.seconds) {
      return new Date(timestamp.seconds * 1000).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    }

    try {
      return new Date(timestamp).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } catch (error) {
      return "Invalid date"
    }
  }

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
            <h1 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-5xl">Skincare Blog</h1>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              Expert advice, tips, and insights for healthy, radiant skin
            </p>
          </div>

          {loading ? (
            <div className="grid gap-8 mt-12 md:grid-cols-2 lg:grid-cols-3">
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
          ) : posts.length > 0 ? (
            <div className="grid gap-8 mt-12 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Card key={post.id} className="overflow-hidden flex flex-col">
                  <div className="relative h-48 w-full">
                    <img
                      src={post.imageUrl || "/placeholder.svg?height=300&width=400"}
                      alt={post.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="line-clamp-2 hover:text-primary transition-colors">
                      <Link href={`/blog/${post.id}`}>{post.title}</Link>
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <User className="h-3 w-3" /> {post.author}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{post.excerpt}</p>
                    <div className="flex items-center text-xs text-muted-foreground gap-4">
                      <div className="flex items-center">
                        <CalendarIcon className="h-3 w-3 mr-1" />
                        <span>{formatDate(post.createdAt)}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{post.readTime} min read</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button asChild variant="outline" className="w-full">
                      <Link href={`/blog/${post.id}`}>Read More</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center mt-12">
              <p className="text-muted-foreground">No blog posts available at the moment.</p>
            </div>
          )}
        </section>
      </main>
      <Footer />
      <Chatbot />
    </div>
  )
}

