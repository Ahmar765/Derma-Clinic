"use client"

import { useEffect, useState } from "react"
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Skeleton } from "@/components/ui/skeleton"

interface FAQ {
  id: string
  question: string
  answer: string
  order: number
}

export function FaqSection({ limit = 5 }: { limit?: number }) {
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const faqsCollection = collection(db, "faqs")
        const faqsSnapshot = await getDocs(faqsCollection)
        const faqsList = faqsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as FAQ[]

        // Sort by order field
        const sortedFaqs = faqsList.sort((a, b) => a.order - b.order)

        setFaqs(sortedFaqs.slice(0, limit))
        setLoading(false)
      } catch (error) {
        console.error("Error fetching FAQs:", error)
        setLoading(false)
      }
    }

    fetchFaqs()
  }, [limit])

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto mt-8 space-y-4">
        {Array(limit)
          .fill(0)
          .map((_, index) => (
            <div key={index} className="space-y-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          ))}
      </div>
    )
  }

  // If no FAQs are available yet, show placeholder FAQs
  const displayFaqs =
    faqs.length > 0
      ? faqs
      : [
          {
            id: "1",
            question: "How often should I get a facial?",
            answer:
              "For most skin types, we recommend getting a professional facial every 4-6 weeks. This timeframe aligns with your skin's natural cell turnover cycle. However, the frequency can vary based on your specific skin concerns, age, and lifestyle factors.",
            order: 1,
          },
          {
            id: "2",
            question: "What should I do before my appointment?",
            answer:
              "Please arrive with clean skin (no makeup if possible). Avoid sun exposure, exfoliation, or any harsh treatments 48 hours before your appointment. If you're on any medications or have skin conditions, please inform us beforehand.",
            order: 2,
          },
          {
            id: "3",
            question: "Are your treatments suitable for sensitive skin?",
            answer:
              "Yes, we offer treatments specifically designed for sensitive skin. Our skincare professionals will assess your skin type and sensitivity level before recommending appropriate treatments and products.",
            order: 3,
          },
          {
            id: "4",
            question: "How long do results last after a treatment?",
            answer:
              "Results vary depending on the treatment type, your skin condition, and how well you follow post-treatment care. Generally, you can expect to see benefits for 2-4 weeks after a facial. More intensive treatments like chemical peels may show results for several months.",
            order: 4,
          },
          {
            id: "5",
            question: "Do you offer refunds if I'm not satisfied?",
            answer:
              "We're committed to your satisfaction. If you're not happy with your treatment, please let us know within 48 hours, and we'll work with you to address your concerns, which may include offering a complimentary follow-up treatment or adjustment.",
            order: 5,
          },
        ]

  return (
    <div className="max-w-3xl mx-auto mt-8">
      <Accordion type="single" collapsible className="w-full">
        {displayFaqs.map((faq) => (
          <AccordionItem key={faq.id} value={faq.id}>
            <AccordionTrigger>{faq.question}</AccordionTrigger>
            <AccordionContent>{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}

