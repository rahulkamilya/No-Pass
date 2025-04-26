"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, Trash2 } from "lucide-react"
import { useUser, useAuth } from "@clerk/nextjs" 


interface CardData {
  cardNumber: string
  expiryDate: string
  cardholderName: string
  id: string 
}

export default function YourCards() {
  const { isLoaded, isSignedIn, user } = useUser() 
  const { getToken } = useAuth() 

  const [cards, setCards] = useState<CardData[]>([]) 
  const [isLoading, setIsLoading] = useState(false) 
  const [error, setError] = useState<string | null>(null) 

  
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      const fetchedCards = (user as any)?.privateMetadata?.cards || [];
  
      
      if (Array.isArray(fetchedCards)) {
        const validCards = fetchedCards.filter(
          (card: any) =>
            card.cardNumber &&
            card.expiryDate &&
            card.cvv &&
            card.cardholderName
        );
        setCards(validCards);
        console.log("Fetched valid cards from database:", validCards);
      } else {
        setCards([]);
        console.log("No valid cards found in the database.");
      }
    }
  }, [isLoaded, isSignedIn, user]);

  
  const handleCopy = (cardNumber: string) => {
    navigator.clipboard.writeText(cardNumber.replace(/\*/g, ""))
    // Optionally add a toast notification here to notify the user
  }

  
  const handleDelete = async (id: string) => {
    setError(null) 
    setIsLoading(true)

    try {
      const token = await getToken()
      if (!token) {
        throw new Error("Authentication token not available.")
      }

      const response = await fetch("/api/save-card", {
        method: "DELETE", 
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ cardId: id }), 
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to delete card.' }))
        throw new Error(errorData.error || `Failed to delete card. Status: ${response.status}`)
      }

      // Update the frontend state to reflect the deletion
      setCards((currentCards) => currentCards.filter((card) => card.id !== id))
      console.log("Card deleted successfully.")
    } catch (err) {
      console.error("Error deleting card:", err)
      const message = err instanceof Error ? err.message : "An unknown error occurred."
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  
  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center py-8">
        <span>Loading cards...</span>
      </div>
    )
  }

  
  if (!isSignedIn) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Please sign in to view your saved cards.
      </div>
    )
  }

  
  if (cards.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No credit cards saved yet.
      </div>
    )
  }

  
  const maskCardNumber = (cardNumber: string): string => {
    const visibleDigits = 4
    const cleaned = cardNumber.replace(/\s/g, "") // Remove spaces
    if (cleaned.length <= visibleDigits) {
      return cardNumber // Return original if too short to mask meaningfully
    }
    const maskedSection = "*".repeat(cleaned.length - visibleDigits)
    const lastFour = cleaned.slice(-visibleDigits)
    const maskedWithSpaces = (maskedSection + lastFour).replace(/(.{4})/g, "$1 ").trim()
    return maskedWithSpaces
  }

  return (
    <div className="space-y-4">
     
      {error && (
        <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-md">
          Error: {error}
        </div>
      )}

      {/* Display Cards */}
      {cards.map((card) => (
        <Card key={card.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="bg-gradient-to-r from-primary/80 to-primary p-4 text-primary-foreground">
              <div className="flex justify-between items-center">
                <span className="text-xs uppercase font-bold">{card.cardNumber}</span>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-primary-foreground/90 hover:text-primary-foreground hover:bg-primary-foreground/10"
                    onClick={() => handleCopy(card.cardNumber.replace(/\*/g, ""))}
                  >
                    <Copy className="h-3 w-3" />
                    <span className="sr-only">Copy card number</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-primary-foreground/90 hover:text-primary-foreground hover:bg-primary-foreground/10"
                    onClick={() => handleDelete(card.id)}
                    disabled={isLoading} // Disable delete button while loading
                  >
                    <Trash2 className="h-3 w-3" />
                    <span className="sr-only">Delete card</span>
                  </Button>
                </div>
              </div>
              <div className="mt-4 font-mono text-lg tracking-wider">{maskCardNumber(card.cardNumber)}</div>
              <div className="mt-4 flex justify-between text-sm">
                <div>
                  <div className="text-xs text-primary-foreground/70">Card Holder</div>
                  <div>{card.cardholderName}</div>
                </div>
                <div>
                  <div className="text-xs text-primary-foreground/70">Expires</div>
                  <div>{card.expiryDate}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
