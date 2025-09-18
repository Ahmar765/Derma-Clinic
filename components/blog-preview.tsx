"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { collection, getDocs, orderBy, query, limit } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  author: string
  imageUrl: string
  createdAt: string
}

export function BlogPreview() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsQuery = query(collection(db, "blogs"), orderBy("createdAt", "desc"), limit(3))
        const postsSnapshot = await getDocs(postsQuery)
        const postsList = postsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
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

  if (loading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-8">
        {Array(3)
          .fill(0)
          .map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4 mt-2" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
      </div>
    )
  }

  // If no posts are available yet, show placeholder posts
  const displayPosts =
    posts.length > 0
      ? posts
      : [
          {
            id: "1",
            title: "The Importance of Sunscreen in Your Daily Routine",
            excerpt:
              "Learn why sunscreen is crucial for skin health and how to choose the right one for your skin type.",
            content: "",
            author: "Dr. Sarah Johnson",
            imageUrl: "/placeholder.svg?height=300&width=400",
            createdAt: new Date().toISOString(),
          },
          {
            id: "2",
            title: "Understanding Acne: Causes and Treatments",
            excerpt: "Discover the science behind acne and effective treatment options for clear skin.",
            content: "",
            author: "Dr. Michael Chen",
            imageUrl: "/placeholder.svg?height=300&width=400",
            createdAt: new Date().toISOString(),
          },
          {
            id: "3",
            title: "Anti-Aging Skincare: What Really Works",
            excerpt: "Separate fact from fiction in the world of anti-aging products and treatments.",
            content: "",
            author: "Dr. Emily Rodriguez",
            imageUrl: "/placeholder.svg?height=300&width=400",
            createdAt: new Date().toISOString(),
          },
        ]

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-8">
      {displayPosts.map((post) => (
        <Card key={post.id} className="overflow-hidden">
          <img
            src={post.imageUrl || "/placeholder.svg?height=300&width=400"}
            alt={post.title}
            className="h-48 w-full object-cover"
          />
          <CardHeader>
            <CardTitle className="line-clamp-2">{post.title}</CardTitle>
            <CardDescription>
              By {post.author} | {new Date(post.createdAt).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground line-clamp-3">{post.excerpt}</p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link href={`/blog/${post.id}`}>Read More</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

