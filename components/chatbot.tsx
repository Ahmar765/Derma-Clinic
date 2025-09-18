"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageSquare, Send, X } from "lucide-react"
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"

// Define the Gemini API key
const GEMINI_API_KEY = "AIzaSyBPfrNZh-B4cbUG-Rlu6kfx5n6pTbhDKCQ"

interface Message {
  role: "user" | "assistant"
  content: string
}

interface GeminiResponse {
  candidates: {
    content: {
      parts: {
        text: string
      }[]
    }
  }[]
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm your skincare assistant. How can I help you today?",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [services, setServices] = useState<any[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Fetch services for the chatbot to reference
    const fetchServices = async () => {
      try {
        const servicesCollection = collection(db, "services")
        const servicesSnapshot = await getDocs(servicesCollection)
        const servicesList = servicesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        setServices(servicesList)
      } catch (error) {
        console.error("Error fetching services:", error)
      }
    }

    fetchServices()
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim()) return

    const userMessage = input
    setInput("")

    // Add user message to chat
    setMessages((prev) => [...prev, { role: "user", content: userMessage }])

    setIsLoading(true)

    try {
      // Create context about available services
      const servicesContext =
        services.length > 0
          ? `Available services: ${services.map((s) => `${s.name} (${s.description}, $${s.price})`).join(", ")}`
          : "Services information not available yet."

      // Call Gemini API
      const aiResponse = await getGeminiResponse(userMessage, servicesContext)

      // Add assistant response to chat
      setMessages((prev) => [...prev, { role: "assistant", content: aiResponse }])
    } catch (error) {
      console.error("Error generating response:", error)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I'm sorry, I'm having trouble connecting right now. Please try again later.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  // Function to call Gemini API
  const getGeminiResponse = async (userMessage: string, servicesContext: string): Promise<string> => {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `You are a helpful skincare clinic assistant. Your job is to help users with questions about skincare services, 
                  booking appointments, and general skincare advice. Be friendly, professional, and concise.
                  
                  Here is information about our services:
                  ${servicesContext}
                  
                  Our clinic is open Monday through Friday from 9:00 AM to 5:00 PM, and Saturday from 10:00 AM to 2:00 PM. 
                  We are closed on Sundays.
                  
                  Contact information:
                  Phone: (123) 456-7890
                  Email: info@skincareclinic.com
                  
                  User question: ${userMessage}`,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 1024,
            },
          }),
        },
      )

      if (!response.ok) {
        // If API call fails, fall back to local response generation
        console.error("Gemini API error:", await response.text())
        return fallbackResponse(userMessage, servicesContext)
      }

      const data = (await response.json()) as GeminiResponse

      if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
        return data.candidates[0].content.parts[0].text
      } else {
        // If response format is unexpected, fall back to local response
        console.error("Unexpected Gemini API response format:", data)
        return fallbackResponse(userMessage, servicesContext)
      }
    } catch (error) {
      console.error("Error calling Gemini API:", error)
      // Fall back to local response generation if API call fails
      return fallbackResponse(userMessage, servicesContext)
    }
  }

  // Fallback response function in case the API fails
  const fallbackResponse = (userMessage: string, servicesContext: string): string => {
    const userMessageLower = userMessage.toLowerCase()

    if (userMessageLower.includes("book") || userMessageLower.includes("appointment")) {
      return "You can book an appointment by visiting our Services page and selecting the service you're interested in. Would you like me to tell you about our available services?"
    }

    if (userMessageLower.includes("price") || userMessageLower.includes("cost")) {
      if (services.length > 0) {
        return `Here are our service prices: ${services.map((s) => `${s.name}: $${s.price}`).join(", ")}. Is there a specific service you're interested in?`
      } else {
        return "Our prices vary depending on the service. You can view all our services and their prices on the Services page. Would you like me to help you find something specific?"
      }
    }

    if (userMessageLower.includes("acne") || userMessageLower.includes("pimple")) {
      return "For acne concerns, we offer specialized treatments that help reduce inflammation and prevent breakouts. Our skincare experts can create a personalized treatment plan for your specific skin type. Would you like to know more about our acne treatments?"
    }

    if (userMessageLower.includes("aging") || userMessageLower.includes("wrinkle")) {
      return "We offer several anti-aging treatments that can help reduce the appearance of fine lines and wrinkles. These include chemical peels, microdermabrasion, and specialized facials. Would you like more information about these treatments?"
    }

    if (userMessageLower.includes("facial") || userMessageLower.includes("face")) {
      return "Our facials are customized to address your specific skin concerns. We use high-quality products and techniques to cleanse, exfoliate, and nourish your skin. Would you like to know about the different types of facials we offer?"
    }

    if (
      userMessageLower.includes("contact") ||
      userMessageLower.includes("phone") ||
      userMessageLower.includes("email")
    ) {
      return "You can contact our clinic by phone at (123) 456-7890 or by email at info@skincareclinic.com. You can also fill out the contact form on our Contact page. Is there something specific you'd like to ask our team?"
    }

    if (userMessageLower.includes("hours") || userMessageLower.includes("open")) {
      return "Our clinic is open Monday through Friday from 9:00 AM to 5:00 PM, and Saturday from 10:00 AM to 2:00 PM. We are closed on Sundays. Would you like to book an appointment during these hours?"
    }

    // Default response
    return "Thank you for your question. I'm here to help with any skincare concerns or questions about our services. Is there something specific you'd like to know about our treatments or skincare advice?"
  }

  return (
    <>
      {!isOpen && (
        <Button onClick={() => setIsOpen(true)} className="fixed bottom-4 right-4 rounded-full h-14 w-14 p-0 bg-black text-white">
          <MessageSquare className="h-6 w-6" />
        </Button>
      )}

      {isOpen && (
       <Card className="fixed bg-white bottom-4 right-4 w-96 border border-gray-300 shadow-lg rounded-lg">
       <CardHeader className="p-4 border-b border-gray-300 flex flex-row items-center justify-between">
         <CardTitle className="text-lg">Skincare Assistant</CardTitle>
         <Button className="hover:bg-gray-100 cursor-pointer" variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
           <X className="h-5 w-5 text-gray-600" />
         </Button>
       </CardHeader>
       <CardContent className="p-0 flex-grow overflow-hidden">
         <ScrollArea className="h-[360px] p-4">
           {messages.map((message, index) => (
             <div key={index} className={`flex mb-4 ${message.role === "assistant" ? "justify-start" : "justify-end"}`}>
               {message.role === "assistant" && (
                 <Avatar className="h-8 w-8 mr-2">
                   <div className="bg-black text-white rounded-full h-full w-full flex items-center justify-center text-xs">
                     AI
                   </div>
                 </Avatar>
               )}
               <div
                 className={`px-3 py-2 rounded-lg max-w-[80%] ${
                   message.role === "assistant" ? "bg-gray-200 text-gray-700" : "bg-black text-white ml-2"
                 }`}
               >
                 {message.content}
               </div>
             </div>
           ))}
           {isLoading && (
             <div className="flex justify-start mb-4">
               <Avatar className="h-8 w-8 mr-2">
                 <div className="bg-black text-white rounded-full h-full w-full flex items-center justify-center text-xs">
                   AI
                 </div>
               </Avatar>
               <div className="px-3 py-2 rounded-lg max-w-[80%] bg-gray-200">
                 <div className="flex space-x-1">
                   <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce"></div>
                   <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce delay-75"></div>
                   <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce delay-150"></div>
                 </div>
               </div>
             </div>
           )}
           <div ref={messagesEndRef} />
         </ScrollArea>
       </CardContent>
       <CardFooter className="p-4 border-t border-gray-300">
         <form onSubmit={handleSendMessage} className="flex w-full gap-2">
           <Input placeholder="Type your message..." className="border-gray-300" value={input} onChange={(e) => setInput(e.target.value)} disabled={isLoading} />
           <Button type="submit" size="icon" disabled={isLoading} className="bg-black border border-gray-300 hover:bg-gray-700">
             <Send className="h-4 w-4 text-white" />
           </Button>
         </form>
       </CardFooter>
     </Card>
     
      )}
    </>
  )
}

